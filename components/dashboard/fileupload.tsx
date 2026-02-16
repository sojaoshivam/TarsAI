"use client"
import { uploadToS3 } from '@/app/lib/db/s3'
import { useMutation } from '@tanstack/react-query'
import { FileUp, Loader2 } from 'lucide-react'
import { useDropzone } from 'react-dropzone'
import axios from "axios"
import { toast } from 'sonner'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function FileUpload() {
    const router = useRouter()

    const [uploading, setUploading] = useState(false)
    const { mutate, isPending } = useMutation({
        mutationFn: async ({ file_key, file_name }: { file_key: string, file_name: string }) => {
            const response = await axios.post('/api/create-chat', {
                file_key, 
                file_name
            })
            return response.data;
        }
    })




    const { getRootProps, getInputProps } = useDropzone({
        accept: { "application/pdf": ['.pdf'] },
        maxFiles: 1,
        onDrop: async (acceptedFiles) => {
            console.log(acceptedFiles)
            const file = acceptedFiles[0];
            if (file.size > 100 * 1024 * 10) {
                // console.log("file is bigger than 10 mb");
                toast.error("file is bigger than 10 mb")
                return
            }
            try {
                setUploading(true)
                const data = await uploadToS3(file)
                if (!data?.file_key || !data?.file_name) {
                    toast.error("something went wrong")
                    return;
                }

                mutate(data, {
                    onSuccess: ({chat_id}) => {
                        toast.success("File Uploaded Sucessfully")
                        router.push(`dashboard/${chat_id}`)

                    },
                    onError: (data) => {
                        toast.error("Error creating Chat")
                    }
                })

            } catch (error) {
                console.log(error)
            } finally {
                setUploading(false)
            }
        }
    })
    return (
        <div className="w-full max-w-3xl mx-auto  md:mt-30 px-4">
            <div
                {...getRootProps({
                    className: `
        border-dashed border-2 
        w-full 
        bg-transparent 
        rounded-2xl cursor-pointer 
        py-10 px-6 md:py-20 md:px-10 
        flex justify-center items-center flex-col
        transition-colors duration-200 ease-in-out
        hover:bg-gray-50/5
      `
                })}
            >
                <input {...getInputProps()} />
                {(uploading || isPending) ? (
                   <>
                    <Loader2 className='h-20 w-20 text-[#dadada] animate-spin'/>
                    <p className='text-md text-white mt-4'>Its Happening !!</p>
                    </>
                    
                ): (
                    <>
                    <FileUp className = "w-12 h-12 md:w-16 md:h-16 text-[#dadada] mb-4" />
                <p className="text-sm md:text-lg text-[#dadada] text-center">
                    Drop or Upload your PDF
                </p>
            </>
                )}

        </div>
        </div >


    )
}
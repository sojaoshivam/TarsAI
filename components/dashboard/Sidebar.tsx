"use client"
import { DrizzleChat } from '@/app/lib/db/schema'
import Link from 'next/link'
import { Button } from '../ui/button'
import { PlusCircle, FileText, Sparkles, User, Loader2, AlertCircle } from 'lucide-react'
import { cn } from '@/app/lib/utils'
import { useDropzone } from 'react-dropzone'
import { useMutation, useQuery } from '@tanstack/react-query'
import { uploadToS3 } from '@/app/lib/db/s3'
import axios from "axios"
import { toast } from 'sonner'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'

type Props = {
    chats: DrizzleChat[],
    chatId: number
}

const Sidebar = ({ chatId, chats }: Props) => {
    const router = useRouter()
    const { user } = useUser()
    const [uploading, setUploading] = useState(false)

    // Fetch subscription status
    const { data: subscriptionData, refetch } = useQuery({
        queryKey: ['subscription'],
        queryFn: async () => {
            const response = await axios.get('/api/subscription')
            return response.data
        },
    })

    const { mutate, isPending } = useMutation({
        mutationFn: async ({ file_key, file_name }: { file_key: string, file_name: string }) => {
            const response = await axios.post('/api/create-chat', {
                file_key,
                file_name
            })
            return response.data;
        }
    })

    const { getRootProps, getInputProps, open } = useDropzone({
        accept: { "application/pdf": ['.pdf'] },
        maxFiles: 1,
        noClick: true,
        noKeyboard: true,
        onDrop: async (acceptedFiles) => {
            const file = acceptedFiles[0];
            if (file.size > 100 * 1024 * 10) {
                toast.error("File is bigger than 10 MB")
                return
            }

            // Check if user can upload
            if (subscriptionData) {
                const { pdfCount, pdfLimit } = subscriptionData;
                if (pdfCount >= pdfLimit) {
                    toast.error(
                        subscriptionData.plan === "free"
                            ? "Free plan limit reached! Upgrade to Pro for 10 PDFs per month."
                            : "Monthly PDF limit reached. Limit resets next month."
                    )
                    return;
                }
            }

            try {
                setUploading(true)
                const data = await uploadToS3(file)
                if (!data?.file_key || !data?.file_name) {
                    toast.error("Something went wrong")
                    return;
                }

                mutate(data, {
                    onSuccess: ({ chat_id }) => {
                        toast.success("Chat created successfully!")
                        refetch() // Refresh subscription data
                        router.push(`/dashboard/${chat_id}`)
                    },
                    onError: (error: any) => {
                        const errorMessage = error?.response?.data?.error || "Error creating chat"
                        toast.error(errorMessage)
                    }
                })

            } catch (error) {
                console.log(error)
                toast.error("Upload failed")
            } finally {
                setUploading(false)
            }
        }
    })

    const handleUpgrade = async () => {
        try {
            const response = await axios.post('/api/checkout')
            window.location.href = response.data.url
        } catch (error) {
            toast.error("Failed to start checkout")
        }
    }

    const pdfCount = subscriptionData?.pdfCount || 0
    const pdfLimit = subscriptionData?.pdfLimit || 2
    const plan = subscriptionData?.plan || "free"
    const percentage = (pdfCount / pdfLimit) * 100

    return (
        <div className='w-full h-screen p-4 bg-[#0a0a0a] border-r border-gray-800/50 flex flex-col' {...getRootProps()}>
            <input {...getInputProps()} />

            {/* New Chat Button */}
            <Button
                onClick={(e) => {
                    e.stopPropagation()
                    if (pdfCount >= pdfLimit) {
                        toast.error(
                            plan === "free"
                                ? "Free plan limit reached! Upgrade to Pro."
                                : "Monthly PDF limit reached."
                        )
                        return;
                    }
                    open()
                }}
                disabled={uploading || isPending}
                className='w-full rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 transition-all h-11 disabled:opacity-50 disabled:cursor-not-allowed'
            >
                {(uploading || isPending) ? (
                    <>
                        <Loader2 className='mr-2 w-4 h-4 animate-spin' />
                        Uploading...
                    </>
                ) : (
                    <>
                        <PlusCircle className='mr-2 w-4 h-4' />
                        New Chat
                    </>
                )}
            </Button>

            {/* PDF Limit Warning */}
            {pdfCount >= pdfLimit && (
                <div className='mt-3 p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-start gap-2'>
                    <AlertCircle className='w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5' />
                    <p className='text-xs text-amber-400'>
                        {plan === "free"
                            ? "PDF limit reached. Upgrade to continue."
                            : "Monthly limit reached. Resets next month."}
                    </p>
                </div>
            )}

            {/* Chats List */}
            <div className="flex flex-col mt-6 gap-1.5 flex-1 overflow-y-auto">
                {chats.map(chat => (
                    <Link key={chat.id} href={`/dashboard/${chat.id}`}>
                        <div className={
                            cn('rounded-lg flex p-3 items-center transition-all group', {
                                'bg-cyan-500/10 border border-cyan-500/30 text-cyan-400': chat.id === chatId,
                                'hover:bg-[#141414] text-gray-400 hover:text-gray-200': chat.id !== chatId,
                            })
                        }>
                            <FileText className='mr-2 w-4 h-4 flex-shrink-0' />
                            <p className='w-full overflow-hidden text-sm truncate whitespace-nowrap text-ellipsis'>
                                {chat.pdfName}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Bottom Section */}
            <div className='mt-auto space-y-3'>
                {/* PDF Usage */}
                <div className='p-3 rounded-lg bg-[#141414] border border-gray-800'>
                    <div className='flex items-center justify-between mb-2'>
                        <span className='text-xs font-medium text-gray-400'>PDFs This Month</span>
                        <span className={cn('text-sm font-semibold', {
                            'text-cyan-400': pdfCount < pdfLimit * 0.8,
                            'text-amber-400': pdfCount >= pdfLimit * 0.8 && pdfCount < pdfLimit,
                            'text-red-400': pdfCount >= pdfLimit,
                        })}>
                            {pdfCount} / {pdfLimit}
                        </span>
                    </div>
                    <div className='w-full bg-gray-800 rounded-full h-1.5 overflow-hidden'>
                        <div
                            className={cn('h-full rounded-full transition-all', {
                                'bg-gradient-to-r from-cyan-500 to-blue-500': percentage < 80,
                                'bg-gradient-to-r from-amber-500 to-orange-500': percentage >= 80 && percentage < 100,
                                'bg-gradient-to-r from-red-500 to-red-600': percentage >= 100,
                            })}
                            style={{ width: `${Math.min(percentage, 100)}%` }}
                        />
                    </div>
                    <p className='text-xs text-gray-500 mt-1.5'>
                        {plan === "free" ? "Free Plan" : "Pro Plan"}
                    </p>
                </div>

                {/* Upgrade Button */}
                {plan === "free" && (
                    <Button
                        className='w-full rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white transition-all h-11 font-medium shadow-lg shadow-cyan-500/20'
                        onClick={handleUpgrade}
                    >
                        <Sparkles className='mr-2 w-4 h-4' />
                        Upgrade to Pro
                    </Button>
                )}

                {/* Account Info */}
                <div className='p-3 rounded-lg bg-[#141414] border border-gray-800'>
                    <div className='flex items-center gap-3'>
                        <div className='w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center border border-cyan-500/30'>
                            {user?.imageUrl ? (
                                <img
                                    src={user.imageUrl}
                                    alt="Profile"
                                    className='w-full h-full rounded-full object-cover'
                                />
                            ) : (
                                <User className='w-4 h-4 text-cyan-400' />
                            )}
                        </div>
                        <div className='flex-1 min-w-0'>
                            <p className='text-sm font-medium text-gray-200 truncate'>
                                {user?.fullName || user?.firstName || 'User'}
                            </p>
                            <p className='text-xs text-gray-500 truncate'>
                                {plan === "free" ? "Free Plan" : "Pro Plan"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer Links */}
                <div className='pt-3 border-t border-gray-800/50'>
                    <div className='flex items-center justify-center gap-4 text-xs text-gray-500'>
                        <Link href='/help' className='hover:text-cyan-400 transition-colors'>
                            Help
                        </Link>
                        <span className='text-gray-700'>•</span>
                        <Link href='/settings' className='hover:text-cyan-400 transition-colors'>
                            Settings
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Sidebar
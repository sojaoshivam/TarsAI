import axios from 'axios';

export async function uploadToS3(file: File) {
    try {
        // 1. Get Presigned URL
        const { data } = await axios.post('/api/upload-url', {
            file_name: file.name,
            file_type: file.type
        });

        const { url, file_key } = data;

        // 2. Upload to S3 using the URL
        await axios.put(url, file, {
            headers: {
                'Content-Type': file.type
            },
            onUploadProgress: (progressEvent) => {
                if (progressEvent.total) {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    console.log('uploading to s3 ', percentCompleted + "%");
                }
            }
        });

        console.log("successfully uploaded to s3", file_key);

        return {
            file_key,
            file_name: file.name,
        };

    } catch (error) {
        console.error("Error uploading to S3:", error);
        throw error;
    }
}

export function getS3Url(file_key: string) {
    const url = `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.eu-north-1.amazonaws.com/${file_key}`;
    return url;
}
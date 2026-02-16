import { S3 } from "aws-sdk";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { file_name, file_type } = await req.json();

        const file_key = 'uploads/' + Date.now().toString() + file_name.replace(' ', '-');

        const s3 = new S3({
            apiVersion: "2006-03-01",
            accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID,
            secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_KEY,
            region: "eu-north-1",
            signatureVersion: "v4",
        });

        const params = {
            Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME,
            Key: file_key,
            Expires: 60, // URL expires in 60 seconds
            ContentType: file_type,
        };

        const url = await s3.getSignedUrlPromise("putObject", params);

        return NextResponse.json({ url, file_key });
    } catch (error) {
        console.error("Presigned URL Error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

import AWS from "aws-sdk";
import fs from "fs";
import path from "path";
import os from "os";

export async function downloadFromS3(file_key: string): Promise<string | null> {
  try {
    // Configure AWS
    AWS.config.update({
      accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_KEY,
    });

    const s3 = new AWS.S3({
      params: {
        Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME,
      },
      region: "eu-north-1", // Ensure this matches your bucket region
    });

    const params = {
      Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
      Key: file_key,
    };

    // 1. Download the object from S3
    const obj = await s3.getObject(params).promise();

    // 2. Define a local path to save the file
    // Use os.tmpdir() to work on both Windows and Linux/Vercel
    const file_name = path.join(os.tmpdir(), `pdf-${Date.now()}.pdf`);

    // 3. Write the file to the local system
    if (obj.Body instanceof Buffer) {
      fs.writeFileSync(file_name, obj.Body);
    } else {
      throw new Error("S3 Body is not a Buffer");
    }

    // 4. Return the file path string
    return file_name;

  } catch (error) {
    console.error("S3 Download Error:", error);
    return null; // This will now be caught by the check in Step 1
  }
}
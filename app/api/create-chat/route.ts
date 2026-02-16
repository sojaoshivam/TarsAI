// app/api/create-chat/route.ts
import { db } from "@/app/lib/db";
import { chats } from "@/app/lib/db/schema";
import { loadS3IntoPinecone } from "@/app/lib/pinecone";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { canUploadPDF, incrementPDFCount } from "@/app/lib/subscription";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { file_key, file_name } = body;

    // Check if user can upload PDF
    const uploadStatus = await canUploadPDF();

    if (!uploadStatus.canUpload) {
      return NextResponse.json(
        {
          error: uploadStatus.reason,
          pdfCount: uploadStatus.pdfCount,
          pdfLimit: uploadStatus.pdfLimit,
        },
        { status: 403 }
      );
    }

    // Load into Pinecone
    await loadS3IntoPinecone(file_key);

    // Create chat
    const chat_id = await db
      .insert(chats)
      .values({
        fileKey: file_key,
        pdfName: file_name,
        pdfUrl: `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.eu-north-1.amazonaws.com/${file_key}`,
        userId,
      })
      .returning({
        insertedId: chats.id,
      });

    // Increment PDF count
    await incrementPDFCount();

    return NextResponse.json(
      {
        chat_id: chat_id[0].insertedId,
        message: "Chat created successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
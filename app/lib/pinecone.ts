import { Pinecone, PineconeRecord } from "@pinecone-database/pinecone"
import { downloadFromS3 } from "./s3-server"
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { Document, RecursiveCharacterTextSplitter } from "@pinecone-database/doc-splitter";
import getEmbeddings from "./embeddings";
import md5 from "md5"
import { convertToAscii } from "./utils";

const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY!
})

type PDFPage = {
    pageContent: string,
    metadata: {
        loc: { pageNumber: number }
    }
}

export async function loadS3IntoPinecone(file_key: string) {
    console.log("downloading the pdf in the system from the s3 bucket")


    const file_name = await downloadFromS3(file_key);
    if (!file_name) {
        console.log("failed to fetch file name from DOWNLOAD FROM S3  ")
    }
    const loader = new PDFLoader(file_name!);
    const pages = (await loader.load() as PDFPage[])

    // Cleanup: Delete the temporary file
    const fs = require('fs');
    fs.unlink(file_name!, (err: any) => {
        if (err) console.error("Error deleting temp file:", err);
        else console.log("Temp file deleted:", file_name);
    });

    //2 prepare the document 
    // split the document into smaller sections
    const documents = await Promise.all(pages.map(documentSplitter));

    //vectorize and embed the documents
    const vectors = await Promise.all(documents.flat().map(embedDocuments))

    //upload to pinecone
    const index = pinecone.Index(process.env.PINECONE_INDEX!)
    const namespace = index.namespace(convertToAscii(file_key))
    console.log("inserting vectors into pinecone");
    const batchSize = 10;
    for (let i = 0; i < vectors.length; i += batchSize) {
        const batch = vectors.slice(i, i + batchSize);
        await namespace.upsert(batch);
        console.log(`Uploaded batch ${Math.floor(i / batchSize) + 1} of ${Math.ceil(vectors.length / batchSize)}`);
    }

    return documents[0];

}

export async function embedDocuments(doc: Document) {
    try {
        const embeddings = await getEmbeddings(doc.pageContent)
        const hash = md5(doc.pageContent)

        return {
            id: hash,
            values: embeddings,
            metadata: {
                text: doc.metadata.text as string,
                pageNumber: doc.metadata.pageNumber as number
            }
        } as PineconeRecord
    } catch (error) {
        console.log("error embedding the document in PINECONE")
        throw error
    }
}

export const truncateStringByBytes = (str: string, bytes: number) => {
    const enc = new TextEncoder()
    return new TextDecoder('utf-8').decode(enc.encode(str).slice(0, bytes))
}

async function documentSplitter(page: PDFPage) {
    let { pageContent, metadata } = page
    pageContent = pageContent.replace(/\n/g, ' ')
    //split 
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200
    })
    const docs = await splitter.splitDocuments([
        new Document({
            pageContent,
            metadata: {
                pageNumber: metadata.loc.pageNumber,
                text: truncateStringByBytes(pageContent, 36000)
            }
        })
    ])
    return docs

}
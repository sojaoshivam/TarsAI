import { Pinecone } from "@pinecone-database/pinecone";
import { convertToAscii } from "./utils";
import getEmbeddings from "./embeddings";

export async function getMatchesFromEmbeddings(
  embeddings: number[],
  fileKey: string
) {
  try {
    const client = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY!,
    });

    // 1. Get the index (Sync call now, no await needed)
    const pineconeIndex = client.index(process.env.PINECONE_INDEX!);

    // 2. Target the specific namespace
    const namespace = pineconeIndex.namespace(convertToAscii(fileKey));

    // 3. Query the namespace
    const queryResult = await namespace.query({
      topK: 5,
      vector: embeddings,
      includeMetadata: true,
    });

    return queryResult.matches || [];
  } catch (error) {
    console.log("error querying embeddings", error);
    throw error;
  }
}

export async function getContext(query: string, fileKey: string) {
  const queryEmbeddings = await getEmbeddings(query);
  const matches = await getMatchesFromEmbeddings(queryEmbeddings, fileKey);

  const qualifyingDocs = matches.filter(
    (match) => match.score && match.score > 0.1
  );

  type Metadata = {
    text: string;
    pageNumber: number;
  };

  let docs = qualifyingDocs.map((match) => (match.metadata as Metadata).text);
  console.log("DOCS->>>", docs)
  
  // Join vectors and truncate to save tokens
  return docs.join("\n").substring(0, 3000);
}
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAi = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!)

export default async function getEmbeddings(text: string): Promise<number[]> {

    try {
        const model = genAi.getGenerativeModel({ model: "gemini-embedding-001" })
        const cleanText = text.replace(/\n/g, ' ');
        const result = await model.embedContent(cleanText);
        const embedding = result.embedding;
        return embedding.values
    } catch (error) {
        console.error("Error calling google api key", error)
        throw error;
    }


}
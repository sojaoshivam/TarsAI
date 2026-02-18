import { streamText } from "ai";
import { google } from "@ai-sdk/google";
import { getContext } from "@/app/lib/context";
import { db } from "@/app/lib/db";
import { chats, messages as messagesTable } from "@/app/lib/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { ChatMessage, SanitizedMessage, ContentPart } from "@/app/lib/types";

export async function POST(req: Request) {
  try {
    // 1. Parse Input
    const { messages, chatId, fileKey } = await req.json();

    if (!chatId || !fileKey) {
      return new Response("Missing chatId or fileKey", { status: 400 });
    }

    const { userId } = await auth();
    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const _chats = await db.select().from(chats).where(eq(chats.id, chatId));
    if (_chats.length !== 1 || _chats[0].userId !== userId) {
      return new Response("Unauthorized", { status: 403 });
    }

    // 2. Extract User Message Text
    const lastMessage = messages[messages.length - 1];

    // Debug: Log the last message structure
    console.log("Last message:", JSON.stringify(lastMessage, null, 2));

    let lastMessageText = "";

    // Handle different content formats
    if (typeof lastMessage.content === 'string') {
      lastMessageText = lastMessage.content;
    } else if (Array.isArray(lastMessage.content)) {
      // Handle array of content parts
      lastMessageText = lastMessage.content
        .filter((part: ContentPart) => part.type === 'text')
        .map((part: ContentPart) => part.type === 'text' ? part.text : '')
        .join(' ');
    } else if (lastMessage.parts && Array.isArray(lastMessage.parts)) {
      // Handle parts array (older SDK format)
      lastMessageText = lastMessage.parts
        .filter((part: ContentPart) => part.type === 'text')
        .map((part: ContentPart) => part.type === 'text' ? part.text : '')
        .join(' ');
    }

    if (!lastMessageText || lastMessageText.trim() === "") {
      console.error("Message structure:", lastMessage);
      return new Response("No text content found in message", { status: 400 });
    }

    // 3. Save User Message to DB immediately
    await db.insert(messagesTable).values({
      chatId: parseInt(chatId),
      content: lastMessageText,
      role: "user",
    });

    // 4. Retrieve Context & Build System Prompt
    const context = await getContext(lastMessageText, fileKey);
    console.log("CONTEXT ->>>>>", context);

    const systemPrompt = `You are a chat with PDF AI, your name is TARS AI.
    
START CONTEXT BLOCK
${context}
END OF CONTEXT BLOCK

You possess the ability to answer questions based on the context provided above.
If the context does not contain the answer, say "I cannot find the answer in the document."
Do not make up information.`;

    // 5. Sanitize History for Gemini
    // Convert 'system' role messages to 'assistant' (Gemini doesn't support 'system' in history)
    // Remove the last message as we'll add it separately
    const sanitizedMessages: SanitizedMessage[] = messages.slice(0, -1).map((msg: ChatMessage) => {
      const sanitizedMsg: SanitizedMessage = {
        role: msg.role === 'system' ? 'assistant' : msg.role,
        content: '',
      };

      // Ensure content is a string
      if (typeof msg.content === 'string') {
        sanitizedMsg.content = msg.content;
      } else if (Array.isArray(msg.content)) {
        sanitizedMsg.content = msg.content
          .filter((part: ContentPart) => part.type === 'text')
          .map((part: ContentPart) => part.type === 'text' ? part.text : '')
          .join(' ');
      } else if (msg.parts && Array.isArray(msg.parts)) {
        sanitizedMsg.content = msg.parts
          .filter((part: ContentPart) => part.type === 'text')
          .map((part: ContentPart) => part.type === 'text' ? part.text : '')
          .join(' ');
      } else {
        sanitizedMsg.content = '';
      }

      return sanitizedMsg;
    });

    // 6. Generate Stream
    const result = streamText({
      model: google("gemini-2.5-flash"), // Changed to available model
      system: systemPrompt,
      messages: [
        ...sanitizedMessages,
        {
          role: 'user',
          content: lastMessageText,
        },
      ],
      onFinish: async (event) => {
        // 7. Save AI Response to DB
        try {
          const aiResponseText = event.text;

          if (aiResponseText) {
            await db.insert(messagesTable).values({
              chatId: parseInt(chatId),
              content: aiResponseText,
              role: "system",
            });
          }
        } catch (dbError) {
          console.error("Failed to save AI response to DB:", dbError);
        }
      },
    });

    // 8. Return Text Stream Response
    return result.toTextStreamResponse();

  } catch (error) {
    console.error("Model Error:", error);
    return new Response("Failed to stream chat completion", { status: 500 });
  }
}
import { queryPineconeVectorStore } from "@/utils";
import { Pinecone } from "@pinecone-database/pinecone";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { Message, StreamData, streamText } from "ai";

// Allow streaming responses up to 60 seconds
export const maxDuration = 60;

// Initialize Pinecone client
const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
});

// Initialize Google Generative AI client
const google = createGoogleGenerativeAI({
  baseURL: "https://generativelanguage.googleapis.com/v1beta",
  apiKey: process.env.GEMINI_API_KEY,
});

// Configure the model
const model = google("models/gemini-1.5-pro-latest", {
  safetySettings: [
    { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" },
  ],
});

export async function POST(req: Request) {
  try {
    // Parse request body
    const reqBody = await req.json();
    console.log("Request received:", reqBody);

    const messages: Message[] = reqBody.messages;
    const userQuestion = `${messages[messages.length - 1].content}`;
    const caseData: string = reqBody.data.reportData;

    // Create query for vector store
    const query = `Represent this for searching relevant passages: client's legal query says: \n${caseData}. \n\n${userQuestion}`;

    console.log("Querying Pinecone vector store...");

    // Create StreamData object early to ensure we can close it in case of errors
    const data = new StreamData();

    try {
      // Query vector store with timeout
      const retrievalsPromise = queryPineconeVectorStore(
        pinecone,
        "indian-law-corpus",
        "capstone",
        query
      );

      // Add a timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(
          () => reject(new Error("Vector store query timed out")),
          15000
        );
      });

      const retrievals = (await Promise.race([
        retrievalsPromise,
        timeoutPromise,
      ])) as any;
      console.log("Vector store retrievals completed");

      // Append retrievals to stream data
      data.append({
        retrievals: retrievals?.links || [],
      });

      // Construct prompt
      const finalPrompt = `Here is a summary of the user's legal case details, and their legal query regarding Indian law. Some generic legal provisions and precedents are also provided that may or may not be relevant for this case.
Go through the case details and answer the user's legal query while assuming you are a lawyer.
Ensure the response is factually accurate, and demonstrates a thorough understanding of the query topic and Indian legal framework.
Before answering you may enrich your knowledge by going through the provided legal provisions and precedents.
The legal provisions and precedents are generic information and not specific legal advice. Do not include any legal provision if it is not relevant for the user's case.

\n\n**User's Case Details:** \n${caseData}. 
\n**end of user's case details** 

\n\n**User Query:**\n${userQuestion}?
\n**end of user query** 

\n\n**Generic Legal Provisions and Precedents:**
\n\n${retrievals?.text || "No relevant provisions found"}. 
\n\n**end of generic legal provisions and precedents** 

\n\nProvide thorough justification for your answer based on relevant laws and precedents.
\n\n**Answer:**
`;

      console.log("Starting text stream...");

      // Stream the text generation with proper event handlers
      const result = await streamText({
        model: model,
        prompt: finalPrompt,
        onFinish() {
          console.log("Stream finished, closing data");
          data.close();
        },
      });

      console.log("Stream created successfully");
      return result.toDataStreamResponse({ data });
    } catch (error) {
      console.error("Error during streaming setup:", error);
      // Make sure to close the stream data in case of error
      data.append({ error: "An error occurred during processing" });
      data.close();

      return new Response(JSON.stringify({ error: "Processing failed" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch (outerError) {
    console.error("Outer error in POST handler:", outerError);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

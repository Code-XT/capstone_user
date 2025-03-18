import { queryPineconeVectorStore } from "@/utils";
import { Pinecone } from "@pinecone-database/pinecone";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { Message, StreamData, streamText } from "ai";

// Allow streaming responses up to 60 seconds
export const maxDuration = 60;

// Initialize Pinecone client inside the handler function to avoid connection issues
// between serverless function invocations

// Initialize Google AI client
const google = createGoogleGenerativeAI({
  baseURL: "https://generativelanguage.googleapis.com/v1beta",
  apiKey: process.env.GEMINI_API_KEY,
});

// Configure Gemini model
const model = google("models/gemini-1.5-pro-latest", {
  safetySettings: [
    { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" },
  ],
});

export async function POST(req: Request, res: Response) {
  try {
    // Initialize Pinecone inside the request handler
    const pinecone = new Pinecone({
      apiKey:
        "pcsk_6shQ1t_FSL5GpDHVC2NhVUsb3YFcmPQ6moN5cgWPDqk6LmLggGeVqMFJL7kBAiAUZ8YHY7",
    });

    // Parse request body
    const reqBody = await req.json();
    console.log("Request received:", new Date().toISOString());

    // Extract messages and user question
    const messages: Message[] = reqBody.messages;
    const userQuestion = `${messages[messages.length - 1].content}`;
    const caseData: string = reqBody.data.reportData;

    // Create the query
    const query = `Represent this for searching relevant passages: client's legal query says: \n${caseData}. \n\n${userQuestion}`;

    console.log("Querying Pinecone:", new Date().toISOString());

    // Set a timeout for the Pinecone query
    let retrievals: { text?: string; links?: string[] };
    try {
      const retrievalPromise = queryPineconeVectorStore(
        pinecone,
        "indian-law-corpus",
        "capstone",
        query
      );

      // Add a 15-second timeout for Pinecone queries
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("Pinecone query timed out")), 15000);
      });

      retrievals = (await Promise.race([retrievalPromise, timeoutPromise])) as {
        text?: string;
        links?: string[];
      };
      console.log("Pinecone query completed:", new Date().toISOString());
    } catch (error) {
      console.error("Error querying Pinecone:", error);
      // Provide fallback empty results if Pinecone query fails
      retrievals = { text: "No relevant provisions found.", links: [] };
    }

    // Create the prompt
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
\n\n${retrievals?.text || "No relevant provisions found."}. 
\n\n**end of generic legal provisions and precedents** 

\n\nProvide thorough justification for your answer based on relevant laws and precedents.
\n\n**Answer:**
`;

    // Create stream data for metadata
    const data = new StreamData();

    try {
      console.log("Starting stream generation:", new Date().toISOString());

      // Append metadata to the stream
      data.append({
        retrievals: retrievals?.links || [],
        status: "processing",
      });

      // Generate and stream the response
      const result = await streamText({
        model: model,
        prompt: finalPrompt,
        // onProgress(progress) {
        //   // Optional: Update status during streaming
        //   data.append({ status: "in-progress" });
        // },
        onFinish() {
          data.append({ status: "complete" });
          data.close();
          console.log("Stream completed:", new Date().toISOString());
        },
      });

      // Return the streaming response
      return result.toDataStreamResponse({ data });
    } catch (error: any) {
      console.error("Error in streaming:", error);

      // Close the stream data in case of error
      data.append({ status: "error", message: error.message });
      data.close();

      // Return an error response
      return new Response(
        JSON.stringify({ error: "Error generating response" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  } catch (error) {
    console.error("Error in request handler:", error);

    // Return an error response if the overall handler fails
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

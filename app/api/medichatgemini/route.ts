import { queryPineconeVectorStore } from "@/utils";
import { Pinecone } from "@pinecone-database/pinecone";
// import { Message, OpenAIStream, StreamData, StreamingTextResponse } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText, Message, StreamData, streamText } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 60;
// export const runtime = 'edge';

const pinecone = new Pinecone({
  apiKey:
    "pcsk_6shQ1t_FSL5GpDHVC2NhVUsb3YFcmPQ6moN5cgWPDqk6LmLggGeVqMFJL7kBAiAUZ8YHY7",
});

const google = createGoogleGenerativeAI({
  baseURL: "https://generativelanguage.googleapis.com/v1beta",
  apiKey: process.env.GEMINI_API_KEY,
});

// gemini-1.5-pro-latest
// gemini-1.5-pro-exp-0801
const model = google("models/gemini-1.5-pro-latest", {
  safetySettings: [
    { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" },
  ],
});

export async function POST(req: Request, res: Response) {
  const reqBody = await req.json();
  console.log(reqBody);

  const messages: Message[] = reqBody.messages;
  const userQuestion = `${messages[messages.length - 1].content}`;

  const caseData: string = reqBody.data.reportData;
  const query = `Represent this for searching relevant passages: client's legal query says: \n${caseData}. \n\n${userQuestion}`;

  const retrievals = await queryPineconeVectorStore(
    pinecone,
    "indian-law-corpus",
    "capstone",
    query
  );

  console.log(retrievals);

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
\n\n${retrievals?.text}. 
\n\n**end of generic legal provisions and precedents** 

\n\nProvide thorough justification for your answer based on relevant laws and precedents.
\n\n**Answer:**
`;

  const data = new StreamData();
  data.append({
    retrievals: retrievals?.links,
  });

  const result = await streamText({
    model: model,
    prompt: finalPrompt,
    onFinish() {
      data.close();
    },
  });

  return result.toDataStreamResponse({ data });
}

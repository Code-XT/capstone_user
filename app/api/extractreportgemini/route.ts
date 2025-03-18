import { GoogleGenerativeAI } from "@google/generative-ai";
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-pro",
});

const prompt = `Attached is an image of a legal document. 
Go over the legal document and identify key clauses or provisions that have significant legal implications. Then summarize in 100 words. You may increase the word limit if the document has multiple pages. Do not output client names, dates, or other personal identifiers. Make sure to include specific sections, article numbers, and critical legal terminology from the document, including document title.
## Summary: `;

export async function POST(req: Request, res: Response) {
  const { base64 } = await req.json();
  const filePart = fileToGenerativePart(base64);

  console.log(filePart);
  const generatedContent = await model.generateContent([prompt, filePart]);

  console.log(generatedContent);
  const textResponse =
    generatedContent.response.candidates![0].content.parts[0].text;
  return new Response(textResponse, { status: 200 });
}

function fileToGenerativePart(imageData: string) {
  return {
    inlineData: {
      data: imageData.split(",")[1],
      mimeType: imageData.substring(
        imageData.indexOf(":") + 1,
        imageData.lastIndexOf(";")
      ),
    },
  };
}

import { Pinecone } from "@pinecone-database/pinecone";
import { FeatureExtractionPipeline, pipeline } from "@xenova/transformers";
import { modelname, namespace, topK } from "./app/config";
import { HfInference } from "@huggingface/inference";

const hf = new HfInference(process.env.HF_TOKEN);
export async function queryPineconeVectorStore(
  client: Pinecone,
  indexName: string,
  namespace: string,
  query: string
): Promise<{ text: string; links: string }> {
  const apiOutput = await hf.featureExtraction({
    model: "mixedbread-ai/mxbai-embed-large-v1",
    inputs: query,
  });
  console.log(apiOutput);

  const queryEmbedding = Array.from(apiOutput);
  // console.log("Querying database vector store...");
  const index = client.Index(indexName);
  const queryResponse = await index.namespace(namespace).query({
    topK: 5,
    vector: queryEmbedding as any,
    includeMetadata: true,
    // includeValues: true,
    includeValues: false,
  });

  console.log(queryResponse);

  if (queryResponse.matches.length > 0) {
    // For the knowledge chunks (used in prompt)
    const textRetrievals = queryResponse.matches
      .map(
        (match, index) =>
          `Legal Finding ${index + 1}: \n${match.metadata?.chunk}`
      )
      .join("\n\n");

    // For the links in the UI
    const linkRetrievals = queryResponse.matches
      .map(
        (match, index) =>
          `[${match.metadata?.title}](https://indiankanoon.org/doc/${match.metadata?.tid})`
      )
      .join("\n\n");

    return {
      text: textRetrievals,
      links: linkRetrievals,
    };
  } else {
    return {
      text: "<nomatches>",
      links: "",
    };
  }
}

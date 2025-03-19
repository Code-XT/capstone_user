# JurySight

JurySight is an AI-powered legal assistant that helps users get answers to their legal queries in a way that matches their level of legal expertise. Whether you're a layman seeking straightforward guidance or a legal professional looking for detailed analysis, JurySight adapts its responses to your needs.

![JurySight Banner](![image](https://github.com/user-attachments/assets/1ecf452f-dea1-4248-b7ca-24b5e47e4a2a))

## 🔗 Live Demo

Check out the live version at [JurySight](https://jury-sight.vercel.app)

## ✨ Features

- **Adaptive Responses**: Receives layman-friendly or technical responses based on how you phrase your query
- **Document Upload**: Upload relevant legal documents to provide context for your questions
- **Vector Search**: Retrieves relevant legal provisions and precedents from our knowledge base
- **Case References**: Provides links to relevant cases and legal files that might be helpful
- **Streaming Responses**: Get answers in real-time as they're generated
- **Contextual Understanding**: Analyzes your query and documents to provide relevant information

## 🛠️ Technology Stack

### Frontend & Backend
- **Next.js**: React framework for server-side rendering and API routes
- **React**: UI library for building the user interface
- **TypeScript**: For type-safe code
- **TailwindCSS**: For responsive, utility-first styling
- **Shadcn UI**: Component library for consistent UI elements

### AI & Data
- **Google's Gemini 1.5 Pro**: Large language model for generating legal responses
- **MixedBread-AI/mxbai-embed-large-v1**: Embedding model for vectorizing legal documents and queries
- **Pinecone**: Vector database for semantic search of legal documents
- **Vercel AI SDK**: For streaming AI responses to the client

### Infrastructure
- **Vercel**: For hosting, deployment, and serverless functions
- **UploadThing**: For document upload functionality

## 📁 Project Structure

```
jurysight/
├── .next/                  # Next.js build output
├── app/                    # Next.js application routes and pages
├── components/             # React components
├── lib/                    # Utility libraries and functions
├── public/                 # Static assets
├── utils.ts                # Utility functions including Pinecone querying
├── next.config.mjs         # Next.js configuration
├── tailwind.config.ts      # TailwindCSS configuration
├── uploadthing.ts          # Upload functionality configuration
└── package.json            # Project dependencies and scripts
```

## 📋 Prerequisites

Before you begin, ensure you have:
- Node.js (v18 or later recommended)
- npm or yarn
- Git

## 🚀 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Code-XT/jurysight.git
   cd jurysight
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory with the following variables:
   ```
   PINECONE_API_KEY=your_pinecone_api_key
   GEMINI_API_KEY=your_gemini_api_key
   HF_TOKEN=your_huggingface_token
   ```

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 🔧 How It Works

1. **User Input**: Users enter their legal query and optionally upload relevant documents
2. **Vector Search**: The system converts the query into embeddings and searches the Pinecone vector database for relevant legal information
3. **Context Processing**: Retrieved information is combined with the user's query and documents
4. **Response Generation**: Gemini 1.5 Pro generates a response based on the combined context
5. **Streaming**: The response is streamed to the user in real-time using the Vercel AI SDK
6. **Reference Links**: Relevant legal documents and cases are provided as additional resources

## ⚠️ Limitations & Known Issues

- **Response Stream Interruptions**: The response stream might get stuck midway occasionally. We're actively working on improving this.
- **Legal Accuracy**: While JurySight provides information based on a knowledge base of legal documents, it's still an AI system and may not account for recent legal changes or specific jurisdictional nuances.
- **Not a Substitute for Legal Advice**: JurySight is designed to be informational only and should not replace professional legal advice. Always consult with a qualified attorney for your specific legal situation.
- **Knowledge Base Limitations**: The information provided may be outdated or not applicable to specific cases or jurisdictions.

## 🔮 Future Development

- Refining and expanding the knowledge base for more comprehensive legal coverage
- Improving response streaming reliability
- Enhancing the user interface and experience
- Adding support for more legal jurisdictions
- Adding support for querying in multiple languages
- Implementing more robust error handling and fallback mechanisms
- Developing functionality to track legal updates and amendments

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🙏 Acknowledgements

- Legal professionals who helped validate the knowledge base
- Open-source libraries and tools that made this project possible
- Vercel for the hosting infrastructure
- Google for the Gemini API
- Pinecone for vector database services

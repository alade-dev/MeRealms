import { OpenAIEmbeddings } from "@langchain/openai";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatTogetherAI } from "@langchain/community/chat_models/togetherai";
import { ChatXAI } from "@langchain/xai";
import { AIMessage, BaseMessage, HumanMessage } from "@langchain/core/messages";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { StateGraph } from "@langchain/langgraph";
import { Annotation } from "@langchain/langgraph";
import { tool } from "@langchain/core/tools";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { MongoDBSaver } from "@langchain/langgraph-checkpoint-mongodb";
import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import { MongoClient, ObjectId } from "mongodb";
import { z } from "zod";
import "dotenv/config";

export async function callAgent(
  client: MongoClient,
  query: string,
  thread_id: string
) {
  // Define the MongoDB database and collection based on your index.ts
  const dbName = "tgMiniApp";
  const db = client.db(dbName);
  const memesCollection = db.collection("memes");

  // Define the graph state
  const GraphState = Annotation.Root({
    messages: Annotation<BaseMessage[]>({
      reducer: (x, y) => x.concat(y),
    }),
  });

  // Tool to search and analyze memes
  const memeSearchTool = tool(
    async ({ query, n = 10 }) => {
      console.log("Meme search tool called");

      const dbConfig = {
        collection: memesCollection,
        indexName: "vector_index",
        textKey: "desc",
        embeddingKey: "embedding",
      };

      const vectorStore = new MongoDBAtlasVectorSearch(
        new OpenAIEmbeddings({
          modelName: "text-embedding-3-small",
          dimensions: 1536,
        }),
        dbConfig
      );

      const result = await vectorStore.similaritySearchWithScore(query, n);
      return JSON.stringify(result);
    },
    {
      name: "meme_search",
      description:
        "Searches for memes based on description and returns similar memes with their engagement metrics",
      schema: z.object({
        query: z.string().describe("The search query for finding memes"),
        n: z
          .number()
          .optional()
          .default(10)
          .describe("Number of memes to return"),
      }),
    }
  );

  // Tool to get meme statistics
  const memeStatsTool = tool(
    async ({ meme_id }) => {
      console.log("Meme stats tool called");

      const meme = await memesCollection.findOne({
        _id: new ObjectId(meme_id),
      });
      if (!meme) return JSON.stringify({ error: "Meme not found" });

      return JSON.stringify({
        engagement: {
          likes: meme.likes.length,
          comments: meme.comments.length,
          tips: meme.tips,
          votes: meme.votes,
        },
        creation_info: {
          created_by: meme.createdBy,
          created_at: meme.createdAt,
          chain_id: meme.chain_id,
        },
        content: {
          name: meme.name,
          description: meme.desc,
          image_url: meme.imgUrl,
        },
      });
    },
    {
      name: "meme_stats",
      description:
        "Gets detailed statistics and information about a specific meme",
      schema: z.object({
        meme_id: z.string().describe("The ID of the meme to analyze"),
      }),
    }
  );

  // Tool to get trending memes
  const trendingMemesTool = tool(
    async ({ limit = 5 }) => {
      console.log("Trending memes tool called");

      const trendingMemes = await memesCollection
        .find({})
        .sort({
          votes: -1,
          "likes.length": -1,
          tips: -1,
        })
        .limit(limit)
        .toArray();

      return JSON.stringify(trendingMemes);
    },
    {
      name: "trending_memes",
      description:
        "Gets the current trending memes based on votes, likes, and tips",
      schema: z.object({
        limit: z
          .number()
          .optional()
          .default(5)
          .describe("Number of trending memes to return"),
      }),
    }
  );

  const tools = [memeSearchTool, memeStatsTool, trendingMemesTool];

  const toolNode = new ToolNode<typeof GraphState.State>(tools);

  const model = new ChatTogetherAI({
     model: "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo",
    temperature: 0.7,
  }).bindTools(tools);

  function shouldContinue(state: typeof GraphState.State) {
    const messages = state.messages;
    const lastMessage = messages[messages.length - 1] as AIMessage;

    if (lastMessage.tool_calls?.length) {
      return "tools";
    }
    return "__end__";
  }

  async function callModel(state: typeof GraphState.State) {
    const prompt = ChatPromptTemplate.fromMessages([
      [
        "system",
        `You are RealmsAI, a knowledgeable AI assistant specializing in meme analysis and social engagement metrics.
        Your goal is to help users understand their memes' performance and potential.

        When analyzing memes, focus on:
        - Engagement metrics (likes, comments, tips, votes)
        - Trending patterns and popularity
        - Content analysis and suggestions
        - Chain ID and creator information

        Format your responses in a clear, engaging way that highlights key metrics and insights.
        For numerical data, use appropriate formatting and include percentage changes when relevant.
        
        Available tools: {tool_names}
        Current time: {time}`,
      ],
      new MessagesPlaceholder("messages"),
    ]);

    const formattedPrompt = await prompt.formatMessages({
      time: new Date().toISOString(),
      tool_names: tools.map((tool) => tool.name).join(", "),
      messages: state.messages,
    });

    const result = await model.invoke(formattedPrompt);
    return { messages: [result] };
  }

  const workflow = new StateGraph(GraphState)
    .addNode("agent", callModel)
    .addNode("tools", toolNode)
    .addEdge("__start__", "agent")
    .addConditionalEdges("agent", shouldContinue)
    .addEdge("tools", "agent");

  const checkpointer = new MongoDBSaver({ client, dbName });

  const app = workflow.compile({ checkpointer });

  const finalState = await app.invoke(
    {
      messages: [new HumanMessage(query)],
    },
    { recursionLimit: 15, configurable: { thread_id: thread_id } }
  );

  return finalState.messages[finalState.messages.length - 1].content;
}

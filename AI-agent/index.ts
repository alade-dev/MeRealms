import 'dotenv/config';
import express, { Express, Request, Response } from "express";
import { MongoClient, ObjectId } from "mongodb";
import cors from "cors";
import { callAgent } from './agent';

const app: Express = express();
app.use(cors());
app.use(express.json());

// Initialize MongoDB client
const client = new MongoClient(process.env.MONGODB_ATLAS_URI as string);
const dbName = "tgMiniApp";
const memesCollection = "memes";
const profilesCollection = "profiles";

async function startServer() {
  try {
    await client.connect();
    console.log("Successfully connected to MongoDB!");

    const db = client.db(dbName);

    // Chat routes
    app.get('/', (req: Request, res: Response) => {
      res.send('RealmsAI Meme Analysis Server');
    });

    app.post('/chat', async (req: Request, res: Response) => {
      const initialMessage = req.body.message;
      const threadId = Date.now().toString();
      try {
        const response = await callAgent(client, initialMessage, threadId);
        res.json({ threadId, response });
      } catch (error) {
        console.error('Error starting conversation:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    });

    app.post('/chat/:threadId', async (req: Request, res: Response) => {
      const { threadId } = req.params;
      const { message } = req.body;
      try {
        const response = await callAgent(client, message, threadId);
        res.json({ response });
      } catch (error) {
        console.error('Error in chat:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    });

    // Routes

    // Update Profile
    app.put("/profiles/:walletAddress", async (req: Request, res: Response) => {
      const { walletAddress } = req.params;
      const { username, image } = req.body;

      try {
        const result = await db
          .collection(profilesCollection)
          .updateOne(
            { walletAddress },
            { $set: { username, image, updatedAt: new Date() } },
            { upsert: true }
          );
        res.status(200).json({ message: "Profile updated successfully", result });
      } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    });

    // Get Profile
    app.get("/profiles/:walletAddress", async (req: Request, res: Response) => {
      const { walletAddress } = req.params;

      try {
        const profile = await db.collection(profilesCollection).findOne({ walletAddress });
        if (profile) {
          res.status(200).json(profile);
        } else {
          res.status(404).json({ message: "Profile not found" });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    });

    // Create Meme
    app.post("/memes", async (req: Request, res: Response) => {
      const { name, desc, createdBy, imgUrl, memeCount } = req.body;

      try {
        const result = await db.collection(memesCollection).insertOne({
          name,
          desc,
          createdBy,
          imgUrl,
          chain_id: Number(memeCount) - 1,
          likes: [],
          tips: 0,
          comments: [],
          votes: 0,
          createdAt: new Date(),
        });
        res.status(201).json({ message: "Meme created successfully", id: result.insertedId });
      } catch (error) {
        console.error("Error creating meme:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    });

    // Get Meme
    app.get("/memes/:memeId", async (req: Request, res: Response) => {
      const { memeId } = req.params;

      try {
        const meme = await db.collection(memesCollection).findOne({ _id: new ObjectId(memeId) });
        if (meme) {
          res.status(200).json(meme);
        } else {
          res.status(404).json({ message: "Meme not found" });
        }
      } catch (error) {
        console.error("Error fetching meme:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    });

    // Get All Memes
    app.get("/memes", async (req: Request, res: Response) => {
      try {
        const memes = await db.collection(memesCollection).find().toArray();
        res.status(200).json(memes);
      } catch (error) {
        console.error("Error fetching memes:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    });

    // Comment on a Meme
    app.post("/memes/:memeId/comments", async (req: Request, res: Response) => {
      const { memeId } = req.params;
      const { comment, user } = req.body;

      try {
        const result = await db
          .collection(memesCollection)
          .updateOne(
            { _id: new ObjectId(memeId) },
            { $push: { comments: { user, comment, createdAt: new Date() } } as any }
          );
        res.status(200).json({ message: "Comment added successfully", result });
      } catch (error) {
        console.error("Error adding comment:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    });

    // Like a Meme
    app.post("/memes/:memeId/like", async (req: Request, res: Response) => {
      const { memeId } = req.params;
      const { user } = req.body;

      try {
        const result = await db
          .collection(memesCollection)
          .updateOne(
            { _id: new ObjectId(memeId) },
            { $addToSet: { likes: user } }
          );
        res.status(200).json({ message: "Meme liked successfully", result });
      } catch (error) {
        console.error("Error liking meme:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    });

    // Tip a Meme
    app.post("/memes/:memeId/tip", async (req: Request, res: Response) => {
      const { memeId } = req.params;
      const { amount } = req.body;

      try {
        const result = await db
          .collection(memesCollection)
          .updateOne(
            { _id: new ObjectId(memeId) },
            { $inc: { tips: amount } }
          );
        res.status(200).json({ message: "Meme tipped successfully", result });
      } catch (error) {
        console.error("Error tipping meme:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    });

    // Vote on a Meme
    app.post("/memes/:memeId/vote", async (req: Request, res: Response) => {
      const { memeId } = req.params;
      const { user } = req.body;

      try {
        const result = await db.collection(memesCollection).updateOne(
          { _id: new ObjectId(memeId) },
          {
            $inc: { votes: 1 },
            $addToSet: { voters: user }
          }
        );

        if (result.modifiedCount === 0) {
          return res.status(404).json({ error: "Meme not found or user already voted" });
        }

        res.status(200).json({ message: "Vote added successfully", result });
      } catch (error) {
        console.error("Error voting on meme:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    });

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
}

startServer();

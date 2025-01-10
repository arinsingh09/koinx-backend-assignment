import { MongoClient, Db, ServerApiVersion } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGO_DB_CONNECTION || "mongodb://localhost:27017";
const dbName = "koinx-backend";
let dbInstance: Db | null = null;

async function connectToDatabase(): Promise<Db> {
  if (!dbInstance) {
    try {
      console.log(`Attempting to connect to MongoDB at ${uri}`);
      const client = new MongoClient(uri, {
        serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true,
        }
      });
      await client.connect();
      await client.db("admin").command({ ping: 1 });
      console.log("Pinged your deployment. You successfully connected to MongoDB!");
      dbInstance = client.db(dbName);
      console.log("Successfully connected to MongoDB");
    } catch (error) {
      console.error("Error connecting to MongoDB:", error instanceof Error ? error.message : error);
      throw error;
    }
  }
  return dbInstance;
}

export default connectToDatabase;
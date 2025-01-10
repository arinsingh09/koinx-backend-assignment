import express, { Request, Response } from "express";
import connectToDatabase from "../db/connect";
import { cryptoDataSchema, validateSchema, CryptoDataWithId } from "../db/schema";

const router = express.Router();

router.get("/", async (req: Request, res: Response): Promise<any> => {
  const { coin } = req.query;

  if (!coin || typeof coin !== "string") {
    return res.status(400).json({ error: "Invalid coin" });
  }

  try {
    const db = await connectToDatabase();
    const collection = db.collection("crypto_data");

    const latestData = (await collection.findOne(
      { coin },
      { sort: { timestamp: -1 } }
    )) as CryptoDataWithId | null;

    if (!latestData) {
      return res.status(404).json({ error: `Data not found for the coin ${coin}` });
    }

    validateSchema(latestData, cryptoDataSchema);

    res.json({
      price: latestData.price,
      marketCap: latestData.marketCap,
      "24hChange": latestData["24hChange"],
    });
  } catch (error) {
    console.error("Error fetching latest stats:", error instanceof Error ? error.message : error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
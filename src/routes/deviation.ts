import express, { Request, Response } from "express";
import connectToDatabase from "../db/connect";

const router = express.Router();

router.get("/", async (req: Request, res: Response): Promise<any> => {
  const { coin } = req.query;

  if (!coin || typeof coin !== "string") {
    return res.status(400).json({ error: "Coin is required" });
  }

  try {
    const db = await connectToDatabase();
    const collection = db.collection("crypto_data");

    const prices = await collection
      .find({ coin }, { projection: { price: 1, _id: 0 } })
      .sort({ timestamp: -1 })
      .limit(100)
      .toArray();

    if (prices.length === 0) {
      return res.status(404).json({ error: `Not enough data for ${coin}` });
    }

    const priceValues = prices.map((doc) => doc.price);
    const mean = priceValues.reduce((a, b) => a + b, 0) / priceValues.length;
    // console.log("Mean:", mean);
    const variance = priceValues.reduce((a, b) => a + (b-mean)*(b-mean), 0) / priceValues.length;
    const standardDeviation = Math.sqrt(variance);

    res.json({ deviation: parseFloat(standardDeviation.toFixed(2)) });
  } catch (error) {
    console.error("Error calculating deviation:", error instanceof Error ? error.message : error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
import axios from "axios";
import connectToDatabase from "../db/connect";
import { cryptoDataSchema, validateSchema, CryptoData } from "../db/schema";
import dotenv from "dotenv";

dotenv.config();

const COINGECKO_API = `https://api.coingecko.com/api/v3/simple/price`;
const COINS = ["bitcoin", "matic-network", "ethereum"];

async function fetchCryptoData() {
  try {
    const response = await axios.get(COINGECKO_API, {
      params: {
        ids: COINS.join(","),
        vs_currencies: "usd",
        include_market_cap: true,
        include_24hr_change: true,
      },
    });
    const data = response.data;

    const db = await connectToDatabase();

    // insert data into the respective collection
    for (const coin of COINS) {
      const collection = db.collection(coin);  // creating a collection for each coin

      const record: CryptoData = {
        price: data[coin].usd,
        marketCap: data[coin].usd_market_cap,
        "24hChange": data[coin].usd_24h_change,
        timestamp: new Date(),
      };

      validateSchema(record, cryptoDataSchema);

      await collection.insertOne(record);
    }

    console.log("Crypto data saved to the respective collections");
  } catch (error) {
    console.error("Error fetching crypto data:", error instanceof Error ? error.message : error);
  }
}

export default fetchCryptoData;
import { ObjectId } from "mongodb";

export interface CryptoData {
  coin: string;
  price: number;
  marketCap: number;
  "24hChange": number;
  timestamp: Date;
}

export interface CryptoDataWithId extends CryptoData {
  _id: ObjectId;
}

export const cryptoDataSchema: Record<keyof CryptoData, string> = {
  coin: "string",
  price: "number",
  marketCap: "number",
  "24hChange": "number",
  timestamp: "object",
};

export const validateSchema = (data: Record<string, any>, schema: Record<string, string>) => {
  Object.keys(schema).forEach((key) => {
    if (!(key in data) || typeof data[key] !== schema[key]) {
      throw new Error(`Invalid data format for key: ${key}`);
    }
  });
};
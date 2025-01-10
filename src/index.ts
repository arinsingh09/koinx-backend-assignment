import express from "express";
import fetchCryptoData from "./services/job";
import statsRoute from "./routes/stats";
import deviationRoute from "./routes/deviation";

const app = express();
const PORT = process.env.PORT || 80;
app.use(express.json());

app.use("/stats", statsRoute);
app.use("/deviation", deviationRoute);

app.get("/", (req, res) => {
  res.json({"stats endpoint": "/stats", "deviation endpoint": "/deviation"});
});

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});

// ensuring background job runs every 2 hours
const TWO_HOURS = 2 * 60 * 60 * 1000;
async function startBackgroundJob() {
  console.log("Starting background job...");
  await fetchCryptoData();
  setInterval(fetchCryptoData, TWO_HOURS);
}

startBackgroundJob();
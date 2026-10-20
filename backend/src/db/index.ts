// ℹ️ package responsible to make the connection with mongodb
// https://www.npmjs.com/package/mongoose
import mongoose from "mongoose";

// ℹ️ The whole team uses the same MongoDB Atlas cluster, so the connection string lives in .env (see .env.example).
// No localhost fallback on purpose: if it's missing we want to know, not silently test on a different db
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is missing from .env");
}

mongoose
  .connect(MONGODB_URI)
  .then((x) => {
    const dbName = x.connections[0].name;
    console.log(`Connected to Mongo! Database name: "${dbName}"`);
  })
  .catch((err) => {
    console.error("Error connecting to mongo: ", err);
  });

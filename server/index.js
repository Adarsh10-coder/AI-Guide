const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));

const rawMongoUri = process.env.MONGO_URI;
const defaultMongoUri = "mongodb://127.0.0.1:27017/ai-guide";
let mongoUri = rawMongoUri || defaultMongoUri;

if (rawMongoUri) {
  if (!rawMongoUri.startsWith("mongodb://") && !rawMongoUri.startsWith("mongodb+srv://")) {
    console.warn("Warning: invalid MONGO_URI in .env; falling back to local MongoDB default.");
    mongoUri = defaultMongoUri;
  }
} else {
  console.warn("No MONGO_URI found in .env; using local MongoDB default.");
}

mongoose.connect(mongoUri)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB connection failed:", err));

app.use("/api/auth", require("./routes/authRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server Running on port ${PORT}`);
});
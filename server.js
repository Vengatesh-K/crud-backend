const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const cardRouter = require("./routes/cards");

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

app.use("/cards", cardRouter);

console.log("MONGODB_URI:", process.env.MONGODB_URI);
console.log("Port:", port);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected");
    console.log("Connected to database:", mongoose.connection.db.databaseName);
  })
  .catch((err) => console.error("MongoDB connection error:", err));

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

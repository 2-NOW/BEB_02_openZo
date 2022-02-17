require("dotenv").config();
const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

// DB 연결
const { PORT, MONGO_URI } = process.env;
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("Success mongo connect"))
  .catch((e) => console.error(e));

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "OPTIONS"],
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.unsubscribe(bodyParser.json());

// Router 설정
const nftRouter = require("./routes/nft-routes");

app.use("/nft", nftRouter);

module.exports = app.listen(PORT, () => {
  console.log(`Server is starting on ${PORT}`);
});

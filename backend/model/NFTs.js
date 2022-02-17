const mongoose = require("mongoose");

// db mmodel
const NftSchema = new mongoose.Schema({
  tokenId: {
    type: Number,
    required: true,
    unique: true,
  },
  creator: {
    type: String,
    required: true,
  },
  description: {
    type: Array,
  },
  image: {
    type: String,
  },
  name: {
    type: String,
  },
  ownerAddr: {
    type: String,
  },
});

module.exports = mongoose.model("nfts", NftSchema);

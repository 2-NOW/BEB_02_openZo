const axios = require("axios");
const NftDataModel = require("../model/NFTs");

exports.saveNftDb = async (req, res) => {
  const tokenURI = req.body.tokenURI;

  try {
    axios({
      method: "get",
      url: tokenURI,
    }).then((_res) => {
      const Nft = new NftDataModel({
        tokenId: req.body.tokenId,
        creator: req.body.userAddress,
        description: _res.data.description,
        image: _res.data.image,
        name: _res.data.name,
        ownerAddr: req.body.userAddress,
      });

      Nft.save(function (err) {
        if (err) {
          return res.status(502).send("tokenId is already save");
        } else {
          return res.status(201).send("Success save data");
        }
      });
    });
  } catch (err) {
    // error 처리
    return res.status(400).json({ message: "Post error" });
  }
};

//nft 전체리스트 조회
// TokenId, image, name
exports.getNftList = async (req, res) => {
  try {
    const NftList = await NftDataModel.find().exec();
    return res.status(201).json({ data: NftList });
  } catch (err) {
    return res.status(404).json({ message: "Error" });
  }
};

// tokenId로 Nft 정보 조회
exports.getNftInfoByTokenId = async (req, res) => {
  try {
    const NftFilterByTokenId = await NftDataModel.find({
      tokenId: req.params.tokenId,
    }).exec();
    return res.status(201).json({ data: NftFilterByTokenId });
  } catch (err) {
    return res.status(404).json({ message: "error" });
  }
};

// 소유자 주소로 검색하기
exports.getNftListByAddr = async (req, res) => {
  try {
    const NftFilterByAddr = await NftDataModel.find({
      ownerAddr: req.params.addr,
    }).exec();
    return res.status(201).json({ data: NftFilterByAddr });
  } catch (err) {
    return res.status(404).json({ message: "error" });
  }
};

// transfer시 db 업데이트
exports.updateOwnerAddr = async (req, res) => {
  try {
    NftDataModel.updateOne(
      { tokenId: req.body.tokenId },
      { ownerAddr: req.body.sendAddr },
      function (err) {
        if (!err) {
          return res.status(201).json({ message: "Success ownerAddr update" });
        } else {
          return res
            .status(400)
            .json({ message: "update not working check tokenId" });
        }
      }
    );
  } catch (err) {
    return res.status(404).json({ message: "error" });
  }
};

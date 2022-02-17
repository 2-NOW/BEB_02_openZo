const express = require("express");
const router = express.Router();
const NftController = require("../controller/NftController");

// 전체 목록 조회
router.get("/", NftController.getNftList);

// nft 디테일 조회
router.get("/token/:tokenId", NftController.getNftInfoByTokenId);

// nft 저장
router.post("/savenft", NftController.saveNftDb);

// transfer 발생시 OnwerAddr 업데이트
router.post("/transfer", NftController.updateOwnerAddr);

// 주소로 nft 검색 하기
router.get("/addr/:addr", NftController.getNftListByAddr);

module.exports = router;

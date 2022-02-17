# Backend
> 실행 방법
```cli 
npm install
npm start
```
+ port: 4999
+ mongodb port: 27017

# NFT 모델
|Key|Type|Detail|
|---|---|---|
|tokenId|String|tokenId|
|creator|String|nft 발행자|
|description|Array|NFT 특징|
|image|String|NFT 이미지 주소|
|name|String|NFT 이름|
|ownerAddr|String|NFT 소유자|

# API
## /nft (get)
+ Nft 전체 리스트 조회

## /nft/token/{tokenId} (get)
+ tokenId로 NFT detail 조회

## /nft/addr/{addr} (get)
+ 가지고있는 nft 주소로 검색

## /nft/savenft (post)
+ NFT 정보 저장

|Body|Type|Detail|
|---|---|---|
|tokenId|String|tokenId|
|creator|String|nft 발행자|
|tokenURI|String|NFT tokenURI 주소(ipfs)|

## /nft/transfer (post)
+ nft transfer시 Db 업데이트

|Body|Type|Detail|
|---|---|---|
|tokenId|String|tokenId|
|sendAddr|String|nft 받는 사람|

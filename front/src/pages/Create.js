import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Row, Col, Input, Form, Button, Tooltip, message } from "antd";
import styled from "styled-components";
import ProfileBackground from "../components/banner/ProfileBackground";
import { CheckOutlined, PlusSquareFilled } from "@ant-design/icons";
import { create } from "ipfs-http-client";
import contractAddr from "../data/create/contractAddr";
import axios from "axios";

const HeadSection = styled.h1`
  height: 15vh;
  font-size: 3rem;
  color: rgb(101, 136, 251);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ProfileImageWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-right: 3rem;
`;

const ProfileInputWrapper = styled.div`
  width: 25vw;
  margin-left: 4rem;
  margin-top: 3rem;
`;

const ProfileImagePosition = styled.div`
  position: absolute;
`;

const StyledImage = styled.img`
  position: relative;
  width: 15vw;
  height: 30vh;
  object-fit: contain;
`;

const StyledLabel = styled.label`
  position: relative;
  width: 25vw;
  height: 50vh;
  font-size: 4rem;
  color: rgba(255, 255, 255, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledInput = styled.div`
  border-bottom: 1.5px solid;
  border-color: rgba(57, 102, 249, 0.5);
  margin-top: 1rem;
`;

const StyledButton = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 0.5rem;
  margin-right: 1rem;
`;

export default function Create({ userAddress, contract, web3 }) {
  // TODO: Submit 시 require 알림 띄워주기
  // TODO: onFinish 함수로 control
  // TODO: issue DB에 넣는 로직
  // TODO: tx 보내서 contrack storage에 tokenURI 넣는 로직
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();
  const url = "http://localhost:4999/nft/savenft";

  const handleImageUpload = (e) => {
    if (image) URL.revokeObjectURL(image);

    const images = e.target.files;
    const imageUrl = URL.createObjectURL(images[0]);

    setImage(images[0]);
    setPreview(imageUrl);
  };

  const handleSubmitFinish = (values) => {
    if (values.name && image) {
      // ipfs 설정
      const ipfs = create({
        host: "ipfs.infura.io",
        port: 5001,
        protocol: "https",
      });
      // img파일 읽어서 ipfs통해 CID 받아오는 과정
      const reader = new window.FileReader();
      reader.readAsArrayBuffer(image);
      reader.onload = async (e) => {
        await getHash(Buffer(e.target.result), values)
          .then((res) => {
            const metaUri = `https://ipfs.io/ipfs/${res}`;
            return metaUri;
          })
          .then((metaUri) => {
            // mint함수 부르기
            if (metaUri) {
              sendTransaction(metaUri);
            }
          })
          .catch((err) => alert(err));
      };

      // ipfs로 tokenUri 생성
      const getHash = async (buffer, values) => {
        try {
          const uploadResult = await ipfs.add(buffer);

          if (uploadResult.path) {
            console.log(`hash: ${uploadResult.path}`);
            // metadata생성하기
            const metadata = {
              description: values.description ?? "",
              image: `https://ipfs.io/ipfs/${uploadResult.path}`,
              name: values.name,
            };
            // metadataURI생성하기
            const metaURI = ipfs.add(JSON.stringify(metadata)).then((res) => {
              console.log(`metaUri: ${res.path}`);
              return res.path;
            });
            return metaURI;
          }
        } catch (e) {
          console.log(e);
          return;
        }
      };

      // NFT 컨트랙트 실행
      const sendTransaction = async (tokenUri) => {
        const nonce = await web3.eth.getTransactionCount(userAddress, "latest");
        const tx = {
          from: userAddress,
          to: contractAddr,
          nonce: nonce,
          gas: 300000,
          data: contract.methods.mintNFT(userAddress, tokenUri).encodeABI(),
        };
        // mintNFT
        await web3.eth
          .sendTransaction(tx)
          .then((res) => {
            console.log(res);
            const tokenId = contract.methods.getTokenId().call();
            return tokenId;
          })
          .then((res) => {
            console.log(`tokenId: ${res}`);
            axios
              .post(
                url,
                {
                  tokenId: res,
                  tokenURI: tokenUri,
                  userAddress: userAddress,
                },
                {
                  headers: {
                    "Content-Type": "application/json",
                  },
                  withCredentials: true,
                }
              )
              .then((res) => {
                console.log(res);
              })
              .catch((err) => {
                console.log(`err: ${err}`);
                // 만약 NFT생성은 완료 되었는데 서버전송에서 오류날 경우따로 DB저장 처리 가능한 함수 필요
              });
          })
          .catch((err) => {
            console.log(err);
          });
        message.success({
          content: "Congratulate to create your NFT !",
          style: {
            marginTop: "20vh",
          },
        });
        navigate("/");
      };
    } else {
      if (!image) message.error("required NFT image");
      if (!values.name) message.error("required NFT name");
    }
  };
  //// request server with NFTInfo
  //const handleSaveNFT = () => {
  //  if (tokenId !== 0 && metaUri !== "")
  //    axios
  //      .post("http://localhost:4999/nft/savenft", {
  //        tokenId,
  //        metaUri,
  //        userAddress,
  //      })
  //      .then((res) => {
  //        console.log(`res:${res}`);
  //      })
  //      .catch((err) => {
  //        console.log(`err: ${err}`);
  //        // 만약 NFT생성은 완료 되었는데 서버전송에서 오류날 경우따로 DB저장 처리 가능한 함수 필요
  //      });
  //};

  useEffect(() => {
    return () => {
      URL.revokeObjectURL(image);
      setPreview(null);
      setImage(null);
    };
  }, []);

  return (
    <>
      <HeadSection>Create your NFT</HeadSection>
      <Row>
        <Col span={12}>
          <ProfileImageWrapper>
            <ProfileImagePosition>
              <ProfileBackground />
            </ProfileImagePosition>

            <StyledLabel htmlFor="input-file">
              {preview ? <StyledImage src={preview} /> : <PlusSquareFilled />}
            </StyledLabel>
            <input
              type="file"
              id="input-file"
              accept="img/*"
              onChange={handleImageUpload}
              style={{ display: "none" }}
            />
          </ProfileImageWrapper>
        </Col>

        <Col span={12}>
          <ProfileInputWrapper>
            <Form layout="vertical" onFinish={handleSubmitFinish}>
              <Form.Item label="name" name="name" required>
                <StyledInput>
                  <Input placeholder="Write your NFT name" bordered={false} />
                </StyledInput>
              </Form.Item>
              <br />
              <Form.Item label="description" name="description">
                <StyledInput>
                  <Input.TextArea
                    placeholder="Describe your NFT"
                    bordered={false}
                    autoSize={{ minRows: 5, maxRows: 5 }}
                  />
                </StyledInput>
              </Form.Item>
              <Form.Item>
                <StyledButton>
                  {userAddress ? (
                    <Button
                      shape="round"
                      htmlType="submit"
                      icon={<CheckOutlined />}
                    >
                      Create
                    </Button>
                  ) : (
                    <Tooltip title="Connect wallet first" color={"red"}>
                      <Button
                        shape="round"
                        htmlType="submit"
                        disabled
                        icon={<CheckOutlined />}
                      >
                        Create
                      </Button>
                    </Tooltip>
                  )}
                </StyledButton>
              </Form.Item>
            </Form>
          </ProfileInputWrapper>
        </Col>
      </Row>
    </>
  );
}

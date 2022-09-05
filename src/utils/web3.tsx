import { ethers, Contract, Signer } from "ethers";

declare let window: any;
// import contractABI from "../contracts/proxy.json";
// const contractAddress = "0x72A40770537525c4E67FE8121409100DCf141718";
import contractABI from "../contracts/tagnft.json";
const contractAddress = "0xCF8E091466cF4F0A9c734793BD7ede9B9761FD12";

const wethContractAddress = "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619";
import wethContractABI from "../contracts/weth.json";

const TAG = 1;
const BUY_PRICE = 0.0102;

let provider: any,
  smartContract,
  signer: Signer | undefined,
  contractWithSigner: Contract,
  address: string,
  wethContractWithSigner: Contract;

let has_error = false;

const metamaskInstalled = () => {
  if (window.ethereum) return true;
  return false;
};

const initConnection = async () => {
  const provider = metamaskInstalled()
    ? new ethers.providers.Web3Provider(window.ethereum)
    : undefined;
  const smartContract = new ethers.Contract(
    contractAddress,
    contractABI,
    provider
  );

  const wethContract = new ethers.Contract(
    wethContractAddress,
    wethContractABI,
    provider
  );

  signer = provider?.getSigner();
  if (signer) {
    contractWithSigner = smartContract.connect(signer);
    wethContractWithSigner = wethContract.connect(signer);
    address = await signer?.getAddress();
  }

  if (!contractWithSigner || !address) has_error = true;
  else has_error = false;
};

const getTagCount = async () => {
  if (has_error) {
    return;
  }
  const count = await contractWithSigner?.balanceOf(address, TAG);
  return count.toNumber();
};

const sellTagNft = async (count: number) => {
  let rlt = false;
  await contractWithSigner?.sellTag(count).then(
    async (trxHash: any) => {
      await trxHash.wait(1);
      rlt = true;
    },
    (error: unknown) => {
      console.log(error);
    }
  );
  return rlt;
};

const buyTagNft = async (count: number) => {
  let rlt = false;
  await wethContractWithSigner
    ?.approve(contractAddress, ethers.utils.parseEther(BUY_PRICE.toString()))
    .then(async () => {
      await contractWithSigner?.buyTag(count).then(
        async (trxHash: any) => {
          await trxHash.wait(1);
          rlt = true;
        },
        (error: unknown) => {
          console.log(error);
        }
      );
    });
  return rlt;
};

const mintTagNft = async (count: number) => {
  let rlt = false;
  await contractWithSigner?.buyTag(count).then(
    async (trxHash: any) => {
      await trxHash.wait(1);
      rlt = true;
    },
    (error: unknown) => {
      console.log(error);
    }
  );
  return rlt;
};

export { initConnection, getTagCount, sellTagNft, buyTagNft, mintTagNft };

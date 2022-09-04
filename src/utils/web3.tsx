import { ethers, Contract, Signer } from "ethers";

declare let window: any;
import contractABI from "../contracts/proxy.json";
const contractAddress = "0x72A40770537525c4E67FE8121409100DCf141718";

let provider: any, smartContract, signer: Signer | undefined, contractWithSigner: Contract;

const metamaskInstalled = () => {
  if (window.ethereum) return true;
  return false;
};

const initConnection = async() => {
  const provider =  metamaskInstalled()? new ethers.providers.Web3Provider(window.ethereum): undefined;
  const smartContract = new ethers.Contract(
  contractAddress,
  contractABI,
  provider
);

  signer = provider?.getSigner();
  if (signer) contractWithSigner = smartContract.connect(signer);
};

initConnection();

const getTagCount = async () => {
  return null;
};

const sellTagNft = async (count: number) => {
  contractWithSigner?.sellTag(count).then(
    () => {
      alert("successfully sold");
    },
    (error: unknown) => {
      console.log(error);
    }
  );
};

const buyTagNft = async (count: number) => {
  contractWithSigner?.mintTag(count).then(
    () => {
      alert("successfully baught");
    },
    (error: unknown) => {
      console.log(error);
    }
  );
};

const mintTagNft = async (count: number) => {
  contractWithSigner?.mintTag(count).then(
    () => {
      alert("successfully minted");
    },
    (error: unknown) => {
      console.log(error);
    }
  );
};

export {
  getTagCount,
  sellTagNft,
  buyTagNft,
  mintTagNft
};
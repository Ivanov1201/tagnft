import { ethers, Contract, Signer } from "ethers";

declare let window: any;
// import contractABI from "../contracts/proxy.json";
// const contractAddress = "0x72A40770537525c4E67FE8121409100DCf141718";
import contractABI from "../contracts/tagnft.json";
const contractAddress = "0x488Ab03ce728429dcB64c31CB9Df9390F61DC21e";
const TAG = 1;

let provider: any, smartContract, signer: Signer | undefined, contractWithSigner: Contract, address: string;

let has_error = false;

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
  if (signer) {
    contractWithSigner = smartContract.connect(signer);
    address = await signer?.getAddress();
  }
  if (!contractWithSigner || !address) 
    has_error = true;
  else has_error = false;
};

const getTagCount = async () => {
  if (has_error) {
    alert("Error occured in metamask");
    return;
  }
  const count = await contractWithSigner?.balanceOf(address, TAG);
  return count;
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
  contractWithSigner?.buyTag(count).then(
    () => {
      alert("successfully baught");
    },
    (error: unknown) => {
      console.log(error);
    }
  );
};

const mintTagNft = async (count: number) => {
  contractWithSigner?.buyTag(count).then(
    () => {
      alert("successfully minted");
    },
    (error: unknown) => {
      console.log(error);
    }
  );
};

export {
  initConnection,
  getTagCount,
  sellTagNft,
  buyTagNft,
  mintTagNft
};
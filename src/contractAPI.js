import { ethers } from "ethers";
import { abi } from "./MemeRealms.json";

const contractAddress = "0x633945C363c5caBABea7481339DA1bb56Ff0597D";

export async function getContract(signer) {
  return new ethers.Contract(contractAddress, abi, signer);
}

export async function createMeme(signer, formData) {
  const { name, description, createdBy, image } = formData;
  const imgUrl = 'https://ipfs.io/ipfs/QmdoLAfdxaq4Y8cco9g24wyYiVvsbeb1RNZD7wYjrL7yAH'
  const contract = await getContract(signer);

  try {
    const tx = await contract.submitMeme(name, imgUrl);
    await tx.wait();
    console.log("Token created successfully:", tx);
  } catch (error) {
    console.error("Error creating token:", error);
    throw new Error("Failed to create token");
  }
}

export const createEvent = async (
    wallet,
    eventDetails,
    ticketName,
    ticketSymbol
  ) => {
    try {
      if (!wallet || wallet.type !== "evm") {
        console.log("Wallet is not connected or provider is not available");
        return;
      }
  
      const ethersProvider = new ethers.providers.Web3Provider(
        wallet.provider,
        "any"
      );
      const contract = contractInstance.connect(ethersProvider.getSigner());
  
      const tx = await contract.createEvent(
        eventDetails,
        ticketName,
        ticketSymbol
      );
      await tx.wait();
  
      console.log("Event created successfully!");
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };

//   const reader = new window.FileReader();
//   reader.readAsArrayBuffer(image);
//   reader.onloadend = async () => {
//     const buffer = Buffer.from(reader.result);
//     const ipfs = create({
//       host: "ipfs.infura.io",
//       port: 5001,
//       protocol: "https",
//     });
//     const { path } = await ipfs.add(buffer);
//     const tokenURI = `https://ipfs.infura.io/ipfs/${path}`;
//     await contract.createToken(name, description, tokenURI, createdBy);
//   };
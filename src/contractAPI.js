import { ethers } from "ethers";
import abi from "./MemeRealms.json";
import axios from 'axios';

const contractAddress = "0x633945C363c5caBABea7481339DA1bb56Ff0597D";

export async function getContract(signer) {
  return new ethers.Contract(contractAddress, abi, signer);
}

export async function createMeme(signer, formData) {
  const { name, description, createdBy, image } = formData;
  const imgUrl = 'https://i.pinimg.com/originals/0a/bb/e5/0abbe546e479edc1eb62f5a8ccd66328.jpg';
  const contract = await getContract(signer);

  try {
    // const tx = await contract.submitMeme(name, imgUrl);
    // await tx.wait();
    // console.log("Token created successfully:", tx);
    const memeCount = await contract.memeCount().then((count) => count.toString());

    // After the transaction is successful, include the meme in the database
    const response = await axios.post('http://localhost:3000/memes', {
      name,
      desc: description,
      createdBy,
      imgUrl,
      memeCount
    });

    console.log("Meme added to database:", response.data);
  } catch (error) {
    console.error("Error creating token or adding meme to database:", error);
    throw new Error("Failed to create token or add meme to database");
  }
}

export async function getMemes(signer) {
  let memes = [];
  try {
    const contract = await getContract(signer);
    const memeCount = await contract.memeCount();
    console.log("Meme Count", memeCount);

    for (let i = 0; i < memeCount; i++) {
      const meme = await contract.memes(i);
      memes.push(meme);
      console.log("Meme:", meme);
    }
  } catch (error) {
    console.error("Error fetching memes:", error);
    throw new Error("Failed to fetch memes");
  }

  return memes;
}

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
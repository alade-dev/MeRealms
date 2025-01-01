import axios from 'axios';
import { ethers } from "ethers";
import abi from "./MemeRealms.json";

const contractAddress = "0x633945C363c5caBABea7481339DA1bb56Ff0597D";

export async function getContract(signer) {
  return new ethers.Contract(contractAddress, abi, signer);
}

export async function createMeme(signer, formData) {
  const { name, description, createdBy, image } = formData;
  const imgUrl = 'https://i.redd.it/ke53iac4gg331.jpg';
  const contract = await getContract(signer);

  try {
    const tx = await contract.submitMeme(name, imgUrl);
    await tx.wait();
    console.log("Token created successfully:", tx);
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

export async function getMemes() {
  try {
    const response = await axios.get('http://localhost:3000/memes');
    const memes_db = response.data;
    console.log("Memes fetched from database:", memes_db);

    // Restructure the data
    const memes = memes_db.map(meme => ({
      category: "Hot",
      duration: "1h",
      projects: [
        {
          name: meme.name,
          image: meme.imgUrl,
          createdBy: meme.createdBy,
          voters: meme.votes.toString(),
          description: meme.desc,
          status: "Live",
          projectStatus: "Live project",
          assetId: meme._id,
          chainId: meme.chain_id,
          likes: meme.likes,
          owner: ''
        }
      ]
    }));

    return memes;
  } catch (error) {
    console.error("Error fetching memes from database:", error);
    throw new Error("Failed to fetch memes from database");
  }
}

export async function likeMeme(memeId, user) {
  try {
    const response = await axios.post(`http://localhost:3000/memes/${memeId}/like`, { user });
    console.log("Meme liked successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error liking meme:", error);
    throw new Error("Failed to like meme");
  }
}

export async function voteOnMeme(memeId, user) {
  try {
    const response = await axios.post(`http://localhost:3000/memes/${memeId}/vote`, { user });
    console.log("Vote added successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error voting on meme:", error);
    throw new Error("Failed to vote on meme");
  }
}

export async function commentOnMeme(memeId, comment, user) {
  try {
    const response = await axios.post(`http://localhost:3000/memes/${memeId}/comments`, { comment, user });
    console.log("Comment added successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error adding comment:", error);
    throw new Error("Failed to add comment");
  }
}

export async function tipMeme(signer, memeId, chainId, amount) {
  const contract = await getContract(signer);
  try {
    const tx = await contract.supportCreator(chainId, { value: ethers.parseEther(String(amount)) });
    await tx.wait();
    const response = await axios.post(`http://localhost:3000/memes/${memeId}/tip`, { amount });
    console.log("Meme tipped successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error tipping meme:", error);
    throw new Error("Failed to tip meme");
  }
}

export async function updateProfile() {
  // Update user profile
}
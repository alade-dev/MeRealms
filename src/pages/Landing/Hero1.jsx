import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { wallet as wallet1, arrow } from "../../assets/icons/index";
import {
  giphy2,
  giphy3,
  giphy4,
  giphy5,
  giphy6,
  giphy8,
} from "../../assets/gif/index";
import RotatingMemes from "../../components/RotatingMemes";
import ModalForm from "../../components/ModalForm";

const Hero = () => {
  const navigate = useNavigate();
  const [tokens] = useState({
    projects: {
      name: "Crying Nikita",
      image: giphy6,
      createdBy: "Joshj",
      description: "This is a meme and Dao token",
    },
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleTrendClick = (project) => {
    navigate(`/meme/${project.name}`, { state: { projectData: project } });
  };

  const handleLeaderBoard = () => {
    navigate("/leaderboard");
  };

  const handleCreate = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const renderTrendsContent = () => {
    const firstToken = tokens.projects;

    return (
      <div
        className="flex items-center space-x-4 cursor-pointer hover:opacity-90 transition-opacity"
        onClick={() => handleTrendClick(firstToken)}
      >
        <img
          src={firstToken.image}
          alt="Meme"
          className="h-44 lg:w-[250px] w-40 rounded-xl object-cover"
        />
        <div className="text-left text-md leading-6">
          <p>
            Name:{" "}
            <span className="bg-gradient-to-r from-[#4782E0] to-fuchsia-300 bg-clip-text text-transparent">
              {firstToken.name}
            </span>
          </p>
          <p>
            Created by:{" "}
            <span className="bg-gradient-to-r from-[#4782E0] to-fuchsia-300 bg-clip-text text-transparent">
              {firstToken.createdBy}
            </span>
          </p>
          <p>2hrs ago</p>
        </div>
      </div>
    );
  };

  return (
    <section className="relative py-16 px-6 text-white">
      <div className="container mx-auto flex flex-col lg:flex-row items-center justify-between">
        <div className="lg:w-1/2 flex flex-col items-start justify-center lg:items-start text-center lg:text-left">
          <h1 className="text-5xl md:text-6xl font-bold mb-8">
            Grow your <span className="text-blue-500">meme</span> revolution
            <br />
            with{" "}
            <span className="bg-gradient-to-r from-[#4782E0] to-fuchsia-300 bg-clip-text text-transparent">
              {" "}
              AI{" "}
            </span>{" "}
            insights
          </h1>

          <div className="flex space-x-4 mb-12 justify-center lg:justify-start">
            {/* Open the modal */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              className="bg-[#4782E0] text-xl transition-colors duration-200 text-white px-7 w-fit flex gap-x-3 items-center py-3 text-md rounded-md hover:bg-[#5892f0]"
              onClick={handleCreate}
            >
              Create
              <img
                src={wallet1}
                alt="wallet"
                className="w-5 h-5 object-contain"
              />
            </motion.button>

            <button
              onClick={handleLeaderBoard}
              className="bg-transparent text-xl border border-gray-400 text-white px-6 py-3 rounded-lg flex items-center space-x-2 hover:bg-gray-600"
            >
              <span>Explore</span>
              <img src={arrow} alt="Arrow" className="w-5 h-5 object-contain" />
            </button>
          </div>

          <div className="bg-transparent border cursor-pointer border-fuchsia-300/20 border-r-0 p-6 rounded-xl shadow-md w-full max-w-lg text-center lg:text-left mb-16">
            <h2 className="text-3xl font-bold mb-4">Explore Realms</h2>
            {renderTrendsContent()}
          </div>
        </div>

        <RotatingMemes
          giphy2={giphy2}
          giphy3={giphy3}
          giphy4={giphy4}
          giphy5={giphy5}
          giphy6={giphy6}
          giphy8={giphy8}
        />
      </div>

      {/* Render the modal when open */}
      {isModalOpen && <ModalForm onClose={closeModal} />}
    </section>
  );
};

export default Hero;

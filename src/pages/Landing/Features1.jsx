import { useEffect, useState } from "react";
// import {
//   giphy2,
//   giphy3,
//   giphy4,
//   giphy5,
//   giphy6,
//   giphy8,
// } from "../../assets/gif/index";
import { tokens as data } from "../../data";
import { useNavigate } from "react-router-dom";
import SingleFeatures from "./SingleFeatures";

const Feature = () => {
  const [selectedCategory, setSelectedCategory] = useState("Hot");
  // const [selectedDuration, setSelectedDuration] = useState("1h");
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        setLoading(true);
        setTokens(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchTokens();
  }, [tokens]);

  // Filter tokens by selected category and duration
  const filteredTokens = tokens.filter(
    (token) => token.category === selectedCategory
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[200px] w-full">
        <div className="animate-pulse text-lg text-blue-400">
          Loading tokens...
        </div>
      </div>
    );
  }

  const handleTokenClick = (project) => {
    console.log(project);
    navigate(`/meme/${project.name}`, { state: { projectData: project } });
  };
  return (
    <div className="p-4 sm:p-6 bg-[#2A2A2A] text-white min-h-screen mx-auto max-w-screen-2xl">
      <h2 className="text-3xl font-bold mb-4 lg:mb-6 text-center">Realms</h2>

      {/* Category and Duration Filters */}
      <div className="flex flex-col sm:flex-row justify-between mb-4 sm:mb-6 space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="flex flex-wrap bg-[#D9D9D9]/10 rounded-md p-1 border justify-evenly w-full sm:w-auto border-[#D9D9D9]/30">
          {["Hot", "New Listing", "Gainers", "Favourites"].map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-2 sm:px-4 py-2 rounded-lg font-medium text-sm sm:text-base flex-grow sm:flex-grow-0 m-1 ${
                selectedCategory === category
                  ? "bg-blue-600 text-white"
                  : "bg-transparent text-gray-400 hover:bg-gray-700"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* <div className="flex flex-wrap bg-[#D9D9D9]/10 rounded-md p-1 border justify-evenly w-full sm:w-auto border-[#D9D9D9]/30">
          {["1h", "6h", "24h", "7d"].map((duration) => (
            <button
              key={duration}
              onClick={() => setSelectedDuration(duration)}
              className={`px-2 sm:px-4 py-2 rounded-lg font-medium text-sm sm:text-base flex-grow sm:flex-grow-0 m-1 ${
                selectedDuration === duration
                  ? "bg-blue-600 text-white"
                  : "bg-transparent text-gray-400 hover:bg-gray-700"
              }`}
            >
              {duration}
            </button>
          ))}
        </div> */}
      </div>

      <div className="w-full">
        <div className="grid grid-cols-[2fr,1fr,1fr,1fr,1fr] lg:gap-x-16 gap-x-0 mb-4 lg:ml-20 text-xs lg:text-sm text-[#D9D9D9] font-bold">
          <p>Collection</p>
          <p>Created By</p>
          <p>Market Cap</p>
          <p>Votes</p>
          <p></p>
        </div>
        <div className="max-h-[660px] overflow-y-auto scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-300/10">
          <div className="grid lg:grid-cols-[4fr,2fr,2fr,2fr,1fr] grid-cols-[4fr,2fr,1fr,1fr,1fr]  gap-4 items-center bg-gray-800/30 rounded-lg p-4 mb-4">
            {filteredTokens.map((token, index) => (
              <SingleFeatures
                token={token}
                handleTokenClick={handleTokenClick}
                key={index}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feature;

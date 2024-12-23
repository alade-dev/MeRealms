import { useState } from "react";
import {
  Vote,
  Heart,
  DollarSign,
  Share2,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const MemeDetailPage = () => {
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [tipAmount, setTipAmount] = useState("");
  const [showTipInput, setShowTipInput] = useState(false);
  const [voteStatus, setVoteStatus] = useState(0);
  const [voteCount, setVoteCount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const { projectData } = location.state || {};

  if (!projectData) {
    return <div>Project data not found.</div>;
  }

  const { image, createdBy, voters, name } = projectData;

  const handleLike = () => {
    setLiked(!liked);
  };

  const handleComment = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      setComments([
        ...comments,
        {
          id: Date.now(),
          text: newComment,
          user: "Current User",
          timestamp: new Date().toISOString(),
        },
      ]);
      setNewComment("");
    }
  };

  const handleTip = () => {
    if (tipAmount && !isNaN(tipAmount)) {
      console.log("Sending tip:", tipAmount);
      // setShowTipInput(false);
      setTipAmount("");
    }
  };

  const handleVote = (direction) => {
    if (voteStatus === direction) {
      setVoteStatus(0);
      setVoteCount(voteCount - direction);
    } else {
      setVoteCount(voteCount - voteStatus + direction);
      setVoteStatus(direction);
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      {/* Header */}
      <div className="sticky top-0 bg-[#121212] border-b border-gray-800 p-4 z-10">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 hover:text-gray-300"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back </span>
        </button>
      </div>

      <div className="max-w-7xl mx-auto p-4">
        <div className="flex justify-center items-center gap-4 mb-4">
          <div className="bg-blue-500 text-white py-4 bg-transparent px-4 rounded-md font-semibold  transition-colors flex items-center justify-center space-x-2">
            <span>Vote: </span>
            <Vote alt="vote" className="w-5 h-5 object-contain" />
          </div>
          <div className="flex  items-center gap-2">
            <button
              onClick={() => handleVote(1)}
              className={`p-3 rounded-full transition-all duration-300 ${
                voteStatus === 1
                  ? "bg-green-500 shadow-lg shadow-green-500/50 hover:bg-green-600"
                  : "bg-gray-800 hover:bg-gray-700"
              }`}
            >
              <ArrowUp
                className={`w-6 h-6 ${
                  voteStatus === 1 ? "text-white" : "text-gray-400"
                }`}
              />
            </button>
            <span className="font-bold text-lg">{voteCount}</span>
            <button
              onClick={() => handleVote(-1)}
              className={`p-3 rounded-full transition-all duration-300 ${
                voteStatus === -1
                  ? "bg-red-500 shadow-lg shadow-red-500/50 hover:bg-red-600"
                  : "bg-gray-800 hover:bg-gray-700"
              }`}
            >
              <ArrowDown
                className={`w-6 h-6 ${
                  voteStatus === -1 ? "text-white" : "text-gray-400"
                }`}
              />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Meme Content - Takes up 2/3 of the space on large screens */}
          <div className="lg:col-span-2">
            <div className="bg-gray-900 rounded-xl overflow-hidden mb-6">
              <img
                src={image}
                alt={name}
                className="w-full object-cover max-h-[500px]"
              />
              <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h1 className="text-xl font-bold">{name}</h1>
                  <span className="text-sm text-gray-400">
                    Created by {createdBy}
                  </span>
                </div>

                {/* Interaction Buttons */}
                <div className="flex items-center gap-4 border-t border-b border-gray-800 py-4">
                  <button
                    onClick={handleLike}
                    className={`flex items-center gap-2 ${
                      liked ? "text-red-500" : "text-gray-400"
                    } hover:text-red-500 transition-colors`}
                  >
                    <Heart
                      className={`w-6 h-6 ${liked ? "fill-current" : ""}`}
                    />
                    <span>Like</span>
                  </button>

                  <button
                    onClick={() => setShowTipInput(!showTipInput)}
                    className="flex items-center gap-2 text-gray-400 hover:text-yellow-500 transition-colors"
                  >
                    <DollarSign className="w-6 h-6" />
                    <span>Tip</span>
                  </button>

                  <button className="flex items-center gap-2 text-gray-400 hover:text-blue-500 transition-colors">
                    <Share2 className="w-6 h-6" />
                    <span>Share</span>
                  </button>

                  <div className="ml-auto flex items-center gap-2">
                    <Vote className="w-6 h-6" />
                    <span>{voters}</span>
                  </div>
                </div>

                {/* Tip Input */}
                {showTipInput && (
                  <div className="mt-4 flex gap-2">
                    <input
                      type="number"
                      value={tipAmount}
                      min={0}
                      onChange={(e) => setTipAmount(e.target.value)}
                      placeholder="Enter tip amount"
                      className="flex-1 bg-gray-800 rounded-lg px-4 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={handleTip}
                      className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-lg transition-colors"
                    >
                      Send Tip
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Comments Section - Takes up 1/3 of the space on large screens */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900 rounded-xl p-4 sticky top-20">
              <h2 className="text-lg font-semibold mb-4">Comments</h2>

              {/* Comment Form */}
              <form onSubmit={handleComment} className="mb-6">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-1 bg-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg transition-colors"
                  >
                    Comment
                  </button>
                </div>
              </form>

              {/* Comments List */}
              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="border-b border-gray-800 pb-4"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-full bg-gray-800" />
                      <span className="font-medium">{comment.user}</span>
                      <span className="text-sm text-gray-400">
                        {new Date(comment.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-300">{comment.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemeDetailPage;

import { useState } from "react";
import { Settings, Copy } from "lucide-react";
import { toast } from "react-toastify";
import { useWallet } from "../../WalletContext";
import ProfileSettings from "./ProfileSettings";

const UserProfilePage = () => {
  const [activeTab, setActiveTab] = useState("memes");
  const { walletAddress } = useWallet();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const shortenAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const userData = {
    username: "memeMaster",
    walletAddress: walletAddress
      ? shortenAddress(walletAddress)
      : "Connect Wallet",
    totalMemes: 42,
    totalVotes: 156,
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast("Wallet address copied to clipboard");
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white p-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500" />
          <div>
            <h1 className="text-2xl font-bold">{userData.username}</h1>
            <div className="flex items-center gap-2 text-gray-400">
              <span>{userData.walletAddress}</span>
              <button
                onClick={() => copyToClipboard(walletAddress)}
                className="hover:text-white transition-colors"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsSettingsOpen(true)}
          className="p-2 hover:bg-gray-800 rounded-full transition-colors"
        >
          <Settings className="w-6 h-6" />
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gray-900 rounded-xl p-4">
          <h3 className="text-gray-400 mb-1">Total Memes</h3>
          <p className="text-2xl font-bold">{userData.totalMemes}</p>
        </div>

        <div className="bg-gray-900 rounded-xl p-4">
          <h3 className="text-gray-400 mb-1">Total Votes</h3>
          <p className="text-2xl font-bold">{userData.totalVotes}</p>
        </div>

        {/* <div className="bg-gray-900 rounded-xl p-4">
          <h3 className="text-gray-400 mb-1">Chain</h3>
          <div className="relative">
            <button
              className="w-full flex items-center justify-between bg-gray-800 rounded-lg p-2"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <span>{activeChain}</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {dropdownOpen && (
              <div className="absolute top-full left-0 w-full mt-1 bg-gray-800 rounded-lg overflow-hidden">
                 {walletAddress && (
          <select
            value={chainId}
            onChange={(e) => {
              const selectedChain = CHIANS.find(
                (chain) => chain.chainId === Number(e.target.value)
              );
              if (selectedChain) switchChain(selectedChain);
            }}
            className="bg-[#2d2d35] text-white px-4 py-2 rounded-md focus:outline-none"
          >
            {CHIANS.map((chain) => (
              <option key={chain.chainId} value={chain.chainId}>
                {chain.chainName}
              </option>
            ))}
          </select>
        )}
              </div>
            )}
          </div>
        </div> */}
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-800 mb-6">
        <div className="flex gap-4">
          {["memes", "votes", "activity"].map((tab) => (
            <button
              key={tab}
              className={`pb-2 px-1 capitalize ${
                activeTab === tab
                  ? "border-b-2 border-purple-500 text-white"
                  : "text-gray-400"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {activeTab === "memes" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((meme) => (
            <div key={meme} className="bg-gray-900 rounded-xl overflow-hidden">
              <div className="aspect-square bg-gray-800" />
              <div className="p-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Created 2d ago</span>
                  <span className="flex items-center gap-1">
                    <span>💖</span>
                    <span>42</span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "votes" && (
        <div className="space-y-4">
          {[1, 2, 3].map((vote) => (
            <div key={vote} className="bg-gray-900 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-800 rounded-lg" />
                  <div>
                    <p className="font-medium">Voted on Epic Meme {vote}</p>
                    <p className="text-sm text-gray-400">1 hour ago</p>
                  </div>
                </div>
                <span>💖</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "activity" && (
        <div className="space-y-4">
          {[1, 2, 3, 4].map((activity) => (
            <div key={activity} className="bg-gray-900 rounded-xl p-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-800 rounded-lg" />
                <div>
                  <p className="font-medium">
                    Created new meme Epic Meme {activity}
                  </p>
                  <p className="text-sm text-gray-400">2 hours ago</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isSettingsOpen && (
        <ProfileSettings
          onClose={() => setIsSettingsOpen(false)}
          currentUser={userData}
        />
      )}
    </div>
  );
};

export default UserProfilePage;

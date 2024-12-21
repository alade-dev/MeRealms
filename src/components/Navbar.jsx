import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { WalletTgSdk } from "@uxuycom/web3-tg-sdk";
import { motion } from "framer-motion";
import { LogOut } from "lucide-react";

let isInjected = localStorage.getItem("__isInjected");
const walletTgSdk = new WalletTgSdk({ injected: !!isInjected });
const ethereum = isInjected ? window.ethereum : walletTgSdk.ethereum;

const CHIANS = [
  {
    chainId: 56,
    chainKey: "binance",
    chainName: "Binance",
    chainSymbol: "BNB",
    chainRPCs: ["https://bnb.rpc.subquery.network/public"],
  },
  {
    chainId: 204,
    chainKey: "opbnb",
    chainName: "opBNB",
    chainSymbol: "BNB",
    chainRPCs: ["https://opbnb-mainnet-rpc.bnbchain.org"],
  },
];

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [walletAddress, setWalletAddress] = useState(null);
  const [chainId, setChainId] = useState(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const connectWallet = async () => {
    try {
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      setWalletAddress(accounts[0]);
      const currentChainId = await ethereum.request({ method: "eth_chainId" });
      setChainId(currentChainId);
    } catch (error) {
      alert(error.message);
    }
  };

  const disconnectWallet = () => {
    setWalletAddress(null);
    setChainId(null);
  };

  const switchChain = async (chain) => {
    try {
      await ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${chain.chainId.toString(16)}` }],
      });
      setChainId(chain.chainId); 
    } catch (error) {
      alert(error.message);
    }
  };

  useEffect(() => {
    const init = async () => {
      if (ethereum) {
        const accounts = await ethereum.request({ method: "eth_accounts" });
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
          const currentChainId = await ethereum.request({ method: "eth_chainId" });
          setChainId(currentChainId);
        }
      }
    };
    init();
  }, []);

  return (
    <nav className="flex justify-between lg:relative mx-auto items-center bg-black/30 px-8 py-4">
      {/* Logo and Brand Name */}
      <Link to="/">
        <motion.div
          whileHover={{
            scale: 1.1,
          }}
          className="flex items-center space-x-2"
        >
          <p className="border-cyan-700 font-extrabold text-xl">
            Me<span className="text-[#4782E0]">Realms</span>
          </p>
        </motion.div>
      </Link>

      {/* Hamburger Button */}
      <button
        className="md:hidden text-white hover:text-[#F5167E] focus:outline-none"
        onClick={toggleMenu}
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
          />
        </svg>
      </button>

      {/* Navigation Links */}
      <div
        className={`${
          isMenuOpen ? "block" : "hidden"
        } md:flex md:items-center md:space-x-6 absolute md:static top-16 left-0 w-full md:w-auto bg-black/30 md:bg-transparent p-4 md:p-0 z-10`}
      >
        <div className="block md:hidden items-center space-x-2 bg-[#2d2d35] px-4 py-2 mb-3 w-[300px] hover:border-gray-500 focus-within:border-gray-500 transition-colors rounded-md">
          <input
            type="text"
            placeholder="Search"
            className="bg-[#2d2d35] text-white px-4 py-1 rounded-l-md focus:outline-none w-full"
          />
        </div>

        {/* Chain Selector */}
        {walletAddress && (
          <select
            value={chainId}
            onChange={(e) => {
              const selectedChain = CHIANS.find(chain => chain.chainId === Number(e.target.value));
              if (selectedChain) switchChain(selectedChain);
            }}
            className="bg-[#2d2d35] text-white px-4 py-2 rounded-md focus:outline-none"
          >
            {CHIANS.map(chain => (
              <option  key={chain.chainId} value={chain.chainId}>{chain.chainName}</option>
            ))}
          </select>
        )}

        {/* Wallet Address Button */}
        {walletAddress ? (
          <div style={{ display: "flex", alignItems: "center" }}>
            <button className="bg-[#4885e7] transition-colors duration-200 text-white px-4 py-3 text-md rounded-md hover:bg-[#4782E0]">
              {walletAddress.slice(0, 8)}...{walletAddress.slice(-5)}
            </button>
            <motion.div whileHover={{ scale: 1.1 }}>
              <LogOut
                size={36}
                onClick={disconnectWallet}
                style={{ marginLeft: 10, color: "red", cursor: "pointer" }}
              />
            </motion.div>
          </div>
        ) : (
          <motion.button
            whileHover={{ scale: 1.1 }}
            className="bg-[#4885e7] transition-colors duration-200 text-white px-4 py-3 text-md rounded-md hover:bg-[#4782E0]"
            onClick={connectWallet}
          >
            Connect Wallet
          </motion.button>
        )}

        {/* Display Chain ID if connected
        {walletAddress && (
          <div>
            <p>Chain ID: {chainId}</p>
          </div>
        )} */}
      </div>
    </nav>
  );
};

export default NavBar;

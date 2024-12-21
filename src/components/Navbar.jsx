import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

// import { LogOut } from "lucide-react";
import { logoapp } from "../assets/icons";

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // const [loading, setLoading] = useState(true); // Add loading state

  // const { balance } = useBalance({
  //   address: wallet?.address.toAddress(),
  //   assetId: wallet?.provider.getBaseAssetId(),
  // });

  // useEffect(() => {
  //   if (isConnected && wallet) {
  //     setLoading(false);
  //     //You can add function here 🫠
  //   }
  // }, [wallet, isConnected]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // const handleConnect = () => {
  //   if (!isConnected) {
  //     connect();
  //   }
  // };

  // const handleDisconnect = () => {
  //   if (wallet) {
  //     disconnect();
  //   }
  // };

  // const slicedAddress = wallet?.address
  //   ? `${wallet?.address.toAddress().slice(0, 8)}...${wallet?.address.toAddress().slice(-5)}`
  //   : "";

  // const handleCopyAddress = () => {
  //   if (wallet?.address.toAddress()) {
  //     navigator.clipboard.writeText(wallet.address.toAddress());
  //     alert("Wallet address copied to clipboard!");
  //   }
  // };
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
          <p className="border-cyan-700 font-extrabold text-xl">Me<span className="text-[#4782E0]">Realms</span></p>
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

        {/* Wallet Address Button */}

        {/* {wallet && isConnected && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            className="bg-[#4782E0] transition-colors duration-200 text-white px-4 py-3 text-md rounded-md hover:bg-[#5892f0]"
            onClick={handleCopyAddress}
          >
            {slicedAddress}
          </motion.button>
        )} */}

        {/* {wallet  (
          <motion.button
            whileHover={{ scale: 1.1 }}
            className=" text-red-500 ml-2 cursor-pointer"
            onClick={handleDisconnect}
          >
            <LogOut size={24} />
          </motion.button>
        )} */}

        {/* Connect Button */}

        <motion.button
          whileHover={{ scale: 1.1 }}
          className="bg-[#4885e7] transition-colors duration-200 text-white px-4 py-3 text-md rounded-md hover:bg-[#4782E0]"
        >
          Connect Wallet
        </motion.button>
      </div>
    </nav>
  );
};

export default NavBar;

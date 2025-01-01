import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { WalletTgSdk } from "@uxuycom/web3-tg-sdk";
import { ethers } from "ethers";
import { createMeme } from "../contractAPI";


let isInjected = localStorage.getItem("__isInjected");
const walletTgSdk = new WalletTgSdk({ injected: !!isInjected });
const ethereum = isInjected ? window.ethereum : walletTgSdk.ethereum;

const ModalForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    ticker: "",
    description: "",
    createdBy: "",
    image: null,
  });

  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose(); // Close the modal
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const provider = new ethers.BrowserProvider(ethereum);
    const signer = await provider.getSigner();
    console.log("Form Data Submitted:", formData);
    await createMeme(signer, formData);
    // Perform submission logic here
    onClose(); // Close the modal
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div
        ref={modalRef}
        className="bg-[#1C1C28] p-8 rounded-lg shadow-lg w-full max-w-md"
      >
        <h2 className="text-white text-xl mb-6 font-bold">Create Token</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-1">
              Name<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              placeholder="Enter token name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-1">
              Ticker<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="ticker"
              placeholder="Enter ticker"
              value={formData.ticker}
              onChange={handleChange}
              className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-1">
              Description<span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              placeholder="Enter description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-1">
              Created By<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="createdBy"
              placeholder="Creator name"
              value={formData.createdBy}
              onChange={handleChange}
              className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-1">
              Image<span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="w-full text-gray-300"
              required
            />
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#4782E0] text-white rounded hover:bg-blue-700"
            >
              Create Now
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
ModalForm.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default ModalForm;

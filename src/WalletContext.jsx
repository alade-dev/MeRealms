/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { createContext, useContext, useState, useEffect } from 'react';
import { WalletTgSdk } from '@uxuycom/web3-tg-sdk';

const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  let isInjected = localStorage.getItem("__isInjected");
  const walletTgSdk = new WalletTgSdk({ injected: !!isInjected });
  const ethereum = isInjected ? window.ethereum : walletTgSdk.ethereum;

  const [walletAddress, setWalletAddress] = useState(null);
  const [chainId, setChainId] = useState(null);

  const connectWallet = async () => {
    try {
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
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
  }, [ethereum]);

  return (
    <WalletContext.Provider value={{ walletAddress, chainId, setChainId, connectWallet, disconnectWallet }}>
      {children}
    </WalletContext.Provider>
  );
};


export const useWallet = () => {
  return useContext(WalletContext);
};


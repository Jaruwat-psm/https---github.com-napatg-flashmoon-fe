import React, { createContext, useState, useEffect, useContext } from 'react';

const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');

  // Load wallet connection state from localStorage when the component mounts
  useEffect(() => {
    const connected = localStorage.getItem('walletConnected') === 'true';
    const address = localStorage.getItem('walletAddress');
    setWalletConnected(connected);
    if (address) setWalletAddress(address);
  }, []);

  // Save wallet connection state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('walletConnected', walletConnected);
    localStorage.setItem('walletAddress', walletAddress);
  }, [walletConnected, walletAddress]);

  return (
    <WalletContext.Provider value={{ walletConnected, setWalletConnected, walletAddress, setWalletAddress }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  return useContext(WalletContext);
};

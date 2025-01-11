import React, { createContext, useContext } from "react";
import { useWallet } from "../hooks/useWallet";

export const WalletContext = createContext(null);

export const WalletProvider = ({ children }) => {
  const wallet = useWallet();

  return (
    <WalletContext.Provider value={wallet}>{children}</WalletContext.Provider>
  );
};

export const useWalletContext = () => {
  const context = useContext(WalletContext);
  if (context === null) {
    throw new Error("useWalletContext must be used within a WalletProvider");
  }
  return context;
};

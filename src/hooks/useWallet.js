import { useState, useEffect, useCallback, useRef } from "react";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import { toast } from "react-hot-toast";

// Contract imports
import SablierContract from "../config/contracts/Sablier.json";
const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;

const web3ModalConfig = {
  cacheProvider: true,
  providerOptions: {},
};

const WALLET_DATA_KEY = "walletData";

export const useWallet = () => {
  const [web3Modal, setWeb3Modal] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Use refs to prevent infinite loops
  const hasAutoConnected = useRef(false);

  const saveWalletData = useCallback((data) => {
    localStorage.setItem(
      WALLET_DATA_KEY,
      JSON.stringify({
        account: data.account,
        timestamp: Date.now(),
      })
    );
  }, []);

  const loadWalletData = useCallback(() => {
    try {
      const data = localStorage.getItem(WALLET_DATA_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (error) {
      console.error("Error loading wallet data:", error);
      localStorage.removeItem(WALLET_DATA_KEY);
    }
    return null;
  }, []);

  const clearWalletData = useCallback(() => {
    try {
      localStorage.removeItem(WALLET_DATA_KEY);
    } catch (error) {
      console.error("Error clearing wallet data:", error);
    }
  }, []);

  const handleChainChanged = useCallback(() => {
    window.location.reload();
  }, []);

  const disconnectWallet = useCallback(async () => {
    try {
      if (provider?.disconnect) {
        await provider.disconnect();
      }
      if (web3Modal) {
        web3Modal.clearCachedProvider();
      }

      setProvider(null);
      setSigner(null);
      setAccount(null);
      setContract(null);
      clearWalletData();
      hasAutoConnected.current = false;

      toast.success("Wallet disconnected");
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
      // Still clear the state even if there's an error
      setProvider(null);
      setSigner(null);
      setAccount(null);
      setContract(null);
      clearWalletData();
      hasAutoConnected.current = false;
    }
  }, [provider, web3Modal, clearWalletData]);

  const connectWallet = useCallback(async () => {
    if (!web3Modal || isConnecting) return;

    try {
      setIsConnecting(true);
      setError(null);

      const connection = await web3Modal.connect();
      const ethersProvider = new ethers.BrowserProvider(connection);
      const ethersSigner = await ethersProvider.getSigner();
      const userAddress = await ethersSigner.getAddress();

      const sablierContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        SablierContract.abi,
        ethersSigner
      );

      // Setup event listeners before setting state
      const handleAccountsChanged = async (accounts) => {
        if (accounts.length === 0) {
          await disconnectWallet();
        } else {
          const newSigner = await ethersProvider.getSigner();
          const newAddress = await newSigner.getAddress();
          setSigner(newSigner);
          setAccount(newAddress);
          saveWalletData({ account: newAddress });
        }
      };

      // Remove old listeners if they exist
      if (provider) {
        provider.removeAllListeners?.();
      }

      // Add new listeners
      connection.on("accountsChanged", handleAccountsChanged);
      connection.on("chainChanged", handleChainChanged);
      connection.on("disconnect", disconnectWallet);

      // Set all state at once to trigger a single re-render
      setProvider(ethersProvider);
      setSigner(ethersSigner);
      setAccount(userAddress);
      setContract(sablierContract);

      saveWalletData({ account: userAddress });
      // toast.success("Wallet connected successfully!");
    } catch (err) {
      console.error("Failed to connect wallet:", err);
      setError(err);
      toast.error("Failed to connect wallet");
      await disconnectWallet();
    } finally {
      setIsConnecting(false);
    }
  }, [
    web3Modal,
    isConnecting,
    saveWalletData,
    disconnectWallet,
    handleChainChanged,
    provider,
  ]);

  // Initialize Web3Modal once
  useEffect(() => {
    if (!isInitialized) {
      const modal = new Web3Modal(web3ModalConfig);
      setWeb3Modal(modal);
      setIsInitialized(true);
    }
  }, [isInitialized]);

  // Handle auto-connection
  useEffect(() => {
    const autoConnect = async () => {
      if (
        web3Modal?.cachedProvider &&
        !hasAutoConnected.current &&
        loadWalletData()
      ) {
        hasAutoConnected.current = true;
        await connectWallet();
      }
    };

    autoConnect();
  }, [web3Modal, connectWallet, loadWalletData]);

  return {
    isConnected: !!account,
    isConnecting,
    error,
    account,
    signer,
    contract,
    connectWallet,
    disconnectWallet,
  };
};

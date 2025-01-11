import { useWalletContext } from "../contexts/WalletContext";

const WalletConnect = () => {
  const {
    isConnected,
    isConnecting,
    error,
    account,
    connectWallet,
    disconnectWallet,
  } = useWalletContext();

  const shortenAddress = (address) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="flex items-center gap-4">
      {isConnected ? (
        <>
          <span className="text-sm text-gray-300">
            {shortenAddress(account)}
          </span>
          <button
            onClick={disconnectWallet}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded transition-colors"
          >
            Disconnect
          </button>
        </>
      ) : (
        <button
          onClick={connectWallet}
          disabled={isConnecting}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isConnecting ? "Connecting..." : "Connect Wallet"}
        </button>
      )}
      {error && <p className="text-red-500 text-sm mt-2">{error.message}</p>}
    </div>
  );
};

export default WalletConnect;

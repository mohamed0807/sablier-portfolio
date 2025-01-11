import { useWallet } from "../hooks/useWallet";

export const WalletConnection = () => {
  const {
    isConnected,
    isConnecting,
    error,
    account,
    contract,
    connectWallet,
    disconnectWallet,
  } = useWallet();

  return (
    <div>
      {isConnected ? (
        <>
          <p>Connected Account: {account}</p>
          <button
            onClick={disconnectWallet}
            className="px-4 py-2 bg-red-500 text-white rounded"
          >
            Disconnect Wallet
          </button>
          <button
            onClick={handleCreateStream}
            className="px-4 py-2 bg-blue-500 text-white rounded ml-2"
          >
            Create Stream
          </button>
        </>
      ) : (
        <button
          onClick={connectWallet}
          disabled={isConnecting}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          {isConnecting ? "Connecting..." : "Connect Wallet"}
        </button>
      )}
      {error && <p className="text-red-500 mt-2">{error.message}</p>}
    </div>
  );
};

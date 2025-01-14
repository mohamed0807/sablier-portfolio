import isEmpty from "is-empty";
import {
  Clock,
  CreditCard,
  Download,
  Loader2,
  Pause,
  Pen,
  Power,
  Search,
  User,
  User2,
  Wallet,
  XCircle,
} from "lucide-react";

import Modal from "react-modal";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";
import { useWallet } from "../hooks/useWallet";
import { contractInstance } from "../services/contract";

const formatAmount = (amount, decimals) => {
  return amount / Math.pow(10, decimals);
};
const actionTypes = [
  "deposit",
  "withdraw",
  "void",
  "pause",
  "adjustRatePerSecond",
  "restart",
];

const getSuccessMessage = (actionType) => {
  if (!actionTypes.includes(actionType)) {
    return "Action completed successfully!";
  }

  const actionVerbs = {
    deposit: "Deposited",
    withdraw: "Withdrawn",
    void: "Voided",
    pause: "Paused",
    adjustRatePerSecond: "Adjusted rate per second for",
    restart: "Restarted",
  };

  const verb = actionVerbs[actionType] || "Completed";
  return `Successfully ${verb} stream.`;
};
const getErrorMessage = (actionType) => {
  if (!actionTypes.includes(actionType)) {
    return "An error occurred while processing the action.";
  }

  const actionErrors = {
    deposit: "An error occurred while depositing stream.",
    withdraw: "An error occurred while withdrawing stream.",
    void: "An error occurred while voiding stream.",
    pause: "An error occurred while pausing stream.",
    adjustRatePerSecond: "An error occurred while adjusting rate per second.",
    restart: "An error occurred while restarting stream.",
  };

  return (
    actionErrors[actionType] || "An error occurred while processing the stream."
  );
};
const handleTransaction = async (
  actionType,
  debtContract,
  toast,
  setLoading,
  streamId,
  stream,
  walletAddress,
  formData,
  handleSearch,
  signer
) => {
  try {
    let response;

    if (actionType === "withdraw") {
      response = await debtContract.withdraw(streamId, walletAddress);
    } else if (actionType === "deposit") {
      response = await debtContract.deposit(
        streamId,
        formData.amount,
        stream[2],
        walletAddress,
        stream[7],
        signer
      );
    } else if (actionType === "void") {
      response = await debtContract.void(streamId, stream[2], walletAddress);
    } else if (actionType === "pause") {
      response = await debtContract.pauseStream(
        streamId,
        stream[2],
        walletAddress
      );
    } else if (actionType === "adjustRPC") {
      response = await debtContract.adjustRatePerSecond(
        streamId,
        formData.newRPC,
        stream[2],
        walletAddress
      );
    } else if (actionType == "restart") {
      response = await debtContract.restartStream(
        streamId,
        formData.newRPC,
        stream[2],
        walletAddress
      );
    }

    const { status, message } = response;

    if (status) {
      await handleSearch();
      const successMessage = getSuccessMessage(actionType);
      toast.success(successMessage);
    } else {
      if (!isEmpty(message)) {
        toast.error(message);
        return;
      }
      const errorMessage = getErrorMessage(actionType);
      toast.error(errorMessage);
    }
  } catch (err) {
    const errorMessage = getErrorMessage(actionType);
    toast.error(errorMessage);
    console.log(`Error during ${actionType}:`, err);
  } finally {
    setLoading(false);
  }
};
const StreamActionModal = ({ isOpen, onClose, actionType, onConfirm }) => {
  const [formData, setFormData] = useState({
    sender: "",
    recipient: "",
    amount: "",
    newRPC: "",
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    onConfirm(formData);
    onClose();
  };

  const renderModalContent = () => {
    switch (actionType) {
      case "deposit":
        return (
          <div className="grid gap-4">
            {/* <div className="grid gap-2">
              <label
                htmlFor="sender"
                className="text-sm font-medium text-gray-700"
              >
                Sender
              </label>
              <input
                id="sender"
                name="sender"
                value={formData.sender}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="grid gap-2">
              <label
                htmlFor="recipient"
                className="text-sm font-medium text-gray-700"
              >
                Recipient
              </label>
              <input
                id="recipient"
                name="recipient"
                value={formData.recipient}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div> */}
            <div className="grid gap-2">
              <label
                htmlFor="amount"
                className="text-sm font-medium text-gray-700"
              >
                Amount
              </label>
              <input
                id="amount"
                name="amount"
                type="number"
                value={formData.amount}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        );
      case "restart":
        return (
          <div className="grid gap-4">
            <div className="grid gap-2">
              <label
                htmlFor="ratePerSecond"
                className="text-sm font-medium text-gray-700"
              >
                New RPC Amount
              </label>
              <input
                id="newRPC"
                name="newRPC"
                type="number"
                value={formData.newRPC}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        );

      case "adjustRPC":
        return (
          <div className="grid gap-4">
            <div className="grid gap-2">
              <label
                htmlFor="newRPC"
                className="text-sm font-medium text-gray-700"
              >
                New RPC Amount
              </label>
              <input
                id="newRPC"
                name="newRPC"
                type="number"
                value={formData.newRPC}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        );

      default:
        return (
          <p className="text-gray-700">
            Are you sure you want to {actionType} this stream?
          </p>
        );
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg mx-auto outline-none"
    >
      <header className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold capitalize">
          {actionType} Stream
        </h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          ✕
        </button>
      </header>

      {renderModalContent()}

      <footer className="flex justify-end space-x-2 mt-4">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
        >
          Confirm
        </button>
      </footer>
    </Modal>
  );
};
const DataItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-3 p-4 bg-gray-800/30 rounded-lg hover:bg-gray-800/40 transition-all duration-300">
    {Icon ? (
      <Icon className="text-gray-400" size={20} />
    ) : (
      <div className="w-2 h-2 rounded-full bg-green-400 mt-1" />
    )}
    <div className="flex-1">
      <p className="text-sm text-gray-400 mb-1">{label}</p>
      <p className="text-sm font-medium text-gray-100 truncate">{value}</p>
    </div>
  </div>
);
// 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
const StreamCard = ({
  stream,
  setLoading,
  setError,
  streamId,
  contract,
  loading,
  address,
  handleSearch,
  signer,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentAction, setCurrentAction] = useState(null);

  const handleAction = async (actionType, formData = {}) => {
    setLoading(true);
    setError("");
    try {
      const debtContract = contractInstance(contract);
      await handleTransaction(
        actionType,
        debtContract,
        toast,
        setLoading,
        streamId,
        stream,
        address,
        formData,
        handleSearch,
        signer
      );
    } catch (err) {
      console.error("Error in action handler:", err);
      setError(
        err?.response?.data?.message || "An error occurred during the action."
      );
    } finally {
      setLoading(false);
    }
  };

  const openModal = (actionType) => {
    setCurrentAction(actionType);
    setModalOpen(true);
  };

  const handleModalConfirm = (formData) => {
    handleAction(currentAction, formData);
  };

  const isLive = !stream[6];

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8 rounded-xl shadow-xl border border-gray-700/50 hover:border-gray-600/50 transition-all duration-500">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-extrabold text-blue-400">
            Active Stream
          </h2>
          <div className="flex items-center mt-1">
            <div
              className={`w-3 h-3 rounded-full ${
                isLive ? "bg-green-400 animate-pulse" : "bg-red-400"
              }`}
            />
            <span
              className={`ml-2 text-sm font-semibold ${
                isLive ? "text-green-300" : "text-red-300"
              }`}
            >
              {isLive ? "Live" : "Ended"}
            </span>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-2 text-gray-400">
            <button
              disabled
              className={`mt-4 w-full px-4 py-3 text-white rounded-lg transition-all duration-200 shadow-lg flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 hover:shadow-blue-500/25`}
            >
              <Loader2 className="animate-spin" size={24} />
              <span>Loading...</span>
            </button>
          </div>
        ) : (
          !loading &&
          isLive && (
            <div className="flex gap-3">
              <ActionButton
                onClick={() => openModal("withdraw")}
                icon={Download}
                label="Withdraw"
                variant="primary"
              />
              <ActionButton
                onClick={() => openModal("deposit")}
                icon={CreditCard}
                label="Deposit"
                variant="success"
              />
              <ActionButton
                onClick={() => openModal("pause")}
                icon={Pause}
                label="Pause"
                variant="secondary"
              />
              <ActionButton
                onClick={() => openModal("restart")}
                icon={Power}
                label="Restart"
                variant="restart"
              />
              <ActionButton
                onClick={() => openModal("adjustRPC")}
                icon={Pen}
                label="Adjust RPC"
                variant="warning"
              />
              <ActionButton
                onClick={() => openModal("void")}
                icon={XCircle}
                label="Void"
                variant="danger"
              />
            </div>
          )
        )}
      </div>
      <StreamActionModal
        stream={stream}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        actionType={currentAction}
        onConfirm={handleModalConfirm}
      />
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-4">
          <DataItem icon={User} label="Sender" value={stream[2]} />
          <DataItem icon={User2} label="Recipient" value={stream[10]} />
          <DataItem
            icon={Wallet}
            label="Amount"
            value={formatAmount(stream[0], stream[8])}
          />
        </div>
        <div className="space-y-4">
          <DataItem icon={User2} label="Token" value={stream[7]} />

          <DataItem
            icon={CreditCard}
            label="Rate Per Second"
            value={formatAmount(stream[1], stream[8])}
          />
          <DataItem
            icon={Clock}
            label="Start Time"
            value={new Date(stream[3] * 1000).toLocaleString()}
          />
        </div>
      </div>
    </div>
  );
};

const ActionButton = ({ onClick, icon: Icon, label, variant }) => {
  const baseStyles =
    "px-4 rounded-lg font-semibold flex items-center gap-2 transition-all";
  const variants = {
    primary: "bg-blue-500 hover:bg-blue-600 text-white hover:text-black",
    secondary: "bg-gray-500 hover:bg-gray-600 text-white hover:text-black",
    success: "bg-green-500 hover:bg-green-600 text-white hover:text-black",
    warning: "bg-yellow-500 hover:bg-yellow-600 text-black hover:text-white",
    danger: "bg-red-500 hover:bg-red-600 text-white hover:text-black",
    restart: "bg-gray-800 hover:bg-gray-300 hover:text-black text-white",
  };

  return (
    <button onClick={onClick} className={`${baseStyles} ${variants[variant]}`}>
      {Icon && <Icon className="w-5 h-5" />}
      {label}
    </button>
  );
};

const FindStream = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [streams, setStreams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  const query = searchParams.get("query") || "";

  const { contract, signer } = useWallet();
  const isValidInput = (input) => {
    return input.trim().length > 0;
  };

  const handleSearch = async () => {
    if (!query || isEmpty(query)) return;
    if (!isValidInput(query)) return;

    setLoading(true);
    setError("");
    setStreams([]);

    try {
      if (isEmpty(contract) || isEmpty(signer)) return;
      const debtContract = await contractInstance(contract);
      let data = await debtContract.getStreamById(query);
      console.log("DATA", data);
      if (data.length === 0) {
        setError("Stream not found.");
      } else {
        // data = data.map((item) => {
        //   if (typeof item === "bigint") {
        //     return item.toString();
        //   }
        //   return item;
        // });
        setStreams(data);
      }
      // console.log("DATA", data.length, data[0]);
    } catch (err) {
      console.error("Error fetching streams:", err);
      const message =
        err?.response?.data?.message ||
        "An error occurred while fetching streams.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;

    setSearchParams(value ? { query: value } : {});
  };

  useEffect(() => {
    console.log("query_query", query);
    handleSearch();
  }, [query, contract]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white">
      <main className="max-w-4xl mx-auto p-6">
        <div className="mb-8 relative">
          <div className="relative">
            <input
              type="text"
              placeholder="Enter Stream ID (Ex: Try to find 1)"
              value={query}
              onChange={handleInputChange}
              className="w-full px-4 py-3 pl-11 rounded-lg bg-gray-800/50 text-white border border-gray-700/50 focus:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 backdrop-blur-sm"
            />
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={loading || actionLoading}
            className={`mt-4 w-full px-4 py-3 text-white rounded-lg transition-all duration-200 shadow-lg flex items-center justify-center gap-2 ${
              loading || actionLoading
                ? "bg-blue-300 hover:bg-blue-300 cursor-not-allowed opacity-50 shadow-none"
                : "bg-blue-500 hover:bg-blue-600 hover:shadow-blue-500/25"
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                <span>Searching...</span>
              </>
            ) : (
              <>
                <Search size={20} />
                <span>Search</span>
              </>
            )}
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-2 text-gray-400">
            <Loader2 className="animate-spin" size={24} />
            <span>Searching for streams...</span>
          </div>
        ) : error ? (
          <div className="p-4 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20">
            {error}
          </div>
        ) : streams.length > 0 ? (
          <div className="animate-fadeIn">
            <StreamCard
              handleSearch={handleSearch}
              address={signer.address}
              loading={actionLoading}
              streamId={query}
              contract={contract}
              stream={streams}
              setLoading={setActionLoading}
              setError={setError}
              signer={signer}
            />
          </div>
        ) : query ? (
          <div className="text-center text-gray-400">
            No streams found for this query.
          </div>
        ) : null}
      </main>
    </div>
  );
};

export default FindStream;

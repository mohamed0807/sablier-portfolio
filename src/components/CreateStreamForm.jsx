import React, { useState, useEffect, useContext } from "react";
import { Clock, CreditCard, Send, Timer, Wallet, Activity } from "lucide-react";
import { createStream } from "../api/api";
import { useWallet } from "../hooks/useWallet";
import { contractInstance } from "../services/contract";
import toast from "react-hot-toast";

const InputGroup = ({ icon: Icon, label, error, children }) => (
  <div className="space-y-2">
    <label className="flex items-center space-x-2 text-sm font-medium text-gray-300">
      <Icon size={16} />
      <span>{label}</span>
    </label>
    {children}
    {error && <p className="text-sm text-red-400">{error}</p>}
  </div>
);

// address sender,
//       address recipient,
//       UD21x18 ratePerSecond,
//       IERC20 token,
//       bool transferable,
//       uint128 amount

const CreateStreamForm = () => {
  const [loading, setLoading] = useState(false);
  const { signer, contract } = useWallet();

  const [formData, setFormData] = useState({
    sender: "",
    token: "",
    recipient: "",
    amount: "",
    ratePerSecond: "",
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    const addressRegex = /^0x[a-fA-F0-9]{40}$/;

    if (!formData.sender) {
      newErrors.sender = "Sender address is required";
    } else if (!addressRegex.test(formData.sender)) {
      newErrors.sender = "Invalid sender address format";
    }

    if (!formData.token) {
      newErrors.token = "Token address is required";
    } else if (!addressRegex.test(formData.token)) {
      newErrors.token = "Invalid token address format";
    }

    if (!formData.recipient) {
      newErrors.recipient = "Recipient address is required";
    } else if (!addressRegex.test(formData.recipient)) {
      newErrors.recipient = "Invalid recipient address format";
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = "Amount must be greater than 0";
    }

    if (!formData.ratePerSecond || parseFloat(formData.ratePerSecond) <= 0) {
      newErrors.startTime = "Rate per second must be greater than 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const streamData = {
        sender: formData.sender,
        token: formData.token,
        recipient: formData.recipient,
        amount: formData.amount,
        ratePerSecond: formData.ratePerSecond,
        transferable: true,
      };
      const { sender, token, recipient, amount, ratePerSecond } = streamData;
      const debtContract = contractInstance(contract);

      const { status } = await debtContract.createStream(
        sender,
        recipient,
        ratePerSecond,
        token,
        true,
        amount
      );
      if (status) {
        toast.success("Stream created successfully!");
        setFormData({
          sender: "",
          token: "",
          recipient: "",
          amount: "",
          ratePerSecond: "",
        });
      } else {
        toast.error("Failed to create stream. Please try again.");
      }
    } catch (err) {
      console.log(err);
      toast.error("Failed to create stream. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      sender: signer?.address || "",
    }));
  }, [signer]);

  return (
    <div>
      <div className="pt-8">
        <h2 className="text-2xl font-semibold text-white mb-6">
          Create New Stream
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <InputGroup icon={Send} label="Sender Address" error={errors.sender}>
            <input
              type="text"
              value={formData.sender}
              onChange={(e) =>
                setFormData({ ...formData, sender: e.target.value })
              }
              className="w-1/2 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0x..."
            />
          </InputGroup>

          <InputGroup icon={Wallet} label="Token Address" error={errors.token}>
            <input
              type="text"
              value={formData.token}
              onChange={(e) =>
                setFormData({ ...formData, token: e.target.value })
              }
              className="w-1/2 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0x..."
            />
          </InputGroup>

          <InputGroup
            icon={Send}
            label="Recipient Address"
            error={errors.recipient}
          >
            <input
              type="text"
              value={formData.recipient}
              onChange={(e) =>
                setFormData({ ...formData, recipient: e.target.value })
              }
              className="w-1/2 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0x..."
            />
          </InputGroup>

          <InputGroup icon={CreditCard} label="Amount" error={errors.amount}>
            <input
              type="number"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
              className="w-1/2 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0.0"
              step="0.000001"
            />
          </InputGroup>

          <InputGroup
            icon={Activity}
            label="Rate Per Second (Calculated)"
            error={errors.ratePerSecond}
          >
            <input
              type="text"
              value={formData.ratePerSecond}
              onChange={(e) =>
                setFormData({ ...formData, ratePerSecond: e.target.value })
              }
              className="w-1/2 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-400 focus:outline-none"
            />
          </InputGroup>

          {errors.submit && (
            <div className="text-red-400 text-sm">{errors.submit}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={` px-6 py-3 text-white font-medium rounded-lg transition-colors ${
              loading
                ? "bg-blue-600 cursor-not-allowed opacity-70"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {loading ? "Creating Stream..." : "Create Stream"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateStreamForm;

// 0x42842e0e
// 0xb88d4fde

// 0x445cfe12

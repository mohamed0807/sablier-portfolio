import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { AlertCircle, Clock, CreditCard, Send, Wallet } from "lucide-react";
import { getStreamById } from "../api/api";
import { formatTimestamp } from "../utils/format";

const StatusBadge = ({ status }) => {
  const colors = {
    active: "bg-green-500/10 text-green-500 border-green-500/20",
    ended: "bg-gray-500/10 text-gray-500 border-gray-500/20",
    pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full border ${colors[status]} text-sm font-medium`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const InfoCard = ({ icon: Icon, label, value }) => (
  <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
    <div className="flex items-center space-x-3 mb-2">
      <Icon size={20} className="text-gray-400" />
      <span className="text-sm text-gray-400">{label}</span>
    </div>
    <div className="text-lg font-medium text-white">{value}</div>
  </div>
);

const StreamProgress = ({ startTime, endTime, currentTime }) => {
  const start = new Date(startTime).getTime();
  const end = new Date(endTime).getTime();
  const current = new Date(currentTime).getTime();

  const progress = Math.min(
    Math.max(((current - start) / (end - start)) * 100, 0),
    100
  );

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm text-gray-400">
        <span>Progress</span>
        <span>{progress.toFixed(1)}%</span>
      </div>
      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-500 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

const StreamDetails = () => {
  const streamId = "1";
  const [stream, setStream] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStream = async () => {
      try {
        const { data } = await getStreamById(streamId);
        setStream(data);
      } catch (err) {
        setError("Failed to load stream details");
      } finally {
        setLoading(false);
      }
    };
    fetchStream();
  }, [streamId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
          <h3 className="mt-4 text-lg font-medium text-white">
            Failed to load stream
          </h3>
          <p className="mt-2 text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  if (!stream) return null;

  const getStreamStatus = () => {
    const now = new Date();
    const start = new Date(stream.startTime);
    const end = new Date(stream.endTime);

    if (now < start) return "pending";
    if (now > end) return "ended";
    return "active";
  };

  // Sample data for the stream rate chart
  const streamData = [
    { time: stream.startTime, amount: stream.totalAmount },
    { time: stream.endTime, amount: 0 },
  ];

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Stream Details</h1>
          <p className="text-gray-400 mt-1">ID: {streamId}</p>
        </div>
        <StatusBadge status={getStreamStatus()} />
      </div>

      {/* Key Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <InfoCard icon={Wallet} label="Token Address" value={stream.token} />
        <InfoCard icon={Send} label="Recipient" value={stream.recipient} />
        <InfoCard
          icon={CreditCard}
          label="Total Amount"
          value={`${stream.totalAmount} Tokens`}
        />
        <InfoCard
          icon={Clock}
          label="Duration"
          value={`${Math.ceil(
            (new Date(stream.endTime) - new Date(stream.startTime)) /
              (1000 * 60 * 60 * 24)
          )} days`}
        />
      </div>

      {/* Stream Progress */}
      <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
        <StreamProgress
          startTime={stream.startTime}
          endTime={stream.endTime}
          currentTime={new Date().toISOString()}
        />
      </div>

      {/* Stream Rate Chart */}
      <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
        <h3 className="text-lg font-medium text-white mb-4">Stream Rate</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={streamData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey="time"
                tickFormatter={(time) => new Date(time).toLocaleDateString()}
                stroke="#9CA3AF"
              />
              <YAxis stroke="#9CA3AF" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#3B82F6"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
        <h3 className="text-lg font-medium text-white mb-4">Timeline</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="w-24 text-sm text-gray-400">Start Time</div>
            <div className="text-white">
              {formatTimestamp(stream.startTime)}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-24 text-sm text-gray-400">End Time</div>
            <div className="text-white">{formatTimestamp(stream.endTime)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StreamDetails;

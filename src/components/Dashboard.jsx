import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import isEmpty from "is-empty";
import { useWalletContext } from "../contexts/WalletContext";
import { contractInstance } from "../services/contract";
import { Card, CardContent } from "../components/ui";
import { Skeleton } from "../components/ui";
import { Button } from "../components/ui";
import { Alert, AlertDescription, AlertTitle } from "../components/ui";

import { ArrowRight, Wallet, AlertCircle } from "lucide-react";

const StreamCard = ({ stream }) => (
  <Link to={`/streams?query=${stream.toString()}`}>
    <Card className="group hover:shadow-lg transition-all duration-300">
      <CardContent className="p-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="p-2 bg-blue-500/10 rounded-lg">
            {/* <Stream className="w-6 h-6 text-blue-500" /> */}
          </div>
          <div>
            <p className="text-sm text-gray-500">Stream ID</p>
            <p className="font-semibold">{stream.toString()}</p>
          </div>
        </div>
        <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
      </CardContent>
    </Card>
  </Link>
);

const LoadingSkeleton = () => (
  <div className="space-y-4">
    {[1, 2, 3].map((i) => (
      <Card key={i}>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);

const Dashboard = () => {
  const [streams, setStreamIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { signer, contract } = useWalletContext();

  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/create");
  };

  useEffect(() => {
    const loadStreams = async () => {
      try {
        setError(null);
        const debtStreamInstance = await contractInstance(contract);
        const data = await debtStreamInstance.getStreamBySender(
          signer?.address
        );
        setStreamIds(data);
      } catch (error) {
        console.error("Error loading streams:", error);
        setError("Failed to load streams. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (!isEmpty(contract) && !isEmpty(signer)) {
      loadStreams();
    } else {
      setLoading(false);
    }
  }, [signer, contract]);

  const renderContent = () => {
    if (!signer || !contract) {
      return (
        <Alert>
          <Wallet className="h-4 w-4" />
          <AlertTitle>No Wallet Connected</AlertTitle>
          <AlertDescription>
            Please connect your wallet to view your streams.
          </AlertDescription>
        </Alert>
      );
    }

    if (loading) {
      return <LoadingSkeleton />;
    }

    if (error) {
      return (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      );
    }

    if (streams.length === 0) {
      return (
        <Alert>
          {/* <Stream className="h-4 w-4" /> */}
          <AlertTitle>No Streams Found</AlertTitle>
          <AlertDescription>
            You haven't created any streams yet.
            <Button
              variant="link"
              className="p-0 ml-2 h-auto"
              onClick={handleClick}
            >
              Create your first stream
            </Button>
          </AlertDescription>
        </Alert>
      );
    }

    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {streams.map((stream, index) => (
          <StreamCard key={index} stream={stream} />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Dashboard
              </h1>
              <p className="mt-1 text-sm text-gray-500">Manage your streams</p>
            </div>
            <Button onClick={handleClick}>
              Create New Stream
              {/* <Stream className="ml-2 h-4 w-4" /> */}
            </Button>
          </div>
        </header>
        <main className="pb-12">{renderContent()}</main>
      </div>
    </div>
  );
};

export default Dashboard;

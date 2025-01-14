import React from "react";
import { Card, CardContent, Button } from "./ui";

import {
  ArrowRight,
  Wallet,
  //   Stream,
  Clock,
  Shield,
  //   ChartLineUp,
  DollarSign,
} from "lucide-react";

const FeatureCard = ({ icon: Icon, title, description }) => (
  <Card className="border-none shadow-lg bg-white dark:bg-gray-800">
    <CardContent className="p-6">
      <div className="mb-4 inline-block p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <Icon className="w-6 h-6 text-blue-500" />
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-500 dark:text-gray-400">{description}</p>
    </CardContent>
  </Card>
);

const StepCard = ({ number, title, description }) => (
  <div className="flex items-start gap-4">
    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
      {number}
    </div>
    <div>
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-gray-500 dark:text-gray-400">{description}</p>
    </div>
  </div>
);

const HowItWorks = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h6 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-3xl md:text-3xl">
              What is it about
            </h6>
            <p className="mt-6 mx-auto text-xl text-gray-500 dark:text-gray-400">
              Flow allows you to send and receive funds continuously in
              real-time, giving you flexibility and control over your payments.
              Whether you're paying for a service, supporting someone, or
              receiving payments, Flow makes it simple to create and manage your
              streams.
            </p>
          </div>
        </div>
      </div>

      {/* How It Works Steps */}
      <div className="bg-white dark:bg-gray-800 py-5 mt-12">
        <h2 className="text-3xl font-bold text-center mb-5 text-gray-900 dark:text-white">
          How It Works
        </h2>
        <div className=" mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-1xl mx-auto space-y-7">
            <StepCard
              number="1"
              title="Create a Stream"
              description={
                <div>
                  Setting up a payment stream is simple! Here's what you need:
                  <br />
                  <br />
                  <ul>
                    <li>
                      <strong>Sepolia ERC20 Token</strong> and{" "}
                      <strong>ETH</strong> (for transaction fees) in your
                      wallet.
                    </li>
                    <li>
                      <strong>Sender</strong>: The person who owes the debt.
                    </li>
                    <li>
                      <strong>Token Address</strong>: The ERC20 token you want
                      to send as payment.
                    </li>
                    <li>
                      <strong>Recipient</strong>: The person who will receive
                      the debt payments.
                    </li>
                    <li>
                      <strong>Amount</strong>: The total debt amount to be paid.
                    </li>
                    <li>
                      <strong>Rate Per Second</strong>: The rate at which the
                      recipient will collect the debt. For example, if user A
                      wants to pay 10 USDC per day to user B, the rate per
                      second will be calculated as:
                      <br />
                      <code>
                        Rate per second = 10 USDC / 86400 seconds =
                        0.00011574074 USDC per second
                      </code>
                    </li>
                  </ul>
                  No need to approve the contract for your token—our platform
                  handles it for you. Plus, there's no upfront deposit required!
                </div>
              }
            />
            <StepCard
              number="2"
              title="Deposit Funds"
              description={
                <div>
                  Add funds to your stream to start transferring payments to the
                  recipient. The funds will be transferred continuously based on
                  the set RPS.
                  <br />
                  <br />
                  For example: you never have to worry about depositing more
                  funds than you owe per day, because the recipient can only
                  withdraw what they are owed per day.
                </div>
              }
            />
            <StepCard
              number="3"
              title="Pause the Stream"
              description="You (Sender or Recipient) can pause the stream at any time. This will temporarily stop the payments from flowing until you restart it."
            />
            <StepCard
              number="4"
              title="Adjust Rate Per Second (RPS)"
              description={
                <div>
                  Modify the Rate Per Second (RPS) to increase or decrease the
                  speed of payments at any point during the stream.
                  <br />
                  <br />
                  <strong>Note:</strong> This will determine how much the
                  recipient can collect from their debt payment per day.
                  <br />
                  <br />
                  For example, if you set the Rate Per Second to 1 USDC, then
                  the recipient will be able to collect 86400 (1 day in seconds)
                  USDC per day.
                </div>
              }
            />
            <StepCard
              number="5"
              title="Withdraw"
              description="The recipient is the only person able to withdraw funds from the stream. You can withdraw funds at any time. Even if you forgot to withdraw an earlier payment, you can collect it with the current payment."
            />
            <StepCard
              number="6"
              title="Restart the Stream"
              description="Anyone (sender or recipient) can restart the stream at any time. If the stream was paused, you can restart it and continue transferring funds as originally planned."
            />
            <StepCard
              number="7"
              title="Void the Stream"
              description="Completely end the stream at any time. This will stop the flow of funds and void any future payments."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;

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
              How Flow Works
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
          Stream Guide
        </h2>
        <div className=" mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-1xl mx-auto space-y-7">
            <StepCard
              number="1"
              title="Create a Stream"
              description="
              Creating stream is simple you just have to have a some sepolia ERC20 token, then approve 
              Set up your payment stream by specifying the amount, recipient, and payment rate (RPS). No upfront deposit required!"
            />
            <StepCard
              number="2"
              title="Deposit Funds"
              description="Add funds to your stream to start transferring payments to the recipient. The funds will be transferred continuously based on the set RPS."
            />
            <StepCard
              number="3"
              title="Pause the Stream"
              description="You can pause the stream at any time. This will temporarily stop the payments from flowing until you restart it."
            />
            <StepCard
              number="4"
              title="Adjust Rate Per Second (RPS)"
              description="Modify the Rate Per Second (RPS) to increase or decrease the speed of payments at any point during the stream."
            />
            <StepCard
              number="5"
              title="Monitor & Withdraw"
              description="Track the flow of funds in real-time and withdraw funds as a recipient, or modify the stream settings as a sender."
            />
            <StepCard
              number="6"
              title="Restart the Stream"
              description="If the stream was paused, you can restart it and continue transferring funds as originally planned."
            />
            <StepCard
              number="7"
              title="Void the Stream"
              description="Completely end the stream at any time. This will stop the flow of funds and void any future payments."
            />
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="flex items-center justify-center my-12">
        <Button size="lg" variant="secondary">
          Launch App
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default HowItWorks;

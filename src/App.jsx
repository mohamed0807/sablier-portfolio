// src/App.jsx
import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
  Navigate,
} from "react-router-dom";
import {
  Home,
  PlusCircle,
  Activity,
  BarChart3,
  ChevronRight,
  LayoutGrid,
  Search,
  SearchIcon,
  FileQuestion,
} from "lucide-react";
import { Toaster } from "react-hot-toast";
import WalletConnection from "./components/WalletConnect";
import { useWallet } from "./hooks/useWallet";
import StreamDetails from "./pages/StreamDetails";
import DashboardPage from "./pages/Dashboard";
import CreateStream from "./pages/CreateStream";
import FindStream from "./components/FindStreams";
import { useWalletContext, WalletProvider } from "./contexts/WalletContext";
import HowItWorksPage from "./pages/HowItWorks";
// Protected Route Component
const ProtectedRoute = ({ children }) => {
  // const { isConnected } = useWallet();
  // const location = useLocation();

  // if (!isConnected) {
  //   return <Navigate to="/" replace state={{ from: location }} />;
  // }

  return children;
};

// Sidebar Link Component
const SidebarLink = ({ to, icon: Icon, children, indented }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
        isActive
          ? "bg-gray-800 text-white"
          : "text-gray-400 hover:bg-gray-800 hover:text-white"
      } ${indented ? "ml-4" : ""}`}
    >
      <Icon size={20} />
      <span className="font-medium">{children}</span>
    </Link>
  );
};

// Sidebar Section Component
const SidebarSection = ({ title, children }) => (
  <div className="space-y-1">
    <div className="px-4 py-2">
      <h3 className="text-sm font-medium text-gray-400">{title}</h3>
    </div>
    {children}
  </div>
);

// Layout Component
const Layout = ({ children }) => {
  const { isConnected, account } = useWalletContext();

  return (
    <div className="min-h-screen w-full bg-gray-900 text-white">
      <div className="fixed top-0 left-0 right-0 z-10 bg-gray-900 border-b border-gray-800">
        <div className="flex items-center justify-between px-6 py-4">
          <h1 className="text-xl font-bold">Stream Platform</h1>
          <WalletConnection />
        </div>
      </div>

      <div className="flex h-full pt-16">
        {isConnected ? (
          <>
            <aside className="fixed w-64 h-full bg-gray-900 border-r border-gray-800 p-4">
              <nav className="space-y-6">
                <SidebarSection title="">
                  <SidebarLink to="/" icon={LayoutGrid}>
                    Dashboard
                  </SidebarLink>
                  <SidebarLink to="/streams" icon={SearchIcon}>
                    Find Streams
                  </SidebarLink>
                  <SidebarLink to="/create" icon={PlusCircle}>
                    Create Stream
                  </SidebarLink>
                  <SidebarLink to="/how-it-works" icon={FileQuestion}>
                    How It Works ?
                  </SidebarLink>
                </SidebarSection>
              </nav>
            </aside>
            <main className="ml-64 flex-1 p-6">{children}</main>
          </>
        ) : (
          <main className="w-full flex-1 p-6 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">
                Welcome to Stream Platform
              </h2>
              <p className="text-gray-400 mb-4">
                Please connect your wallet to continue
              </p>
            </div>
          </main>
        )}
      </div>
      <Toaster position="top-right" />
    </div>
  );
};
// App Component
const App = () => {
  return (
    <WalletProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route
              path="/create"
              element={
                <ProtectedRoute>
                  <CreateStream />
                </ProtectedRoute>
              }
            />
            <Route
              path="/activity"
              element={
                <ProtectedRoute>
                  <Activity />
                </ProtectedRoute>
              }
            />
            <Route
              path="/stream/:id"
              element={
                <ProtectedRoute>
                  <StreamDetails />
                </ProtectedRoute>
              }
            />

            <Route
              path="/streams"
              element={
                <ProtectedRoute>
                  <FindStream />
                </ProtectedRoute>
              }
            />

            <Route
              path="/how-it-works"
              element={
                <ProtectedRoute>
                  <HowItWorksPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Layout>
      </Router>
    </WalletProvider>
  );
};

export default App;

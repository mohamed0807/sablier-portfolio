import React from "react";

export const AlertDescription = ({ children }) => {
  return <div className="text-sm text-gray-700">{children}</div>;
};

export const AlertTitle = ({ children }) => {
  return <div className="font-semibold text-lg">{children}</div>;
};

export const Alert = ({ children, className = "" }) => {
  return (
    <div className={`p-4 mb-4 border-l-4 rounded-md ${className}`}>
      {children}
    </div>
  );
};

export const Button = ({
  children,
  onClick,
  className = "",
  type = "button",
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
    >
      {children}
    </button>
  );
};

export const Skeleton = ({
  className = "",
  height = "20px",
  width = "100%",
}) => {
  return (
    <div
      className={`bg-gray-200 animate-pulse ${className}`}
      style={{ height, width }}
    />
  );
};

export const CardContent = ({ children, className = "" }) => {
  return <div className={`p-4 ${className}`}>{children}</div>;
};

export const Card = ({ children, className = "" }) => {
  return (
    <div
      className={`border border-gray-200 rounded-lg shadow-md overflow-hidden ${className}`}
    >
      {children}
    </div>
  );
};

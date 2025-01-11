import React from "react";

const Navbar = () => {
  return (
    <nav className="p-4 bg-gray-800">
      <ul className="flex space-x-6">
        <li>
          <a href="/" className="text-white hover:underline">
            Home
          </a>
        </li>
        <li>
          <a href="/dashboard" className="text-white hover:underline">
            Dashboard
          </a>
        </li>
        <li>
          <a href="/create" className="text-white hover:underline">
            Create Stream
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;

import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* Sidebar */}
      <div
        className={`bg-gray-800 w-64 space-y-6 py-7 px-2 fixed inset-y-0 left-0 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-200 ease-in-out lg:translate-x-0 lg:relative`}
      >
        {/* Sidebar Header with Close Button (Visible on Mobile) */}
        <div className="flex justify-between items-center px-4">
          <h1 className="text-2xl font-bold text-white">ChatApp</h1>
          {/* Close Button (Visible on Mobile) */}
          <button
            onClick={toggleSidebar}
            className="text-white focus:outline-none lg:hidden"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>

        {/* Sidebar Navigation Links */}
        <nav>
          <Link
            to="/"
            className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 text-white"
          >
            Home
          </Link>
          <Link
            to="/chat"
            className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 text-white"
          >
            Chat
          </Link>
          <Link
            to="/profile"
            className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 text-white"
          >
            Profile
          </Link>
          <Link
            to="/settings"
            className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 text-white"
          >
            Settings
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-1">
        {/* Navbar */}
        <div className="bg-gray-800 p-4 flex justify-between items-center">
          {/* Toggle Button for Sidebar (Visible on Mobile) */}
          <button
            onClick={toggleSidebar}
            className="text-white focus:outline-none lg:hidden"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              ></path>
            </svg>
          </button>

          {/* User Info and Logout Button */}
          <div className="text-white flex items-center space-x-4">
            <span>Welcome, User</span>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
              Logout
            </button>
          </div>
        </div>

        {/* Page Content */}
        {/* <div className="p-6">
          <h1 className="text-2xl font-bold text-white">Welcome to ChatApp</h1>
          <p className="text-gray-400">Start chatting with your friends!</p>
        </div> */}
        <Outlet/>
      </div>
    </div>
  );
}
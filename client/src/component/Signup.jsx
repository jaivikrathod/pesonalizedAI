import React from "react";
import { Link } from "react-router-dom";

export default function Signup() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-50"></div>

      {/* Main Card */}
      <div className="relative bg-gray-800 bg-opacity-90 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden w-full max-w-4xl flex flex-col md:flex-row">
        {/* Left Section - Visuals */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center items-center bg-gradient-to-br from-blue-600 to-purple-600">
          <img
            src="/path-to-your-logo.png" // Replace with your logo path
            alt="Company Logo"
            className="w-32 h-32 mb-6 animate-bounce"
          />
          <h1 className="text-4xl font-bold text-white text-center">
            Join <span className="text-yellow-400">Company</span>
          </h1>
          <p className="mt-4 text-gray-200 text-center">
            Innovating the future, one step at a time.
          </p>
          <div className="mt-8">
            <div className="w-24 h-24 bg-white bg-opacity-10 rounded-full absolute -top-12 -left-12"></div>
            <div className="w-16 h-16 bg-white bg-opacity-10 rounded-full absolute -bottom-8 -right-8"></div>
          </div>
        </div>

        {/* Right Section - Signup Form */}
        <div className="w-full md:w-1/2 p-10">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Create Your Account
          </h2>
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300">Name</label>
              <input
                type="text"
                className="mt-1 block w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter your name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Email</label>
              <input
                type="email"
                className="mt-1 block w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Password</label>
              <input
                type="password"
                className="mt-1 block w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter your password"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Confirm Password</label>
              <input
                type="password"
                className="mt-1 block w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Confirm your password"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105"
            >
              Sign Up
            </button>
          </form>
          <p className="mt-6 text-center text-gray-400">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-400 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
import React from "react";
import { HiOutlineBadgeCheck } from "react-icons/hi";
const ThankYouPage = () => {
  return (
    <div className="bg-gray-100 flex items-center justify-center min-h-screen">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-lg text-center">
        <div className="flex ">
          <HiOutlineBadgeCheck className="text-green-600 w-48 h-48 m-auto" />
        </div>

        <h1 className="text-2xl font-semibold text-gray-800 mt-4">
          Thank You for Registering!
        </h1>
        <p className="text-gray-600 mt-2">
          We appreciate your registration as a vendor. You can now start
          exploring our platform.
        </p>
        <div className="flex justify-center gap-4 mt-6">
          <button
            className="bg-blue-500 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            onClick={() => (window.location.href = "/dashboard")}
          >
            Go back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default ThankYouPage;

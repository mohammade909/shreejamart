import React from "react";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 text-white">
      <h1 className="text-9xl font-bold mb-4">404</h1>
      <h2 className="text-3xl font-semibold mb-2">Page Not Found</h2>
      <p className="text-lg mb-6">
        Oops! The page you’re looking for doesn’t exist.
      </p>
      <button
        onClick={() => navigate("/")}
        className="px-6 py-3 bg-white text-blue-500 font-medium rounded-md shadow-md hover:bg-gray-100 transition duration-200"
      >
        Go Back Home
      </button>
    </div>
  );
};

export default NotFoundPage;

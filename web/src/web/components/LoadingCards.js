import React from "react";
import { Loader2 } from "lucide-react";

const LoadingCards = () => {
  const loadingItems = [1, 2, 3, 4, 5];

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:px-8 px-4 py-4">
        {loadingItems.map((item) => (
          <div
            key={item}
            className="bg-white animate-pulse rounded p-4 h-64 flex flex-col justify-start border border-gray-200"
          >
            {/* Square Image Placeholder */}
            <div className="w-full h-1/2 bg-gray-200 rounded-lg mb-4"></div>

            {/* Text Placeholders */}
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoadingCards;

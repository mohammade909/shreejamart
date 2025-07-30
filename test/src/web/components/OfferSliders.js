import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
const OfferSliders = () => {
  const [mainSlide, setMainSlide] = useState(0);
  const [topSlide, setTopSlide] = useState(0);
  const [bottomSlide, setBottomSlide] = useState(0);

  const mainSlides = [
    {
      image: "./sliders/strawberry.jpg",
      title: "Fresh Vegetables",
      discount: "30% OFF",
      description: "Get organic vegetables at the best price",
    },
    {
      image: "./sliders/orange.jpg",
      title: "Fresh Fruits",
      discount: "25% OFF",
      description: "Seasonal fruits fresh from the garden",
    },
    {
      image: "./sliders/kiwi.jpg",
      title: "Bakery Items",
      discount: "20% OFF",
      description: "Freshly baked goods every morning",
    },
  ];

  const sideSlides = [
    {
      image: "./sliders/400by200.jpg",
      title: "Dairy Products",
      discount: "15% OFF",
    },
    {
      image: "./sliders/400by2001.jpg",
      title: "Snack Items",
      discount: "10% OFF",
    },
  ];

  const handleMainSlide = (direction) => {
    if (direction === "next") {
      setMainSlide((prev) => (prev + 1) % mainSlides.length);
    } else {
      setMainSlide(
        (prev) => (prev - 1 + mainSlides.length) % mainSlides.length
      );
    }
  };

  const handleSideSlide = (direction, position) => {
    if (position === "top") {
      if (direction === "next") {
        setTopSlide((prev) => (prev + 1) % sideSlides.length);
      } else {
        setTopSlide(
          (prev) => (prev - 1 + sideSlides.length) % sideSlides.length
        );
      }
    } else {
      if (direction === "next") {
        setBottomSlide((prev) => (prev + 1) % sideSlides.length);
      } else {
        setBottomSlide(
          (prev) => (prev - 1 + sideSlides.length) % sideSlides.length
        );
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex gap-4">
        {/* Main Slider (70%) */}
        <div className="w-full md:w-[70%]  relative">
          <div className="relative overflow-hidden rounded-xl h-[400px]">
            <img
              src={mainSlides[mainSlide].image}
              alt={mainSlides[mainSlide].title}
              className="w-full h-full object-cover aspect-auto"
            />
            <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/60 to-transparent text-white space-y-3">
              <h2 className="text-3xl font-bold">
                {mainSlides[mainSlide].title}
              </h2>
              <p className="text-xl font-semibold text-emerald-400">
                {mainSlides[mainSlide].discount}
              </p>
              <p className="text-gray-200">
                {mainSlides[mainSlide].description}
              </p>
              <div className="pt-2">
                <Link
                  to={`/product/${mainSlides[mainSlide].title.replace(
                    /\s/g,
                    "-"
                  )}`}
                  className="inline-block bg-secondary hover:bg-emerald-700 px-6 py-2.5 text-white rounded-md font-medium transition-colors"
                >
                  Buy Now
                </Link>
              </div>
            </div>
          </div>
          <div className="absolute top-1/2 -translate-y-1/2 left-4">
            <button
              onClick={() => handleMainSlide("prev")}
              className="bg-white/80 hover:bg-white p-2 rounded-full shadow-lg"
            >
              <ChevronLeft className="w-6 h-6 text-gray-800" />
            </button>
          </div>
          <div className="absolute top-1/2 -translate-y-1/2 right-4">
            <button
              onClick={() => handleMainSlide("next")}
              className="bg-white/80 hover:bg-white p-2 rounded-full shadow-lg"
            >
              <ChevronRight className="w-6 h-6 text-gray-800" />
            </button>
          </div>
        </div>

        {/* Side Sliders (30%) */}
        <div className="hidden md:w-[30%] md:flex flex-col gap-4">
          {/* Top Slider */}
          <div className="relative h-[190px]">
            <div className="relative overflow-hidden rounded-xl h-full">
              <img
                src={sideSlides[topSlide].image}
                alt={sideSlides[topSlide].title}
                className="w-full h-full object-cover  aspect-auto"
              />
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent text-white space-y-2">
                <h3 className="text-xl font-bold">
                  {sideSlides[topSlide].title}
                </h3>
                <p className="text-emerald-400 font-semibold">
                  {sideSlides[topSlide].discount}
                </p>
                <div className="pb-1">
                  <Link
                    to={`/product/${sideSlides[topSlide].title.replace(
                      /\s/g,
                      "-"
                    )}`}
                    className="inline-block bg-secondary hover:bg-emerald-700 px-4 py-1.5 text-white text-sm rounded-md font-medium transition-colors"
                  >
                    Buy Now
                  </Link>
                </div>
              </div>
            </div>
            <div className="absolute top-1/2 -translate-y-1/2 left-2">
              <button
                onClick={() => handleSideSlide("prev", "top")}
                className="bg-white/80 hover:bg-white p-1 rounded-full shadow-lg"
              >
                <ChevronLeft className="w-4 h-4 text-gray-800" />
              </button>
            </div>
            <div className="absolute top-1/2 -translate-y-1/2 right-2">
              <button
                onClick={() => handleSideSlide("next", "top")}
                className="bg-white/80 hover:bg-white p-1 rounded-full shadow-lg"
              >
                <ChevronRight className="w-4 h-4 text-gray-800" />
              </button>
            </div>
          </div>

          {/* Bottom Slider */}
          <div className="relative h-[190px]">
            <div className="relative overflow-hidden rounded-xl h-full">
              <img
                src={sideSlides[bottomSlide].image}
                alt={sideSlides[bottomSlide].title}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent text-white space-y-2">
                <h3 className="text-xl font-bold">
                  {sideSlides[topSlide].title}
                </h3>
                <p className="text-emerald-400 font-semibold">
                  {sideSlides[topSlide].discount}
                </p>
                <div className="pb-1">
                  <Link
                    to={`/product/${sideSlides[topSlide].title.replace(
                      /\s/g,
                      "-"
                    )}`}
                    className="inline-block bg-secondary hover:bg-emerald-700 px-4 py-1.5 text-white text-sm rounded-md font-medium transition-colors"
                  >
                    Buy Now
                  </Link>
                </div>
              </div>
            </div>
            <div className="absolute top-1/2 -translate-y-1/2 left-2">
              <button
                onClick={() => handleSideSlide("prev", "bottom")}
                className="bg-white/80 hover:bg-white p-1 rounded-full shadow-lg"
              >
                <ChevronLeft className="w-4 h-4 text-gray-800" />
              </button>
            </div>
            <div className="absolute top-1/2 -translate-y-1/2 right-2">
              <button
                onClick={() => handleSideSlide("next", "bottom")}
                className="bg-white/80 hover:bg-white p-1 rounded-full shadow-lg"
              >
                <ChevronRight className="w-4 h-4 text-gray-800" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfferSliders;

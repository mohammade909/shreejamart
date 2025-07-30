import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ServiceSection from "./ServiceSection";

const FeaturedSection = () => {
  const trendingItems = [
    {
      name: "Healthy Nutmix, 2...",
      category: "Driedfruit",
      price: 45.0,
      originalPrice: 42.0,
      image:
        "./img/product-images/10_1.jpg",
    },
    {
      name: "Organic Fresh To...",
      category: "Vegetables",
      price: 30.0,
      originalPrice: 25.0,
      image:
        "./img/product-images/11_1.jpg",
    },
    {
      name: "Coffee With Choc...",
      category: "Coffee",
      price: 65.0,
      originalPrice: 52.0,
      image:
        "./img/product-images/19_1.jpg",
    },
  ];

  const ratedItems = [
    {
      name: "Ginger - Organic",
      category: "Vegetables",
      price: 65.0,
      originalPrice: 62.0,
      image:
        "./img/product-images/17_1.jpg",
    },
    {
      name: "Dates Value Pouc...",
      category: "Driedfruit",
      price: 78.0,
      originalPrice: 56.0,
      image:
        "./img/product-images/2_2.jpg",
    },
    {
      name: "Blue Berry",
      category: "Fruits",
      price: 30.0,
      originalPrice: 25.0,
      image:
        "./img/product-images/23_1.jpg",
    },
  ];

  const sellingItems = [
    {
      name: "Lemon - Seedless",
      category: "Vegetables",
      price: 45.0,
      originalPrice: 42.0,
      image:
        "./img/product-images/18_1.jpg",
    },
    {
      name: "Mango - Kesar",
      category: "Fruits",
      price: 65.0,
      originalPrice: 62.0,
      image:
        "./img/product-images/28_1.jpg",
    },
    {
      name: "Mixed Nuts & Alm...",
      category: "Driedfruit",
      price: 11.0,
      originalPrice: 10.0,
      image:
        " /img/product-images/7_2.jpg",
    },
  ];

  const ProductSection = ({ title, items }) => (
    <div className="w-full">
      <div className="flex justify-between items-center p-3 mb-6 bg-blue-50">
        <h2 className=" flex space-x-3 font-Poppins text-lg text-primary/75 font-semibold">
          <span>{title.split(" ")[0]}</span>
          <span className="text-secondary">{title.split(" ")[1]}</span>
        </h2>
        <div className="flex gap-1 text-primary/75">
          {/* <button className="p-1 rounded">
            <ChevronLeft className="w-6 h-6 " />
          </button> */}
          <button className="p-1 rounded">
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {items.map((item, index) => (
          <div
            key={index}
            className="border rounded-lg p-4 flex justify-between"
          >
            <div>
              <img
                src={item.image}
                alt={item.name}
                className="w-20 h-20 object-cover mb-2"
              />
            </div>
            <div>
              <h3 className="text-base font-normal font-Poppins text-primary ">{item.name}</h3>
              <p className="text-gray-500 text-sm">{item.category}</p>
              <div className="flex gap-2 items-center mt-2">
                <span className="font-semibold text-primary/80 font-Poppins ">${item.price.toFixed(2)}</span>
                <span className="text-gray-400 line-through text-sm">
                  ${item.originalPrice.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4  mt-10">
      {/* Hero Banners */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
        {/* Snack Section */}
        <div className="relative bg-gray-100 rounded-lg overflow-hidden">
          <img
            src="./img/banner/2.jpg"
            alt="Snack"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex flex-col justify-center items-end p-6 text-white">
            <div className="flex flex-col justify-start items-start">
              <div className="bg-gray-600 text-sm px-2 py-1 rounded mb-2">
                70% Off
              </div>
              <h2 className="text-2xl font-bold mb-2 text-blue-gray-600">
                Tasty Snack & Fastfood
              </h2>
              <p className="text-blue-gray-600 mb-4">
                The Flavor of Something Special
              </p>
              <button className="bg-secondary text-white px-6 py-2 rounded-lg">
                Shop Now
              </button>
            </div>
          </div>
        </div>

        {/* Fruits Section */}
        <div className="relative bg-gray-100 rounded-lg overflow-hidden">
          <img
            src="./img/banner/3.jpg"
            alt="Fruits"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0  flex flex-col justify-center items-end p-6 text-white">
            <div className="flex flex-col justify-start items-start">
              <div className="bg-gray-600 text-sm px-2 py-1 rounded mb-2">
                50% Off
              </div>
              <h2 className="text-2xl font-bold mb-2 text-blue-gray-600">
                Fresh Fruits & Veggies
              </h2>
              <p className="text-blue-gray-600 mb-4">
                A Healthy Meal For Every One
              </p>
              <button className="bg-secondary text-white px-6 py-2 rounded-lg">
                Shop Now
              </button>
            </div>
          </div>
        </div>
      </div>
      <ServiceSection />
      {/* Product Sections */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-12 flex-col">
        <div
          className="relative bg-cover bg-center rounded-md flex items-start justify-start text-primary p-6"
          style={{
            backgroundImage:
              "url('./img/banner/4.jpg')",
          }}
        >
          <div className=" p-4 rounded">
            <h2 className="text-2xl font-bold mb-2">
              Our Top Most Products Check It Now
            </h2>
            {/* <p className="text-sm">Discover exclusive offers and top deals!</p> */}
            <button className="bg-secondary px-3 py-2 mt-3 rounded-md text-white">
              Shop Now!
            </button>
          </div>
        </div>
        <ProductSection title="Trending Items" items={trendingItems} />
        <ProductSection title="Top Rated" items={ratedItems} />
        <ProductSection title="Top Selling" items={sellingItems} />
      </div>
    </div>
  );
};

export default FeaturedSection;




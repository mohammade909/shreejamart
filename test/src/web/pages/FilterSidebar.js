import React, { useState } from "react";
import {
  Filter,
  ChevronDown,
  ChevronUp,
  ShoppingBag,
  DollarSign,
  Weight,
  Coffee,
  Pizza,
  Apple,
  Beer,
  Beef,
  Fish,
  Cookie,
  Sandwich,
  Milk,
  Grape,
  Popcorn,
  AppleIcon,
} from "lucide-react";
import { PiCheeseLight } from "react-icons/pi";
import { PiGrains } from "react-icons/pi";
import { CiApple } from "react-icons/ci";
import { LiaCookieBiteSolid } from "react-icons/lia";
import { BiLeaf } from "react-icons/bi";
export const getCategoryIcon = (categoryName) => {
  const iconMap = {
    "Fruits & Vegetables": Coffee,
    "Groceries & Staples": Pizza,
    "Dairy Products": Apple,
    "Personal Care": Fish,
    "Fresh Vegetables": Sandwich,
    "Spices & Masalas": Sandwich,
    "Household Supplies": Sandwich,
    "Organic Products": BiLeaf,
    "Rice & Grains": PiGrains,
    "Meat & Seafood": Beef,
    "Fresh Fruits": AppleIcon,
    Beverages: Sandwich,
    Milk: Milk,
    Cheese: PiCheeseLight,
    "Bakery & Snacks": Popcorn,
    Cookies: LiaCookieBiteSolid,
    "Dried Fruit": Grape,
  };

  const IconComponent = iconMap[categoryName] || ShoppingBag;
  return <IconComponent className="h-4 w-4 text-gray-500" />;
};

const FilterSidebar = ({
  categories,
  selectedCategories,
  toggleCategory,
  priceRange,
  setPriceRange,
  weights,
}) => {
  const [openSections, setOpenSections] = useState({
    categories: true,
    price: true,
    weight: true,
  });

  // Function to get icon based on category name

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <div className="w-full md:w-1/4 hidden md:block">
      <div className="bg-base rounded-md border p-6 sticky top-4">
        {/* Categories Section */}
        <div className="mb-6">
          <button
            onClick={() => toggleSection("categories")}
            className="w-full flex items-center justify-between font-semibold mb-4 hover:text-secondary"
          >
            <div className="flex items-center gap-2 text-primary">
              {/* <ShoppingBag className="h-5 w-5" /> */}
              <span>Categories</span>
            </div>
            {openSections?.categories ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </button>

          {openSections?.categories && (
            <div className="space-y-3">
              {categories?.map((category) => (
                <label
                  key={category.category_id}
                  className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded-lg group"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative flex items-center">
                      <input
                        type="checkbox"
                        name="category"
                        className="rounded border-gray-300 text-secondary focus:ring-secondary peer"
                        checked={selectedCategories?.includes(
                          category.category_id
                        )}
                        onChange={() => toggleCategory(category.category_id)}
                      />
                      {/* <div className="absolute  left-0 w-full h-full flex items-center justify-center pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity">
                        {getCategoryIcon(category.name)}
                      </div> */}
                    </div>
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(category.name)}
                      <span className="text-sm text-primary/80">
                        {category.name}
                      </span>
                    </div>
                  </div>
                  <span className="text-gray-500 text-sm">({89})</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Price Range Section */}
        <div className="mb-6">
          <button
            onClick={() => toggleSection("price")}
            className="w-full flex items-center justify-between font-semibold mb-4 hover:text-secondary"
          >
            <div className="flex items-center gap-2 text-primary">
              {/* <DollarSign className="h-5 w-5" /> */}
              <span>Price Range</span>
            </div>
            {openSections?.price ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </button>

          {openSections.price && (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <input
                  type="number"
                  className="w-24 px-2 py-1 border rounded focus:ring-secondary focus:border-secondary"
                  value={priceRange[0]}
                  onChange={(e) =>
                    setPriceRange([parseInt(e.target.value), priceRange[1]])
                  }
                />
                <span>to</span>
                <input
                  type="number"
                  className="w-24 px-2 py-1 border rounded focus:ring-secondary focus:border-secondary"
                  value={priceRange[1]}
                  onChange={(e) =>
                    setPriceRange([priceRange[0], parseInt(e.target.value)])
                  }
                />
              </div>
              <input
                type="range"
                min="0"
                max="1000"
                className="w-full accent-secondary"
                value={priceRange[1]}
                onChange={(e) =>
                  setPriceRange([priceRange[0], parseInt(e.target.value)])
                }
              />
            </div>
          )}
        </div>

        {/* Weight Section */}
        <div>
          <button
            onClick={() => toggleSection("weight")}
            className="w-full flex items-center justify-between font-semibold mb-4 hover:text-secondary"
          >
            <div className="flex items-center gap-2 text-primary">
              {/* <Weight className="h-5 w-5" /> */}
              <span>Weight</span>
            </div>
            {openSections.weight ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </button>

          {/* {openSections?.weight && (
            <div className="flex flex-wrap gap-2">
              {weights.map((weight) => (
                <button
                  key={weight}
                  className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm flex items-center gap-2"
                >
                  <Weight className="h-4 w-4" />
                  {weight}
                </button>
              ))}
            </div>
          )} */}
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;

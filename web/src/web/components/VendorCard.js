import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Star } from "lucide-react";
import toast from "react-hot-toast";
import { HiOutlineEye } from "react-icons/hi2";
import { CiHeart } from "react-icons/ci";
import { GoGitCompare } from "react-icons/go";

const VendorCard = ({ vendor, viewType }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const handleView = (id) => navigate(`/stores/vendor/${id}`);
  const handleLike = () =>
    toast.error("This feature is not available right now");
  const handleCompare = () =>
    toast.error("This feature is not available right now");

  const parsedBrandDetails =
    typeof vendor.brand_details === "string"
      ? JSON.parse(vendor.brand_details)
      : vendor.brand_details;

  return (
    <div
      className={`relative bg-white rounded-lg border border-gray-300 shadow-sm hover:shadow-lg transition-all overflow-hidden ${
        viewType === "list" ? "flex" : ""
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Section */}
      <div
        className={`relative overflow-hidden ${
          viewType === "list" ? "w-1/3" : ""
        }`}
      >
        <img
          src={parsedBrandDetails?.logo_url ?? "./default-vendor.jpg"}
          alt={parsedBrandDetails?.name}
          className="w-full min-h-48 object-cover rounded-t-md"
          onError={(e) => {
            e.target.src = "./default-vendor.jpg";
            e.target.alt = "Default Product Image";
          }}
        />
    
      </div>
      <div
        className={`p-4 flex flex-col justify-between ${
          viewType === "list" ? "w-2/3" : "w-full"
        }`}
      >
        <h6 className="text-primary/70 capitalize text-sm font-medium hover:text-secondary ">
          {parsedBrandDetails?.category}
        </h6>
        <h5 className="text-sm font-semibold text-gray-800 hover:text-blue-500 transition">
          <Link to={`/stores/vendor/${vendor?.vendor_id}`}>
            {parsedBrandDetails?.name}
          </Link>
        </h5>
        {/* Star Rating */}
        <div className="flex items-center gap-2 mt-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < vendor?.rating ? "text-yellow-400" : "text-gray-300"
              }`}
              fill="currentColor"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default VendorCard;

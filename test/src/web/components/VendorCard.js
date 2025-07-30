import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Star} from "lucide-react";
import toast from "react-hot-toast";
import { HiOutlineEye } from "react-icons/hi2";
import { CiHeart } from "react-icons/ci";
import { GoGitCompare } from "react-icons/go";
import { useNavigate } from "react-router-dom";
const VendorCard = ({ vendor, viewType }) => {

  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
 

  const handleView =(id)=>{
    navigate(`/stores/vendor/${id}`);
  }
  const handleLike =()=>{
    toast.error("This features not available right now")
  }
  const handleComapre =()=>{
    toast.error("This features not available right now")
  }
  // Parse images if needed
  const parsedBrandDetails =
    typeof vendor.brand_details === "string"
      ? JSON.parse(vendor.brand_details)
      : vendor.brand_details;


  return (
    <div
      className={`bg-white rounded-md border overflow-hidden relative ${
        viewType === "list" ? "flex" : ""
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`relative p-3 border-b ${
          viewType === "list" ? "w-1/3" : ""
        }`}
      >
        <img
          src={parsedBrandDetails?.logo_url}
          alt={parsedBrandDetails?.name}
          className="w-full h-48 object-cover"
          onError={(e) => {
            e.target.src = "/svg/default-product.svg";
            e.target.alt = "Default Product Image";
          }}
        />

        {/* Action buttons overlay on hover */}
        {isHovered && (
          <div className="relative group">
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
         
              <button
                onClick={() => handleLike()}
                className=" p-2 bg-white rounded-lg hover:bg-secondary hover:text-white transition-colors"
              >
                <CiHeart className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleView(vendor.vendor_id)}
                className=" p-2 bg-white rounded-lg hover:bg-secondary hover:text-white transition-colors"
              >
                <HiOutlineEye className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleComapre()}
                className="p-2 bg-white rounded-lg hover:bg-secondary hover:text-white transition-colors"
              >
                <GoGitCompare className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      <div
        className={`p-4 flex flex-col justify-between ${
          viewType === "list" ? "w-2/3" : "w-full"
        }`}
      >
        {/* Category Badge */}

        <h6 className="text-primary/70 capitalize text-sm font-Poppins font-normal hover:text-secondary mb-3">
          {parsedBrandDetails?.category}
        </h6>

        <div>
          <h5 className="text-base font-normal text-primary capitalize tracking-wide mb-2  hover:text-secondary">
            <Link
              className=" hover:text-secondary"
              to={`/stores/vendor/${vendor?.vendor_id}`}
            >
              {parsedBrandDetails?.name}
            </Link>
          </h5>

          {/* Star Rating and Weight/Quantity */}
          <div className="flex items-center mb-2 justify-between">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < vendor?.rating
                      ? "text-star/60 fill-current"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>

          </div>

          </div>
      </div>
    </div>
  );
};

export default VendorCard;

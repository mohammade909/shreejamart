import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Star, ShoppingCart, Heart, ThumbsUp } from "lucide-react";
import { addToCart, resetState } from "../../redux/cartSlice";
import toast from "react-hot-toast";
import { GiShoppingCart } from "react-icons/gi";
import { HiOutlineEye } from "react-icons/hi2";
import { CiHeart } from "react-icons/ci";
import { GoGitCompare } from "react-icons/go";
import { fetchUserCart } from "../../redux/cartSlice";
import { useNavigate } from "react-router-dom";
const ProductCard = ({ product, viewType }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const { auth } = useSelector((state) => state.auth);
  const { cart, message, loading } = useSelector((state) => state.cart);

  useEffect(() => {
    if (auth?.user_id) {
      dispatch(fetchUserCart(auth?.user_id));
    }
  }, [auth]);

  const handleCart = (product) => {
    // Check authentication
    if (!auth || auth.user_type === "admin" || auth.user_type === "vendor") {
      alert("Please login to add items to the cart");
      return;
    }
  
    // Create the cart item object
    const cartItem = {
      product_id: product.product_id,
      price: Number(product.price),
      quantity: 1,
      user_id: auth.user_id,
      vendorId: product.vendor_id,
    };
  
    // Check if cart has items from a different vendor
    const existingVendorId = cart.items?.length > 0 ? cart.items[0].vendor_id : null;
    
    if (existingVendorId && existingVendorId !== product.vendor_id) {
      const confirmClear = window.confirm(
        "Your cart contains items from a different vendor. Adding this item will clear your current cart. Do you want to proceed?"
      );
  
      if (!confirmClear) {
        return; // Exit if the user cancels
      }
      
      // Clear the cart before adding new item
      dispatch(resetState());
    }
  
    // Add the new item to the cart
    dispatch(addToCart(cartItem));
    toast.success("Item added to the cart successfully");
  };

  const handleView =(id)=>{
    navigate(`/product/${id}`);
  }
  const handleLike =()=>{
    toast.error("This features not available right now")
  }
  const handleComapre =()=>{
    toast.error("This features not available right now")
  }
  // Parse images if needed
  const parsedImages =
    typeof product.images === "string"
      ? JSON.parse(product.images)
      : product.images;

  // Calculate discounted price
  const discountedPrice =
    product.discount_percentage > 0
      ? (
          Number(product.original_price) *
          (1 - product.discount_percentage / 100)
        ).toFixed(2)
      : Number(product.original_price).toFixed(2);

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
          src={parsedImages?.featured_image}
          alt={product.name}
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
                onClick={() => handleCart(product)}
                className="p-2 bg-white rounded-lg hover:bg-secondary hover:text-white transition-colors"
              >
                <GiShoppingCart className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleLike()}
                className=" p-2 bg-white rounded-lg hover:bg-secondary hover:text-white transition-colors"
              >
                <CiHeart className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleView(product.product_id)}
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
          {product.category_name}
        </h6>

        <div>
          <h5 className="text-base font-normal text-primary capitalize tracking-wide mb-2  hover:text-secondary">
            <Link
              className=" hover:text-secondary"
              to={`/product/${product.product_id}`}
            >
              {product.name}
            </Link>
          </h5>

          {/* Star Rating and Weight/Quantity */}
          <div className="flex items-center mb-2 justify-between">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < product.average_rating
                      ? "text-star/60 fill-current"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            {(product.weight || product.quantity) && (
              <span className="text-sm text-gray-500 capitalize">
                {product.weight || product.quantity}{" "}
                {product.unit_of_measurement}
              </span>
            )}
          </div>

          {/* Pricing */}
          {Number(product.discount_percentage) > 0 ? (
            <div className="flex justify-between items-center">
              <div className="font-bold text-primary font-Poppins">
              ₹{discountedPrice}
              </div>
              <div className="line-through text-gray-400 text-sm font-Poppins">
              ₹{Number(product.original_price).toFixed(2)}
              </div>
            </div>
          ) : (
            <div className="font-bold text-primary font-Poppins">
               ₹{Number(product.original_price).toFixed(2)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

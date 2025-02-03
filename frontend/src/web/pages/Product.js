import React, { useState, useEffect } from "react";
import { Star, Heart, Share2, ShoppingCart, ImageOff } from "lucide-react";
import { useParams } from "react-router-dom";
import { fetchProductById } from "../../redux/productsSlice";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, resetState } from "../../redux/cartSlice";
import toast from "react-hot-toast";
import { fetchReviewsByEntity } from "../../redux/reviewSlice";
import Reviews from "../../components/products/Reviews";
import { fetchCategories } from "../../redux/categorySlice";
import FilterSidebar from "./FilterSidebar";
const Product = () => {
  const dispatch = useDispatch(); // Get the Redux dispatch function
  const { productId } = useParams(); // Get the product ID from the URL parameters
  const [selectedWeight, setSelectedWeight] = useState("100g");
  const { product } = useSelector((state) => state.products);
 
  const [quantity, setQuantity] = useState(1);
  const { auth } = useSelector((state) => state.auth);
  const [selectedImage, setSelectedImage] = useState(null);
  const { cart } = useSelector((state) => state.cart);
  const { reviews } = useSelector((state) => state.reviews);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [images, setImages] = useState({});
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [viewType, setViewType] = useState("grid");
  const { categories } = useSelector((state) => state.categories);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    status: "",
  });

  React.useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);
  useEffect(() => {
    dispatch(fetchProductById(productId));
  }, [dispatch, productId]);

  useEffect(() => {
    if (product?.images) {
      dispatch(
        fetchReviewsByEntity({
          entityType: "products",
          entityId: product?.product_id,
        })
      );
      // Safely parse the images if they are a string
      const parsedImages =
        typeof product.images === "string"
          ? JSON.parse(product.images)
          : product.images;

      // Ensure the object structure is valid before setting state
      if (parsedImages?.other_images?.length > 0) {
        setImages(parsedImages);
        setSelectedImage(parsedImages.other_images[0]);
        setSelectedIndex(0); // Reset selected index
      }
    }
  }, [product]);

  const relatedProducts = [
    {
      title: "Mixed Nuts Berries Pack",
      price: 56.0,
      originalPrice: 64.0,
      rating: 4.5,
      image: "/api/placeholder/200/200",
    },
    {
      title: "Multi Grain Combo Cookies",
      price: 30.0,
      originalPrice: 35.0,
      rating: 4.0,
      image: "/api/placeholder/200/200",
    },
    // Add more related products as needed
  ];

  const handleImageView = (ind, image) => {
    setSelectedImage(image);
    setSelectedIndex(ind);
  };

  const handleCart = (product) => {
    if (!auth || auth.user_type === "admin" || auth.user_type === "vendor") {
      alert("Please login to add items to the cart");
      return;
    }

    const existingVendorId =
      cart.items?.length > 0 ? cart.items[0].vendor_id : null;
    if (existingVendorId && existingVendorId !== product.vendor_id) {
     
      const confirmClear = window.confirm(
        "Your cart contains items from a different vendor. Adding this item will clear your current cart. Do you want to proceed?"
      );

      if (!confirmClear) {
        return; // Exit if the user cancels
      }

      // Create the cart item object
      const cartItem = {
        product_id: product.product_id,
        price: Number(product.price),
        quantity: 1,
        user_id: auth.user_id,
        vendorId: product.vendor_id,
      };
      // Dispatch action to clear the cart
      dispatch(addToCart(cartItem));
      dispatch(resetState());
      toast.success("Item added to the cart successfully");
    }
    const cartItem = {
      product_id: product.product_id,
      price: Number(product.price),
      quantity: 1,
      user_id: auth.user_id,
      vendorId: product.vendor_id,
    };
    // Dispatch action to clear the cart
    dispatch(addToCart(cartItem));
    dispatch(resetState());
    toast.success("Item added to the cart successfully");

    // Add the new item to the cart
  };


  const averageRating = reviews?.length
    ? (
        reviews?.reduce((sum, review) => sum + parseFloat(review.rating), 0) /
        reviews.length
      ).toFixed(1)
    : "0.0";

  const RenderStars = ({ rating, size = 20 }) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        size={size}
        fill={index < Math.floor(rating) ? "#f27d0c" : "none"}
        color="#f27d0c"
        className="inline-block"
      />
    ));
  };

  const toggleCategory = (category) => {
    setFilters((prev) => ({
      ...prev,
      category: prev.category?.includes(category)
        ? prev.category.filter((c) => c !== category)
        : [...(prev.category || []), category],
    }));

    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  return (
    <div className="max-w-7xl mx-auto mt-14 px-4">
      {/* Header */}

      {/* Main Content */}
      <div className="container mx-auto py-8">
        <div className="flex flex-wrap -mx-4">
          {/* Sidebar */}
          <FilterSidebar
            categories={categories}
            selectedCategories={selectedCategories}
            toggleCategory={toggleCategory}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            // weights={weights}
          />
          {/* Product Details */}
          <div className="w-full md:w-3/4 px-4">
            <div className="">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-5">
                {/* Product Images */}
                <div className="border rounded-md p-6">
                  <div className="mb-4">
                    <img
                      src={selectedImage}
                      alt="Product"
                      onError={(e) => {
                        e.target.src = "/default-grocery.png";
                        e.target.alt = "Default gr Image";
                      }}
                      className="w-full rounded-sm aspect-square"
                    />
                  </div>
                  <div className="flex space-x-2 justify-center ">
                    {images?.other_images?.map((thumb, index) => (
                      <button
                        key={index}
                        onClick={() => handleImageView(index, thumb)}
                        className={`border-2 rounded-lg p-1 ${
                          selectedIndex === index
                            ? "border-secondary"
                            : "border-gray-200"
                        }`}
                      >
                        <img
                          src={thumb}
                          alt={`Thumbnail ${index + 1}`}
                          className="w-16 h-16"
                          onError={(e) => {
                            e.target.src = "/default-grocery.png";
                            e.target.alt = "Default gr Image";
                          }}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Product Info */}
                <div className="py-3 ">
                  <h1 className="text-xl font-Poppins tracking-wide text-primary capitalize font-medium mb-5">
                    {product?.name}
                  </h1>
                  <div className="flex items-center text-sm space-x-2 mb-4">
                    <div className="flex">
                      <RenderStars
                        rating={parseFloat(averageRating)}
                        size={16}
                      />
                    </div>
                    <span className="text-gray-600">| 562 Ratings</span>
                  </div>

                  {Number(product.discount_percentage) > 0 ? (
                    <div className=" flex justify-between mb-4  text-primary capitalize text-2xl font-semibold ">
                      <div>
                        <span className="">
                          ₹
                          {(
                            product.original_price *
                            (1 - product.discount_percentage / 100)
                          ).toFixed(2)}
                        </span>
                        <span className="text-secondary ml-2">-{Number(product.discount_percentage).toFixed(0)}%</span>
                        <br />
                        <span className="text-gray-500 text-lg line-through mt-3">
                          M.R.P. : {Number(product.original_price).toFixed(2)}
                        </span>
                      </div>
                      <div>
                        <span className="mb-3">SKU# :78943KH</span>
                        <br />
                        <span
                          className={`${
                            Number(product?.stock_quantity) > 0
                              ? "text-secondary"
                              : "text-red-200"
                          } uppercase text-lg font-semibold tracking-wide`}
                        >
                          {Number(product?.stock_quantity) > 0
                            ? "In Stock"
                            : "Out of Stock"}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className=" flex justify-between mb-4  text-primary capitalize text-2xl font-semibold ">
                      <div>
                        <span className="">
                          ₹{Number(product?.original_price).toFixed(2)}
                        </span>
                      </div>
                      <div>
                        <span className="">SKU# :78943KH</span>
                        <br />
                        <span className="text-secondary">IN STOCK</span>
                      </div>
                    </div>
                  )}

                  <p
                    className="text-gray-600 break-all text-sm py-3"
                    dangerouslySetInnerHTML={{ __html: product?.description }}
                  ></p>
                  {/* Weight Selection */}
                  <div className="mb-6">
                    <h3 className="font-semibold mb-2 uppercase">
                      WEIGHT/quantity
                    </h3>
                    <div className="flex space-x-2">
                      <button
                        className={`px-4 py-2 rounded-md bg-secondary text-white`}
                      >
                        {Number(product?.weight).toFixed(0) ||
                          Number(product?.quantitiy).toFixed(0)}{" "}
                        {product?.unit_of_measurement}
                      </button>
                    </div>
                    {/* <div className="flex space-x-2">
                      {["100g", "1kg", "2kg"].map((weight) => (
                        <button
                          key={weight}
                          onClick={() => setSelectedWeight(weight)}
                          className={`px-4 py-2 rounded-lg ${
                            selectedWeight === weight
                              ? "bg-secondary text-white"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {weight}
                        </button>
                      ))}
                    </div> */}
                  </div>

                  {/* Add to Cart */}
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center border rounded-md">
                      <button
                        className="px-4 py-2"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      >
                        -
                      </button>
                      <span className="px-4 py-2 border-x">{quantity}</span>
                      <button
                        className="px-4 py-2"
                        onClick={() => setQuantity(quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                    <div>
                      <button
                        onClick={()=>handleCart(product)}
                        className="bg-gray-800 text-sm font-semibold  text-white px-6  py-2.5 rounded-md flex items-center space-x-2 transition duration-300 ease-in-out transform hover:bg-secondary hover:text-white hover:scale-105 hover:shadow-lg"
                      >
                        <span>ADD TO CART</span>
                      </button>
                    </div>

                    <button className="p-2 border rounded-md">
                      <Heart className="w-5 h-5" />
                    </button>
                    <button className="p-2 border rounded-md">
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <Reviews
              reviews={reviews}
              entityId={product?.product_id}
              entityType="products"
              auth={auth}
            />

            {/* Related Products */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Related Products</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {relatedProducts.map((product, index) => (
                  <div key={index} className="bg-white rounded-lg shadow p-4">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                    <h3 className="font-semibold mb-2">{product.title}</h3>
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < product.rating
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold">
                        ${product.price.toFixed(2)}
                      </span>
                      <span className="text-gray-500 line-through">
                        ${product.originalPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;

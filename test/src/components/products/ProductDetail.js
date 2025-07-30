import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductById } from "../../redux/productsSlice"; // Import the action from your slice
import { Link, useParams } from "react-router-dom";
import { fetchReviewsByEntity } from "../../redux/reviewSlice";
import Reviews from "./Reviews";
import { Star, Heart, Share2, ShoppingCart, ImageOff } from "lucide-react";
import { addToCart } from "../../redux/cartSlice";
import toast from "react-hot-toast";
const ProductDetail = () => {
  const { productId } = useParams(); // Get the product ID from the URL parameters
  const dispatch = useDispatch();
  const { reviews } = useSelector((state) => state.reviews);
  const [quantity, setQuantity] = useState(1);
  const { auth } = useSelector((state) => state.auth);
  const [activeImage, setActiveImage] = useState(0);
  const [images, setImages] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  // Get the product data from Redux state
  const { product, status, error } = useSelector((state) => state.products);

  useEffect(() => {
    // Dispatch action to fetch product by ID
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

  // Handle loading state
  if (status === "loading") {
    return <div>Loading...</div>;
  }

  // Handle error state
  if (status === "failed") {
    return <div>Error: {error}</div>;
  }

  // Handle case where no product is found
  if (!product) {
    return <div>No product found</div>;
  }

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
        fill={index < Math.floor(rating) ? "#FFD700" : "none"}
        color="#FFD700"
        className="inline-block"
      />
    ));
  };
  const handleImageView = (ind, image) => {
    setSelectedImage(image);
    setSelectedIndex(ind);
  };

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

  const parsedBrandDetails =
    typeof product?.brand_details === "string"
      ? JSON.parse(product?.brand_details)
      : product?.brand_details;

  const handleCart = () => {
    if (!auth || auth.user_type === "admin" || auth.user_type === "vendor") {
      alert("Please login to add items to the cart");
      return;
    }
    const cartItem = {
      product_id: product.product_id,
      price: Number(product.price),
      quantity,
      user_id: auth.user_id,
    };

    dispatch(addToCart(cartItem));
    toast.success("Cart added successfully");
  };


  
  return (
    <>
      <div className="w-full mb-4">
        <nav aria-label="breadcrumb">
          <ol className="flex text-sm text-gray-600 space-x-2">
            <li>
              <Link to="/" className="hover:text-blue-500">
                Home
              </Link>
            </li>
            <li>
              <Link
                to={`/category/${product.category_id}`}
                className="hover:text-blue-500"
              >
                {product.category_name}
              </Link>
            </li>
            <li>
              <span className="text-gray-500">{product.name}</span>
            </li>
          </ol>
        </nav>
      </div>
      <div className="container mx-auto py-8">
        <div className="flex flex-wrap -mx-4">
          <div className="w-full md:w-3/4 px-4 ">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Product Images */}
                <div>
                  <div className="mb-4">
                    <img
                      src={selectedImage}
                      alt="Product"
                      onError={(e) => {
                        e.target.src = "/default-grocery.png";
                        e.target.alt = "Default gr Image";
                      }}
                      className="w-full rounded-lg aspect-square"
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
                <div>
                  <h1 className="text-2xl font-semibold mb-2">
                    {product?.name}
                  </h1>
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="flex">
                      <RenderStars
                        rating={parseFloat(averageRating)}
                        size={24}
                      />
                    </div>
                    <span className="text-gray-600">| 562 Ratings</span>
                  </div>

                  {Number(product.discount_percentage) > 0 ? (
                    <div className="mb-4">
                      <span className=" text-3xl font-bold ">
                        Price:{" "}
                        {(
                          product.price *
                          (1 - product.discount_percentage / 100)
                        ).toFixed(2)}
                      </span>
                      <span className="text-secondary ml-2">-70%</span>
                      <span className="text-gray-500 line-through ml-2">
                        MRP: {Number(product.price).toFixed(2)}
                      </span>
                    </div>
                  ) : (
                    <span className="text-lg font-bold">
                      MRP: {Number(product.price).toFixed(2)}
                    </span>
                  )}

                  <p
                    className="text-gray-600 break-all text-sm py-3"
                    dangerouslySetInnerHTML={{ __html: product?.description }}
                  ></p>
                  {/* Weight Selection */}
                  <div className="mb-6">
                    <h3 className="font-semibold mb-2 uppercase">
                      {product?.unit_of_measurement}
                    </h3>
                    <div className="flex space-x-2">
                      <button
                        className={`px-4 py-2 rounded-lg bg-secondary text-white`}
                      >
                        {Number(product?.weight).toFixed(0) ||
                          Number(product?.quantitiy).toFixed(0)}{" "}
                        {product?.unit_of_measurement}
                      </button>
                    </div>
                  </div>

                  {/* Add to Cart */}
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center border rounded-lg">
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
                        onClick={handleCart}
                        className="bg-gray-800 text-sm text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition duration-300 ease-in-out transform hover:bg-secondary hover:text-white hover:scale-105 hover:shadow-lg"
                      >
                        <ShoppingCart className="w-5 h-5" />
                      </button>
                    </div>

                    <button className="p-2 border rounded-lg">
                      <Heart className="w-5 h-5" />
                    </button>
                    <button className="p-2 border rounded-lg">
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
          </div>
          {parsedBrandDetails && (
            <div className="mb-6">
              <h3 className="text-xl font-medium text-gray-800 mb-2">Brand</h3>
              <div className="flex items-center">
                <img
                  src={parsedBrandDetails?.logo_url}
                  alt={parsedBrandDetails?.name}
                  onError={(e) => {
                    e.target.src = "/defaultlogo.png";
                    e.target.alt = "Default gr Image";
                  }}
                  className="w-16 h-16 object-cover rounded-full mr-4"
                />
                <div>
                  <p className="text-gray-800 font-semibold">
                    {parsedBrandDetails?.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {parsedBrandDetails?.category}
                  </p>
                  <p className="text-sm text-gray-600">
                    {parsedBrandDetails?.description}
                  </p>
                </div>
              </div>
            </div>
          )}
          {/* Brand Info */}
        </div>
      </div>
    </>
  );
};

export default ProductDetail;

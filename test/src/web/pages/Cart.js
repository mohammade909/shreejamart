import { Fragment, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import ProductSection from "../components/ProductSection";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchUserCart,
  updateCart,
  removeItemFromCart,
} from "../../redux/cartSlice";
const Cart = () => {
  const navigate = useNavigate();
  const { auth } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  useEffect(() => {
    if (auth?.user_id) {
      dispatch(fetchUserCart(auth?.user_id));
    }
  }, [auth]);

  const handleQuantity = (id, action) => {
    dispatch(updateCart({ id, action, userId: auth.user_id }));
  };

  const handleRemoveItem = (id) => {
    dispatch(removeItemFromCart(id));
  };

  // Calculate subtotal, delivery charges, discounts, and taxes
  const calculateCartTotals = () => {
    const subtotal = cart?.items?.reduce(
      (total, item) => total + item.quantity * item.price,
      0
    );
    const deliveryCharges = subtotal > 500 ? 0 : 50; // Free delivery over $500
    let discount = subtotal > 1000 ? subtotal * 0.1 : 0; // 10% discount over $1000
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + deliveryCharges + tax;
    return { subtotal, deliveryCharges, discount, tax, total };
  };

  const { subtotal, deliveryCharges, discount, tax, total } =
    calculateCartTotals();

  const products = [
    {
      id: 1,
      category: "Dried Fruits",
      name: "Mixed Nuts Berries Pack",
      price: 56.0,
      oldPrice: 45.0,
      rating: 5,
      image: "/api/placeholder/200/200",
      tag: "SALE",
    },
    {
      id: 2,
      category: "Cookies",
      name: "Multi Grain Combo Cookies",
      price: 30.0,
      oldPrice: 25.0,
      rating: 4,
      image: "/api/placeholder/200/200",
      tag: "SALE",
    },
    // Add more products as needed
  ];

  return (
    <div className="min-h-screen  bg-base/50 my-14">
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Cart Summary */}
          <div className="w-1/3">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Summary</h2>
              <div className="space-y-4">
                <div className="border-b pb-4">
                  <h3 className="font-medium mb-2">Estimate Shipping</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-gray-600">Country *</label>
                      <select className="w-full mt-1 border rounded p-2">
                        <option>Select Country</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">
                        State/Province
                      </label>
                      <select className="w-full mt-1 border rounded p-2">
                        <option>Select State</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">
                        Zip/Postal Code
                      </label>
                      <input
                        type="text"
                        className="w-full mt-1 border rounded p-2"
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Sub-Total</span>
                    <span>₹{Number(subtotal).toFixed(2) || 0.0}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>₹{Number(tax).toFixed(2) || 0.0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Charges</span>
                    <span>₹{Number(deliveryCharges).toFixed(2) || 0.0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Coupon Discount</span>
                    <button className="text-secondary">Apply Discount</button>
                  </div>
                  {/* Original Total with line-through if discount is applied */}
                  {discount > 0 && (
                    <div className="flex justify-between text-primary">
                      <span>Total</span>
                      <span className="line-through">
                        ₹{Number(total).toFixed(2) || 0.0}
                      </span>
                    </div>
                  )}
                  <div
                    className={`flex justify-between border-t ${
                      discount > 0 ? "text-secondary" : "text-primary"
                    }`}
                  >
                    <span>To be Paid</span>
                    <span>₹{Number(total - discount).toFixed(2) || 0.0}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Cart Items */}
          <div className="w-2/3">
            <div className="bg-white rounded-lg shadow">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left">Product</th>
                    <th className="px-6 py-4 text-left">Price</th>
                    <th className="px-6 py-4 text-left">Quantity</th>
                    <th className="px-6 py-4 text-left">Total</th>
                    <th className="px-6 py-4 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {cart?.items?.map((product) => {
                    const parsedImages = typeof product.images === "string" 
                    ? JSON.parse(product.images) 
                    : product.images;
                    return (
                      <tr>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <img
                              src={parsedImages?.featured_image}
                              alt=""
                              className="w-16 h-16 rounded"
                            />
                            <span className="ml-4">
                              <Link to={`/product/${product.product_id}`}>
                                {" "}
                                {product.product_name}{" "}
                              </Link>
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">MRP. {product.price}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() =>
                                handleQuantity(
                                  product.cart_item_id,
                                  "DECREMENT"
                                )
                              }
                              className="px-2 py-1 border rounded"
                            >
                              -
                            </button>
                            <span>{product.quantity}</span>
                            <button
                              type="button"
                              onClick={() =>
                                handleQuantity(
                                  product.cart_item_id,
                                  "INCREMENT"
                                )
                              }
                              className="px-2 py-1 border rounded"
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {Number(product.price) * Number(product.quantity)}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() =>
                              handleRemoveItem(product.cart_item_id)
                            }
                            className="text-red-500"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="mt-8">
              <div className="flex justify-between items-center mb-6">
                <button className="text-secondary">Continue Shopping</button>
                <button
                  onClick={() => navigate("/checkout")}
                  className="bg-secondary text-white px-6 py-2 rounded"
                >
                  Check Out
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* New Arrivals Section */}
        <section className="mt-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold">New Arrivals</h2>
            <p className="text-gray-600 mt-2">
              Browse The Collection of Top Products
            </p>
          </div>

          <ProductSection from={0} to={5} />
        </section>
      </main>
    </div>
  );
};

export default Cart;

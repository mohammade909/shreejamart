import { useParams } from "react-router-dom";
import { useEffect, useMemo } from "react";
import { fetchOrderById } from "../../redux/orderSlice";
import { useDispatch, useSelector } from "react-redux";
const OrderSuccessPage = () => {
  // Access the current location
  const dispatch = useDispatch();
  const { id } = useParams();
  const { order, loading, error } = useSelector((state) => state.orders);
  useEffect(() => {
    dispatch(fetchOrderById(id));
  }, [dispatch, id]);
  const calculateCartTotals = useMemo(() => {
    if (!order?.items || order.items.length === 0) {
      return {
        subtotal: 0,
        deliveryCharges: 0,
        discount: 0,
        tax: 0,
        gst: 0,
        total: 0,
      };
    }

    const subtotal = order.items.reduce(
      (total, item) => total + item.quantity * item.price,
      0
    );
    const deliveryCharges = subtotal > 500 ? 0 : 50;
    const discount = subtotal > 1000 ? subtotal * 0.1 : 0;
    const tax = subtotal * 0.08;
    const gst = subtotal * 0.18;
    const total = subtotal + deliveryCharges + tax + gst - discount;

    return { subtotal, deliveryCharges, discount, tax, gst, total };
  }, [order]);
  const orderDetails = {
    orderNumber: "ORD-2025-84932",
    orderDate: "January 9, 2025",
    deliveryDate: "January 12, 2025",
    shippingAddress: "2548 Broaddus Maple Court, Madisonville KY 4783, USA",
    paymentMethod: "Cash on Delivery",
    items: [
      {
        id: 1,
        name: "Women's Wallet Hand Purse",
        quantity: 3,
        price: 70.0,
        image: "/api/placeholder/80/80",
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="container mx-auto py-4 px-4">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-teal-600">Grabit</div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Success Message */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-10 h-10 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Thank You for Your Order!
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Your order has been placed successfully. We'll send you a
              confirmation email shortly.
            </p>
            <p className="text-xl font-semibold text-gray-800 mb-2">
              Order Number: {order.order_number}
            </p>
            <p className="text-gray-600">
              Please save this order number for future reference
            </p>
          </div>

          {/* Order Details */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-6">Order Details</h2>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">
                  Delivery Information
                </h3>
                <div className="text-gray-600 space-y-1">
                  <p>Estimated Delivery Date: {orderDetails.deliveryDate}</p>
                  <p>Shipping Address:</p>
                  <p className="font-medium">{orderDetails.shippingAddress}</p>
                </div>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">
                  Order Information
                </h3>
                <div className="text-gray-600 space-y-1">
                  <p>Order Date: {order?.placed_at}</p>
                  <p>Payment Method: {order?.payment_method}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-6">Order Summary</h2>
            {order?.items?.map((item) => {
              const parsedImages =
                typeof item.images === "string"
                  ? JSON.parse(item.images)
                  : item.images;
              return (
                <div key={item.id} className="flex items-center py-4 border-b">
                  <img
                    src={parsedImages?.featured_image}
                    alt={item.product_name}
                    className="w-20 h-20 rounded object-cover"
                  />
                  <div className="ml-6 flex-1">
                    <h3 className="font-medium text-gray-900">
                      {item.product_name}
                    </h3>
                    <p className="text-gray-600">Quantity: {item.quantity}</p>
                    <p className="text-gray-600">
                      Price: ${Number(item.price).toFixed(2)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      ₹{(Number(item.price) * Number(item.quantity)).toFixed(2)}
                    </p>
                  </div>
                </div>
              );
            })}
            <div className="mt-6 space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>₹{Number(calculateCartTotals.subtotal).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>
                  ₹{Number(calculateCartTotals.deliveryCharges).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>GST</span>
                <span>₹{Number(calculateCartTotals.gst).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>TAX</span>
                <span>₹{Number(calculateCartTotals.tax).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-semibold text-gray-900 pt-4 border-t">
                <span>Total</span>
                <span>₹{Number(calculateCartTotals.total).toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4">
            <button className="bg-teal-500 text-white px-8 py-3 rounded-lg font-medium hover:bg-teal-600 transition-colors">
              Track Order
            </button>
            <button className="bg-gray-100 text-gray-800 px-8 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors">
              Continue Shopping
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white mt-16 border-t">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-gray-600">
            <p>© 2025 Grabit. All rights reserved.</p>
            <p className="mt-2">
              Need help? Contact our support team at support@grabit.com
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default OrderSuccessPage;

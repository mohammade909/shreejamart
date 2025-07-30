import React from "react";
import { X } from "lucide-react";

const OrderDetailsModal = ({ isOpen, onClose, order }) => {
  // Sample order data based on provided structure

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white">
          <h2 className="text-xl font-semibold">
            Order Details #{order.order_number}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Order Status and Date */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <span
                className={`px-3 py-1 rounded-full text-sm ${
                  order?.order_status === "pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : order?.order_status === "delivered"
                    ? "bg-green-100 text-green-800"
                    : "bg-blue-100 text-blue-800"
                }`}
              >
                {order?.order_status.charAt(0).toUpperCase() +
                  order?.order_status.slice(1)}
              </span>
              <span className="ml-4 text-gray-600">
                Placed on {new Date(order?.placed_at).toLocaleDateString()}
              </span>
            </div>
            <div
              className={`px-3 py-1 rounded-full text-sm ${
                order?.payment_status === "paid"
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              Payment:{" "}
              {order?.payment_status.charAt(0).toUpperCase() +
                order?.payment_status.slice(1)}
            </div>
          </div>

          {/* Customer Details */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold mb-3">Customer Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">Name</p>
                <p className="font-medium">{`${order?.user?.firstname} ${order?.user?.lastname}`}</p>
              </div>
              <div>
                <p className="text-gray-600">Phone</p>
                <p className="font-medium">{order?.user?.phone_number}</p>
              </div>
              <div>
                <p className="text-gray-600">Email</p>
                <p className="font-medium">{order?.user?.email}</p>
              </div>
              <div>
                <p className="text-gray-600">Delivery Address</p>
                <p className="font-medium">{order?.user?.address}</p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3">Order Items</h3>
            <div className="border rounded-lg overflow-hidden">
              {order?.items?.map((item, index) => {
                const parsedImages =
                  typeof item.images === "string"
                    ? JSON.parse(item.images)
                    : item.images;
                return (
                  <div
                    key={index}
                    className="flex items-center p-4 border-b last:border-b-0"
                  >
                    <img
                      src={parsedImages?.featured_image}
                      alt={item?.product_name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="ml-4 flex-1">
                      <h4 className="font-medium">{item.product_name}</h4>
                      <p className="text-gray-600">
                      ₹{item.price} x {item.quantity}
                      </p>
                    </div>
                    <div className="font-medium">₹{item.item_total}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold mb-3">Order Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>₹{order.subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span>₹{order.tax}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">GST</span>
                <span>₹{order.gst}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery Charge</span>
                <span>₹{order.delivery_charge}</span>
              </div>
              {Number(order.discount) > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Discount</span>
                  <span>-₹{order.discount}</span>
                </div>
              )}
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>₹{order.total_amount}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t flex justify-end space-x-4 sticky bottom-0 bg-white">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            Close
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Print Invoice
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;

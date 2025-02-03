import React, { useState, useEffect } from "react";
import { 
  Check, X, AlertTriangle, Package, Truck, MapPin, 
  CreditCard, Phone, User, Clock, ShoppingBag 
} from "lucide-react";
import { updateOrder } from "../../../redux/orderSlice";
import { fetchPartnerProfile } from "../../../redux/partnersSlice";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { BASEURL } from "../../../baseurl";
import axios from "axios";

const DeliveryOrderCard = ({ order }) => {
  const dispatch = useDispatch();
  const [activeModal, setActiveModal] = useState(null);
  const [customerOTP, setCustomerOTP] = useState("");
  const [vendorOTP, setVendorOTP] = useState("");
  const [cancellationReason, setCancellationReason] = useState("");

  const statusColors = {
    'pending': 'bg-yellow-50 text-yellow-600',
    'picked': 'bg-blue-50 text-blue-600',
    'in_transit': 'bg-green-50 text-green-600',
    'completed': 'bg-emerald-50 text-emerald-600'
  };

  const orderStatusActions = {
    'pending': [
      { 
        label: 'Pick Order', 
        color: 'blue', 
        icon: Package, 
        action: () => setActiveModal('pick') 
      }
    ],
    'picked': [
      { 
        label: 'Start Delivery', 
        color: 'green', 
        icon: Truck, 
        action: () => setActiveModal('in_transit') 
      }
    ],
    'transit': [
      { 
        label: 'Complete Delivery', 
        color: 'green', 
        icon: Check, 
        action: () => setActiveModal('deliver') 
      }
    ],
  
  };

  const handleSubmitDelivery = () => {
    dispatch(
      updateOrder({
        orderId: order.order_id,
        updatedData: { 
          cosutmer_pin: customerOTP, 
          order_status: "completed" 
        },
      })
    );
    toast.success("Order Delivered successfully");
    setActiveModal(null);
  };

  const handleSubmitPicked = () => {
    dispatch(
      updateOrder({
        orderId: order.order_id,
        updatedData: { 
          vendor_pin: vendorOTP, 
          order_status: "picked" 
        },
      })
    );
    toast.success("Order picked successfully");
    setActiveModal(null);
  };

  const handleSubmitTransit = () => {
    dispatch(
      updateOrder({
        orderId: order.order_id,
        updatedData: { 
          order_status: "transit" 
        },
      })
    );
    toast.success("Order picked successfully");
    setActiveModal(null);
  };

  const handleSubmitCancellation = () => {
    dispatch(
      updateOrder({
        orderId: order.order_id,
        updatedData: {
          cosutmer_pin: customerOTP,
          cancel_reason: cancellationReason,
          order_status: "cancelled",
        },
      })
    );
    toast.success("Order Cancelled successfully");
    setActiveModal(null);
  };

  const renderModal = () => {
    if (activeModal === 'pick') {
      return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <Package className="mr-2 text-blue-500" size={24} />
              Confirm Order Pickup
            </h3>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">
                Enter Vendor OTP
              </label>
              <input
                type="text"
                value={vendorOTP}
                onChange={(e) => setVendorOTP(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-blue-500"
                placeholder="Enter OTP"
              />
            </div>
            <div className="flex justify-between">
              <button
                onClick={() => setActiveModal(null)}
                className="bg-red-50 text-red-500 px-4 py-2 rounded-md flex items-center hover:bg-red-100"
              >
                <X className="mr-2" size={20} /> Cancel
              </button>
              <button
                onClick={handleSubmitPicked}
                className="bg-green-50 text-green-500 px-4 py-2 rounded-md flex items-center hover:bg-green-100"
              >
                <Check className="mr-2" size={20} /> Confirm
              </button>
            </div>
          </div>
        </div>
      );
    }
    if (activeModal === 'deliver') {
      return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <Truck className="mr-2 text-green-500" size={24} />
              Confirm Delivery
            </h3>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">
                Enter Customer OTP
              </label>
              <input
                type="text"
                value={customerOTP}
                onChange={(e) => setCustomerOTP(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-green-500"
                placeholder="Enter OTP"
              />
            </div>
            <div className="flex justify-between">
              <button
                onClick={() => setActiveModal(null)}
                className="bg-red-50 text-red-500 px-4 py-2 rounded-md flex items-center hover:bg-red-100"
              >
                <X className="mr-2" size={20} /> Cancel
              </button>
              <button
                onClick={handleSubmitDelivery}
                className="bg-green-50 text-green-500 px-4 py-2 rounded-md flex items-center hover:bg-green-100"
              >
                <Check className="mr-2" size={20} /> Confirm
              </button>
            </div>
          </div>
        </div>
      );
    }
    if (activeModal === 'in_transit') {
      return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <Truck className="mr-2 text-green-500" size={24} />
             Are you ready to deliver?
            </h3>
            <div className="flex justify-between">
              <button
                onClick={() => setActiveModal(null)}
                className="bg-red-50 text-red-500 px-4 py-2 rounded-md flex items-center hover:bg-red-100"
              >
                <X className="mr-2" size={20} /> No
              </button>
              <button
                onClick={handleSubmitTransit}
                className="bg-green-50 text-green-500 px-4 py-2 rounded-md flex items-center hover:bg-green-100"
              >
                <Check className="mr-2" size={20} /> Yes
              </button>
            </div>
          </div>
        </div>
      );
    }
    if (activeModal === 'cancel') {
      return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96">
            <div className="flex items-center mb-4 text-red-600">
              <AlertTriangle className="mr-2" size={24} />
              <h3 className="text-xl font-bold">Cancel Order</h3>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">
                Enter Customer OTP
              </label>
              <input
                type="text"
                value={customerOTP}
                onChange={(e) => setCustomerOTP(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-red-500"
                placeholder="Enter OTP"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">
                Cancellation Reason
              </label>
              <textarea
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-red-500"
                placeholder="Reason for cancellation"
                rows="3"
              />
            </div>
            <div className="flex justify-between">
              <button
                onClick={() => setActiveModal(null)}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md flex items-center hover:bg-gray-400"
              >
                <X className="mr-2" size={20} /> Close
              </button>
              <button
                onClick={handleSubmitCancellation}
                className="bg-red-50 text-red-500 px-4 py-2 rounded-md flex items-center hover:bg-red-100"
              >
                <Check className="mr-2" size={20} /> Cancel Order
              </button>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  const renderActionButtons = () => {
    const status = order.order_status.toLowerCase();
    const actions = orderStatusActions[status] || [];

    return (
      <>
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.action}
            className={`bg-${action.color}-50 text-${action.color}-500 px-4 py-2 rounded-md hover:bg-${action.color}-200 transition flex items-center`}
          >
            <action.icon className="mr-2" size={20} /> {action.label}
          </button>
        ))}
        <button
          onClick={() => setActiveModal('cancel')}
          className="bg-red-50 text-red-500 px-4 py-2 rounded-md hover:bg-red-200 transition flex items-center"
        >
          <AlertTriangle className="mr-2" size={20} /> Cancel Order
        </button>
      </>
    );
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-5 mb-4">
      <div className="flex justify-between items-center mb-4 pb-4 border-b">
        <div className="flex items-center space-x-3">
          <div className={`p-3 rounded-full ${statusColors[order.order_status.toLowerCase()] || 'bg-gray-50'}`}>
            <ShoppingBag size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              Order #{order.order_number}
            </h2>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Clock size={16} />
              <span>{order.order_status.replace('_', ' ')}</span>
            </div>
          </div>
        </div>
        <div className="text-xl font-semibold text-green-600">
        ₹{order.delivery_charge}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center space-x-3">
          <User className="text-gray-500" size={20} />
          <span>{order.firstname} {order.lastname}</span>
        </div>
        <div className="flex items-center space-x-3">
          <Phone className="text-gray-500" size={20} />
          <span>{order.phone_number}</span>
        </div>
        <div className="flex items-center space-x-3">
          <MapPin className="text-gray-500" size={20} />
          <span className="truncate">{order.location}</span>
        </div>
        <div className="flex items-center space-x-3">
          <CreditCard className="text-gray-500" size={20} />
          <span>{order.payment_method.toUpperCase()}</span>
        </div>
      </div>

      <div className="flex space-x-2">
        {renderActionButtons()}
      </div>

      {renderModal()}
    </div>
  );
};

const DeliveryOrdersPage = () => {
  const dispatch = useDispatch();
  const { partner } = useSelector((state) => state.partners);
  const { auth } = useSelector((state) => state.auth);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    dispatch(fetchPartnerProfile(auth.user_id));
  }, [auth]);

  useEffect(() => {
    const fetchPendingOrders = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(
          `${BASEURL}/api/v1/orders/pending/${partner?.partner_id}`
        );
        setPendingOrders(response.data.pendingOrders);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };

    if (partner) {
      fetchPendingOrders();
    }
  }, [partner]);

  return (
    <div className="container mx-auto bg-gray-50 min-h-screen p-8">
      <div className="flex items-center mb-6 space-x-4">
        <Truck size={32} className="text-blue-600" />
        <h1 className="text-3xl font-bold text-gray-800">Pending Deliveries</h1>
      </div>
      {loading ? (
        <div className="flex justify-center items-center">
          <p>Loading orders...</p>
        </div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        pendingOrders?.length > 0 ? (
          pendingOrders.map((order) => (
            <DeliveryOrderCard key={order.order_id} order={order} />
          ))
        ) : (
          <div className="text-center text-gray-500 py-10">
            <Package size={48} className="mx-auto mb-4" />
            <p>No pending orders at the moment</p>
          </div>
        )
      )}
    </div>
  );
};

export default DeliveryOrdersPage;
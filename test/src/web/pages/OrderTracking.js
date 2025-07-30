import React, { useEffect, useState } from "react";
import { fetchOrders } from "../../redux/orderSlice";
import { useDispatch, useSelector } from "react-redux";
import ReactPaginate from "react-paginate";
import { formatDateTime } from "../utils/helpers";
const OrderTracking = () => {
  const dispatch = useDispatch();
  const { auth } = useSelector((state) => state.auth);
  const { orders, pagination } = useSelector((state) => state.orders);

  const [pendingOrders, setPendingOrders] = useState([]);
  const [completedOrders, setCompletedOrders] = useState([]);

  useEffect(() => {
    if (auth?.user_id) {
      dispatch(fetchOrders({ page: 1, filters: { userId: auth.user_id } }));
    }
  }, [dispatch, auth]);

  // Update pending/completed orders when orders are fetched
  useEffect(() => {
    if (orders) {
      setPendingOrders(
        orders.filter((item) => item.order_status !== "completed")
      );
      setCompletedOrders(
        orders.filter((item) => item.order_status === "completed")
      );
    }
  }, [orders]);

  return (
    <div>
      <div className="max-w-5xl mx-auto py-8">
        <div className="bg-white">
          <div className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-semibold mb-2">
                Product <span className="text-emerald-500">Order List</span>
              </h1>
              <p className="text-gray-500">
                Your product Order is our first priority.
              </p>
            </div>

            {/* Pending Orders */}
            <div className="mb-8 border p-5">
              <h2 className="text-gray-700 font-medium mb-4 border-b pb-3">PENDING <span className="text-secondary">ORDERS</span></h2>
              <div className="overflow-x-auto">
                {pendingOrders.length === 0 ? (
                  <p className="text-gray-600 py-4">No orders found</p>
                ) : (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 text-gray-600">
                          Order No.
                        </th>
                        <th className="text-left py-3 px-4 text-gray-600">
                          Shipping
                        </th>
                        <th className="text-left py-3 px-4 text-gray-600">
                          Quantity
                        </th>
                        <th className="text-left py-3 px-4 text-gray-600">
                          Status
                        </th>
                        <th className="text-left py-3 px-4 text-gray-600">
                          Date
                        </th>
                        <th className="text-left py-3 px-4 text-gray-600">
                          Paid
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingOrders.map((order) => (
                        <tr
                          key={order.order_id}
                          className="border-b border-gray-200"
                        >
                          <td className="py-3 px-4 text-gray-600">
                            {order.order_number}
                          </td>
                          <td className="py-3 px-4 text-gray-600">
                            {order.location}
                          </td>
                          <td className="py-3 px-4 text-gray-600">
                            {order?.items?.reduce(
                              (total, item) => total + item.quantity,
                              0
                            )}
                          </td>
                          <td className={`py-3 px-4 text-gray-600 `}>
                           <span className={`rounded-md px-2 items-center capitalize ${order.order_status !== 'pending' ? 'bg-orange-50 text-orange-600 ': 'bg-blue-50 text-blue-600'}`}>
                             {order.order_status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-gray-600">
                            {new Date(order.placed_at).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4 text-gray-600">
                            {order.total_amount}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            {/* Completed Orders */}
            <div className="mb-8 border p-5">
              <h2 className="text-gray-700 font-medium mb-4 border-b pb-3">COMPELETE <span className="text-secondary">ORDERS</span></h2>

              <div className="overflow-x-auto">
                {completedOrders.length === 0 ? (
                  <p className="text-gray-600 py-4">No orders found</p>
                ) : (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 text-gray-600">
                          Order NO.
                        </th>
                        <th className="text-left py-3 px-4 text-gray-600">
                          Shipping
                        </th>
                        <th className="text-left py-3 px-4 text-gray-600">
                          Quantity
                        </th>
                        <th className="text-left py-3 px-4 text-gray-600">
                          Delvered At
                        </th>
                        <th className="text-left py-3 px-4 text-gray-600">
                          Paid
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {completedOrders?.map((order) => (
                        <tr
                          key={order.order_id}
                          className="border-b border-gray-200"
                        >
                          <td className="py-3 px-4 text-gray-600">
                            {order.order_number}
                          </td>
                          <td className="py-3 px-4 text-gray-600">
                            {order.location}
                          </td>
                          <td className="py-3 px-4 text-gray-600">
                            {order?.items?.reduce(
                              (total, item) => total + item.quantity,
                              0
                            )}
                          </td>
                          <td className="py-3 px-4 text-gray-600">
                            {formatDateTime(order.placed_at)}
                          </td>
                          <td className="py-3 px-4 text-gray-600">
                            {order.total_amount}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
         
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;

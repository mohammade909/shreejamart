import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Users,
  Store,
  Package,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Clock,
  X,
  Wallet,
} from "lucide-react";
import OrderMetrics from "../../components/OrderMetrics";
import { BASEURL } from "../../baseurl";
import { getUserById } from "../../redux/usersSlice";
import { useSelector, useDispatch } from "react-redux";
const AdminDashboard = () => {
  const dispatch = useDispatch();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { auth } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.users);

  useEffect(() => {
    dispatch(getUserById(auth.user_id));
  }, [dispatch, auth]);

  console.log(user);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${BASEURL}/api/v1/auth/matrix`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        setData(result.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl font-semibold">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl font-semibold text-red-500">Error: {error}</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl font-semibold">No data available</div>
      </div>
    );
  }

  const stats = [
    {
      title: "Total Vendors",
      value: data.totalVendors,
      icon: Store,
      color: "blue",
    },
    {
      title: "Total Users",
      value: data.totalUsers,
      icon: Users,
      color: "green",
    },
    {
      title: "Total Products",
      value: data.totalProducts,
      icon: Package,
      color: "indigo",
    },
    {
      title: "Total Orders",
      value: data.totalOrders,
      icon: ShoppingCart,
      color: "orange",
    },
    {
      title: "Total Sales",
      value: data.totalSales,
      icon: DollarSign,
      color: "red",
    },
    {
      title: "Total Revenue",
      value: data.totalRevenue.revenue || 0,
      icon: TrendingUp,
      color: "yellow",
    },
    {
      title: "Rejected Products",
      value: data?.rejectedAndPendingCounts?.rejected || 0,
      icon: X,
      color: "red",
    },
    {
      title: "Pending Products",
      value: data?.rejectedAndPendingCounts?.pending || 0,
      icon: Clock,
      color: "lime",
    },
  ];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className=" min-h-screen">
      <h1 className="text-3xl font-bold mb-8">Dashboard Overview</h1>

      {/* Stats Grid */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl shadow-xl p-6 text-white hover:scale-105 transform transition duration-300 ease-in-out">
          <div className="flex items-center">
            <div className="bg-white bg-opacity-20 p-4 rounded-full shadow-md">
              <Wallet className="w-10 h-10 text-white" />
            </div>
            <div className="ml-6">
              <p className="text-sm font-semibold uppercase tracking-wide text-gray-200">
                Wallet Balance
              </p>
              <h3 className="text-3xl font-extrabold mt-1">
                ₹{Number(user?.wallet_balance).toFixed(2)}
              </h3>
            </div>
          </div>
        </div>
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className={`p-4 rounded-full bg-${stat.color}-50`}>
                <stat.icon className={`w-8 h-8 text-${stat.color}-500`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">
                  {stat.title}
                </p>
                <h3 className="text-2xl font-bold">{stat.value}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>
      <OrderMetrics />
      {/* Categories Chart */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="mb-4">
          <h2 className="text-xl font-bold">Product Categories Distribution</h2>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.topCategories}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="product_count" fill="#4F46E5" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="mb-4">
          <h2 className="text-xl font-bold">Recent Orders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4 font-semibold">Order ID</th>
                <th className="text-left p-4 font-semibold">Customer</th>
                <th className="text-left p-4 font-semibold">Amount</th>
                <th className="text-left p-4 font-semibold">Status</th>
                <th className="text-left p-4 font-semibold">Date</th>
              </tr>
            </thead>
            <tbody>
              {data.recentOrders.map((order) => (
                <tr key={order.order_id} className="border-b hover:bg-gray-50">
                  <td className="p-4">#{order.order_number}</td>
                  <td className="p-4">
                    {order.firstname && order.lastname
                      ? `${order.firstname} ${order.lastname}`
                      : "Anonymous"}
                  </td>
                  <td className="p-4">₹{order.total_amount}</td>
                  <td className="p-4">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      {order.order_status}
                    </span>
                  </td>
                  <td className="p-4">{formatDate(order.placed_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

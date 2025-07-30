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
import { Link } from "react-router-dom";
import OrderMetrics from "../../components/OrderMetrics";
import { BASEURL } from "../../baseurl";
import { getUserById } from "../../redux/usersSlice";
import { useSelector, useDispatch } from "react-redux";
import { FiSearch } from "react-icons/fi";
const AdminDashboard = () => {
  const dispatch = useDispatch();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { auth } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.users);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter orders based on c/]ustomer name search query
  const filteredOrders = data?.recentOrders.filter((order) => {
    const fullName = `${order.firstname} ${order.lastname}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
  });

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
      href: "/dashboard/vendors",
      text: "View Vendors",
      textColor: "blue",
      bgView: "bg-blue-500/10 border-blue-200/30",
    },
    {
      title: "Total Users",
      value: data.totalUsers,
      icon: Users,
      color: "green",
      href: "#",
      text: "View Users",
      textColor: "green",
      bgView: "bg-green-500/10 border-green-200/30",
    },
    {
      title: "Total Products",
      value: data.totalProducts,
      icon: Package,
      color: "teal",
      href: "#",
      text: "View Products",
      textColor: "teal",
      bgView: "bg-teal-500/10 border-teal-200/30",
    },
    {
      title: "Total Orders",
      value: data.totalOrders,
      icon: ShoppingCart,
      color: "orange",
      href: "/dashboard/orders",
      text: "View Orders",
      textColor: "orange",
      bgView: "bg-orange-500/10 border-orange-200/30",
    },
    {
      title: "Total Sales",
      value: data.totalSales,
      icon: DollarSign,
      color: "pink",
      href: "#",
      text: "View Sales",
      textColor: "pink",
      bgView: "bg-pink-500/10 border-pink-200/30",
    },
    {
      title: "Total Revenue",
      value: data.totalRevenue.revenue || 0,
      icon: TrendingUp,
      color: "amber",
      href: "#",
      text: "View Revenue",
      textColor: "amber",
      bgView: "bg-amber-500/10 border-amber-200/30",
    },
    {
      title: "Rejected Products",
      value: data?.rejectedAndPendingCounts?.rejected || 0,
      icon: X,
      color: "red",
      href: "#",
      text: "View Products",
      textColor: "red",
      bgView: "bg-red-500/10 border-red-200/30",
    },
    {
      title: "Pending Products",
      value: data?.rejectedAndPendingCounts?.pending || 0,
      icon: Clock,
      color: "lime",
      href: "#",
      text: "View Pending Products",
      textColor: "lime",
      bgView: "bg-lime-500/10 border-lime-200/30",
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
      {/* <h1 className="text-3xl font-bold mb-8">Dashboard Overview</h1> */}

      {/* Stats Grid */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl shadow-xl p-6 text-white hover:scale-105 transform transition duration-300 ease-in-out">
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
        </div> */}

        <div className="w-full max-w-md overflow-hidden bg-gradient-to-br from-white/40 to-white/10 backdrop-blur-md border border-gray-300 shadow-sm">
          <div className="p-6">
            <div className="flex items-center space-x-4">
              <div className="rounded-full bg-indigo-500/20 p-3 transition-all duration-300 ease-in-out group-hover:scale-110 group-hover:bg-indigo-500/30">
                <Wallet className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-indigo-900/70">
                  Wallet Balance
                </p>
                <h3 className="text-2xl font-semibold text-indigo-900">
                  ₹{Number(user?.wallet_balance).toFixed(2)}
                </h3>
              </div>
            </div>
          </div>
          <div className="px-6 py-4 bg-indigo-500/10  border-indigo-200/30 border-t">
            <div className="flex items-center justify-end">
              <Link to="/dashboard/transactions">
                <button className="text-sm font-medium text-indigo-700 hover:text-indigo-500 transition-colors duration-200">
                  View Transactions
                </button>
              </Link>
            </div>
          </div>
        </div>
        {stats.map((stat, index) => (
          <div
            key={index}
            className="w-full max-w-md overflow-hidden bg-gradient-to-br from-white/40 to-white/10 backdrop-blur-md border border-gray-300 shadow-sm"
          >
            <div className="p-6">
              <div className="flex items-center">
                <div className={`p-3 rounded-full bg-${stat?.color}-50`}>
                  <stat.icon className={`h-6 w-6 text-${stat.color}-500`} />
                </div>
                <div className="ml-4 space-y-1">
                  <p
                    className={`text-sm font-medium text-${stat.textColor}-500`}
                  >
                    {stat.title}
                  </p>
                  <h3
                    className={`text-2xl font-semibold text-${stat.textColor}-500`}
                  >
                    {stat.value}
                  </h3>
                </div>
              </div>
            </div>
            <div className={`px-6 py-4 ${stat?.bgView}  border-t`}>
              <div className="flex items-center justify-end">
                <Link to={stat.href}>
                  <button
                    className={`text-sm font-medium text-${stat.textColor}-700  transition-colors duration-200`}
                  >
                    {stat?.text}
                  </button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
      <OrderMetrics />
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

      <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-4 border-b pb-2">
        <h2 className="text-xl font-semibold">Recent Orders</h2>
        <div className="relative w-64">
          <input
            type="text"
            placeholder="Search by customer name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border-none outline-none bg-transparent text-sm text-gray-700 placeholder-gray-400 w-full pl-10 pr-3 py-1 focus:ring-0 focus:border-b-2 focus:border-indigo-500"
          />
          <FiSearch className="absolute left-2 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-black text-white text-sm">
            <tr className="border-b">
              <th className="text-left p-4 font-medium">Order ID</th>
              <th className="text-left p-4 font-medium">Customer</th>
              <th className="text-left p-4 font-medium">Amount</th>
              <th className="text-left p-4 font-medium">Status</th>
              <th className="text-left p-4 font-medium">Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <tr
                  key={order.order_id}
                  className="border-b text-[13px] hover:bg-gray-50"
                >
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
              ))
            ) : (
              <tr className="border  border-gray-300">
                <td colSpan="5" className="p-4 text-center text-sm text-gray-700">
                  No recent orders available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
    </div>
  );
};

export default AdminDashboard;

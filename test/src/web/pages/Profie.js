import React, { useState, useEffect } from "react";
import { User, Edit, ShoppingBag, LogOut } from "lucide-react";
import { CiShoppingCart } from "react-icons/ci";
import { LiaFileInvoiceDollarSolid } from "react-icons/lia";
import OrderTracking from "./OrderTracking";
import {getUserById} from '../../redux/usersSlice'
import { useSelector, useDispatch } from "react-redux";
const menus = [
  { name: "User Profile", value: "profile", icon: User },
  { name: "Orders", value: "orders", icon: ShoppingBag },
  { name: "Cart", value: "cart", icon: CiShoppingCart },
  { name: "Invoice", value: "invoice", icon: LiaFileInvoiceDollarSolid },
  { name: "Logout", value: "logout", icon: LogOut },
];

const UserProfilePage = () => {
  const dispatch = useDispatch();
  const { auth } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.users);
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    dispatch(getUserById(auth.user_id));
  }, [dispatch, auth.user_id]);

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <div>
            <h3 className="text-xl font-semibold mb-6">Account Information</h3>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h4 className="text-gray-600 mb-2">E-mail address</h4>
                <p>Email:{user?.email}</p>
              </div>
              <div>
                <h4 className="text-gray-600 mb-2">Contact number</h4>
                <p>Phone Number: {user?.phone_number}</p>
              </div>
            </div>
            <div className="mt-8">
              <h4 className="text-gray-600 mb-2">Address</h4>
              <p>Home: {user?.address}</p>
            </div>
          </div>
        );
      case "orders":
        return <OrderTracking/>
      case "cart":
        return <p>Your cart is currently empty.</p>;
      case "checkout":
        return <p>Proceed to checkout here.</p>;
      case "invoice":
        return <p>View and manage invoices here.</p>;
      case "logout":
        return <p>You have been logged out.</p>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 my-16">
      {/* Profile Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex space-x-8">
          {/* Sidebar */}
          <div className="w-64">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="space-y-4">
                {menus.map((menu) => (
                  <div
                    key={menu.value}
                    className={`cursor-pointer py-2 px-4 rounded hover:bg-primary hover:text-white ${
                      activeTab === menu.value
                        ? "bg-secondary text-white"
                        : "text-gray-500"
                    }`}
                    onClick={() => setActiveTab(menu.value)}
                  > 
                   
                    {menu.name}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="relative h-64 bg-gray-200 rounded-lg mb-8">
              <div className="absolute bottom-8 left-8 flex items-center space-x-4">
                <div className="w-24 h-24 bg-gray-300 rounded-full"></div>
                <h2 className="text-2xl font-bold text-white capitalize">
                  {`${user?.firstname} ${user?.lastname}`}
                </h2>
              </div>
              <button className="absolute top-4 right-4 px-3 py-1 bg-white rounded-md flex items-center space-x-2">
                <Edit className="h-4 w-4" />
                <span>Edit</span>
              </button>
            </div>

            <div className="bg-white rounded-lg  border p-6">
              {renderContent()}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserProfilePage;

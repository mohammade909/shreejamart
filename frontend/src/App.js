import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AdminPrivateRoute from "./utils/AdminPrivateRoutes";
import PrivateRoute from "./utils/PrivateRoutes";
import ScrollToTop from "./components/ScollToTop";
import DashboardLayout from "./admin/layout/DashboardLayout";
import Login from "./pages/Login";
import AdminLogin from "./admin/pages/AdminLogin";
import Dashboard from "./vendor/pages/Dashboard";
import AdminDashboard from "./admin/pages/AdminDashboard";
import VendorLayout from "./vendor/layout/VendorLayout";
import UserRegister from "./pages/UserRegister";
import VendorRegistration from "./pages/VendorRegistration";
import ThankYouPage from "./pages/ThankYou";
import VendorList from "./admin/components/vendors/VendorList";
import VendorDetails from "./admin/components/vendors/VendorDetail";
import ProductForm from "./components/products/ProductForm";
import BlogList from "./admin/components/blogs/Blogs";
import BlogForm from "./admin/components/blogs/BlogForm";
import BlogOverview from "./admin/components/blogs/BlogOverview";
import Products from "./components/products/Products";
import ProductDetail from "./components/products/ProductDetail";
import Categories from "./admin/components/categories/Categories";
import CategoryForm from "./admin/components/categories/CategoryForm";
import Users from "./admin/components/users/Users";
import NotFoundPage from "./pages/NotFound";
import Home from "./web/pages/Home";
import { WebLayout } from "./web/layout/WebLayout";
import ProductListing from "./web/pages/ProductListing";
import Product from "./web/pages/Product";
import Cart from "./web/pages/Cart";
import CheckoutPage from "./web/pages/Checkout";
import OrderSuccessPage from "./web/pages/OrderSuccessPage";
import OrderTracking from "./web/pages/OrderTracking";
import UserProfilePage from "./web/pages/Profie";
import VendorOrders from "./vendor/components/orders/VendorOrders";
import Orders from "./admin/components/orders/Orders";
import VendorOnboardingForm from "./pages/VendorOnbaordingForm";
import Register from "./web/pages/Register";
import SignIn from "./web/pages/SignIn";
import PartnersList from "./admin/components/partners/PartnerList";
import PartnerDashboard from "./partner/pages/PartnerDashboard";
import PartnerLayout from "./partner/layout/PartnerLayout";
import PartnerOnboarding from "./pages/PartnerOnboarding";
import Partner from "./admin/components/partners/Partner";
import Transactions from "./admin/components/transactions/Transactions";
import OrderList from "./partner/components/orders/OrderList";
import PartnerProfile from "./partner/pages/PartnerProfile";
import UserTransactions from "./components/UserTransaction";

import Notifications from "./admin/pages/Notifications";
import NotificationForm from "./admin/components/notifications/NotificationForm";
import Reviews from "./components/reviews/Reviews";
import BlogPage from "./web/pages/BlogPage";
import BlogsPage from "./web/pages/BlogsPage";
import AboutUs from "./web/pages/AboutUs";
import { About } from "./web/pages/About";
import { Contact } from "lucide-react";
import { FAQ } from "./web/pages/FAQ";
import { RemoveTrailingSlash } from "./components/RemoveTrailing";
import NotificationList from "./components/NotificationList";
import VendorProfile from "./vendor/pages/Profile";
function App() {
  return (
    <Router>
      <ScrollToTop>
        <Routes>
          <Route element={<AdminPrivateRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard/admin" element={<AdminDashboard />} />
              <Route path="/dashboard/users" element={<Users />} />
              <Route path="/dashboard/partners" element={<PartnersList />} />
              <Route path="/dashboard/partners/:id" element={<Partner />} />
              <Route path="/dashboard/vendors" element={<VendorList />} />
              <Route path="/dashboard/orders" element={<Orders />} />
              <Route path="/dashboard/transactions" element={<Transactions />} />
              <Route path="/dashboard/reviews" element={<Reviews />} />
              <Route path="/dashboard/transactions/:id" element={<UserTransactions />} />
              <Route
                path="/dashboard/vendors/:vendorId"
                element={<VendorDetails />}
              />
              <Route path="/dashboard/products" element={<Products />} />
              <Route
                path="/dashboard/products/:productId"
                element={<ProductDetail />}
              />
              <Route path="/dashboard/product/add" element={<ProductForm />} />
              <Route path="/dashboard/categories" element={<Categories />} />
              <Route
                path="/dashboard/categories/add"
                element={<CategoryForm />}
              />
              <Route path="/dashboard/blogs" element={<BlogList />} />
              <Route
                path="/dashboard/blogs/view/:id"
                element={<BlogOverview />}
              />
              <Route path="/dashboard/blog/add" element={<BlogForm />} />
              <Route
                path="/dashboard/notifications"
                element={<Notifications />}
              />   <Route
              path="/dashboard/notification/add"
              element={<NotificationForm />}
            />
            </Route>
          </Route>
          <Route element={<PrivateRoute role={"vendor"} />}>
            <Route element={<VendorLayout />}>
              <Route path="/dashboard/vendor" element={<Dashboard />} />
              <Route path="/vendor/products" element={<Products />} />
              <Route path="/vendor/orders" element={<VendorOrders />} />
              <Route path="/vendor/profile" element={<VendorProfile />} />
              <Route
                path="/vendor/products/:productId"
                element={<ProductDetail />}
              />
               <Route path="/vendor/categories" element={<Categories />} />
              <Route path="/vendor/product/add" element={<ProductForm />} />
              <Route path="/vendor/transactions" element={<UserTransactions />} />
              <Route
                path="/vendor/notifications"
                element={<NotificationList />}
              />
            </Route>
          </Route>
          <Route element={<PrivateRoute role={"delivery_partner"} />}>
            <Route element={<PartnerLayout />}>
              <Route path="/dashboard/delivery_partner" element={<PartnerDashboard />} />
              <Route path="/partner/orders" element={<OrderList />} />
              <Route path="/partner/profile" element={<PartnerProfile />} />
              <Route path="/partner/transactions" element={<UserTransactions />} />
              <Route
                path="/partner/notifications"
                element={<NotificationList />}
              />
            </Route>
          </Route>

          {/* <Route path="/" element={<WebLayout />}>
           
          </Route> */}

          <Route path="*" element={<NotFoundPage />} />
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* <Route path="/register" element={<UserRegister />} /> */}
          <Route path="/vendor/onboarding" element={<VendorOnboardingForm />} />
          <Route path="/partner/onboarding" element={<PartnerOnboarding />} />
          {/* <Route path="/thank-you" element={<ThankYouPage />} /> */}
          {/* <Route path="/register" element={<Register />} /> */}
          {/* Web layout */}

          <Route element={<WebLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<SignIn />} />
            <Route path="/register" element={<Register />} />
            <Route path="/products" element={<ProductListing />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/product/:productId" element={<Product />} />
            <Route path="/thank-you/:id" element={<OrderSuccessPage />} />
            <Route path="/order-tracking" element={<OrderTracking />} />
            <Route path="/profile" element={<UserProfilePage />} />
            <Route path="/blogs" element={<BlogsPage/>} />
            <Route path="/about-us" element={<About/>} />
            <Route path="/contact" element={<Contact/>} />
            <Route path="/faq" element={<FAQ/>} />
            <Route path="/blogs/:id" element={<BlogPage />} />
          </Route>
        </Routes>
      </ScrollToTop>
    </Router>
  );
}

export default App;

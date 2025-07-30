import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Popover,
} from "@headlessui/react";
import {
  Bars3Icon,
  MagnifyingGlassIcon,
  ShoppingBagIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchUserCart,
  updateCart,
  removeItemFromCart,
} from "../../redux/cartSlice";
import { getUserById } from "../../redux/usersSlice";
import { LucideUser } from "lucide-react";
import Logo from "../../components/Logo";
export default function Navigation() {
  const [open, setOpen] = useState(false);
  const { auth } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.users);
  const { cart, message, loading } = useSelector((state) => state.cart);
  const [viewSearch, setViewSearch] = useState(false);
  const [reload, setReload] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };
  useEffect(() => {
    if (auth?.user_id) {
      dispatch(fetchUserCart(auth?.user_id));
      dispatch(getUserById(auth?.user_id));
      setReload(true);
    }
  }, [auth, reload, message]);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

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

  return (
    <div className="bg-white">
      {/* Mobile menu */}
      <Dialog open={open} onClose={setOpen} className="relative z-40 lg:hidden">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-black/25 transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
        />

        <div className="fixed inset-0 z-40 flex">
          <DialogPanel
            transition
            className="relative flex w-full max-w-xs transform flex-col overflow-y-auto bg-white pb-12 shadow-xl transition duration-300 ease-in-out data-[closed]:-translate-x-full"
          >
            <div className="flex px-4 pb-2 pt-5">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="relative -m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400"
              >
                <span className="absolute -inset-0.5" />
                <span className="sr-only">Close menu</span>
                <XMarkIcon aria-hidden="true" className="size-6" />
              </button>
            </div>
            <div className="border-t border-gray-200 px-4">
              <Link to="/" className="-m-2 flex items-center p-2">
                <Logo />
              </Link>
            </div>
            <div className="space-y-6 border-t border-gray-200 px-4 py-6">
              <div className="flow-root">
                {!auth?.user_id ? (
                  <div className="flex justify-center items-center space-x-4">
                    <Link
                      to="/login"
                      className="text-sm font-medium text-gray-700 hover:text-gray-900"
                    >
                      Sign in
                    </Link>
                    <span aria-hidden="true" className="h-6 w-px bg-gray-300" />
                    <Link
                      to="/register"
                      className="text-sm font-medium text-gray-700 hover:text-gray-900"
                    >
                      Create account
                    </Link>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <Link
                      to={
                        auth.user_type === "customer"
                          ? "/profile"
                          : `/dashboard/${auth.user_type}`
                      }
                      className="flex items-center gap-2 text-sm capitalize bg-secondary px-3 py-1 rounded-full font-medium text-white shadow hover:bg-secondary-dark"
                    >
                      <LucideUser className="h-5 w-5" />
                      {user?.username}
                    </Link>
                    <span aria-hidden="true" className="h-6 w-px bg-gray-300" />
                    <button
                      onClick={handleLogout}
                      className="text-sm font-medium text-red-600 hover:text-red-800 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </DialogPanel>
        </div>
      </Dialog>

      <header className="relative bg-white">
        <p className="flex h-10 items-center justify-center bg-[#f8f8fb] px-4 text-sm font-medium text-secondary sm:px-6 lg:px-8">
          Get free delivery on orders over $100
        </p>

        <nav aria-label="Top" className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border-b border-gray-200">
            <div className="flex h-16 justify-between items-center">
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="relative rounded-md bg-white p-2 text-gray-400 lg:hidden"
              >
                <span className="absolute -inset-0.5" />
                <span className="sr-only">Open menu</span>
                <Bars3Icon aria-hidden="true" className="size-6" />
              </button>

              {/* Logo */}
              {!viewSearch &&
              <div className="ml-4 flex lg:ml-0">
                <Link to="/">
                  <Logo />
                </Link>
              </div>}

              {/* Flyout menus */}

              <div
                className={`flex-1 ${
                  viewSearch ? "" : "hidden"
                } lg:block ml-6 max-w-md `}
              >
                <form onSubmit={handleSearch} className="relative m-auto">
                  <label htmlFor="search" className="sr-only">
                    Search
                  </label>
                  <input
                    id="search"
                    name="search"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="block w-full px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-md  focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                  />
                  <button
                    type="submit"
                    className="absolute inset-y-0 right-0 px-4 py-2 text-gray-500 hover:text-gray-600"
                  >
                    <MagnifyingGlassIcon className="h-5 w-5" />
                  </button>
                </form>
              </div>

              <div className=" flex items-center">
                <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-6">
                  {!auth?.user_id ? (
                    <>
                      <Link
                        to="/login"
                        className="text-sm font-medium text-gray-700 hover:text-gray-900"
                      >
                        Sign in
                      </Link>
                      <span
                        aria-hidden="true"
                        className="h-6 w-px bg-gray-300"
                      />
                      <Link
                        to="/register"
                        className="text-sm font-medium text-gray-700 hover:text-gray-900"
                      >
                        Create account
                      </Link>
                    </>
                  ) : (
                    <div className="flex items-center space-x-4">
                      <Link
                        to={
                          auth.user_type === "customer"
                            ? "/profile"
                            : `/dashboard/${auth.user_type}`
                        }
                        className="text-sm capitalize flex gap-1 items-center bg-secondary px-3 py-1 rounded-full font-medium text-white"
                      >
                        <LucideUser className="h-5 w-5" />
                        {auth?.username}
                      </Link>
                      <span
                        aria-hidden="true"
                        className="h-6 w-px bg-gray-300"
                      />
                      <button
                        onClick={handleLogout}
                        className="text-sm font-medium text-red-600 hover:text-red-800"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>

                <div className="hidden lg:ml-8 lg:flex">
                  <Link
                    to="/"
                    className="flex items-center text-gray-700 hover:text-gray-800"
                  >
                    <img
                      alt=""
                      src="https://tailwindui.com/plus/img/flags/flag-canada.svg"
                      className="block h-auto w-5 shrink-0"
                    />
                    <span className="ml-3 block text-sm font-medium">CAD</span>
                    <span className="sr-only">, change currency</span>
                  </Link>
                </div>

                {/* Search */}
                <div className="flex lg:ml-6">
                  <Link
                    to="/"
                    className="p-2 text-gray-400 hover:text-gray-500"
                  >
                    <span className="sr-only">Search</span>
                    <MagnifyingGlassIcon
                      aria-hidden="true"
                      className="size-6"
                      onClick={() => setViewSearch(!viewSearch)}
                    />
                  </Link>
                </div>

                {/* cart */}
                <div className="ml-4 flow-root lg:ml-6">
                  <Popover className="relative">
                    <Popover.Button className="group -m-2 flex items-center p-2">
                      {/* Shopping Bag Icon */}
                      <ShoppingBagIcon
                        aria-hidden="true"
                        className="size-6 shrink-0 text-gray-400 group-hover:text-gray-500 transition-transform duration-300 transform group-hover:scale-110"
                      />
                      {/* Cart Item Count in the corner of the bag */}
                      {cart?.items?.length > 0 && (
                        <span className="absolute top-0 left-3 inline-flex items-center justify-center w-5 h-5 text-xs font-semibold text-white bg-red-500 rounded-full">
                          {cart.items.length}
                        </span>
                      )}
                    </Popover.Button>
                    <Popover.Panel className="absolute inset-x-0 top-16 mt-px bg-white pb-6 shadow-lg sm:px-2 left-auto right-0 top-full border border-gray-300 -mr-1.5 lg:mt-3 w-80 lg:rounded-lg lg:ring-1 lg:ring-black/5 z-50">
                      <h2 className="sr-only text-red-400">Shopping Cart</h2>

                      {cart?.items?.length > 0 ? (
                        <div className="mx-auto max-w-2xl px-4">
                          {/* Cart Item List */}
                          <ul role="list" className="divide-y divide-gray-200">
                            {cart?.items?.map((item) => {
                              const images =
                                typeof item.images === "string"
                                  ? JSON.parse(item.images)
                                  : item.images;

                              return (
                                <li
                                  key={item.product_id}
                                  className="flex items-center py-6"
                                >
                                  <img
                                    alt={item.product_name}
                                    src={images?.featured_image} // Replace with actual image URL
                                    className="size-16 flex-none rounded-md border border-gray-200"
                                  />
                                  <div className="ml-4 flex-auto">
                                    <h3 className="font-medium text-gray-900">
                                      <Link to={`/product/${item.product_id}`}>
                                        {" "}
                                        {item.product_name}{" "}
                                      </Link>
                                    </h3>
                                    <p className="text-gray-500">
                                      {item.product_color}
                                    </p>
                                    <p className="text-gray-500 border flex justify-around">
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleQuantity(
                                            item.cart_item_id,
                                            "DECREMENT"
                                          )
                                        }
                                      >
                                        -
                                      </button>{" "}
                                      Qty: {item.quantity}{" "}
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleQuantity(
                                            item.cart_item_id,
                                            "INCREMENT"
                                          )
                                        }
                                      >
                                        +
                                      </button>
                                      | MRP.{item.price}
                                    </p>
                                    <p className="text-gray-500 ">
                                      <button
                                        onClick={() =>
                                          handleRemoveItem(item.cart_item_id)
                                        }
                                        type="button"
                                        className="text-xs text-red-600"
                                      >
                                        {loading ? "Loading..." : "Remove Item"}
                                      </button>
                                    </p>
                                  </div>
                                </li>
                              );
                            })}
                          </ul>

                          {/* Cart Totals */}
                          <div className="mt-4 border-t pt-4 ">
                            <div className="flex justify-between text-sm font-medium text-primary">
                              <span>Subtotal</span>
                              <span>₹{Number(subtotal).toFixed(2) || 0.0}</span>
                            </div>
                            <div className="flex justify-between text-sm font-medium text-primary">
                              <span>Tax</span>
                              <span>₹{Number(tax).toFixed(2) || 0.0}</span>
                            </div>
                            <div className="flex justify-between text-sm font-medium text-primary">
                              <span>Delivery Charges</span>
                              <span>
                                ₹{Number(deliveryCharges).toFixed(2) || 0.0}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm font-medium text-primary">
                              <span>Discount</span>
                              <span className="text-red-600">
                                -₹{Number(discount).toFixed(2) || 0.0}
                              </span>
                            </div>

                            {/* Original Total with line-through if discount is applied */}
                            {discount > 0 && (
                              <div className="flex justify-between text-sm font-medium text-primary">
                                <span>Total</span>
                                <span className="line-through">
                                  ₹{Number(total).toFixed(2) || 0.0}
                                </span>
                              </div>
                            )}

                            {/* Final Total Amount */}
                            <div
                              className={`flex justify-between text-sm font-medium ${
                                discount > 0 ? "text-secondary" : "text-primary"
                              }`}
                            >
                              <span>To be Paid</span>
                              <span>
                                ₹{Number(total - discount).toFixed(2) || 0.0}
                              </span>
                            </div>
                          </div>

                          {/* Checkout Button */}
                          <button
                            onClick={() => navigate("/checkout")}
                            className="w-full rounded-md border border-transparent bg-secondary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-secondary/50 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 focus:ring-offset-gray-50 mt-4"
                          >
                            Checkout
                          </button>

                          {/* Link to the full cart page */}
                          <p className="mt-6 text-center">
                            <Link
                              to={`/cart`}
                              className="text-sm font-medium text-secondary hover:text-secondary/60"
                            >
                              View Shopping Bag
                            </Link>
                          </p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center text-center p-6">
                          <i class="fi fi-ts-cart-shopping-fast text-secondary text-6xl"></i>
                          <p className="text-lg text-gray-600">
                            Your cart is empty.
                          </p>
                          <Link
                            to="/products"
                            className="mt-6 inline-block rounded-md bg-secondary px-4 py-2 text-white hover:bg-secondary/50"
                          >
                            Continue Shopping
                          </Link>
                        </div>
                      )}
                    </Popover.Panel>
                  </Popover>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>
    </div>
  );
}

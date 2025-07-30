import { useEffect, useState } from "react";
import { ChevronRightIcon } from "@heroicons/react/20/solid";
import { IoHome } from "react-icons/io5";
import { fetchVendorProfile } from "../../redux/vendorSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Menu,
  MenuButton,
  MenuItems,
  MenuItem,
  TransitionChild,
} from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { FaUserTie } from "react-icons/fa";
import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/20/solid";
import { Link, Outlet, useNavigate } from "react-router-dom";

import { BsShop } from "react-icons/bs";
import { AiOutlineProduct } from "react-icons/ai";
import { MdOutlineCategory } from "react-icons/md";
import { AiOutlineHome } from "react-icons/ai";
import { FaBell, FaChartPie } from "react-icons/fa";
import { BsBoxSeam } from "react-icons/bs";
import { PiUsersThree } from "react-icons/pi";
import { MdOutlineDeliveryDining , MdOutlinePayments,MdOutlineNotificationsActive} from "react-icons/md";

import {  } from "react-icons/md";
const navigation = [
  {
    name: "Shop",
    href: "/dashboard/vendor",
    icon: BsShop,
    initial: "DAS",
    current: true,
    bgColor: "bg-blue-100",
    textColor: "text-blue-800",
  },

  {
    name: "Products",
    href: "/vendor/products",
    icon: AiOutlineProduct,
    initial: "STU",
    current: false,
    bgColor: "bg-green-100",
    textColor: "text-green-800",
  },
  {
    name: "Orders",
    href: "/vendor/orders",
    icon: BsBoxSeam,
    initial: "STU",
    current: false,
    bgColor: "bg-yellow-100",
    textColor: "text-yellow-800",
  },
  {
    name: "Transactions",
    href: "/vendor/transactions",
    icon: MdOutlinePayments,
    initial: "STU",
    current: false,
    bgColor: "bg-yellow-100",
    textColor: "text-yellow-800",
  },

  {
    name: "Categories",
    href: "/vendor/categories",
    icon: MdOutlineCategory,
    initial: "STU",
    current: false,
    bgColor: "bg-purple-100",
    textColor: "text-purple-800",
  },
  // {
  //   name: "Partners",
  //   href: "/vendor/partners",
  //   icon: MdOutlineDeliveryDining,
  //   initial: "STU",
  //   current: false,
  //   bgColor: "bg-red-100",
  //   textColor: "text-red-800",
  // },

  {
    name: "Notify",
    href: "/vendor/notifications",
    icon: MdOutlineNotificationsActive,
    initial: "NOT",
    current: false,
    bgColor: "bg-indigo-100",
    textColor: "text-indigo-800",
  },

  {
    name: "Reports",
    href: "#",
    icon: FaChartPie,
    initial: "STU",
    current: false,
    bgColor: "bg-gray-100",
    textColor: "text-gray-800",
  },
];

const userNavigation = [
  { name: "Your profile", href: "/vendor/profile" },
  { name: "Sign out", href: "#" },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function VendorLayout() {
  const dispatch = useDispatch();
  const { auth } = useSelector((state) => state.auth);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Dashboard");
  const {vendor} = useSelector((state) => state.vendors);

  useEffect(() => {
    dispatch(fetchVendorProfile(auth.user_id));
  }, [auth]);
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };
  return (
    <>
      <div>
        <Dialog
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          className="relative z-50 lg:hidden"
        >
          <DialogBackdrop
            transition
            className="fixed inset-0 bg-black/80 transition-opacity duration-300 ease-linear"
          />

          <div className="fixed inset-0 flex">
            <DialogPanel
              transition
              className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out"
            >
              <TransitionChild>
                <div className="absolute left-full top-0 flex w-16 justify-center pt-5 duration-300 ease-in-out">
                  <button
                    type="button"
                    onClick={() => setSidebarOpen(false)}
                    className="-m-2.5 p-2.5"
                  >
                    <span className="sr-only">Close sidebar</span>
                    <XMarkIcon
                      aria-hidden="true"
                      className="h-6 w-6 text-white"
                    />
                  </button>
                </div>
              </TransitionChild>
              <div className="flex grow flex-col gap-y-5 overflow-y-auto px-6 pb-4 ring-1 bg-black ring-white/10">
                <div className="flex h-16 shrink-0 items-center border-b">
                  <img
                    alt="Your Company"
                    src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=500"
                    className="h-8 w-auto"
                  />
                </div>

                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => (
                    <li key={item.name}>
                      {!item.children ? (
                        <a
                          href={item.href}
                          className={classNames(
                            item.current ? 
                             "bg-gray-900 text-white border border-white/50"
                            : " text-gray-300 hover:bg-gray-900/50 ",
                          "group flex w-full items-center gap-5 rounded-md py-2 pl-7 pr-2 text-sm font-medium"
                          )}
                        >
                          <item.icon
                            aria-hidden="true"
                            className="h-6 w-6 shrink-0 text-gray-300"
                          />
                          {item.name}
                        </a>
                      ) : (
                        <Disclosure as="div">
                          <DisclosureButton
                            className={classNames(
                              item.current ? "bg-gray-50" : "hover:bg-gray-50",
                              "group flex w-full items-center gap-x-3 rounded-md p-2 text-left text-sm font-semibold leading-6 text-gray-700"
                            )}
                          >
                            {item.name}

                            <ChevronRightIcon
                              aria-hidden="true"
                              className="ml-auto h-5 w-5 shrink-0 text-gray-400 group-data-[open]:rotate-90 group-data-[open]:text-gray-500"
                            />
                          </DisclosureButton>
                          <DisclosurePanel as="ul" className="mt-1 px-2">
                            {item.children.map((subItem) => (
                              <li key={subItem.name}>
                                {/* 44px */}
                                <DisclosureButton
                                  as={Link}
                                  href={subItem.href}
                                  className={classNames(
                                    subItem.current
                                      ? "bg-gray-50"
                                      : "hover:bg-gray-50",
                                    "block rounded-md py-2 pl-9 pr-2 text-sm leading-6 text-gray-700"
                                  )}
                                >
                                  {subItem.name}
                                </DisclosureButton>
                              </li>
                            ))}
                          </DisclosurePanel>
                        </Disclosure>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </DialogPanel>
          </div>
        </Dialog>

        <div className="hidden lg:fixed lg:inset-y-0  bg-black lg:z-50 lg:flex lg:w-60 lg:flex-col ">
          <div className="flex grow flex-col gap-y-5 overflow-y-auto no-scrollbar border pb-4">
            <div className="flex h-16 shrink-0 items-center border-b ">
              <img
                alt="LMS"
                src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=500"
                className="h-8 w-auto"
              />
            </div>
            <nav
              aria-label="Sidebar"
              className="flex-1 space-y-1 bg-black px-2"
            >
              {navigation.map((item) =>
                !item.children ? (
                  <div key={item.name}>
                    <Link
                      to={item.href}
                      onClick={() => setActiveTab(item.name)}
                      className={classNames(
                        item.name === activeTab
                          ? "bg-gray-900 text-white border border-white/50"
                          : " text-gray-300 hover:bg-gray-900/50 ",
                        "group flex w-full items-center gap-5 rounded-md py-2 pl-7 pr-2 text-sm font-medium"
                      )}
                    >
                      {" "}
                      <item.icon
                        aria-hidden="true"
                        className={classNames(
                          item.name === activeTab
                            ? "text-white"
                            : "text-gray-300 ",
                          "h-6 w-6 shrink-0 focus:ring-gray-500"
                        )}
                      />
                      {item.name}
                    </Link>
                  </div>
                ) : (
                  <Disclosure key={item.name} as="div" className="space-y-1">
                    <DisclosureButton
                      className={classNames(
                        item.current
                          ? "bg-gray-100 text-gray-900"
                          : "bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                        "group flex w-full  items-center rounded-md py-2 pr-2 text-left text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gray-500"
                      )}
                    >
                      <svg
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                        className="mr-2 h-5 w-5 flex-shrink-0 transform text-gray-300 transition-colors duration-150 ease-in-out group-hover:text-gray-400 group-data-[open]:rotate-90 group-data-[open]:text-gray-400"
                      >
                        <path d="M6 6L14 10L6 14V6Z" fill="currentColor" />
                      </svg>
                      <div className="flex items-center gap-5">
                        <item.icon
                          aria-hidden="true"
                          className="h-6 w-6 shrink-0 text-gray-700"
                        />
                        {item.name}
                      </div>
                    </DisclosureButton>
                    <DisclosurePanel className="space-y-1">
                      {item.children.map((subItem) => (
                        <DisclosureButton
                          key={subItem.name}
                          as="a"
                          href={subItem.href}
                          className="group flex w-full items-center rounded-md py-2 pl-10 pr-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 focus:ring-gray-500"
                        >
                          {subItem.name}
                        </DisclosureButton>
                      ))}
                    </DisclosurePanel>
                  </Disclosure>
                )
              )}
            </nav>
          </div>
        </div>

        <div className="lg:pl-60">
          <header className="sticky inset-x-0 top-0 z-50 flex h-16 items-center border-b bg-white shadow-sm">
            <button
              type="button"
              className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
            <div className="flex flex-1 justify-between px-4">
              <div className="flex gap-x-4">
                <div className="relative hidden lg:flex lg:max-w-[30rem]">
                  <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <input
                    type="search"
                    className="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600"
                    placeholder="Search..."
                  />
                </div>
              </div>
              <div className="flex gap-x-4">
                <button type="button" className="p-2 text-gray-700">
                  <span className="sr-only">Notifications</span>
                  <FaBell className="h-6 w-6" aria-hidden="true" />
                </button>
                <Menu as="div" className="relative">
                  <MenuButton className="inline-flex items-center gap-x-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-semibold text-gray-700 hover:bg-gray-200">
                    {vendor?.vendor_name}
                    <ChevronDownIcon
                      className="-mr-1 h-5 w-5"
                      aria-hidden="true"
                    />
                  </MenuButton>
                  <MenuItems className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    {userNavigation.map((item) => {
                      return item.name === "Sign out" ? (
                        <MenuItem key={item.name}>
                          <button
                            onClick={handleLogout}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            {item.name}
                          </button>
                        </MenuItem>
                      ) : (
                        <MenuItem key={item.name}>
                          <a
                            href={item.href}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            {item.name}
                          </a>
                        </MenuItem>
                      );
                    })}
                  </MenuItems>
                </Menu>
              </div>
            </div>
          </header>

          <main className="p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
}

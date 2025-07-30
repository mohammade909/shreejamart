import React, { useEffect, useState } from "react";
import OfferSliders from "../components/OfferSliders";
import Categories from "../components/Categories";
import ProductSection from "../components/ProductSection";
import axios from "axios";
import { BASEURL } from "../../baseurl";
import { Dialog, Transition } from "@headlessui/react";
import toast from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import FeaturedSection from "../components/FeaturedSection";
import HeroSlider from "../components/HeroSlider";
import CategorySection from "../components/CategorySection";
import BlogSection from "../components/BlogSection";
import { registerUser } from "../../redux/authSlice";
import CountdownTimer from "../components/CountDown";
import VendorSection from "../components/VendorSection";

export default function Home() {
  const { auth } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [userLocation, setUserLocation] = useState(null);
  const [address, setAddress] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    const fetchLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;

            // Save coordinates to state
            setUserLocation({ latitude, longitude });

            // Fetch full address using a geocoding API
            try {
              const response = await fetch(
                `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=YOUR_GOOGLE_MAPS_API_KEY`
              );

              if (response.ok) {
                const data = await response.json();
                if (data.results && data.results.length > 0) {
                  const fullAddress = data.results[0].formatted_address;
                  setAddress(fullAddress); // Save the address to state
                  console.log("Full Address:", fullAddress);
                } else {
                  console.error("No address found for the given coordinates.");
                }
              } else {
                console.error(
                  "Failed to fetch the address:",
                  response.statusText
                );
              }
            } catch (error) {
              console.error("Error fetching address:", error.message);
            }
          },
          (error) => {
            console.error("Error getting location:", error.message);
          }
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
      }
    };

    fetchLocation();

    // Show modal after 10 seconds
    const timer = setTimeout(() => {
      setShowModal(true);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  const sendOTP = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:8000/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success("OTP sent successfully");
        setIsOtpSent(true);
        setLoading(false);
      } else {

        toast.error("Failed to send OTP");
        setLoading(false);
      }
    } catch (err) {
      toast.error("Error sending OTP");
      setLoading(false);

    }
  };

  const verifyOTP = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:8000/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber, otp }),
      });

      const data = await response.json();
      toast.success(data.message);
      setLoading(false);

      if (data.success) {
        // Handle successful verification
        setIsOtpSent(false);
        setOtp("");
        setLoading(false);
      }
    } catch (err) {
      toast.error("Error verifying OTP");
      setLoading(false);
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    await sendOTP();
  };

  // When "Verify OTP" is clicked
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const verified = await verifyOTP();

    if (verified) {
      registerVerifiedUser();
    }
  };

  // Register user after OTP verification
  const registerVerifiedUser = async () => {
    try {
      const response = await dispatch(
        registerUser({ phone_number: phoneNumber, one_time_password: otp })
      ).unwrap();

      if (response.status === 200 || response.success) {
        toast.success("Account created successfully");
        setShowModal(false);
      } else {
        toast.error(response.message || "Registration failed");
      }
    } catch (error) {
      toast.error(error.error || "Something went wrong during registration");
      console.error(error);
    }
  };
  return (
    <div>
      <OfferSliders />
      <Categories />
      {/* <CategorySection/> */}
      <CountdownTimer />
      <VendorSection />
      {/* <ProductSection from={0} to={5} /> */}
      <HeroSlider />
      <ProductSection from={6} to={12} />
      <FeaturedSection />
      <BlogSection />
      {showModal && !auth?.user_id && (
        <Transition show={showModal} as={React.Fragment}>
          <Dialog onClose={() => setShowModal(false)} className="relative z-10">
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-75" />
            </Transition.Child>

            <div className="fixed inset-0 z-10 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <Transition.Child
                  as={React.Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  enterTo="opacity-100 translate-y-0 sm:scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                  leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                  <Dialog.Panel className="relative transform overflow-hidden rounded-md bg-white p-6 text-left shadow-xl sm:w-full sm:max-w-2xl">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="absolute top-4 right-4 text-red-400 hover:text-gray-600 focus:outline-none"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                      <div className="flex justify-center">
                        <img
                          src="./newsletter.png"
                          alt="Newsletter Illustration"
                          className="w-full max-w-sm rounded-lg"
                        />
                      </div>

                      <div>
                        <Dialog.Title
                          as="h2"
                          className="text-xl font-semibold text-primary font-Poppins mb-4 text-center"
                        >
                          Verify Your Number
                        </Dialog.Title>
                        <p className="text-sm text-gray-500 mb-6 text-center">
                          Join our community of smart shoppers and get exclusive
                          benefits!
                        </p>
                        <input
                          type="tel"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          placeholder="Enter your mobile number"
                          className="w-full text-sm p-3 border rounded-md mb-4 focus:outline-secondary"
                        />
                        {!isOtpSent ? (
                          <button
                            onClick={handleSendOtp}
                            disabled={loading}
                            className="w-full py-2 px-4 bg-secondary text-white font-semibold rounded-md hover:bg-secondary/80 focus:outline-none"
                          >
                            {loading ? 'Sending...':'Send Otp'}
                          </button>
                        ) : (
                          <>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Enter OTP
                              </label>
                              <input
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                placeholder="Enter 6-digit OTP"
                                maxLength={6}
                              />
                            </div>
                            <button
                              onClick={handleVerifyOtp}
                              disabled={loading}
                              className="w-full py-2 px-4 bg-secondary text-white font-semibold rounded-md hover:bg-secondary/80 focus:outline-none"
                            >
                              {loading? 'Verifying...':'Verify Otp'}                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      )}
    </div>
  );
}

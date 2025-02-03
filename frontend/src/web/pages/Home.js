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
export default function Home() {
  const { auth } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [userLocation, setUserLocation] = useState(null);
  const [address, setAddress] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");

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


  const handlePhoneNumberSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await dispatch(registerUser({ password, phone_number: phoneNumber })).unwrap();
  
      // Check for success condition (adjust based on your API response structure)
      if (response.status === 200 || response.success) {
        toast.success('Account created successfully');
      } else {
        toast.error(response.message || 'Registration failed');
      }
    } catch (error) {
      
      // Handles any errors thrown during registration
      toast.error(error.error || 'Something went wrong during registration');
      console.error(error);
    } finally {
       // Ensure form is always reset after processing
    }
  };
  


  return (
    <div>
      <OfferSliders />
      <Categories />
      {/* <CategorySection/> */}
      <CountdownTimer />
      <ProductSection from={0} to={5} />
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
                          src="https://grabit-next.tigerheck.com/assets/img/bg/newsletter.png"
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

                        {true ? (
                          <>
                            <input
                              type="tel"
                              value={phoneNumber}
                              onChange={(e) => setPhoneNumber(e.target.value)}
                              placeholder="Enter your mobile number"
                              className="w-full text-sm p-3 border rounded-md mb-4 focus:outline-secondary"
                            />
                            <input
                              type="text"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              placeholder="*********"
                              className="w-full text-sm p-3 border rounded-md mb-4 focus:outline-secondary"
                            />

                            <button
                              type="button"
                              onClick={handlePhoneNumberSubmit}
                              className="w-full py-2 px-4 bg-secondary text-white font-semibold rounded-md hover:bg-secondary/80 focus:outline-none"
                            >
                              Register
                            </button>
                          </>
                        ) : (
                          <>
                            <input
                              type="text"
                              placeholder="Enter OTP"
                              // value={otp}
                              // onChange={(e) => setOtp(e.target.value)}
                              className="w-full text-lg p-3 border rounded-md mb-4 focus:outline-indigo-500"
                            />
                            <button
                              // onClick={handleOtpVerify}
                              className="w-full py-2 px-4 bg-green-600 text-white font-semibold rounded-md hover:bg-green-500 focus:outline-none"
                            >
                              Verify OTP
                            </button>
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

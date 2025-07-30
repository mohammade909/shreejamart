import React from "react";
import {
  IoLogoTwitter,
  IoLogoFacebook,
  IoLogoInstagram,
  IoLogoLinkedin,
} from "react-icons/io";
import { FaLinkedinIn, FaFacebookF } from "react-icons/fa";
import { Link } from "react-router-dom";
import Logo from '../../components/Logo'
const Footer = () => {
  return (
    <footer className=" pt-8 border-t">
      <div className="container mx-auto px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-8">
          {/* Brand Section (First Column) */}
          <div className="md:col-span-3">
            <div className="flex items-center mb-4">
              {/* <span className="text-emerald-500 text-3xl">🛍</span>
              <span className="text-gray-700 text-2xl font-semibold ml-2">
                Grabit
              </span> */}
              <Logo/>
            </div>
            <p className="text-gray-600 mb-4 text-[14px]">
              Grabit is the biggest market of grocery products. Get your daily
              needs from our store.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <img
                src="./img/app/android.png"
                alt="Get it on Google Play"
                className="h-10 rounded-md"
              />
              <img
                src="./img/app/apple.png"
                alt="Download on App Store"
                className="h-10 rounded-md"
              />
            </div>
          </div>

          {/* Category Links (Middle Column) */}
          <div className="md:col-span-2">
            <h3 className="text-gray-700 font-semibold mb-2 pb-3 border-b-2 ">
              Category
            </h3>
            <ul className="space-y-2 pt-2">
              {[
                "Dried Fruit",
                "Cookies",
                "Foods",
                "Fresh Fruit",
                "Tuber Root",
                "Vegetables",
              ].map((item) => (
                <li key={item}>
                  <a href="#" className="text-gray-600 text-[14px] hover:text-secondary">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links (Middle Column) */}
          <div className="md:col-span-2">
            <h3 className="text-gray-700 font-semibold mb-2 pb-3 border-b-2 ">
              Company
            </h3>
            <ul className="space-y-2 pt-2">
              {[
                { name: "About us", link: "/about-us" },
                { name: "Vendor Register", link: "/vendor/onboarding" },
                { name: "Delivery Partner Register", link: "/partner/onboarding" },
                { name: "Legal Notice", link: "/legal-notice" },
                { name: "Terms & conditions", link: "/terms-and-conditions" },
                { name: "Secure payment", link: "/secure-payment" },
                { name: "Contact us", link: "/contact" },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.link}
                    className="text-gray-600 text-[14px] hover:text-secondary"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account Links (Middle Column) */}
          <div className="md:col-span-2">
            <h3 className="text-gray-700 font-semibold mb-2 pb-3 border-b-2 ">
              Account
            </h3>
            <ul className="space-y-2 pt-2">
              {[
                { name: "Sign In", link: "/sign-in" },
                { name: "View Cart", link: "/view-cart" },
                { name: "Return Policy", link: "/return-policy" },
                { name: "Become a Vendor", link: "/become-a-vendor" },
                { name: "Affiliate Program", link: "/affiliate-program" },
                { name: "Payments", link: "/payments" },
              ].map((item) => (
                <li key={item}>
                  <Link
                    to={item.link}
                    className="text-gray-600 text-[14px] hover:text-secondary"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information (Last Column) */}
          <div className="md:col-span-3">
            <h3 className="text-gray-700 font-semibold mb-2 pb-3 border-b-2 ">
              Contact
            </h3>
            <ul className="space-y-2 pt-2">
              <li className="flex items-start gap-x-2 text-secondary">
                <i class="fi fi-rr-marker text-[14px] "></i>
                <span className="text-gray-600 text-[14px]">
                  2548 Broaddus Maple Court, Madisonville KY 4783, USA.
                </span>
              </li>
              <li className="flex items-center gap-x-2 text-secondary ">
                <i class="fi fi-brands-whatsapp "></i>
                <span className="text-gray-600 text-[14px]">+00 9876543210</span>
              </li>
              <li className="flex items-center gap-x-2 text-secondary">
                <i class="fi fi-rr-envelope"></i>
                <span className="text-gray-600 text-[14px]">contact@shreejamart.com</span>
              </li>
            </ul>
            {/* Social Media Icons */}
            <div className="flex space-x-4 mt-6">
              <a
                href="https://www.facebook.com/profile.php?id=61573328654849"
                className="w-8 h-8 flex items-center justify-center rounded bg-primary/75 text-white hover:bg-emerald-500 transition-colors"
              >
                <FaFacebookF size={18} />
              </a>
              <a
                href="https://x.com/shreejamart"
                className="w-8 h-8 flex items-center justify-center rounded bg-primary/75 text-white hover:bg-emerald-500 transition-colors"
              >
                <IoLogoTwitter size={18} />
              </a>
              <a
                href="#"
                className="w-8 h-8 flex items-center justify-center rounded bg-primary/75 text-white hover:bg-emerald-500 transition-colors"
              >
                <FaLinkedinIn size={18} />
              </a>
              <a
                href="https://www.instagram.com/shreeja_mart/"
                className="w-8 h-8 flex items-center justify-center rounded bg-primary/75 text-white hover:bg-emerald-500 transition-colors"
              >
                <IoLogoInstagram size={18} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
      </div>
      <div className="border-t py-4 bg-base px-16">
        <div className="flex flex-col md:flex-row justify-between ">
          <p className="text-gray-600  md:mb-0 text-[14px]">
            {new Date().getFullYear()} Copyright ©{" "}
            <span className="text-secondary text-[14px]">Shreejamart.com</span> all rights
            reserved. Powered by{" "}
            <a
              href="https://cybersolvings.com"
              target="_blank"
              className="underline text-blue-500"
            >
              {" "}
              Cybersolvings.
            </a>
          </p>
          <div className="flex">
            <img
              src="./img/hero-bg/payment.png"
              alt={` payment`}
              className="h-6"
            />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

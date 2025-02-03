import React, { useState } from 'react';
// import { Mail, MapPin, Phone } from 'lucide-react';
import { IoIosMail } from "react-icons/io";
import { FaMapMarked } from "react-icons/fa";
import { FaPhoneAlt } from "react-icons/fa";

export const Contact = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:py-12 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Contact Information Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12">
          {/* Mail & Website Card */}
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-slate-600 rounded-lg flex items-center justify-center mb-4">
                <IoIosMail className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2 sm:mb-4">Mail & Website</h2>
              <a href="mailto:mail.example@gmail.com" className="text-sm sm:text-base text-gray-600 hover:text-gray-800 mb-2">
                mail.example@gmail.com
              </a>
              <a href="http://www.yourdomain.com" className="text-sm sm:text-base text-gray-600 hover:text-gray-800">
                www.yourdomain.com
              </a>
            </div>
          </div>

          {/* Contact Card */}
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-slate-600 rounded-lg flex items-center justify-center mb-4">
                <FaPhoneAlt className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2 sm:mb-4">Contact</h2>
              <p className="text-sm sm:text-base text-gray-600 mb-2">(+91)-9876XXXXX</p>
              <p className="text-sm sm:text-base text-gray-600">(+91)-987654XXXX</p>
            </div>
          </div>

          {/* Address Card */}
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-slate-600 rounded-lg flex items-center justify-center mb-4">
                <FaMapMarked className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2 sm:mb-4">Address</h2>
              <p className="text-sm sm:text-base text-gray-600 text-center">
                Ruami Mello Moraes Filho, 987 - Salvador - MA, 40352, Brazil.
              </p>
            </div>
          </div>
        </div>

        {/* Map and Form Container */}
        <div className="grid grid-cols-1 lg:grid-cols-2   bg-white">
          {/* Map */}
          <div className="1">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1000!2d-38.4849!3d-12.9422!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDU2JzMyLjAiUyAzOMKwMjgnNDkuMSJX!5e0!3m2!1sen!2sbr!4v1234567890"
              className="w-full h-64 sm:h-96 rounded-lg my-4"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          {/* Contact Form */}
          <div className=" p-1 ml-2 my-4 ">
            <form onSubmit={handleSubmit} className="space-y-2">
              <div>
                <input
                  type="text"
                  placeholder="Name"
                  id="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full border rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-base  p-3"
                />
              </div>

              <div>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="w-full border rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-base sm:text-lg p-3"
                />
              </div>

              <div>
                <input
                  type="tel"
                  id="phone"
                  placeholder="Phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full border rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-base sm:text-lg p-3"
                />
              </div>

              <div>
                <textarea
                  id="message"
                  rows={4}
                  placeholder="Message"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full border rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-base sm:text-lg p-3"
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto text-base sm:text-base p-2 bg-green-500 border border-transparent rounded-md shadow-sm font-medium text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
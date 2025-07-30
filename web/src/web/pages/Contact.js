import React, { useState } from 'react';
import { MapPin, Mail, Globe, Phone, Settings } from 'lucide-react';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Add form submission logic here
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 py-5 px-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="text-primary font-medium text-xl">Contact Us</div>
          <div className="flex items-center space-x-2">
            <div className="text-primary">
              <a href="/" className="hover:text-gray-800">Home</a>
              <span className="mx-2 text-secondary">›</span>
              <span className="text-secondary">Contact Us</span>
            </div>
            {/* <div className="bg-gray-200 p-2 rounded-md">
              <Settings className="text-primary w-5 h-5" />
            </div> */}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Page Title */}
          <div className="text-center mb-12">
            <h1 className="text-3xl font-semibold mb-3 text-primary">
              Get In <span className="text-secondary">Touch</span>
            </h1>
            <p className="text-primary max-w-xl mx-auto">
              Please select a topic below related to your inquiry. If 
              you don't find what you need, fill out our contact form.
            </p>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {/* Mail & Website Card */}
            <div className="bg-gray-50 p-8 rounded-lg text-center">
              <div className="bg-primary w-14 h-14 rounded-md flex items-center justify-center mx-auto mb-4">
                <Mail className="text-white w-6 h-6" />
              </div>
              <h3 className="text-primary text-xl font-medium mb-4">Mail & Website</h3>
              <div className="flex items-center justify-center mb-2 text-primary">
                <Mail className="w-4 h-4 mr-2" />
                <span>mail.example@gmail.com</span>
              </div>
              <div className="flex items-center justify-center text-primary">
                <Globe className="w-4 h-4 mr-2" />
                <span>www.yourdomain.com</span>
              </div>
            </div>

            {/* Contact Card */}
            <div className="bg-gray-50 p-8 rounded-lg text-center">
              <div className="bg-primary w-14 h-14 rounded-md flex items-center justify-center mx-auto mb-4">
                <Phone className="text-white w-6 h-6" />
              </div>
              <h3 className="text-primary text-xl font-medium mb-4">Contact</h3>
              <div className="flex items-center justify-center mb-2 text-primary">
                <Phone className="w-4 h-4 mr-2" />
                <span>(+91)-9876XXXXX</span>
              </div>
              <div className="flex items-center justify-center text-primary">
                <Phone className="w-4 h-4 mr-2" />
                <span>(+91)-987654XXXX</span>
              </div>
            </div>

            {/* Address Card */}
            <div className="bg-gray-50 p-8 rounded-lg text-center">
              <div className="bg-primary w-14 h-14 rounded-md flex items-center justify-center mx-auto mb-4">
                <MapPin className="text-white w-6 h-6" />
              </div>
              <h3 className="text-primary text-xl font-medium mb-4">Address</h3>
              <div className="flex items-center justify-center text-primary">
                <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                <span>Ruami Mello Moraes Filho, 987 - Salvador - MA, 40352, Brazil.</span>
              </div>
            </div>
          </div>

          {/* Map and Contact Form */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Map */}
            <div className="rounded border border-gray-200 h-96 bg-gray-100 flex items-center justify-center">
              <div className="text-center p-4">
                <p className="font-bold mb-2">Map Placeholder</p>
                <p className="text-gray-500 text-sm">12°56'32.0"S 38°28'49.1"W</p>
                <p className="text-gray-500 text-sm">Salvador, State of Bahia, Brazil</p>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Full Name"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-secondary"
                  />
                </div>
                <div className="mb-4">
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-secondary "
                  />
                </div>
                <div className="mb-4">
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-secondary "
                  />
                </div>
                <div className="mb-4">
                  <textarea
                    name="message"
                    placeholder="Message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded resize-none focus:outline-none focus:ring-2 focus:ring-secondary"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="bg-secondary text-white px-6 py-3 rounded hover:bg-secondary/60 transition-colors"
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ContactPage;
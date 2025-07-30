import React, { useState, useEffect } from 'react';
import { CiDeliveryTruck } from "react-icons/ci";
import { IoTimeOutline } from "react-icons/io5";
import { LuBadgePercent } from "react-icons/lu";
import { LiaDonateSolid } from "react-icons/lia";
import { FaChevronRight, FaChevronLeft, FaFacebook, FaTwitter, FaLinkedin } from "react-icons/fa";


const ServiceCard = ({ icon, title, description }) => (
  <div className="p-6 bg-white rounded-lg shadow-md border border-gray-200 flex flex-col items-center text-center">
    <div className="w-12 h-12 text-emerald-500 mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-semibold text-gray-700 mb-2">{title}</h3>
    <p className="text-gray-600 text-sm md:text-base">{description}</p>
  </div>
);

export const About = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const testimonials = [
    {
      name: "Mariya Klinton",
      role: "CEO",
      image: "https://img.freepik.com/free-photo/young-businesswoman-holding-digital-tablet-mobile-phone_329181-11723.jpg",
      text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy typesetting industry.",
      rating: 5
    },
    {
      name: "John Smith",
      role: "Marketing Director",
      image: "https://img.freepik.com/free-photo/young-businesswoman-holding-digital-tablet-mobile-phone_329181-11723.jpg",
      text: "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it.",
      rating: 5
    },
    {
      name: "Sarah Johnson",
      role: "Product Manager",
      image: "https://img.freepik.com/free-photo/young-businesswoman-holding-digital-tablet-mobile-phone_329181-11723.jpg",
      text: "It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
      rating: 5
    },
    {
      name: "David Chen",
      role: "Lead Designer",
      image: "https://img.freepik.com/free-photo/young-businesswoman-holding-digital-tablet-mobile-phone_329181-11723.jpg",
      text: "Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text.",
      rating: 5
    }
  ];

  // Auto-play functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % testimonials.length);
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, [testimonials.length]);

  const services = [
    {
      icon: <CiDeliveryTruck size={48} strokeWidth={1.5} />,
      title: "Free Shipping",
      description: "Free shipping on all US orders or orders above $200",
    },
    {
      icon: <IoTimeOutline size={48} strokeWidth={1.5} />,
      title: "24X7 Support",
      description: "Contact us 24 hours a day, 7 days a week",
    },
    {
      icon: <LuBadgePercent size={48} strokeWidth={1.5} />,
      title: "30 Days Return",
      description: "Simply return it within 30 days for an exchange",
    },
    {
      icon: <LiaDonateSolid size={48} strokeWidth={1.5} />,
      title: "Payment Secure",
      description: "Your payments are always safe and secure",
    },
  ];
  // <bottomslider>
  const stats = [
    {
      number: "65K+",
      title: "Vendors",
      description: "Contrary to popular belief, Lorem is not simply random text."
    },
    {
      number: "$45B+",
      title: "Earnings",
      description: "Contrary to popular belief, Lorem is not simply random text."
    },
    {
      number: "25M+",
      title: "Sold",
      description: "Contrary to popular belief, Lorem is not simply random text."
    },
    {
      number: "70K+",
      title: "Products",
      description: "Contrary to popular belief, Lorem is not simply random text."
    }
  ];
  const [currentIndex, setCurrentIndex] = useState(0);

  const teamMembers = [
    {
      name: "Amelia Martin",
      role: "Leader",
      image: "https://img.freepik.com/premium-photo/indian-business-man-using-cell-phone-having-conversation-typing-sms-presenting_466689-45716.jpg?uid=R180299756&ga=GA1.1.78848224.1733308472&semt=ais_hybrid"
    },
    {
      name: "Emma Welson",
      role: "Manager",
      image: "https://img.freepik.com/premium-photo/indian-business-man-using-cell-phone-having-conversation-typing-sms-presenting_466689-45716.jpg?uid=R180299756&ga=GA1.1.78848224.1733308472&semt=ais_hybrid"
    },
    {
      name: "Olivia Smith",
      role: "Founder",
      image: "https://img.freepik.com/premium-photo/indian-business-man-using-cell-phone-having-conversation-typing-sms-presenting_466689-45716.jpg?uid=R180299756&ga=GA1.1.78848224.1733308472&semt=ais_hybrid"
    },
    {
      name: "William Dalin",
      role: "Co-Founder",
      image: "https://img.freepik.com/premium-photo/indian-business-man-using-cell-phone-having-conversation-typing-sms-presenting_466689-45716.jpg?uid=R180299756&ga=GA1.1.78848224.1733308472&semt=ais_hybrid"
    },
    {
      name: "Emma Welson",
      role: "Manager",
      image: "https://img.freepik.com/premium-photo/indian-business-man-using-cell-phone-having-conversation-typing-sms-presenting_466689-45716.jpg?uid=R180299756&ga=GA1.1.78848224.1733308472&semt=ais_hybrid"
    },
    {
      name: "Emma Welson",
      role: "Manager",
      image: "https://img.freepik.com/premium-photo/indian-business-man-using-cell-phone-having-conversation-typing-sms-presenting_466689-45716.jpg?uid=R180299756&ga=GA1.1.78848224.1733308472&semt=ais_hybrid"
    },
    {
      name: "Emma Welson",
      role: "Manager",
      image: "https://img.freepik.com/premium-photo/indian-business-man-using-cell-phone-having-conversation-typing-sms-presenting_466689-45716.jpg?uid=R180299756&ga=GA1.1.78848224.1733308472&semt=ais_hybrid"
    },
    {
      name: "Emma Welson",
      role: "Manager",
      image: "https://img.freepik.com/premium-photo/indian-business-man-using-cell-phone-having-conversation-typing-sms-presenting_466689-45716.jpg?uid=R180299756&ga=GA1.1.78848224.1733308472&semt=ais_hybrid"
    },
    {
      name: "Emma Welson",
      role: "Manager",
      image: "https://img.freepik.com/premium-photo/indian-business-man-using-cell-phone-having-conversation-typing-sms-presenting_466689-45716.jpg?uid=R180299756&ga=GA1.1.78848224.1733308472&semt=ais_hybrid"
    },
  ];

  // Handle the automatic swipe
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % teamMembers.length);
    }, 1500); // Change slide every 3 seconds

    return () => clearInterval(interval); // Clear interval on component unmount
  }, [teamMembers.length]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % teamMembers.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + teamMembers.length) % teamMembers.length);
  };


  return (
    <>
      <div className="container  mx-auto px-4 sm:px-6 lg:px-8 py-12">

        <section className=" mx-auto  py-16">


          {/* Image Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2  gap-6">
            <div>
              {/* Image Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                <div className="md:col-span-1">
                  <img
                    src="https://img.freepik.com/premium-photo/scenic-view-field-against-sky-sunset_1048944-30224520.jpg?uid=R180299756&ga=GA1.1.78848224.1733308472&semt=ais_hybrid"
                    alt="Store interior view"
                    className="w-full h-full object-cover rounded-lg shadow-md"
                  />
                </div>
                <div className="grid grid-cols-1 gap-6 md:gap-4">
                  <div>
                    <img
                      src="https://img.freepik.com/premium-photo/scenic-view-field-against-sky-sunset_1048944-30224520.jpg?uid=R180299756&ga=GA1.1.78848224.1733308472&semt=ais_hybrid"
                      alt="Farmer with tomatoes"
                      className="w-full h-[270px] object-cover rounded-lg shadow-md"
                    />
                  </div>
                  <div>
                    <img
                      src="https://img.freepik.com/premium-photo/scenic-view-field-against-sky-sunset_1048944-30224520.jpg?uid=R180299756&ga=GA1.1.78848224.1733308472&semt=ais_hybrid"
                      alt="Greenhouse interior"
                      className="w-full h-[270px] object-cover rounded-lg shadow-md"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              {/* Content Paragraphs */}
              <div className="space-y-4 text-gray-600 mb-12 mt-4  sm:px-6 lg:px-2">
                <div className="flex flex-col sm:flex-row items-baseline gap-2 mb-4">
                  <h1 className="text-xl  sm:text-2xl font-bold text-gray-700">Who We 
                  <span className="text-xl sm:text-2xl font-bold text-emerald-500 ml-2">Are?</span>
                  </h1>
                  
                </div>
                <h2 className="text-lg sm:text-lg text-2xl lg:text-2xl text-gray-600 sm:font-medium uppercase mb-8 max-w-full sm:max-w-3xl">
                  We're here to serve only the best products for you, enriching your homes with the best essentials.
                </h2>
                <p className="leading-relaxed text-base sm:text-lg lg:text-lg">
                  Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem
                  Ipsum has been the industry standard dummy text ever since the 1500s, when an
                  unknown printer took a galley of type and scrambled it to make a type specimen book.
                  It has survived not only five centuries, but also the leap into electronic typesetting,
                  remaining essentially unchanged.
                </p>
                <p className="leading-relaxed text-base sm:text-lg lg:text-lg">
                  Lorem Ipsum has survived not only five centuries, but also the leap into electronic
                  typesetting, remaining essentially unchanged.
                </p>
                <p className="leading-relaxed text-base sm:text-lg lg:text-lg">
                  Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem
                  Ipsum has been the industry standard dummy text ever since the 1500s, when an
                  unknown printer took a galley of type and scrambled it to make a type specimen book.
                </p>
              </div>
            </div>
          </div>

        </section>
        {/* Other sections */}
        <section className="">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Our <span className="text-emerald-500">Services</span>
            </h2>
            <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
              Customer service should not be a department. It should be the entire company.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {services.map((service, index) => (
              <ServiceCard key={index} {...service} />
            ))}
          </div>
        </section>
        {/* Testimonials */}
        <div className=" mx-auto  py-16">
          <div className="relative bg-gray-50 rounded-2xl p-8 md:p-12">
            <div className="relative overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {testimonials.map((testimonial, index) => (
                  <div
                    key={index}
                    className="w-full flex-shrink-0 px-8 md:px-16"
                  >
                    <div className="flex flex-col items-center text-center">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-24 h-[98px] rounded-full mb-6"
                      />
                      <p className="text-gray-600 mb-6 text-lg max-w-2xl">
                        {testimonial.text}
                      </p>
                      <h3 className="text-emerald-500 text-2xl font-semibold mb-1">
                        {testimonial.name}
                      </h3>
                      <p className=" text-xl font-normal text-gray-500 mb-4">{testimonial.role}</p>
                      <div className="flex gap-1">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <span key={i} className=" text-2xl text-orange-400">★</span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="container mx-auto  py-16">
          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 ">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white p-6 rounded-lg border shadow-sm text-center">
                <h2 className="text-4xl font-bold text-gray-700 mb-4">{stat.number}</h2>
                <h3 className="text-xl font-semibold text-gray-600 mb-3">{stat.title}</h3>
                <p className="text-gray-500 text-sm">{stat.description}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="py-16 mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
          Our <span className="text-emerald-500">Team</span>
        </h2>
        <p className="text-gray-600">Meet our expert team members.</p>
      </div>

      <div className="relative">
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(-${currentIndex * 100 / teamMembers.length}%)`,
            }}
          >
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="w-full sm:w-1/2 md:w-1/3 lg:w-1/5 flex-shrink-0 px-4 relative group"
              >
                <div className=" rounded-2xl overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full aspect-square object-cover"
                  />
                  <div className="p-6 text-center">
                    <h3 className="text-xl font-semibold text-gray-800 mb-1">
                      {member.name}
                    </h3>
                    <p className="text-gray-600">{member.role}</p>
                  </div>

                  {/* application Media Icons on Hover */}
                  <div className="absolute top-[240px] left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex space-x-1 mb-1">
                      <a href="#" className="text-gray-100 bg-gray-700 rounded p-1 mt-1">
                        <FaFacebook className="w-6 h-6" />
                      </a>
                      <a href="#" className="text-gray-200 mt-1 bg-gray-700 rounded p-1">
                        <FaTwitter className="w-6 h-6" />
                      </a>
                      <a href="#" className="text-gray-200 mt-1 bg-gray-700 rounded p-1">
                        <FaLinkedin className="w-6 h-6" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      
      
      </div>
    </div>

      </div>
    </>
  );
};

import React from "react";
import { PiTruckLight } from "react-icons/pi";

const ServiceSection = () => {
  const features = [
    {
      icon: <i className="fi fi-ts-truck-moving text-blue-500 text-5xl"></i>,
      title: "Free Shipping",
      description: "Free shipping on all US orders or orders above $200",
      bgColor: "bg-blue-50",
      borderColor: "bg-blue-500",
      textColor: "text-indigo-500"
      
    },
    {
      icon: <i className="fi fi-ts-hand-holding-seeding text-green-500 text-5xl"></i>,
      title: "24X7 Support",
      description: "Contact us 24 hours a day, 7 days a week",
      bgColor: "bg-green-50",
      borderColor: "bg-green-500",
       textColor: "text-green-500"
    },
    {
      icon: <i className="fi fi-ts-badge-percent text-purple-500 text-5xl"></i>,
      title: "30 Days Return",
      description: "Simply return it within 30 days for an exchange",
      bgColor: "bg-purple-50",
      borderColor: "bg-purple-500",
       textColor: "text-purple-500"
     
    },
    {
      icon: <i className="fi fi-ts-donate text-red-500 text-5xl"></i>,
      title: "Payment Secure",
      description: "Safe and secure payment methods for your peace of mind",
      bgColor: "bg-red-50",
      borderColor: "bg-red-500",
     textColor: "text-red-500"
    },
  ];

  return (
    <div className=" sm:mt-8 mt-4 sm:mb-16 mb-8">
      <div>
        <h4 className="text-2xl font-semibold text-gray-700">Feature</h4>
        <p className="text-base text-gray-600">Trade smarter with our feature-rich platform and unlock new opportunities.</p>
      </div>
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-4">
      {features.map((feature, index) => (
        <div
          key={index}
          className={`group text-center rounded-md p-6 transition-all duration-300 ${feature.bgColor} ${feature.hoverBorderColor} relative`}
        >
          <div className="flex justify-center mb-4">
            {feature.icon}
          </div>
          <h3 className={`font-semibold mb-2 text-base  ${feature.textColor}`}>
            {feature.title}
          </h3>
          <p className="text-primary  text-sm">
            {feature.description}
          </p>
          <div className={`absolute bottom-0 left-0 w-full h-1 ${feature.borderColor} transition-all duration-300 transform scale-x-0 group-hover:scale-x-100`}></div>
        </div>
      ))}
    </div>
    </div>
  );
};

export default ServiceSection;

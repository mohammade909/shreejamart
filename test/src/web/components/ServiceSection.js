import React from "react";
import { PiTruckLight } from "react-icons/pi";
const ServiceSection = () => {
  const features = [
    {
      icon: <i className="fi fi-ts-truck-moving text-secondary text-5xl"></i>,
      title: "Free Shipping",
      description: "Free shipping on all US order or order above $200",
    },
    {
      icon: <i className="fi fi-ts-hand-holding-seeding text-secondary text-5xl"></i>,
      title: "24X7 Support",
      description: "Contact us 24 hours a day, 7 days a week",
    },
    {
      icon: <i className="fi fi-ts-badge-percent text-secondary text-5xl"></i>,
      title: "30 Days Return",
      description: "Simply return it within 30 days for an exchange",
    },
    {
      icon: <i className="fi fi-ts-donate text-secondary text-5xl"></i>,
      title: "Payment Secure",
      description: "Contact us 24 hours a day, 7 days a week",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 my-16">
      {features.map((feature, index) => (
        <div key={index} className="text-center border rounded-md p-3">
          <div className="flex justify-center mb-4">
          {feature.icon}
          </div>
          <h3 className="font-semibold  font-Poppins mb-2 text-xl text-primary ">
            {feature.title}
          </h3>
          <p className="text-primary font-Poppins  text-md
          ">
            {feature.description}
          </p>
        </div>
      ))}
    </div>
  );
};

export default ServiceSection;

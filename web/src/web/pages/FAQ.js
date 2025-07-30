import React, { useState } from 'react';
import { FaChevronDown } from "react-icons/fa";

export const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "What is a multi-vendor marketplace?",
      answer: "A multi-vendor marketplace is an online platform where multiple vendors can sell their products or services under a single brand."
    },
    {
      question: "How do I become a seller?",
      answer: "You can register as a seller by signing up on our platform and completing the necessary verification process."
    },
    {
      question: "What payment methods are supported?",
      answer: "We support various payment methods, including credit/debit cards, PayPal, and digital wallets."
    },
    {
      question: "What is the return policy?",
      answer: "Customers can return products within 30 days of purchase if they meet the return conditions."
    },
    {
      question: "How do I track my order?",
      answer: "Once your order is shipped, you will receive a tracking number via email."
    },
    {
      question: "Are there any discounts for bulk purchases?",
      answer: "Yes, we offer discounts on bulk purchases. Please contact customer support for more details."
    },
    {
      question: "How long does shipping take?",
      answer: "Shipping times vary based on location, but typically it takes 3-7 business days."
    },
    {
      question: "Can I change my shipping address after placing an order?",
      answer: "You can change your shipping address within 12 hours of placing an order by contacting our support team."
    },
    {
      question: "Do you offer international shipping?",
      answer: "Yes, we offer international shipping. Additional fees may apply depending on the destination."
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className=" mx-auto px-24 py-12">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-semibold text-gray-700 mb-2">
          Frequently Asked <span className="text-emerald-500">Questions</span>
        </h2>
        <p className="text-gray-500 text-xl my-4">Customer service management.</p>
      </div>
      
      <div className="grid grid-cols-1 text-lg md:grid-cols-2 md:text-xl gap-6">
        {faqs.map((faq, index) => (
          <div key={index} className="bg-gray-50 rounded-lg overflow-hidden shadow-md">
            <button
              className="w-full flex items-center justify-between p-6 text-left"
              onClick={() => toggleFAQ(index)}
            >
              <span className="text-gray-700 text-lg font-semibold">{faq.question}</span>
              <FaChevronDown
                className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${openIndex === index ? 'rotate-180' : ''}`}
              />
            </button>
            {openIndex === index && (
              <div className="px-6 pb-4 text-gray-600">{faq.answer}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
import React from "react";
import { Field, ErrorMessage } from "formik";

const BusinessDetails = () => {
  const businessTypes = [
    "Distributor",
    "Retailer",
    "Manufacturer",
    "Wholesaler",
    "Service Provider",
    "E-commerce",
    "Supplier",
    "Exporter",
    "Importer",
  ];

  const ecommerceCategories = [
    "Clothing & Accessories",
    "Electronics & Gadgets",
    "Home & Kitchen",
    "Health & Beauty",
    "Sports & Outdoors",
    "Toys & Games",
    "Automotive",
    "Books & Stationery",
    "Pet Supplies",
    "Jewelry & Watches",
    "Furniture",
    "Groceries & Essentials",
  ];

  return (
    <div>
      <div className="flex flex-col">
        <label className="leading-loose">Store Name</label>
        <Field
          type="text"
          name="store_name"
          className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
          placeholder="Store name"
        />
        <ErrorMessage
          name="store_name"
          component="div"
          className="text-red-500 text-sm"
        />
      </div>
      <div className="flex flex-col">
        <label className="leading-loose">Registration Number</label>
        <Field
          type="text"
          name="registration_number"
          className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
          placeholder="Registration number"
        />
        <ErrorMessage
          name="registration_number"
          component="div"
          className="text-red-500 text-sm"
        />
      </div>

      <div className="flex flex-col">
        <label className="leading-loose">Brand Details</label>
        <div className="grid grid-cols-1 gap-4 ">
          <Field
            type="text"
            name="brand_details.name"
            className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
            placeholder="Brand Name"
          />
          <Field
            as="select"
            name="brand_details.brandType"
            className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
            placeholder="Brand Type"
          >
            <option value="">Select Business</option>
            {businessTypes.map((type, index) => (
              <option key={index} value={type}>
                {type}
              </option>
            ))}
          </Field>
          <Field
            as="select"
            name="brand_details.category"
            className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
          >
            <option value="">Select Category</option>
            {ecommerceCategories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </Field>
        
        </div>
        <div className="mt-5">
          <Field
            as="textarea"
            name="brand_details.description"
            className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
            placeholder="Description"
          />
        
        </div>
        <ErrorMessage
          name="brand_details.name"
          component="div"
          className="text-red-500 text-sm"
        />
        <ErrorMessage
          name="brand_details.brandType"
          component="div"
          className="text-red-500 text-sm"
        />
        <ErrorMessage
          name="brand_details.category"
          component="div"
          className="text-red-500 text-sm"
        />
        <ErrorMessage
          name="brand_details.description"
          component="div"
          className="text-red-500 text-sm"
        />
        <ErrorMessage
          name="brand_details.logo_url"
          component="div"
          className="text-red-500 text-sm"
        />
      </div>
    </div>
  );
};

export default BusinessDetails;

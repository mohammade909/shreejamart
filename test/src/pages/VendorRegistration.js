import React from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import {BASEURL} from '../baseurl'
const VendorRegistration = () => {
  // Define validation schema using Yup
  const validationSchema = Yup.object({
    vendor_name: Yup.string().required("Vendor name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    store_name: Yup.string().required("Store name is required"),
    first_name: Yup.string().required("First name is required"),
    phone_number: Yup.string().required("Phone number is required"),
    last_name: Yup.string().required("Last name is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    // Add additional fields validation
  });

  // Handle form submission
  const handleSubmit = async (values) => {
    // Create the payload for the API request
    const payload = {
      ...values,
      bank_account_details: JSON.parse(values.bank_account_details),
      brand_details: JSON.parse(values.brand_details),
    };
   
    try {
      const response = await fetch(`${BASEURL}/api/v1/vendors`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
       console.log(data);
       
      if (data.success) {
        alert('Vendor created successfully');
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error creating vendor:', error);
      alert('An error occurred while creating the vendor');
    }
  };

  return (
    <div className="max-w-3xl m-auto my-20 border">

  
    <Formik
      initialValues={{
        vendor_name: "",
        email: "",
        address: "",
        store_name: "",
        registration_number: "",
        phone_number: "",
        kyc_status: "pending",
        bank_account_details: JSON.stringify({
          account_number: "",
          ifsc: "",
          bank_name: "",
        }),
        brand_details: JSON.stringify({
          name: "",
          brandType: "",
          category: "",
          description: "",
          logo_url: "",
        }),
        annual_turnover: "",
        monthly_turnover: "",
        rating: "",
        total_sales: "",
        login_status: "active",
        first_name: "",
        last_name: "",
        password: "",
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ values, setFieldValue }) => (
        <Form className="space-y-6">
          {/* Vendor Details */}
          <div className="p-5">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Vendor Details
            </h3>
            <div className="grid  grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label
                  htmlFor="vendor_name"
                  className="block text-sm font-medium text-gray-600"
                >
                  Vendor Name
                </label>
                <Field
                  type="text"
                  name="vendor_name"
                  id="vendor_name"
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <ErrorMessage
                  name="vendor_name"
                  component="div"
                  className="text-red-600 text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-600"
                >
                  Email
                </label>
                <Field
                  type="email"
                  name="email"
                  id="email"
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-600 text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="store_name"
                  className="block text-sm font-medium text-gray-600"
                >
                  Store Name
                </label>
                <Field
                  type="text"
                  name="store_name"
                  id="store_name"
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <ErrorMessage
                  name="store_name"
                  component="div"
                  className="text-red-600 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Dynamic Bank Account Details */}
          <div className="p-5 ">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Bank Account Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(JSON.parse(values.bank_account_details)).map(
                ([key, value]) => (
                  <div key={key}>
                    <label
                      htmlFor={`bank_account_details.${key}`}
                      className="block text-sm font-medium text-gray-600"
                    >
                      {key.replace(/_/g, " ").toUpperCase()}
                    </label>
                    <Field
                      type="text"
                      name={`bank_account_details.${key}`}
                      id={`bank_account_details.${key}`}
                      className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                      value={value}
                      onChange={(e) => {
                        const newDetails = {
                          ...JSON.parse(values.bank_account_details),
                          [key]: e.target.value,
                        };
                        setFieldValue(
                          "bank_account_details",
                          JSON.stringify(newDetails)
                        );
                      }}
                    />
                    <ErrorMessage
                      name={`bank_account_details.${key}`}
                      component="div"
                      className="text-red-600 text-sm"
                    />
                  </div>
                )
              )}
            </div>
          </div>

          {/* Dynamic Brand Details */}
          <div className="p-5">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Brand Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(JSON.parse(values.brand_details)).map(
                ([key, value]) => (
                  <div key={key}>
                    <label
                      htmlFor={`brand_details.${key}`}
                      className="block text-sm font-medium text-gray-600"
                    >
                      {key.replace(/_/g, " ").toUpperCase()}
                    </label>
                    <Field
                      type="text"
                      name={`brand_details.${key}`}
                      id={`brand_details.${key}`}
                      className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                      value={value}
                      onChange={(e) => {
                        const newDetails = {
                          ...JSON.parse(values.brand_details),
                          [key]: e.target.value,
                        };
                        setFieldValue(
                          "brand_details",
                          JSON.stringify(newDetails)
                        );
                      }}
                    />
                    <ErrorMessage
                      name={`brand_details.${key}`}
                      component="div"
                      className="text-red-600 text-sm"
                    />
                  </div>
                )
              )}
            </div>
          </div>

          {/* User Details */}
          <div className="p-5">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              User Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="first_name"
                  className="block text-sm font-medium text-gray-600"
                >
                  First Name
                </label>
                <Field
                  type="text"
                  name="first_name"
                  id="first_name"
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <ErrorMessage
                  name="first_name"
                  component="div"
                  className="text-red-600 text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="last_name"
                  className="block text-sm font-medium text-gray-600"
                >
                  Last Name
                </label>
                <Field
                  type="text"
                  name="last_name"
                  id="last_name"
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <ErrorMessage
                  name="last_name"
                  component="div"
                  className="text-red-600 text-sm"
                />
              </div>
             
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-600"
                >
                  Phone
                </label>
                <Field
                  type="tel"
                  name="phone_number"
                  id="phone_number"
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <ErrorMessage
                  name="phone_number"
                  component="div"
                  className="text-red-600 text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-600"
                >
                  Password
                </label>
                <Field
                  type="password"
                  name="password"
                  id="password"
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-600 text-sm"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-6">
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-500"
            >
              Submit
            </button>
          </div>
        </Form>
      )}
    </Formik>
    </div>
  );
};

export default VendorRegistration;

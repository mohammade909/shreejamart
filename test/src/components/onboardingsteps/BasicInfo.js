import React from 'react';
import { Field, ErrorMessage } from 'formik';

const BasicInfo = () => {
  return (
    <>
      <div className="flex flex-col">
        <label className="leading-loose">Vendor Name</label>
        <Field type="text" name="vendor_name" className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600" placeholder="Vendor name" />
        <ErrorMessage name="vendor_name" component="div" className="text-red-500 text-sm" />
      </div>
      <div className="flex flex-col">
        <label className="leading-loose">Email</label>
        <Field type="email" name="email" className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600" placeholder="Email" />
        <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
      </div>
      <div className="flex flex-col">
        <label className="leading-loose">Address</label>
        <Field type="text" name="address" className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600" placeholder="Address" />
        <ErrorMessage name="address" component="div" className="text-red-500 text-sm" />
      </div>
      <div className="flex flex-col">
        <label className="leading-loose">Phone Number</label>
        <Field type="text" name="phone_number" className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600" placeholder="Phone number" />
        <ErrorMessage name="phone_number" component="div" className="text-red-500 text-sm" />
      </div>
    </>
  );
};

export default BasicInfo;


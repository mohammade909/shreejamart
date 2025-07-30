import React from 'react';
import { Field, ErrorMessage } from 'formik';

const AccountSetup = () => {
  return (
    <>
      <div className="flex flex-col">
        <label className="leading-loose">First Name</label>
        <Field type="text" name="first_name" className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600" placeholder="First name" />
        <ErrorMessage name="first_name" component="div" className="text-red-500 text-sm" />
      </div>
      <div className="flex flex-col">
        <label className="leading-loose">Last Name</label>
        <Field type="text" name="last_name" className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600" placeholder="Last name" />
        <ErrorMessage name="last_name" component="div" className="text-red-500 text-sm" />
      </div>
      <div className="flex flex-col">
        <label className="leading-loose">Password</label>
        <Field type="password" name="password" className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600" placeholder="Password" />
        <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />
      </div>
      {/* <div className="flex flex-col">
        <label className="leading-loose">Login Status</label>
        <Field as="select" name="login_status" className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600">
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </Field>
        <ErrorMessage name="login_status" component="div" className="text-red-500 text-sm" />
      </div> */}
    </>
  );
};

export default AccountSetup;


import React from "react";
import { Field, ErrorMessage } from "formik";

const FinancialInfo = () => {
  return (
    <>
      <div className="flex flex-col">
        <label className="leading-loose">Bank Account Details</label>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field
            type="text"
            name="bank_account_details.ifsc"
            className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
            placeholder="IFSC Code"
          />

          <Field
            type="text"
            name="bank_account_details.bank_name"
            className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
            placeholder="Bank Name"
          />
        </div>
        <div className="grid grid-cols-1 mt-4 ">
          <Field
            type="text"
            name="bank_account_details.account_number"
            className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
            placeholder="Account Number"
          />
        </div>
        <ErrorMessage
          name="bank_account_details.account_number"
          component="div"
          className="text-red-500 text-sm"
        />
        <ErrorMessage
          name="bank_account_details.ifsc"
          component="div"
          className="text-red-500 text-sm"
        />
        <ErrorMessage
          name="bank_account_details.bank_name"
          component="div"
          className="text-red-500 text-sm"
        />
      </div>
      <div className="flex flex-col">
        <label className="leading-loose">Annual Turnover</label>
        <Field
          type="number"
          name="annual_turnover"
          className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
          placeholder="Annual turnover"
        />
        <ErrorMessage
          name="annual_turnover"
          component="div"
          className="text-red-500 text-sm"
        />
      </div>
      <div className="flex flex-col">
        <label className="leading-loose">Monthly Turnover</label>
        <Field
          type="number"
          name="monthly_turnover"
          className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
          placeholder="Monthly turnover"
        />
        <ErrorMessage
          name="monthly_turnover"
          component="div"
          className="text-red-500 text-sm"
        />
      </div>
    </>
  );
};

export default FinancialInfo;

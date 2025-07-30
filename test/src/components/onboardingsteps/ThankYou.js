import React from "react";
import { CheckCircle, XCircle } from "lucide-react";
import { useFormikContext } from "formik";
import { Link } from "react-router-dom";

const ThankYou = () => {
  const { status } = useFormikContext();

  if (status && !status.success) {
    return (
      <div className="text-center">
        <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Submission Failed</h2>
        <p className="text-gray-600">{status.message}</p>
        <p className="text-gray-600 mt-2">
          Please try again or contact support if the problem persists.
        </p>
      </div>
    );
  }

  return (
    <div className="text-center">
      <CheckCircle className="w-16 h-16 text-secondary mx-auto mb-4" />
      <h2 className="text-2xl font-bold mb-2">Thank You for Registering!</h2>
      <p className="text-gray-600">
        Your vendor account has been successfully created. We'll review your
        information and get back to you soon.
      </p>
    
    </div>
  );
};

export default ThankYou;

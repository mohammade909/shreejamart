import React, { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import {
  ChevronRight,
  ChevronLeft,
  Store,
  User,
  Briefcase,
  CreditCard,
  CheckCircle,
} from "lucide-react";
import BasicInfo from "../components/onboardingsteps/BasicInfo";
import BusinessDetails from "../components/onboardingsteps/BusinessDetails";
import FinancialInfo from "../components/onboardingsteps/FinancialInfo";
import AccountSetup from "../components/onboardingsteps/AccountSetup";
import ThankYou from "../components/onboardingsteps/ThankYou";
import { BASEURL } from "../baseurl";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const steps = [
  "Basic Info",
  "Business Details",
  "Financial Info",
  "Account Setup",
];

const VendorOnboardingForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const initialValues = {
    vendor_name: "",
    email: "",
    address: "",
    store_name: "",
    registration_number: "",
    phone_number: "",
    kyc_status: "pending",
    bank_account_details: {
      account_number: "",
      ifsc: "",
      bank_name: "",
    },
    brand_details: {
      name: "",
      brandType: "",
      category: "",
      description: "",
    },
    annual_turnover: "",
    monthly_turnover: "",
    rating: 0.0,
    total_sales: 0.0,
    login_status: "active",
    first_name: "",
    last_name: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    vendor_name: Yup.string().required("Vendor name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    address: Yup.string().required("Address is required"),
    store_name: Yup.string().required("Store name is required"),
    registration_number: Yup.string().required(
      "Registration number is required"
    ),
    phone_number: Yup.string().required("Phone number is required"),
    kyc_status: Yup.string().required("KYC status is required"),
    bank_account_details: Yup.object().shape({
      account_number: Yup.string().required("Account number is required"),
      ifsc: Yup.string().required("IFSC code is required"),
      bank_name: Yup.string().required("Bank name is required"),
    }),
    brand_details: Yup.object().shape({
      name: Yup.string().required("Brand name is required"),
      brandType: Yup.string().required("Brand type is required"),
      category: Yup.string().required("Category is required"),
      description: Yup.string().required("Description is required"),
    }),
    annual_turnover: Yup.number()
      .positive("Must be a positive number")
      .required("Annual turnover is required"),
    monthly_turnover: Yup.number()
      .positive("Must be a positive number")
      .required("Monthly turnover is required"),
    first_name: Yup.string().required("First name is required"),
    last_name: Yup.string().required("Last name is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),
  });

  const handleSubmit = async (values, { setSubmitting, setStatus }) => {
    setLoading(true);
    try {
      const response = await fetch(`${BASEURL}/api/v1/vendors`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("Failed to submit form");
      }

      const data = await response.json();
      setLoading(false);
      setStatus({ success: true, message: data.message });
      toast.success("Your Application has been submitted");
      setCurrentStep(steps.length); // Move to Thank You step
    } catch (error) {
      setLoading(false);
      console.error("Error submitting form:", error);
      setStatus({
        success: false,
        message: "Failed to submit form. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const nextStep = () => setCurrentStep(currentStep + 1);
  const prevStep = () => setCurrentStep(currentStep - 1);

  const renderStep = (step) => {
    switch (step) {
      case 0:
        return <BasicInfo />;
      case 1:
        return <BusinessDetails />;
      case 2:
        return <FinancialInfo />;
      case 3:
        return <AccountSetup />;
      case 4:
        return <ThankYou />;
      default:
        return null;
    }
  };

  const getStepIcon = (step) => {
    switch (step) {
      case 0:
        return <User className="w-6 h-6" />;
      case 1:
        return <Store className="w-6 h-6" />;
      case 2:
        return <Briefcase className="w-6 h-6" />;
      case 3:
        return <CreditCard className="w-6 h-6" />;
      default:
        return null;
    }
  };

  return (
    <div className=" bg-gray-100 py-6 mx-auto sm:py-12">
      <div className="relative py-3  ">
        <div className="relative px-4 py-10 bg-white  max-w-lg mx-auto shadow rounded-md sm:p-10">
          <div className="">
            <div className="flex items-center space-x-5">
              <div className="h-14 w-14 bg-secondary/10 rounded-full flex flex-shrink-0 justify-center items-center text-secondary text-2xl font-mono">
                {currentStep < steps.length ? (
                  getStepIcon(currentStep)
                ) : (
                  <CheckCircle className="w-8 h-8" />
                )}
              </div>
              <div className="block pl-2 font-semibold text-xl self-start text-gray-700">
                <h2 className="leading-relaxed">
                  {currentStep < steps.length
                    ? steps[currentStep]
                    : "Thank You"}
                </h2>
                <p className="text-sm text-gray-500 font-normal leading-relaxed">
                  {currentStep < steps.length
                    ? `Step ${currentStep + 1} of ${steps.length}`
                    : "Registration Complete"}
                </p>
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              <Formik
                initialValues={initialValues}
                // validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting, errors, touched, status }) => (
                  <Form className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                    {renderStep(currentStep)}
                    <div className="pt-4 flex items-center space-x-4">
                      {currentStep > 0 && currentStep < steps.length && (
                        <button
                          type="button"
                          onClick={prevStep}
                          className="bg-gray-200 flex justify-center items-center w-full text-gray-600 px-4 py-3 rounded-md focus:outline-none"
                        >
                          <ChevronLeft className="w-6 h-6 mr-2" />
                          Previous
                        </button>
                      )}
                      {currentStep < steps.length - 1 && (
                        <button
                          type="button"
                          onClick={nextStep}
                          className="bg-primary hover:bg-primary/60 flex justify-center items-center w-full text-white px-4 py-3 rounded-md focus:outline-none"
                        >
                          Next
                          <ChevronRight className="w-6 h-6 ml-2" />
                        </button>
                      )}
                      {currentStep === steps.length - 1 && (
                        <button
                          type="submit"
                          className="bg-secondary flex justify-center items-center w-full text-white px-4 py-3 rounded-md focus:outline-none"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? "Submitting..." : "Submit"}
                          <CheckCircle className="w-6 h-6 ml-2" />
                        </button>
                      )}
                    </div>
                    <Link
                      to={"/"}
                      className="bg-secondary text-white px-3 py-2 rounded-lg mt-5 m-auto hover:scale-y-105 hover:bg-secondary/80"
                    >
                      Back Home
                    </Link>
                    {status && (
                      <div
                        className={`text-center ${
                          status.success ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {status.message}
                      </div>
                    )}
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorOnboardingForm;

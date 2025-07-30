import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import {
  User,
  Mail,
  Phone,
  FileText,
  Car,
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  CreditCard,
  Building2,
  Bike,
} from "lucide-react";
import { RiLockPasswordLine } from "react-icons/ri";
import { partnerOnboarding } from "../redux/partnersSlice";
import { useDispatch, useSelector } from "react-redux";

const validationSchema = Yup.object({
  // Personal Details
  password: Yup.string().required("password is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  firstname: Yup.string().required("First name is required"),
  lastname: Yup.string().required("Last name is required"),
  phone_number: Yup.string().required("phone_number number is required"),

  // Documents
  documents: Yup.object({
    driving_license: Yup.mixed().required("Driving license is required"),
    bike_rc: Yup.mixed().required("Bike RC is required"),
  }),

  // Vehicle Details
  vehicle_make: Yup.string().required("Vehicle make is required"),
  vehicle_no: Yup.string().required("Vehicle Number is required"),

  // Banking Details
  account_number: Yup.string().required("Account number is required"),
  ifsc_code: Yup.string().required("IFSC code is required"),
  bank_name: Yup.string().required("Bank name is required"),
});

const PartnerOnboarding = () => {
  const dispacth = useDispatch();
  const [step, setStep] = React.useState(1);

  const initialValues = {
    password: "",
    email: "",
    firstname: "",
    lastname: "",
    phone_number: "",
    driving_license: null,
    bike_rc: null,
    vehicle_model: "",
    vehicle_no: "",
    account_number: "",
    ifsc_code: "",
    bank_name: "",
  };

  // Validation schemas for each step
  const stepValidationSchemas = {
    1: Yup.object({
      password: Yup.string().required("password is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
      firstname: Yup.string().required("First name is required"),
      lastname: Yup.string().required("Last name is required"),
      phone_number: Yup.string().required("phone_number number is required"),
    }),
    2: Yup.object({
      driving_license: Yup.mixed().required("Driving license is required"),
      bike_rc: Yup.mixed().required("Bike RC is required"),
    }),

    3: Yup.object({
      vehicle_model: Yup.string().required("Vehicle model is required"),
      vehicle_no: Yup.number().required("Vehicle year is required"),
      account_number: Yup.string().required("Account number is required"),
      ifsc_code: Yup.string().required("IFSC code is required"),
      bank_name: Yup.string().required("Bank name is required"),
    }),
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    setSubmitting(true);
    if (step === 3) {
      console.log("Final form values:", values);
      dispacth(partnerOnboarding(values));
      setStep(step + 1);
    } else {
      // Move to next step if current step validation passes
      setStep(step + 1);
    }

    setSubmitting(false);
  };

  const CustomInput = ({ field, form, icon: Icon, ...props }) => (
    <div className="relative">
      <Icon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
      <input
        {...field}
        {...props}
        className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      {form.errors[field.name] && form.touched[field.name] && (
        <div className="text-red-500 text-sm mt-1">
          {form.errors[field.name]}
        </div>
      )}
    </div>
  );

  const validateStep = async (values) => {
    try {
      await stepValidationSchemas[step].validate(values, { abortEarly: false });
      return true;
    } catch (err) {
      return false;
    }
  };

  const handleNext = async (formik) => {
    const isValid = await validateStep(formik.values);
    if (isValid) {
      setStep(step + 1);
    } else {
      // Trigger validation
      formik.validateForm();
      // Touch all fields to show errors
      const fieldsToTouch = Object.keys(stepValidationSchemas[step].fields);
      const touched = fieldsToTouch.reduce((acc, field) => {
        acc[field] = true;
        return acc;
      }, {});
      formik.setTouched(touched);
    }
  };

  const renderStep = (formik) => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-6">Personal Information</h2>
            <Field
              name="email"
              component={CustomInput}
              icon={Mail}
              placeholder="Email"
              type="email"
            />
            <Field
              name="password"
              component={CustomInput}
              icon={RiLockPasswordLine}
              placeholder="********"
              type="password"
            />

            <div className="grid grid-cols-2 gap-4">
              <Field
                name="firstname"
                component={CustomInput}
                icon={User}
                placeholder="First Name"
                type="text"
              />

              <Field
                name="lastname"
                component={CustomInput}
                icon={User}
                placeholder="Last Name"
                type="text"
              />
            </div>

            <Field
              name="phone_number"
              component={CustomInput}
              icon={Phone}
              placeholder="Phone Number"
              type="tel"
            />
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-6">Documents</h2>

            <div className="space-y-4">
              <div className="relative">
                <FileText className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="file"
                  onChange={(event) => {
                    formik.setFieldValue(
                      "driving_license",
                      event.currentTarget.files[0]
                    );
                  }}
                  className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <label className="text-sm text-gray-600">Driving License</label>
                {formik.errors?.driving_license && (
                  <div className="text-red-500 text-sm mt-1">
                    {formik.errors.driving_license}
                  </div>
                )}
              </div>

              <div className="relative">
                <FileText className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="file"
                  onChange={(event) => {
                    formik.setFieldValue(
                      "bike_rc",
                      event.currentTarget.files[0]
                    );
                  }}
                  className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <label className="text-sm text-gray-600">Bike RC</label>
                {formik.errors?.bike_rc && (
                  <div className="text-red-500 text-sm mt-1">
                    {formik.errors.bike_rc}
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-6">
              Vehicle & Banking Details
            </h2>

            <Field
              name="vehicle_model"
              component={CustomInput}
              icon={Bike}
              placeholder="Vehicle Model"
              type="text"
            />

            <Field
              name="vehicle_no"
              component={CustomInput}
              icon={Bike}
              placeholder="Vehicle Number"
              type="text"
            />

            <div className="border-t pt-4 mt-4">
              <h3 className="text-lg font-semibold mb-4">
                Banking Information
              </h3>

              <Field
                name="account_number"
                component={CustomInput}
                icon={CreditCard}
                placeholder="Account Number"
                type="text"
              />

              <Field
                name="ifsc_code"
                component={CustomInput}
                icon={Building2}
                placeholder="IFSC Code"
                type="text"
                className="mt-4"
              />

              <Field
                name="bank_name"
                component={CustomInput}
                icon={Building2}
                placeholder="Bank Name"
                type="text"
                className="mt-4"
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="text-center space-y-4">
            <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
            <h2 className="text-2xl font-bold">Thank You!</h2>
            <p className="text-gray-600">
              Your information has been successfully submitted. We'll get back
              to you soon.
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3, 4].map((num) => (
              <div key={num} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step >= num ? "bg-blue-500 text-white" : "bg-gray-200"
                  }`}
                >
                  {num}
                </div>
                {num < 4 && (
                  <div
                    className={`h-1 w-12 ${
                      step > num ? "bg-blue-500" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <Formik
          initialValues={initialValues}
          // validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {(formik) => (
            <Form>
              {renderStep(formik)}

              <div className="mt-8 flex justify-between">
                {step > 1 && step < 4 && (
                  <button
                    type="button"
                    onClick={() => setStep(step - 1)}
                    className="flex items-center px-6 py-2 text-gray-600 hover:text-gray-800"
                  >
                    <ChevronLeft className="h-5 w-5 mr-1" />
                    Previous
                  </button>
                )}

                {step < 3 && (
                  <button
                    type="button"
                    onClick={() => handleNext(formik)}
                    className="flex items-center px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 ml-auto"
                  >
                    Next
                    <ChevronRight className="h-5 w-5 ml-1" />
                  </button>
                )}
                {step === 3 && (
                  <button
                    type="submit"
                    className="flex items-center px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 ml-auto"
                  >
                    Submit
                    <CheckCircle className="h-5 w-5 ml-1" />
                  </button>
                )}
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default PartnerOnboarding;

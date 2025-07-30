import React, { useState, useEffect } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import ErrorAlert from "../components/ErrorAlert";
import {
  clearErrors,
  resetPassword,
  registerUser,
  resetState,
} from "../redux/authSlice";
import { useSelector, useDispatch } from "react-redux";
import Spinner from "../components/Spinner";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import SuccessModal from "../components/SuccessModal";
import ErrorModal from "../components/ErrorModal";
export default function UserRegister() {
  const [showPass, setShowPass] = useState(false);
  const { loading, error, auth, message } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);
  const initialValues = {
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    phone_number: "",
  };

  const validationSchema = Yup.object().shape({
    firstname: Yup.string().required("Firstname is required"),
    lastname: Yup.string().required("Lastname is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    phone_number: Yup.string()
      .matches(/^\d{10}$/, "Phone number must be 10 digits")
      .required("Phone number is required"),
  });

  const formik = useFormik({
    initialValues,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      dispatch(registerUser(values));
    },
  });

  useEffect(() => {
    if (message) {
      setOpenSuccess(true);
    }
    if (error) {
      setOpen(true);
    }
  }, [error, dispatch, auth, message]);

  return (
    <>
      <SuccessModal
        open={openSuccess}
        setOpen={() => setOpenSuccess(false)}
        message={message}
        reset={resetState}
      />
      <ErrorModal
        open={open}
        setOpen={() => setOpen(false)}
        error={error}
        reset={resetState}
      />
      <div className="relative flex items-center justify-center h-screen w-full bg-gray-200">
        {/* Background Section */}
        <div className="bg-yellow-700 shadow-xl md:ml-[20%] w-[20%] h-full absolute left-0"></div>

        {/* Overlapping Cards */}
        <div className="relative flex items-center justify-center z-10">
          {/* Left Card */}
          <div className="bg-white py-10 pl-10 text-white w-[300px] h-[500px] rounded-l-lg flex flex-col items-center justify-center text-center">
            <div className="bg-yellow-700 shadow-lg  w-full h-full">
              <h2 className="text-2xl font-bold">Welcome to Registration</h2>
              <p className="mt-4 px-4">
                Manage your profile efficiently with our platform
              </p>
              {/* Illustration */}
              <div className="mt-8">
                <img src="./login_bg.jpg" alt="Illustration" className="" />
              </div>
            </div>
          </div>

          {/* Right Card */}
          <div className="bg-white w-[550px] h-[500px] rounded-r-lg p-6 flex flex-col items-center justify-center text-gray-700">
            <h2 className="text-xl font-semibold mb-4">Register</h2>
            <form className="w-full space-y-4" onSubmit={formik.handleSubmit}>
              {/* Firstname Input */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstname" className="block text-sm">
                    Firstname
                  </label>
                  <input
                    id="firstname"
                    name="firstname"
                    value={formik.values.firstname}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    type="text"
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    placeholder="John"
                  />
                  {formik.touched.firstname && formik.errors.firstname && (
                    <p className="text-red-500 text-xs mt-2">
                      {formik.errors.firstname}
                    </p>
                  )}
                </div>

                {/* Lastname Input */}
                <div>
                  <label htmlFor="lastname" className="block text-sm">
                    Lastname
                  </label>
                  <input
                    id="lastname"
                    name="lastname"
                    value={formik.values.lastname}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    type="text"
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    placeholder="Doe"
                  />
                  {formik.touched.lastname && formik.errors.lastname && (
                    <p className="text-red-500 text-xs mt-2">
                      {formik.errors.lastname}
                    </p>
                  )}
                </div>
              </div>
              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-sm">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  type="email"
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  placeholder="Jack@example.com"
                />
                {formik.touched.email && formik.errors.email && (
                  <p className="text-red-500 text-xs mt-2">
                    {formik.errors.email}
                  </p>
                )}
              </div>

              {/* Password Input */}
              <div>
                <label htmlFor="password" className="block text-sm">
                  Password
                </label>
                <input
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  id="password"
                  name="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  type={showPass ? "text" : "password"}
                  autoComplete="new-password"
                />
                {formik.touched.password && formik.errors.password && (
                  <p className="text-red-500 text-xs mt-2">
                    {formik.errors.password}
                  </p>
                )}
              </div>

              {/* Phone Number Input */}
              <div>
                <label htmlFor="phone_number" className="block text-sm">
                  Phone Number
                </label>
                <input
                  id="phone_number"
                  name="phone_number"
                  value={formik.values.phone_number}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  type="text"
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  placeholder="1234567890"
                />
                {formik.touched.phone_number && formik.errors.phone_number && (
                  <p className="text-red-500 text-xs mt-2">
                    {formik.errors.phone_number}
                  </p>
                )}
              </div>

              {error && <ErrorAlert error={error} />}

              {/* Register Button */}
              <button
                className={`flex w-full py-2 bg-yellow-700 text-white rounded-lg hover:bg-yellow-600 ${
                  loading ? "opacity-50" : ""
                }`}
              >
                <div className="m-auto">
                  {loading ? <Spinner /> : "REGISTER"}
                </div>
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

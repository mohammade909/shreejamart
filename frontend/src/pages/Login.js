import React, { useState, useEffect } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import ErrorAlert from "../components/ErrorAlert";
import { clearErrors, loginUser } from "../redux/authSlice";
import { useSelector, useDispatch } from "react-redux";
import Spinner from "../components/Spinner";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";

export default function Login() {
  const [showPass, setShowPass] = useState(false);
  const { loading, error, auth } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const initialValues = {
    email: "",
    password: "",
  };
  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Incorrect email").required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const formik = useFormik({
    initialValues,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      dispatch(loginUser(values));
    },
  });

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearErrors());
      }, 2000);

      return () => clearTimeout(timer);
    }

    if (auth !== null) {
      if (auth.user_type === "customer") {
        navigate(`/`);
      } else {
        navigate(`/dashboard/${auth.user_type.toLowerCase()}`);
      }
    }
  }, [error, dispatch, auth]);

  return (
    <>
      <div className="relative flex items-center justify-center h-screen w-full bg-gray-200">
        {/* Background Section */}
        <div className="bg-secondary shadow-xl md:ml-[20%] w-[20%] h-full absolute left-0"></div>

        {/* Overlapping Cards */}
        <div className="relative flex items-center justify-center z-10">
          {/* Left Card */}
          <div className="bg-white  py-10 pl-10 text-white w-[300px] h-[450px] rounded-l-lg flex flex-col items-center justify-center text-center">
            <div className="bg-secondary shadow-lg rounded-lg w-full h-full">
              <h2 className="text-2xl font-bold">Welcome back</h2>
              <p className="mt-4 px-4">
                Manage your shop efficiently on Shopee with our Shopee Seller
                Centre
              </p>
              {/* Illustration */}
              <div className="mt-8">
                <img src="./login_bg.jpg" alt="Illustration" className="" />
              </div>
            </div>
          </div>

          {/* Right Card */}
          <div className="bg-white w-[300px] h-[450px] rounded-r-lg  p-6 flex flex-col items-center justify-center text-gray-700">
            <h2 className="text-xl font-semibold mb-4">Log in</h2>
            <form className="w-full space-y-4" onSubmit={formik.handleSubmit}>
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
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                  placeholder="Jack@example.com"
                />
              </div>

              {/* Password Input */}
              <div>
                <label htmlFor="password" className="block text-sm">
                  Password
                </label>
                <input
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                  id="password"
                  name="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  type={showPass ? "text" : "password"}
                  autoComplete="current-password"
                />
                {formik.touched.password && formik.errors.password && (
                  <p className="text-red-500 tracking-widest text-xs mt-2 text-left">
                    {formik.errors.password}*
                  </p>
                )}
              </div>
              {error && <ErrorAlert error={error} />}
              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between text-sm">
                <div>
                  <input id="remember-me" type="checkbox" className="mr-1" />
                  <label htmlFor="remember-me">Remember me</label>
                </div>
                <a href="#" className="text-secondary">
                  Forgot Password?
                </a>
              </div>

              {/* Login Button */}
              <button
                className={` flex w-full py-2 bg-secondary text-white rounded-lg hover:bg-secondary/50 ${
                  loading ? "opacity-50" : ""
                }`}
              >
                <div className="m-auto">{loading ? <Spinner /> : "LOGIN"}</div>
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

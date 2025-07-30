import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import { Eye, EyeOff, Lock, Mail, Phone, User } from "lucide-react";
import { loginUser } from "../../redux/authSlice";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { useNavigate } from 'react-router-dom';

const AdminSignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const initialValues = {
    identifier: "",
    password: "",
  };

  const validate = (values) => {
    const errors = {};
    if (!values.password) {
      errors.password = "Password is required";
    } else if (values.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }
    return errors;
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    setSubmitting(true);
    try {
      const response = await dispatch(loginUser(values)).unwrap();
      if (response.success) {
        toast.success("User logged in successfully");
        navigate('/');
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (error) {
      toast.error(error.message || "Invalid email or password");
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center" style={{
      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('/bg-lgoin.jpg')`,
      backgroundPosition: 'center',
      backgroundSize: 'cover'
    }}>
      <div className="w-full max-w-md p-8">
        <div className="bg-white/90 backdrop-blur-md rounded shadow-2xl p-8 border border-white/20 transform hover:scale-[1.01] transition-all duration-300">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-Poppins font-bold text-secondary mb-2">Welcome Admin</h2>
            <p className="text-gray-600">Sign in to your account</p>
          </div>

          <Formik
            initialValues={initialValues}
            validate={validate}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Or Phone
                  </label>
                  <div className="relative group">
                    <Field
                      type="text"
                      name="identifier"
                      className="pl-10 w-full rounded-lg border border-gray-300 bg-white/80 p-3 text-sm focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all duration-300"
                      placeholder="john.doe@example.com"
                    />
                    <Mail
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-secondary transition-colors duration-200"
                      size={18}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="relative group">
                    <Field
                      type={showPassword ? "text" : "password"}
                      name="password"
                      className="pl-10 w-full rounded-lg border border-gray-300 bg-white/80 p-3 text-sm focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all duration-300"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-secondary transition-colors duration-200"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                    <Lock
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-secondary transition-colors duration-200"
                      size={18}
                    />
                  </div>
                  {errors.password && touched.password && (
                    <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                  )}
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-secondary focus:ring-secondary border-gray-300 rounded"
                    />
                    <label className="ml-2 text-gray-600">Remember me</label>
                  </div>
                  <a href="/forgot-password" className="text-secondary hover:text-secondary/80 transition-colors duration-200">
                    Forgot password?
                  </a>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-secondary hover:bg-secondary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing in...
                    </span>
                  ) : (
                    "Sign In"
                  )}
                </button>
              </Form>
            )}
          </Formik>

          <p className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <a
              href="/register"
              className="font-medium text-secondary hover:text-secondary/80 transition-colors duration-200"
            >
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminSignIn;
import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import { Eye, EyeOff, Lock, Mail, Phone, User } from "lucide-react";
import { loginUser } from "../../redux/authSlice";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import {useNavigate} from 'react-router-dom'
const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate= useNavigate()
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br  p-4">
      <div className="bg-white/95 p-8 border w-full max-w-md backdrop-blur-lg transform hover:scale-[1.01] transition-transform duration-300">
        <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r bg-clip-text text-secondary">
          SignIn Account
        </h2>

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
                <div className="relative">
                  <Field
                    type="text"
                    name="identifier"
                    className="pl-10 w-full rounded-lg border border-gray-300 bg-white/50 p-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                    placeholder="john.doe@example.com"
                  />
                  <Mail
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                </div>
                {/* {errors.email && touched.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                )} */}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Field
                    type={showPassword ? "text" : "password"}
                    name="password"
                    className="pl-10 w-full rounded-lg border border-gray-300 bg-white/50 p-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                  <Lock
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                </div>
                {errors.password && touched.password && (
                  <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-secondary hover:bg-secondary/70  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Sign in..." : "Sign In"}
              </button>
            </Form>
          )}
        </Formik>

        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <a
            href="/register"
            className="font-medium text-primary underline hover:text-primary transition-colors duration-200"
          >
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignIn;

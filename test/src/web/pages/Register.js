import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import { Eye, EyeOff, Mail, phone_number, User } from 'lucide-react';
import {registerUser} from '../../redux/authSlice'
import { useSelector, useDispatch } from "react-redux";
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch()
  const initialValues = {
    firstName: '',
    lastName: '',
    email: '',
    phone_number: '',
    password: ''
  };

  const validate = values => {
    const errors = {};

    if (!values.firstName) {
      errors.firstName = 'First name is required';
    }

    if (!values.lastName) {
      errors.lastName = 'Last name is required';
    }

    if (!values.email) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      errors.email = 'Invalid email address';
    }

    if (!values.phone_number) {
      errors.phone_number = 'phone_number number is required';
    } else if (!/^\+?[\d\s-]{10,}$/.test(values.phone_number)) {
      errors.phone_number = 'Invalid phone_number number';
    }

    if (!values.password) {
      errors.password = 'Password is required';
    } else if (values.password.length < 6) {
      errors.password = 'Password must be at least 8 characters';
    }

    return errors;
  };
  const handleSubmit = async (values, { setSubmitting }) => {
    setSubmitting(true);
  
    try {
      const response = await dispatch(registerUser(values)).unwrap();
  
      // Check for success condition (adjust based on your API response structure)
      if (response.status === 200 || response.success) {
        toast.success('Account created successfully');
      } else {
        toast.error(response.message || 'Registration failed');
      }
    } catch (error) {
      
      // Handles any errors thrown during registration
      toast.error(error.error || 'Something went wrong during registration');
      console.error(error);
    } finally {
      setSubmitting(false); // Ensure form is always reset after processing
    }
  };
  
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br  p-4">
      <div className="bg-white/95 p-8  rounded-sm border w-full max-w-lg backdrop-blur-lg transform hover:scale-[1.01] transition-transform duration-300">
        <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r bg-clip-text text-secondary">
          Register Account
        </h2>

        <Formik
          initialValues={initialValues}
          validate={validate}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <div className="relative">
                    <Field
                      type="text"
                      name="firstName"
                      className="pl-10 w-full rounded-lg border border-gray-300 bg-white/50 p-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                      placeholder="John"
                    />
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  </div>
                  {errors.firstName && touched.firstName && (
                    <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <div className="relative">
                    <Field
                      type="text"
                      name="lastName"
                      className="pl-10 w-full rounded-lg border border-gray-300 bg-white/50 p-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                      placeholder="Doe"
                    />
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  </div>
                  {errors.lastName && touched.lastName && (
                    <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="relative">
                  <Field
                    type="email"
                    name="email"
                    className="pl-10 w-full rounded-lg border border-gray-300 bg-white/50 p-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                    placeholder="john.doe@example.com"
                  />
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                </div>
                {errors.email && touched.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <Field
                    type="tel"
                    name="phone_number"
                    className="pl-10 w-full rounded-lg border border-gray-300 bg-white/50 p-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                    placeholder="+1 (555) 000-0000"
                  />
                  <phone_number className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                </div>
                {errors.phone_number && touched.phone_number && (
                  <p className="mt-1 text-sm text-red-500">{errors.phone_number}</p>
                )}
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
                </div>
                {errors.password && touched.password && (
                  <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-gradient-to-r from-secondary/80 to-secondary/70 hover:from-gray-300 hover:to-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Signing up...' : 'Sign Up'}
              </button>
            </Form>
          )}
        </Formik>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
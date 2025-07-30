

import React, { useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Formik, Form, Field } from "formik";
import {useNavigate} from 'react-router-dom'
import * as Yup from "yup";
import { fetchUserCart } from "../../redux/cartSlice";
import { createOrder } from "../../redux/orderSlice";
import {getUserById} from '../../redux/usersSlice'
import toast from "react-hot-toast";
import UserdetailsForm from "../components/UserdeatilsForm";
const CheckoutPage = () => {
  const navigate = useNavigate();
  const { auth } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.users);
  const dispatch = useDispatch();

  useEffect(() => {
    if (auth?.user_id) {
      dispatch(fetchUserCart(auth?.user_id));
          dispatch(getUserById(auth.user_id));
    }
  }, [auth, dispatch]);

  const calculateCartTotals = useMemo(() => {
    if (!cart?.items || cart.items.length === 0) {
      return {
        subtotal: 0,
        deliveryCharges: 0,
        discount: 0,
        tax: 0,
        gst: 0,
        total: 0,
      };
    }

    const subtotal = cart.items.reduce(
      (total, item) => total + item.quantity * item.price,
      0
    );
    const deliveryCharges = subtotal > 500 ? 0 : 50;
    const discount = subtotal > 1000 ? subtotal * 0.1 : 0;
    const tax = subtotal * 0.08;
    const gst = subtotal * 0.18;
    const total = subtotal + deliveryCharges + tax + gst - discount;

    return { subtotal, deliveryCharges, discount, tax, gst, total };
  }, [cart]);

  const initialValues = useMemo(
    () => ({
    
      cart_id: cart?.id || "",
      userId: auth?.user_id || "",
      order_number: "", // Will be generated on submission
      location: "",
      partner_id: "", // If applicable
      subtotal: calculateCartTotals.subtotal,
      tax: calculateCartTotals.tax,
      gst: calculateCartTotals.gst,
      delivery_charge: calculateCartTotals.deliveryCharges,
      discount: calculateCartTotals.discount,
      notes: "",
      total_amount: calculateCartTotals.total,
      payment_status: "pending",
      payment_method: "cod",
      order_status: "placed",
      placed_at: new Date().toISOString(),
      delivery_method: "free",
      acceptedTerms: false,
    }),
    [cart, auth, calculateCartTotals]
  );

  const validationSchema = Yup.object({
    location: Yup.string().required("Delivery location is required"),
    notes: Yup.string(),
    payment_method: Yup.string().required("Payment method is required"),
    acceptedTerms: Yup.boolean()
      .required("Required")
      .oneOf([true], "You must accept the terms and conditions"),
    delivery_method: Yup.string().required("Delivery method is required"),
  });

  const handleSubmit = (values, { setSubmitting }) => {
    if(!user.firstname || !user.lastname || !user.email || !user.address){
      toast.error("Please fill out all required fields in the User Details section and save");
      return;
    }
    const orderData = {
      ...values,
      items:cart.items,
      cart_id: cart.cart_id,
      order_number: `${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      placed_at: new Date().toISOString(),
    };
    dispatch(createOrder(orderData))
    .unwrap() // Assuming the createOrder thunk returns a promise
    .then((response) => {
      const orderId = response.order_id; // Capture the order_id returned in the response
      toast.success("Order placed successfully!");
  
      // Redirect to the Thank You page and pass the order_id as navigation state
      setTimeout(() => {
        navigate(`/thank-you/${orderId}`); // Send the orderId to the Thank You page
      }, 2000); // 2-second delay
    })
    .catch((error) => {
      toast.error(`Failed to place order: ${error.message}`);
    })
    .finally(() => {
      setSubmitting(false); // Stop the loading state
    });
  
  };

  return (
    <div className="min-h-screen bg-gray-50 my-16">
      <div className="container mx-auto px-4 py-8">
        <Formik
          enableReinitialize // Ensure Formik reinitializes when initialValues change
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, isSubmitting }) => (
            <Form className="flex gap-8">
              {/* Left Column - Order Summary */}
              <div className="w-1/3">
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Sub-Total</span>
                      <span>₹{Number(values.subtotal).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax</span>
                      <span>₹{Number(values.tax).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>GST</span>
                      <span>₹{Number(values.gst).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery Charges</span>
                      <span>₹{Number(values.delivery_charge).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Discount</span>
                      <span>₹{Number(values.discount).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold">
                      <span>Total Amount</span>
                      <span>₹{Number(values.total_amount).toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Delivery Method */}
                <div className="bg-white rounded-lg shadow p-6 mt-6">
                  <h2 className="font-semibold mb-4">Delivery Method</h2>
                  <div className="space-y-3">
                    <label className="flex items-center space-x-3">
                      <Field
                        type="radio"
                        name="delivery_method"
                        value="free"
                        className="form-radio text-secondary"
                      />
                      <span>Free Shipping</span>
                    </label>
                    <label className="flex items-center space-x-3">
                      <Field
                        type="radio"
                        name="delivery_method"
                        value="flat"
                        className="form-radio text-secondary"
                      />
                      <span>Flat Rate</span>
                    </label>
                  </div>
                </div>

                {/* Location */}
                <div className="bg-white rounded-lg shadow p-6 mt-6">
                  <h2 className="font-semibold mb-4">Delivery Location</h2>
                  <Field
                    name="location"
                    as="textarea"
                    className="w-full border rounded-md p-2"
                    placeholder="Enter your delivery address"
                  />
                  {errors.location && touched.location && (
                    <div className="text-red-500 text-sm mt-1">
                      {errors.location}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column */}
              <div className="w-2/3">
              <UserdetailsForm/>
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-xl font-semibold mb-6">Order Details</h2>

                  {/* Notes */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Order Notes
                    </label>
                    <Field
                      name="notes"
                      as="textarea"
                      className="w-full border rounded-md p-2 h-24"
                      placeholder="Add any special notes or requirements"
                    />
                  </div>

                  {/* Payment Method */}
                  <div className="mb-4">
                    <h3 className="font-medium mb-2">Payment Method</h3>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-3">
                        <Field
                          type="radio"
                          name="payment_method"
                          value="cod"
                          className="form-radio text-secondary"
                        />
                        <span>Cash On Delivery</span>
                      </label>
                      <label className="flex items-center space-x-3">
                        <Field
                          type="radio"
                          name="payment_method"
                          value="online"
                          className="form-radio text-secondary"
                        />
                        <span>Online Payment</span>
                      </label>
                    </div>
                  </div>

                  {/* Terms and Conditions */}
                  <div className="mb-6">
                    <label className="flex items-center space-x-2">
                      <Field
                        type="checkbox"
                        name="acceptedTerms"
                        className="form-checkbox text-secondary"
                      />
                      <span className="text-sm">
                        I have read and agree to the Terms & Conditions
                      </span>
                    </label>
                    {errors.acceptedTerms && touched.acceptedTerms && (
                      <div className="text-red-500 text-sm mt-1">
                        {errors.acceptedTerms}
                      </div>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-secondary text-white px-6 py-2 rounded disabled:opacity-50"
                  >
                    {isSubmitting ? "Placing Order..." : "Place Order"}
                  </button>
                </div>
              
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default CheckoutPage;

import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { updateVendor, fetchVendorProfile } from "../../redux/vendorSlice";
import { useDispatch, useSelector } from "react-redux";
import { Edit } from "lucide-react";
import * as Yup from "yup";
import { Card, CardContent, CardHeader } from "@mui/material";

const VendorProfile = () => {
  const dispatch = useDispatch();
  const vendor = useSelector((state) => state.vendors.vendor);
  const { auth } = useSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (auth?.user_id) {
      dispatch(fetchVendorProfile(auth.user_id));
    }
  }, [dispatch, auth?.user_id]);

  if (!vendor) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  const parsedBankDetails =
    typeof vendor.bank_account_details === "string"
      ? JSON.parse(vendor.bank_account_details)
      : vendor.bank_account_details;

  const parsedBrandDetails =
    typeof vendor.brand_details === "string"
      ? JSON.parse(vendor.brand_details)
      : vendor.brand_details;

  const initialValues = {
    vendor_name: vendor.vendor_name,
    email: vendor.vendor_email || "",
    phone: vendor.vendor_phone || "",
    address: vendor.address || "",
    store_name: vendor.store_name || "",
    registration_number: vendor.registration_number || "",
    bank_account_details: {
      ifsc: parsedBankDetails?.ifsc || "",
      bank_name: parsedBankDetails?.bank_name || "",
      account_number: parsedBankDetails?.account_number || "",
    },
    brand_details: {
      name: parsedBrandDetails?.name || "",
      category: parsedBrandDetails?.category || "",
      brandType: parsedBrandDetails?.brandType || "",
      description: parsedBrandDetails?.description || "",
    },
    logo_url: parsedBrandDetails?.logo_url || "",
    annual_turnover: vendor.annual_turnover || "0.00",
    monthly_turnover: vendor.monthly_turnover || "0.00",
  };

  const validationSchema = Yup.object({
    vendor_name: Yup.string().required("Required"),
    email: Yup.string().email("Invalid email").required("Required"),
    phone: Yup.string().required("Required"),
    address: Yup.string().required("Required"),
    store_name: Yup.string().required("Required"),
    registration_number: Yup.string().required("Required"),
    bank_account_details: Yup.object({
      ifsc: Yup.string().required("Required"),
      bank_name: Yup.string().required("Required"),
      account_number: Yup.string().required("Required"),
    }),
    brand_details: Yup.object({
      name: Yup.string().required("Required"),
      category: Yup.string().required("Required"),
      brandType: Yup.string().required("Required"),
      description: Yup.string().required("Required"),
    }),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const formData = new FormData();
      console.log(values);

      Object.keys(values).forEach((key) => {
        if (key === "logo_url" && values[key]) {
          formData.append("logo_url", values[key]);
        } else if (key === "bank_account_details" || key === "brand_details") {
          formData.append(key, JSON.stringify(values[key]));
        } else {
          formData.append(key, values[key]);
        }
      });
      await dispatch(
        updateVendor({ vendorId: auth.user_id, updatedData: formData })
      );
      setSubmitting(false);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating vendor:", error);
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto ">
      {/* Header Section */}
      <div className="w-full flex justify-end">
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Edit Profile
          </button>
        )}
      </div>
      {isEditing ? (
        <div className="p-8 space-y-8 ">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ errors, touched, isSubmitting, setFieldValue }) => (
              <Form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(initialValues).map(([key, value]) => (
                    <div key={key}>
                      <label className="block text-sm font-medium text-gray-700 capitalize">
                        {key.replace(/_/g, " ")}
                      </label>
                      {key === "logo_url" ? (
                        // Input for logo_url as file type
                        <>
                          <input
                            name="logo_url"
                            className="mt-1 block w-full rounded-lg border-gray-300 border focus:border-blue-500 focus:ring-2 focus:ring-blue-500 px-3 py-2"
                            type="file"
                            onChange={(e) =>
                              setFieldValue("logo_url", e.target.files[0])
                            }
                          />
                          <ErrorMessage
                            name={key}
                            component="div"
                            className="text-red-500 text-sm mt-1"
                          />
                        </>
                      ) : typeof value === "object" && value !== null ? (
                        Object.entries(value).map(([subKey, subValue]) => (
                          <div key={subKey} className="ml-4">
                            <label className="block text-sm font-medium text-gray-700 capitalize">
                              {subKey.replace(/_/g, " ")}
                            </label>

                            <Field
                              name={`${key}.${subKey}`}
                              className="mt-1 block w-full rounded-lg border-gray-300 border focus:border-blue-500 focus:ring-2 focus:ring-blue-500 px-3 py-2"
                            />

                            <ErrorMessage
                              name={`${key}.${subKey}`}
                              component="div"
                              className="text-red-500 text-sm mt-1"
                            />
                          </div>
                        ))
                      ) : (
                        <>
                          <Field
                            name={key}
                            className="mt-1 block w-full rounded-lg border-gray-300 border focus:border-blue-500 focus:ring-2 focus:ring-blue-500 px-3 py-2"
                          />

                          <ErrorMessage
                            name={key}
                            component="div"
                            className="text-red-500 text-sm mt-1"
                          />
                        </>
                      )}
                    </div>
                  ))}
                </div>

                {isEditing && (
                  <div className="flex justify-between">
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => setIsEditing(false)}
                      className="px-6 py-3 bg-primary text-white rounded-lg shadow hover:bg-secondary/80 focus:outline-none focus:ring-4 focus:ring-secondary transition"
                    >
                      {isSubmitting ? "Saving..." : "Cancel"}
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-3 bg-secondary text-white rounded-lg shadow hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-400 transition"
                    >
                      {isSubmitting ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                )}
              </Form>
            )}
          </Formik>
        </div>
      ) : (
        <>
          <div className="flex items-center space-x-6 mb-6">
            <div className="w-24 h-24 rounded-full bg-gray-200">
              {/* Placeholder for Avatar */}
              <img src={vendor?.brand_details?.logo_url}/>
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">
                {vendor?.vendor_name}
              </h2>
              <p className="text-sm text-gray-600">{vendor?.store_name}</p>
              <p className="text-sm text-gray-500">{vendor?.vendor_email}</p>
            </div>
          </div>

          {/* Business Info Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="p-4 bg-gray-50 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900">
                Business Info
              </h3>
              <p className="text-sm text-gray-600">
                Store Name: {vendor?.store_name}
              </p>
              <p className="text-sm text-gray-600">
                Registration Number: {vendor?.registration_number}
              </p>
              <p className="text-sm text-gray-600">Address: {vendor.address}</p>
              <p className="text-sm text-gray-600">
                Category: {vendor?.brand_details?.category}
              </p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900">
                Bank Account
              </h3>
              <p className="text-sm text-gray-600">
                Bank Name: {vendor?.bank_account_details?.bank_name}
              </p>
              <p className="text-sm text-gray-600">
                Account Number: {vendor?.bank_account_details?.account_number}
              </p>
              <p className="text-sm text-gray-600">
                IFSC Code: {vendor?.bank_account_details?.ifsc}
              </p>
            </div>
          </div>

          {/* Financial Info Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="p-4 bg-gray-50 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900">Turnover</h3>
              <p className="text-sm text-gray-600">
                Annual Turnover: ${vendor?.annual_turnover}
              </p>
              <p className="text-sm text-gray-600">
                Monthly Turnover: ${vendor?.monthly_turnover}
              </p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900">
                Sales & Ratings
              </h3>
              <p className="text-sm text-gray-600">
                Total Sales: ${vendor?.total_sales}
              </p>
              <p className="text-sm text-gray-600">
                Rating: {vendor?.rating} / 5
              </p>
            </div>
          </div>

          {/* Account & Vendor Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="p-4 bg-gray-50 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900">
                Account Status
              </h3>
              <p className="text-sm text-gray-600">
                Login Status: {vendor.login_status}
              </p>
              <p className="text-sm text-gray-600">
                KYC Status: {vendor.kyc_status}
              </p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900">
                Platform Fee
              </h3>
              <p className="text-sm text-gray-600">
                Platform Fee Rate: {vendor?.platform_fee_rate}%
              </p>
            </div>
          </div>

          {/* Brand Info */}
          <div className="p-4 bg-gray-50 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900">Brand Info</h3>
            <p className="text-sm text-gray-600">
              Brand Name: {vendor?.brand_details?.name}
            </p>
            <p className="text-sm text-gray-600">
              Brand Type: {vendor?.brand_details?.brandType}
            </p>
            <p className="text-sm text-gray-600">
              Description: {vendor?.brand_details?.description}
            </p>
          </div>

          {/* User Info */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900">User Info</h3>
            <p className="text-sm text-gray-600">
              Username: {vendor?.user_username}
            </p>
            <p className="text-sm text-gray-600">
              Full Name: {vendor?.user_firstname} {vendor?.user_lastname}
            </p>
            <p className="text-sm text-gray-600">Email: {vendor?.user_email}</p>
            <p className="text-sm text-gray-600">Role: {vendor?.role}</p>
          </div>
        </>
      )}
    </div>
  );
};

export default VendorProfile;

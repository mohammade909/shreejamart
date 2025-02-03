import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { fetchCategories } from "../../redux/categorySlice";
import { useDispatch, useSelector } from "react-redux";
import { createProduct, resetState } from "../../redux/productsSlice";
import SuccessModal from "../SuccessModal";
import ErrorModal from "../ErrorModal";
import Spinner from "../Spinner";
const ProductForm = () => {
  const [featuredImagePreview, setFeaturedImagePreview] = useState(null);
  const [otherImagesPreview, setOtherImagesPreview] = useState([]);
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.categories);
  const { message, error, loading } = useSelector((state) => state.products);
  const vendor = useSelector((state) => state.vendors.vendor);
  const [open, setOpen] = useState(false);

  const [openError, setOpenError] = useState(false);
  useEffect(() => {
    dispatch(fetchCategories());
  }, []);
  const initialValues = {
    name: "",
    description: "",
    price: "",
    unit_of_measurement: "",
    stock_quantity: "",
    category_id: "",
    featured_image: null,
    other_images: [],
    expiry_date: "",
    weight: "",
    quantitiy: "",
    is_perishable: false,
    discount_percentage: "",
    status: "available",
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Product name is required"),
    description: Yup.string().required("Description is required"),
    price: Yup.number()
      .required("Price is required")
      .positive("Must be positive"),
    unit_of_measurement: Yup.string().required(
      "Unit of measurement is required"
    ),
    stock_quantity: Yup.number()
      .required("Stock quantity is required")
      .min(0, "Stock quantity cannot be negative"),
    category_id: Yup.string().required("Category  is required"),
    expiry_date: Yup.date().required("Expiry date is required"),
    discount_percentage: Yup.number()
      .required("Discount percentage is required")
      .min(0, "Discount cannot be negative"),
    status: Yup.string().required("Status is required"),
  });

  const handleSubmit = (values) => {
    values.vendor_id = vendor?.vendor_id;
    dispatch(createProduct(values));
  };

  const handleFeaturedImageChange = (event, setFieldValue) => {
    const file = event.target.files[0];
    setFieldValue("featured_image", file);
    setFeaturedImagePreview(file ? URL.createObjectURL(file) : null);
  };

  const handleOtherImagesChange = (event, setFieldValue) => {
    const files = Array.from(event.target.files);
    setFieldValue("other_images", files);
    setOtherImagesPreview(files.map((file) => URL.createObjectURL(file)));
  };
  const removeOtherImage = (index, setFieldValue, values) => {
    const updatedImages = [...values.other_images];
    updatedImages.splice(index, 1);
    setFieldValue("other_images", updatedImages);

    const updatedPreviews = [...otherImagesPreview];
    updatedPreviews.splice(index, 1);
    setOtherImagesPreview(updatedPreviews);
  };
  useEffect(() => {
    if (message) {
      setOpen(true);
    }
    if (error) {
      setOpenError(true);
    }
  }, [message, error]);
  return (
    <div className="max-w-5xl mx-auto p-8  rounded-md">
      <h1 className="text-2xl font-bold mb-6">Add Product Stock</h1>
      <SuccessModal
        open={open}
        setOpen={setOpen}
        message={message}
        reset={resetState}
      />
      <ErrorModal
        open={openError}
        setOpen={setOpenError}
        error={error}
        reset={resetState}
      />
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue, values }) => (
          <Form className="">
            <div className="grid grid-cols-2 gap-4 ">
              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="name"
                >
                  Product Name
                </label>
                <Field
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Enter Product Name"
                  className="w-full border rounded px-2 py-2 text-sm border-gray-300"
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="price"
                >
                  Price ($)
                </label>
                <Field
                  type="number"
                  id="price"
                  name="price"
                  placeholder="Enter Price"
                  className="w-full border rounded px-2 py-2 text-sm border-gray-300"
                />
                <ErrorMessage
                  name="price"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="weight"
                >
                  Product weight
                </label>
                <Field
                  type="number"
                  id="weight"
                  name="weight"
                  placeholder="Enter Product weight"
                  className="w-full border rounded px-2 py-2 text-sm border-gray-300"
                />
              </div>
              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="quantitiy"
                >
                  Quantitiy
                </label>
                <Field
                  type="number"
                  id="quantitiy"
                  name="quantitiy"
                  placeholder="Enter quantitiy"
                  className="w-full border rounded px-2 py-2 text-sm border-gray-300"
                />
              </div>
              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="unit_of_measurement"
                >
                  Unit of Measurement
                </label>
                <Field
                  as="select"
                  id="unit_of_measurement"
                  name="unit_of_measurement"
                  className="w-full border rounded px-2 py-2 text-sm border-gray-300"
                >
                  <option value="">Select unit</option>
                  <option value="litre">Litre</option>
                  <option value="piece">Piece</option>
                  <option value="kg">Kg</option>
                </Field>
                <ErrorMessage
                  name="unit_of_measurement"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="stock_quantity"
                >
                  Stock Quantity
                </label>
                <Field
                  type="number"
                  id="stock_quantity"
                  name="stock_quantity"
                  placeholder="Enter Stock Quantity"
                  className="w-full border rounded px-2 py-2 text-sm border-gray-300"
                />
                <ErrorMessage
                  name="stock_quantity"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="category_id"
                >
                  Category
                </label>
                <Field
                  as="select"
                  id="category_id"
                  name="category_id"
                  className="w-full border rounded px-2 py-[9.5px] text-sm border-gray-300"
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option
                      key={category.category_id}
                      value={category.category_id}
                    >
                      {category.name}
                    </option>
                  ))}
                </Field>
                <ErrorMessage
                  name="category_id"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="expiry_date"
                >
                  Expiry Date
                </label>
                <Field
                  type="date"
                  id="expiry_date"
                  name="expiry_date"
                  className="w-full border rounded px-2 py-2 text-sm border-gray-300 "
                />
                <ErrorMessage
                  name="expiry_date"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="featured_image"
                >
                  Featured Image
                </label>
                <input
                  type="file"
                  id="featured_image"
                  name="featured_image"
                  className="w-full border rounded px-2 py-2 text-sm border-gray-300 bg-white"
                  onChange={(event) =>
                    handleFeaturedImageChange(event, setFieldValue)
                  }
                />
                {featuredImagePreview && (
                  <img
                    src={featuredImagePreview}
                    alt="Featured Preview"
                    className="mt-4 w-32 h-32 object-cover border "
                  />
                )}
                <ErrorMessage
                  name="featured_image"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="other_images"
                >
                  Other Images (Multiple)
                </label>
                <input
                  type="file"
                  id="other_images"
                  name="other_images"
                  multiple
                  className="w-full border rounded px-2 py-2 text-sm border-gray-300 bg-white"
                  onChange={(event) =>
                    handleOtherImagesChange(event, setFieldValue)
                  }
                />
              </div>
              <div className="mb-3">
                {otherImagesPreview.map((image, index) => (
                  <div key={index} className="relative ">
                    <img
                      src={image}
                      alt={`Other Preview ${index + 1}`}
                      className="w-32 h-32 object-cover border"
                    />
                    <button
                      type="button"
                      className="absolute top-0 right-0 bg-red-500 text-white text-sm  rounded-full w-6 h-6 flex items-center justify-center"
                      onClick={() =>
                        removeOtherImage(index, setFieldValue, values)
                      }
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center mb-4">
              <Field
                type="checkbox"
                id="is_perishable"
                name="is_perishable"
                className="h-4 w-4 mr-2"
              />
              <label
                className="block text-sm font-medium"
                htmlFor="is_perishable"
              >
                Is Perishable
              </label>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="discount_percentage"
                >
                  Discount Percentage (%)
                </label>
                <Field
                  type="number"
                  id="discount_percentage"
                  name="discount_percentage"
                  placeholder="Enter a percentage"
                  className="w-full border border-gray-300 rounded px-2 py-2 text-sm"
                />
                <ErrorMessage
                  name="discount_percentage"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="status"
                >
                  Status
                </label>
                <Field
                  as="select"
                  id="status"
                  name="status"
                  className="w-full border rounded px-2 py-2 text-sm  border-gray-300"
                >
                  <option value="available">Available</option>
                  <option value="unavailable">Unavailable</option>
                </Field>
                <ErrorMessage
                  name="status"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
            </div>
            <div className="mb-4 Reactquill">
              <label
                className="block text-sm font-medium mb-1"
                htmlFor="description"
              >
                Description
              </label>
              <ReactQuill
                value={values.description}
                onChange={(value) => setFieldValue("description", value)}
                className="bg-white border rounded "
                // style={{ height: "300px" }}
              />
              <ErrorMessage
                name="description"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>
            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                className={`px-4 py-2 text-sm font-semibold rounded flex items-center justify-center transition-all ${
                  loading
                    ? "bg-blue-400 text-blue-200 cursor-not-allowed"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
                disabled={loading}
              >
                {loading ? <Spinner /> : "Submit"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ProductForm;

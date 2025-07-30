import React, { useEffect , useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  fetchCategories,
  createCategory,
  resetState,
} from "../../../redux/categorySlice";
import SuccessModal from "../../../components/SuccessModal";
import ErrorModal from "../../../components/ErrorModal";

const CategoryForm = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  const [openError, setOpenError] = useState(false);
  const { categories, loading, error, message } = useSelector(
    (state) => state.categories
  );

  // Fetch existing categories for the parent category dropdown
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // Validation schema
  const validationSchema = Yup.object({
    name: Yup.string().required("Category name is required"),
    description: Yup.string().required("Description is required"),
    parent_category_id: Yup.number().nullable(),
  });

  const initialValues = {
    name: "",
    description: "",
    parent_category_id: "",
  };

  const handleSubmit = (values, { resetForm }) => {
    dispatch(createCategory(values));
    resetForm();
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
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Create New Category
      </h2>
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
        {({ isSubmitting }) => (
          <Form>
            {/* Category Name */}
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Category Name
              </label>
              <Field
                name="name"
                type="text"
                placeholder="Enter category name"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              />
              <ErrorMessage
                name="name"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Description */}
            <div className="mb-4">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Description
              </label>
              <Field
                name="description"
                as="textarea"
                placeholder="Enter description"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              />
              <ErrorMessage
                name="description"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Parent Category */}
            <div className="mb-4">
              <label
                htmlFor="parent_category_id"
                className="block text-sm font-medium text-gray-700"
              >
                Parent Category (Optional)
              </label>
              <Field
                name="parent_category_id"
                as="select"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              >
                <option value="">None</option>
                {categories?.map((category) => (
                  <option
                    key={category.category_id}
                    value={category.category_id}
                  >
                    {category.name}
                  </option>
                ))}
              </Field>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-secondary hover:bg-secondary text-white px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {isSubmitting ? "Submitting..." : "Create Category"}
              </button>
            </div>
          </Form>
        )}
      </Formik>

      {/* Loading State */}
      {loading && (
        <div className="mt-4 text-green-600 text-center">
          Loading categories...
        </div>
      )}
    </div>
  );
};

export default CategoryForm;

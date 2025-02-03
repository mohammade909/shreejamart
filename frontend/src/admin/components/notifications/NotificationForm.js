import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import {
  createNotification,
  resetState,
} from "../../../redux/notificationSlice";
import SuccessModal from "../../../components/SuccessModal";
import ErrorModal from "../../../components/ErrorModal";
import Spinner from "../../../components/Spinner";
import { getUsers } from '../../../redux/usersSlice';

// Validation schema
const validationSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  message: Yup.string().required("Message is required"),
  users: Yup.boolean(),
  type: Yup.string().oneOf(['info', 'warning', 'alert', 'success'], "Invalid type").required("Type is required"),
});

const NotificationForm = () => {
  const dispatch = useDispatch();
  const { users } = useSelector((state) => state.users);

  const [searchResults, setSearchResults] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]); // Track selected users
  const [open, setOpen] = useState(false);
  const [openError, setOpenError] = useState(false);
  
  const { loading, error, message } = useSelector(
    (state) => state.notifications
  );

  useEffect(() => {
    if (message) {
      setOpen(true);
    }
    if (error) {
      setOpenError(true);
    }
  }, [message, error]);

  useEffect(() => {
    dispatch(getUsers({ page: 1, limit: 50, token: "tkn" }));
  }, [dispatch]);

  const handleUserSearch = (searchTerm) => {
    if (searchTerm) {
      const filteredUsers = users.filter((user) =>
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(filteredUsers);
    } else {
      setSearchResults([]);
    }
  };

  const handleUserSelect = (user) => {
    if (selectedUsers.includes(user.user_id)) {
      setSelectedUsers(selectedUsers.filter(id => id !== user.user_id)); // Remove user if already selected
    } else {
      setSelectedUsers([...selectedUsers, user.user_id]); // Add user to selection
    }
  };

  return (
    <>
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

      <div className="container mx-auto mt-6 p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Create Notification</h1>

        <Formik
          initialValues={{
            title: "",
            message: "",
            users: true,
            type: "",
          }}
          validationSchema={validationSchema}
          onSubmit={(values, { resetForm }) => {
            // Prepare values including selected user IDs
            const notificationData = { ...values, recipients: selectedUsers };
            console.log(notificationData);
            dispatch(createNotification(notificationData));
            // resetForm();
          }}
        >
          {({ errors, touched, setFieldValue, values }) => (
            <Form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-semibold mb-1">Title</label>
                  <Field
                    name="title"
                    as="input"
                    className="block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <ErrorMessage name="title" component="div" className="text-red-600 text-sm mt-1" />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-semibold mb-1">Type</label>
                  <Field
                    name="type"
                    as="select"
                    className="block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Choose type</option>
                    <option value="info">Information</option>
                    <option value="warning">Warning</option>
                    <option value="alert">Alert</option>
                  </Field>
                  <ErrorMessage name="type" component="div" className="text-red-600 text-sm mt-1" />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-semibold mb-1">Message</label>
                <Field
                  name="message"
                  as="textarea"
                  className="block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="4"
                />
                <ErrorMessage name="message" component="div" className="text-red-600 text-sm mt-1" />
              </div>

              <div className="flex items-center mb-4">
                <Field
                  type="checkbox"
                  name="users"
                  checked={values.users}
                  className="mr-2"
                  onChange={(e) => {
                    const isChecked = e.target.checked;
                    setFieldValue("users", isChecked);
                    if (isChecked) {
                      setSelectedUsers([]); // Clear selected users when checked
                    }
                  }}
                />
                <label className="text-gray-700 text-sm font-semibold">All Users</label>
              </div>

              {!errors.users && !values.users && (
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-semibold mb-1">Search User</label>
                  <input
                    type="text"
                    placeholder="Search user"
                    onChange={(e) => handleUserSearch(e.target.value)}
                    className="block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {searchResults.length > 0 && (
                    <div className="mt-2 bg-gray-100 rounded-md p-2 border border-gray-300">
                      {searchResults.map((user) => (
                        <div key={user.user_id} className="flex items-center mb-2">
                          <Field
                            type="checkbox"
                            name="userId"
                            checked={selectedUsers.includes(user.user_id)}
                            onChange={() => handleUserSelect(user)}
                            className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label className="text-gray-700">{user.username}</label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Show selected users */}
              {selectedUsers.length > 0 && (
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-semibold mb-1">Selected Users:</label>
                  <div className="p-2 border border-gray-300 rounded-md bg-gray-50">
                    {selectedUsers.map(userId => {
                      const user = users.find(u => u.user_id === userId);
                      return user ? (
                        <span key={userId} className="bg-blue-100 text-blue-800 py-1 px-2 rounded mr-2">
                          {user.username}
                        </span>
                      ) : null;
                    })}
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-2 rounded-md text-white font-semibold ${
                  loading
                    ? "bg-blue-300 opacity-70 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600 transition duration-200"
                }`}
              >
                {loading ? <Spinner /> : "Create"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
};

export default NotificationForm;

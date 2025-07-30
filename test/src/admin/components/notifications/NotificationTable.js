import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ConfirmPopup from "../../../components/ConfirmPopup";
import {
  getAllNotifications,
  // deleteNotification,
  // updateNotification,
  resetState,
} from "../../../redux/notificationSlice"; // Redux actions for notifications
import { Formik, Form, Field, ErrorMessage } from "formik";
import SuccessModal from "../../../components/SuccessModal";
import ErrorModal from "../../../components/ErrorModal";
import * as Yup from "yup";

const NotificationsTable = () => {
  const dispatch = useDispatch();
  const { notifications, loading, error, message } = useSelector(
    (state) => state.notifications
  );
  const [open, setOpen] = useState(false);
  const [notificationId, setNotificationId] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [notificationToEdit, setNotificationToEdit] = useState(null);
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openError, setOpenError] = useState(false);

  useEffect(() => {
    dispatch(getAllNotifications()); // Fetch notifications on component load

    if (message) {
      setOpenSuccess(true);
    }
    if (error) {
      setOpenError(true);
    }
  }, [dispatch, message, error]);

  const handleDelete = (id) => {
    setNotificationId(id);
    setOpen(true);
  };

  const handleEdit = (notification) => {
    setNotificationToEdit(notification);
    setEditModalOpen(true);
  };

  // Validation schema for editing the notification
  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    message: Yup.string().required("Message is required"),
    type: Yup.string().oneOf(['info', 'warning', 'error', 'success'], "Invalid type").required("Type is required"),
    status: Yup.string().oneOf(['unread', 'read'], "Invalid status").required("Status is required"),
  });

  return (
    <div className="overflow-x-auto">
      <SuccessModal
        open={openSuccess}
        setOpen={setOpenSuccess}
        message={message}
        reset={resetState}
      />
      <ErrorModal
        open={openError}
        setOpen={setOpenError}
        error={error}
        reset={resetState}
      />
      <table className="min-w-full table-auto border-collapse border border-gray-400 bg-white text-sm">
        <thead>
          <tr className="bg-gray-100 text-gray-800 uppercase">
            <th className="border border-gray-300 px-4 py-2 text-center">#</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Title</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Message</th>
            <th className="border border-gray-300 px-4 py-2 text-left">All User</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Type</th>
            <th className="border border-gray-300 px-4 py-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {notifications?.map((notification, index) => (
            <tr
              key={notification.notification_id}
              className="hover:bg-gray-50 hover:underline hover:cursor-pointer"
            >
              <td className="border border-gray-300 px-4 py-2 text-center">{index + 1}</td>
              <td className="border border-gray-300 px-4 py-2 text-justify">{notification.title}</td>
              <td className="border border-gray-300 px-4 py-2 text-justify">{notification.message}</td>
              <td className="border border-gray-300 px-4 py-2">{notification?.users ? 'True': 'False'}</td>
              <td className="border border-gray-300 px-4 py-2">{notification.type}</td>
              <td className="border border-gray-300 px-4 py-2 text-center">
                {/* <button
                  onClick={() => handleEdit(notification)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                >
                  Edit
                </button> */}
                <button
                  // onClick={() => handleDelete(notification.id)}
                  className="text-red-500  py-1 rounded hover:text-red-600 ml-2"
                  >
                   <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="w-5 h-5"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                      />
                    </svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Confirmation Popup */}
      {/* <ConfirmPopup
        isOpen={open}
        onClose={() => setOpen(false)}
        actionFunction={deleteNotification}
        message="Are you sure you want to delete this notification?"
        id={notificationId}
      /> */}

      {/* Edit Modal */}
      {/* {editModalOpen && notificationToEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-lg font-semibold mb-4">Edit Notification</h2>
            <Formik
              initialValues={{
                title: notificationToEdit.title,
                message: notificationToEdit.message,
                type: notificationToEdit.type,
                status: notificationToEdit.status,
              }}
              validationSchema={validationSchema}
              onSubmit={(values) => {
                dispatch(
                  updateNotification({
                    notificationData: values,
                    notificationId: notificationToEdit.notification_id,
                  })
                );
                setEditModalOpen(false); // Close modal after update
              }}
            >
              {() => (
                <Form className="space-y-4">
                  <div>
                    <label className="block text-gray-700">Title</label>
                    <Field
                      name="title"
                      className="w-full p-2 border rounded-md text-sm"
                    />
                    <ErrorMessage
                      name="title"
                      component="div"
                      className="text-red-600"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700">Message</label>
                    <Field
                      name="message"
                      as="textarea"
                      className="w-full p-2 border rounded-md text-sm"
                    />
                    <ErrorMessage
                      name="message"
                      component="div"
                      className="text-red-600"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700">Type</label>
                    <Field
                      as="select"
                      name="type"
                      className="w-full p-2 border rounded-md text-sm"
                    >
                      <option value="info">Info</option>
                      <option value="warning">Warning</option>
                      <option value="error">Error</option>
                      <option value="success">Success</option>
                    </Field>
                    <ErrorMessage
                      name="type"
                      component="div"
                      className="text-red-600"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700">Status</label>
                    <Field
                      as="select"
                      name="status"
                      className="w-full p-2 border rounded-md text-sm"
                    >
                      <option value="unread">Unread</option>
                      <option value="read">Read</option>
                    </Field>
                    <ErrorMessage
                      name="status"
                      component="div"
                      className="text-red-600"
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <button
                      type="button"
                      className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                      onClick={() => setEditModalOpen(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                      Save Changes
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default NotificationsTable;

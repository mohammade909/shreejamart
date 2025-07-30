import React from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
const ConfirmPopup = ({ isOpen, onClose, actionFunction, id, message }) => {
    const dispatch = useDispatch();
  if (!isOpen) return null; // Don't render the popup if it's closed

  const handleConfirm = () => {
    dispatch(actionFunction(id));
       // Call the action function with the provided ID
    onClose(); // Close the popup
    toast.success("Action performed successfully!"); // Show success toast
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h3 className="text-lg font-bold mb-4">Confirmation</h3>
        <p className="mb-6">{message}</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmPopup;

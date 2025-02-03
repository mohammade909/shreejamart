import React from 'react';
import { Field, ErrorMessage } from 'formik';
import { FaUpload } from 'react-icons/fa'; // Using react-icons for the upload icon

const FileUploadComponent = ({ setFieldValue }) => {
  // Ref to the hidden file input
  const fileInputRef = React.useRef(null);

  // Handle file change
  const handleFileChange = (event) => {
    const file = event.currentTarget.files[0];
    setFieldValue('profile_photo', file); // Set file in Formik's state
  };

  // Function to handle the click on the custom upload box
  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Programmatically click the hidden input
    }
  };

  return (
    <div>
      <label className="block text-gray-700 mb-2">Profile Photo</label>

      {/* Hidden file input */}
      <input
        name="profile_photo"
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange} // Handle file selection
      />

      {/* Custom upload box */}
      <div
        onClick={handleUploadClick}
        className="w-40 h-40 flex items-center justify-center border border-dashed border-gray-400 rounded-md cursor-pointer"
      >
        <FaUpload className="text-gray-600 text-2xl" />
        <span className="ml-2 text-gray-600">Upload</span>
      </div>

      {/* Error message */}
      <ErrorMessage
        name="profile_photo"
        component="div"
        className="text-red-600 mt-2"
      />
    </div>
  );
};

export default FileUploadComponent;

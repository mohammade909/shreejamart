import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateUser, getUserById } from "../../redux/usersSlice";
import toast from "react-hot-toast";

const UserdetailsForm = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.users);
  const { auth } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    firstname: user?.firstname || "",
    lastname: user?.lastname || "",
    email: user?.email || "",
    address: user?.address || "",
  });

  useEffect(() => {
    if (auth.user_id) {
      dispatch(getUserById(auth.user_id));
    }
  }, [auth.user_id, dispatch]);
 
  useEffect(() => {
    setFormData({
      firstname: user?.firstname || "",
      lastname: user?.lastname || "",
      email: user?.email || "",
      address: user?.address || "",
    });
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };


  const handleSave = () => {
    dispatch(updateUser({ userId: auth.user_id, updatedData: formData }))
      .then(() => toast.success("User details updated successfully"))
      .catch(() => toast.error("Failed to update user details"));
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-medium text-gray-700 mb-6">
        User information
      </h2>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 mb-2">
              First Name<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="firstname"
              value={formData.firstname}
              onChange={handleChange}
              placeholder="Enter your first name"
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">
              Last Name<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
              placeholder="Enter your last name"
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Email</label>

          <input
            type="text"
            
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email Address"
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-2">Address</label>
          <textarea
            type="text"
            cols={4}
            rows={3}
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Address Line 1"
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>

        <div className="pt-4">
          <button
            onClick={handleSave}
            type="button"
            className="w-full bg-secondary text-white py-2 px-4 rounded-md hover:bg-secondary/50 transition-colors duration-200"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserdetailsForm;

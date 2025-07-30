import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getUsers } from "../../actions/user";
import { Formik, Form, Field } from "formik";
import {
  getPermissions,
  addPermissions,
  addPermissionColumn,
  getUserPermissions,
} from "../../AccessControl/actions/accessControl";
import { Switch } from "@headlessui/react";

const tabs = [
  { name: "Manage Permissions", id: "permissions" },
  { name: "Configurations", id: "configurations" },
];

const AccessControl = () => {
  const { role } = useParams();
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { users } = useSelector((state) => state.users);
  const { permissions } = useSelector((state) => state.permissions);
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState({});
  const [addingConfiguration, setAddingConfiguration] = useState(false);
  const [newEntityName, setNewEntityName] = useState("");
  const [activeTab, setActiveTab] = useState("permissions");

  useEffect(() => {
    dispatch(getUsers({ user_type: role, token }));
    dispatch(getPermissions());
  }, [dispatch, role, token]);

  const handleSearch = (e) => {
    e.preventDefault();
    const foundUser = users.find((user) => user.email === searchQuery);
    setUser(foundUser);
    setOpen(true);
    if (foundUser) {
      dispatch(getUserPermissions(foundUser.user_id));
    }
  };

  const handleSwitchChange = (column, permission) => {
    setSelectedPermissions((prev) => {
      const updatedPermissions = { ...prev };
      if (!updatedPermissions[column]) {
        updatedPermissions[column] = [];
      }
      if (updatedPermissions[column].includes(permission)) {
        updatedPermissions[column] = updatedPermissions[column].filter(
          (perm) => perm !== permission
        );
      } else {
        updatedPermissions[column].push(permission);
      }
      return updatedPermissions;
    });
  };

  const handleSubmit = (values, { resetForm }) => {
    const formattedValues = {
      user_id: user.user_id, // Assuming you have user data with an id field
      ...selectedPermissions,
    };
    dispatch(addPermissions(formattedValues));
    resetForm(); // Reset Formik form
    setSelectedPermissions({}); // Clear selected permissions
    setSearchQuery(""); // Clear search query
    setOpen(false); // Close the form
  };

  const handleAddConfiguration = () => {
    setAddingConfiguration(true);
  };

  const handleSaveConfiguration = () => {
    if (newEntityName.trim()) {
   
      dispatch(addPermissionColumn(newEntityName));
      setAddingConfiguration(false);
      setNewEntityName("");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-4 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {activeTab === "permissions" && (
        <>
          <form
            onSubmit={handleSearch}
            className="mb-4 flex items-center space-x-2"
          >
            <input
              type="text"
              placeholder="Search by email"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="p-2 border border-gray-300 rounded-md w-full"
            />
            <button
              type="submit"
              className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Search
            </button>
          </form>

          {open && user && (
            <div className="bg-white p-6 rounded-md shadow-md">
              <h2 className="text-xl font-semibold mb-4">
                Set Permissions for {user.first_name} {user.last_name}
              </h2>
              <p className="mb-4">
                <strong>Email:</strong> {user.email}
              </p>
              <p className="mb-4">
                <strong>Role:</strong> {user.user_type}
              </p>

              <Formik initialValues={{}} onSubmit={handleSubmit}>
                <Form>
                  {permissions.map((column) => (
                    <div
                      key={column}
                      className="mb-4 flex gap-4 justify-center items-center"
                    >
                      <div>
                        <h3 className="text-lg font-medium mb-2">{column}</h3>
                      </div>
                      {["create", "read", "update", "delete"].map(
                        (permission) => (
                          <div
                            key={`${column}-${permission}`}
                            className="flex items-center mb-2 shadow p-3"
                          >
                            <span className="mr-2 w-20">{permission}</span>
                            <Switch
                              checked={
                                selectedPermissions[column]?.includes(
                                  permission
                                ) || false
                              }
                              onChange={() =>
                                handleSwitchChange(column, permission)
                              }
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out ${
                                selectedPermissions[column]?.includes(
                                  permission
                                )
                                  ? "bg-indigo-600"
                                  : "bg-gray-200"
                              }`}
                            >
                              <span className="sr-only">
                                Toggle {permission}
                              </span>
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out ${
                                  selectedPermissions[column]?.includes(
                                    permission
                                  )
                                    ? "translate-x-6"
                                    : "translate-x-1"
                                }`}
                              />
                            </Switch>
                          </div>
                        )
                      )}
                    </div>
                  ))}
                  <button
                    type="submit"
                    className="p-2 bg-secondary text-white rounded-md hover:bg-secondary"
                  >
                    Save Permissions
                  </button>
                </Form>
              </Formik>

              <div className="mt-6">
                <h3 className="text-lg font-medium mb-2">
                  Current Permissions
                </h3>
                {Object.entries(selectedPermissions).map(([entity, perms]) => (
                  <div key={entity} className="mb-2">
                    <strong>{entity}:</strong> {perms.join(", ")}
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {activeTab === "configurations" && (
        <div className="bg-white p-6 rounded-md shadow-md">
          <h2 class="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
            Configuration
          </h2>

          <ul class="max-w-md space-y-1 text-gray-500 list-inside dark:text-gray-400">
            {permissions?.map((item, index) => (
              <li class="flex items-center" key={index}>
                <svg
                  class="w-3.5 h-3.5 me-2 text-green-500 dark:text-green-400 flex-shrink-0"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                </svg>
                {item}
              </li>
            ))}
          </ul>

         

          {addingConfiguration ? (
            <div className="mt-6">
              <input
                type="text"
                placeholder="Enter new entity name"
                value={newEntityName}
                onChange={(e) => setNewEntityName(e.target.value)}
                className="p-2 border border-gray-300 rounded-md w-full mb-4"
              />
              <button
                onClick={handleSaveConfiguration}
                className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Save Configuration
              </button>
            </div>
          ) : (
            <button
              onClick={handleAddConfiguration}
              className="p-2 bg-blue-500 mt-5 text-white rounded-md hover:bg-blue-600"
            >
              Add Configuration
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default AccessControl;

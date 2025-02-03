// 'use client';

// import { useState } from 'react';
// import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
// import { CheckIcon } from '@heroicons/react/24/outline';
// import { Formik, Form, Field } from 'formik';
// import { updateAccessPermissions } from '../actions/accessControl';
// import { useDispatch, useSelector } from 'react-redux';

// export default function Modal({ user, open, setOpen }) {
//   const transformPermissions = (formValues) => {
//     const { userId, ...permissions } = formValues;
//     const allPermissions = {
//       handle_courses: 0,
//       handle_students: 0,
//       handle_instructors: 0,
//       handle_transport: 0,
//       handle_accounts: 0,
//       handle_all: 0,
//     };

//     // Populate the permissions with the values from the form
//     for (const key in permissions) {
//       if (permissions[key] !== '' && permissions[key] !== undefined && permissions[key] !== null) {
//         allPermissions[key] = parseInt(permissions[key]);
//       }
//     }

//     // Convert the permissions object to an array of objects and filter out keys with value 0
//     const permissionsArray = Object.entries(allPermissions)
//       .filter(([, value]) => value !== 0)
//       .map(([key, value]) => {
//         return { [key]: value };
//       });

//     return {
//       userId,
//       permissions: permissionsArray,
//     };
//   };

//   const dispatch = useDispatch();
//   const handleSubmit = (values) => {
//     const formattedValues = transformPermissions(values);

//     dispatch(updateAccessPermissions(formattedValues));
//     // Handle form submission here
//     setOpen(false);
//   };

//   return (
//     <Dialog open={open} onClose={setOpen} className="relative z-10">
//       <DialogBackdrop
//         transition
//         className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
//       />

//       <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
//         <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
//           <DialogPanel
//             transition
//             className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
//           >
//             <div>
//               <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
//                 <CheckIcon aria-hidden="true" className="h-6 w-6 text-green-600" />
//               </div>
//               <div className="mt-3 text-center sm:mt-5">
//                 <DialogTitle as="h3" className="text-base font-semibold leading-6 text-gray-900">
//                   Payment successful
//                 </DialogTitle>
//                 <div className="mt-2">
//                   <p className="text-sm text-gray-500">
//                     Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eius aliquam laudantium explicabo pariatur
//                     iste dolorem animi vitae error totam. At sapiente aliquam accusamus facere veritatis.
//                   </p>
//                 </div>
//               </div>
//             </div>
//             <div className="mt-5 sm:mt-6">
//               <Formik
//                 initialValues={{ userId: user.user_id, handle_students: '', handle_courses: '', handle_instructors: '' }}
//                 onSubmit={handleSubmit}
//               >
//                 {({ isSubmitting }) => (
//                   <Form>
//                     <div className="mb-4">
//                       <label className="block text-gray-700 font-bold mb-2">Handle Student:</label>
//                       <div className="flex">
//                         <label className="mr-4">
//                           <Field type="radio" name="handle_students" value="0" className="mr-1" />
//                           None
//                         </label>
//                         <label className="mr-4">
//                           <Field type="radio" name="handle_students" value="1" className="mr-1" />
//                           Create
//                         </label>
//                         <label className="mr-4">
//                           <Field type="radio" name="handle_students" value="2" className="mr-1" />
//                           Create/Update
//                         </label>
//                         <label>
//                           <Field type="radio" name="handle_students" value="3" className="mr-1" />
//                           Create/Update/Delete
//                         </label>
//                       </div>
//                     </div>
//                     <div className="mb-4">
//                       <label className="block text-gray-700 font-bold mb-2">Handle Course:</label>
//                       <div className="flex">
//                         <label className="mr-4">
//                           <Field type="radio" name="handle_courses" value="0" className="mr-1" />
//                           None
//                         </label>
//                         <label className="mr-4">
//                           <Field type="radio" name="handle_courses" value="1" className="mr-1" />
//                           Create
//                         </label>
//                         <label className="mr-4">
//                           <Field type="radio" name="handle_courses" value="2" className="mr-1" />
//                           Create/Update
//                         </label>
//                         <label>
//                           <Field type="radio" name="handle_courses" value="3" className="mr-1" />
//                           Create/Update/Delete
//                         </label>
//                       </div>
//                     </div>
//                     <div className="mb-4">
//                       <label className="block text-gray-700 font-bold mb-2">Handle Instructor:</label>
//                       <div className="flex">
//                         <label className="mr-4">
//                           <Field type="radio" name="handle_instructors" value="0" className="mr-1" />
//                           None
//                         </label>
//                         <label className="mr-4">
//                           <Field type="radio" name="handle_instructors" value="1" className="mr-1" />
//                           Create
//                         </label>
//                         <label className="mr-4">
//                           <Field type="radio" name="handle_instructors" value="2" className="mr-1" />
//                           Create/Update
//                         </label>
//                         <label>
//                           <Field type="radio" name="handle_instructors" value="3" className="mr-1" />
//                           Create/Update/Delete
//                         </label>
//                       </div>
//                     </div>
//                     <div className="sm:flex sm:justify-between">
//                       <button
//                         type="button"
//                         onClick={() => setOpen(false)}
//                         className="mb-2 sm:mb-0 inline-flex w-full sm:w-auto justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
//                       >
//                         Deactivate
//                       </button>
//                       <button
//                         type="submit"
//                         disabled={isSubmitting}
//                         className="inline-flex w-full sm:w-auto justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
//                       >
//                         Submit
//                       </button>
//                       <button
//                         type="button"
//                         data-autofocus
//                         onClick={() => setOpen(false)}
//                         className="mt-3 inline-flex w-full sm:w-auto justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0"
//                       >
//                         Cancel
//                       </button>
//                     </div>
//                   </Form>
//                 )}
//               </Formik>
//             </div>
//           </DialogPanel>
//         </div>
//       </div>
//     </Dialog>
//   );
// }


// components/PermissionsComponent.js
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllPermissions, addPermissions } from '../actions/accessControl';

const PermissionsComponent = () => {
  const dispatch = useDispatch();
  const { permissions, loading, error } = useSelector((state) => state.permissions);
  const [roleId, setRoleId] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  React.useEffect(() => {
    dispatch(fetchAllPermissions());
  }, [dispatch]);

  const handleCheckboxChange = (permissionId) => {
    setSelectedPermissions((prevSelected) =>
      prevSelected.includes(permissionId)
        ? prevSelected.filter((id) => id !== permissionId)
        : [...prevSelected, permissionId]
    );
  };

  const handleAddPermissions = () => {
    if (roleId && selectedPermissions.length > 0) {
      dispatch(addPermissions({ roleId, permissionIds: selectedPermissions }));
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Add Permissions</h2>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="roleId">
          Role ID
        </label>
        <input
          type="text"
          id="roleId"
          value={roleId}
          onChange={(e) => setRoleId(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>

      <div className="mb-4">
        <h3 className="text-xl font-bold mb-2">Select Permissions</h3>
        {permissions.map((perm) => (
          <div key={perm.id} className="flex items-center mb-2">
            <input
              type="checkbox"
              id={`perm-${perm.id}`}
              onChange={() => handleCheckboxChange(perm.id)}
              className="mr-2 leading-tight"
            />
            <label htmlFor={`perm-${perm.id}`} className="text-gray-700">
              {perm.name}
            </label>
          </div>
        ))}
      </div>

      <button
        onClick={handleAddPermissions}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Add Permissions
      </button>
    </div>
  );
};

export default PermissionsComponent;



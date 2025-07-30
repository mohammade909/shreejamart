"use client";

import { useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import {
  UserIcon,

  PhoneIcon,
  CalendarIcon,
  IdentificationIcon,
  WalletIcon,
} from "@heroicons/react/24/outline";
import { GoMail } from "react-icons/go";
export default function UserDetailsModal({ userDetails, open , setOpen }) {


  // Example user details (replace with actual data)

  return (
    <Dialog open={open} onClose={setOpen} className="relative z-50">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in "
      />

      <div className="fixed inset-0 z-50 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6 md:max-w-3xl"
          >
            <div>
              <div className="text-center"> 
                <DialogTitle
                  as="h3"
                  className="text-lg font-semibold text-gray-900"
                >
                  User Details
                </DialogTitle>
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    {
                      label: "User ID",
                      value: userDetails?.user_id,
                      icon: IdentificationIcon,
                    },
                    {
                      label: "First Name",
                      value: userDetails?.first_name,
                      icon: UserIcon,
                    },
                    {
                      label: "Last Name",
                      value: userDetails?.last_name,
                      icon: UserIcon,
                    },
                    {
                      label: "Username",
                      value: userDetails?.username,
                      icon: IdentificationIcon,
                    },
                    {
                      label: "Email",
                      value: userDetails?.email,
                      icon: GoMail,
                    },
                    {
                      label: "Password",
                      value: userDetails?.password,
                      icon: IdentificationIcon,
                    },
                    {
                      label: "Phone Number",
                      value: userDetails?.phone_number,
                      icon: PhoneIcon,
                    },
                    {
                      label: "Address",
                      value: userDetails?.address,
                      icon: UserIcon,
                    },
                    {
                      label: "User Type",
                      value: userDetails?.user_type,
                      icon: IdentificationIcon,
                    },
                    {
                      label: "Wallet Balance",
                      value: userDetails?.wallet_balance,
                      icon: WalletIcon,
                    },
                    {
                      label: "Created At",
                      value: userDetails?.created_at,
                      icon: CalendarIcon,
                    },
                    {
                      label: "Updated At",
                      value: userDetails?.updated_at,
                      icon: CalendarIcon,
                    },
                  ].map(({ label, value, icon: Icon }, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Icon className="h-6 w-6 text-indigo-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          {label}
                        </p>
                        <p className="text-sm text-gray-500">{value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-5 sm:mt-6">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Close
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}

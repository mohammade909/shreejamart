import { PlusCircleIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import NotificationTable from "../components/notifications/NotificationTable";

export default function Notifications() {
  return (
    <div>
      <div className=" p-1 mb-2 w-full flex justify-between  items-center">
        <h2 className="text-xl font-semibold">Notification</h2>
        <Link to='/dashboard/notification/add' className="flex gap-3 text-white bg-indigo-500 hover:bg-indigo-600 rounded-md p-2"> <PlusCircleIcon className="w-6 h-6"/><span>Add New </span></Link>
      </div>
      <NotificationTable/>
    </div>
  );
}

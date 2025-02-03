import { useSelector } from "react-redux";

import { Outlet, Navigate } from "react-router-dom";
export default function AdminPrivateRoute() {
  const { auth } = useSelector((state) => state.auth);

  return auth && auth.user_type.toLowerCase() === "admin" ? (
    <Outlet />
  ) : (
    <Navigate to="/admin/login" />
  );
}

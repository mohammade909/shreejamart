import { useSelector } from "react-redux";

import { Outlet, Navigate } from "react-router-dom";
export default function PrivateRoute({role}) {

  const { auth } = useSelector((state) => state.auth);

  return auth.user_type.toLowerCase() === role ? <Outlet /> : <Navigate to="/" />;
}

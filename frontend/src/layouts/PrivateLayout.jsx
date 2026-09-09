import { Navigate, Outlet } from "react-router";
import { useAuth } from "../context/AuthContext";

const PrivateLayout = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div style={{ padding: "40px", textAlign: "center" }}>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="private-layout">
      <Outlet />
    </div>
  );
};

export default PrivateLayout;

import { Outlet, Link } from "react-router";

const AuthLayout = () => {
  return (
    <div className="auth-layout">
      <Link to="/" className="auth-logo">Zestora</Link>
      <Outlet />
    </div>
  );
};

export default AuthLayout;

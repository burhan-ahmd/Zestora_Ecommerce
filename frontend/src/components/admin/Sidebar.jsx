import { Link, useLocation } from "react-router";
import { useAuth } from "../../context/AuthContext";

const Sidebar = ({ isOpen, onClose }) => {
  const { userRole } = useAuth();
  const location = useLocation();

  const adminMenu = [
    { path: "/dashboard", label: "Dashboard", icon: "📊" },
    { path: "/dashboard/categories", label: "Categories", icon: "📁" },
    { path: "/dashboard/products", label: "Products", icon: "📦" },
    { path: "/dashboard/orders", label: "Orders", icon: "🛒" },
    { path: "/", label: "Back to Shop", icon: "🏠" },
  ];

  const customerMenu = [
    { path: "/dashboard", label: "Dashboard", icon: "📊" },
    { path: "/dashboard/orders", label: "My Orders", icon: "🛒" },
    { path: "/", label: "Back to Shop", icon: "🏠" },
  ];

  const menu = userRole === "admin" ? adminMenu : customerMenu;

  return (
    <>
      <aside className={`admin-sidebar ${isOpen ? "admin-sidebar-open" : ""}`}>
        <nav className="admin-sidebar-nav">
          {menu.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={`admin-sidebar-link ${
                location.pathname === item.path ? "active" : ""
              }`}
            >
              <span className="admin-sidebar-icon">{item.icon}</span>
              <span className="admin-sidebar-label">{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>
      <div
        className={`admin-sidebar-overlay ${isOpen ? "admin-sidebar-overlay-visible" : ""}`}
        onClick={onClose}
      />
    </>
  );
};

export default Sidebar;

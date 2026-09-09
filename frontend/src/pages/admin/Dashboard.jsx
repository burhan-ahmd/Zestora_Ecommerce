import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import api from "../../utils/api";
import { useAuth } from "../../context/AuthContext";

const Dashboard = () => {
  const { user, userRole } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        if (userRole === "admin") {
          const [statsRes, ordersRes] = await Promise.all([
            api.get("/orders/stats"),
            api.get("/orders"),
          ]);
          setStats(statsRes.data.stats);
          setOrders(ordersRes.data.orders.slice(0, 5));
        } else {
          const ordersRes = await api.get("/orders/my-orders");
          const myOrders = ordersRes.data.orders;
          setOrders(myOrders.slice(0, 5));
          const pending = myOrders.filter((o) => o.orderStatus === "pending").length;
          const delivered = myOrders.filter((o) => o.orderStatus === "delivered").length;
          setStats({ totalOrders: myOrders.length, pendingOrders: pending, deliveredOrders: delivered });
        }
      } catch (error) {
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [userRole]);

  if (loading) return <div className="admin-loading">Loading dashboard...</div>;

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1>{userRole === "admin" ? "Admin Dashboard" : "My Dashboard"}</h1>
          <p className="admin-page-subtitle">Welcome back, {user?.name}</p>
        </div>
      </div>

      {stats && (
        <div className="admin-stats-grid">
          <div className="admin-stat-card">
            <div className="admin-stat-icon">📦</div>
            <div className="admin-stat-info">
              <h3>{stats.totalOrders}</h3>
              <p>Total Orders</p>
            </div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-icon">⏳</div>
            <div className="admin-stat-info">
              <h3>{stats.pendingOrders}</h3>
              <p>Pending</p>
            </div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-icon">✅</div>
            <div className="admin-stat-info">
              <h3>{stats.deliveredOrders}</h3>
              <p>{userRole === "admin" ? "Delivered" : "Completed"}</p>
            </div>
          </div>
          {userRole === "admin" && stats.totalRevenue !== undefined && (
            <div className="admin-stat-card">
              <div className="admin-stat-icon">💰</div>
              <div className="admin-stat-info">
                <h3>${stats.totalRevenue.toFixed(2)}</h3>
                <p>Revenue</p>
              </div>
            </div>
          )}
        </div>
      )}

      {userRole === "admin" && (
        <div className="admin-card">
          <div className="admin-card-header">
            <h2>Quick Actions</h2>
          </div>
          <div className="admin-card-body">
            <div className="admin-quick-actions">
              <button onClick={() => navigate("/dashboard/categories")} className="admin-action-card">
                <span className="admin-action-icon">📁</span>
                <span>Categories</span>
              </button>
              <button onClick={() => navigate("/dashboard/products")} className="admin-action-card">
                <span className="admin-action-icon">📦</span>
                <span>Products</span>
              </button>
              <button onClick={() => navigate("/dashboard/orders")} className="admin-action-card">
                <span className="admin-action-icon">🛒</span>
                <span>Orders</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="admin-card">
        <div className="admin-card-header">
          <h2>Recent Orders</h2>
          {orders.length > 0 && (
            <button onClick={() => navigate("/dashboard/orders")} className="admin-btn-text">
              View All →
            </button>
          )}
        </div>
        {orders.length === 0 ? (
          <div className="admin-card-body">
            <div className="admin-empty-inline">
              <p>No orders yet.</p>
              {userRole !== "admin" && (
                <button onClick={() => navigate("/products")} className="admin-btn-primary">
                  Start Shopping
                </button>
              )}
            </div>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Total</th>
                <th>Status</th>
                {userRole === "admin" && <th>Customer</th>}
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order._id}
                  onClick={() => navigate(`/dashboard/orders/${order._id}`)}
                  className="admin-clickable"
                >
                  <td>
                    <span className="admin-cell-mono">#{order._id.slice(-6).toUpperCase()}</span>
                  </td>
                  <td className="admin-cell-muted">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td>
                    <span className="admin-cell-bold">${order.total.toFixed(2)}</span>
                  </td>
                  <td>
                    <span className={`admin-badge ${
                      order.orderStatus === "delivered" ? "admin-badge-success" :
                      order.orderStatus === "cancelled" ? "admin-badge-danger" :
                      "admin-badge-warning"
                    }`}>{order.orderStatus}</span>
                  </td>
                  {userRole === "admin" && (
                    <td className="admin-cell-muted">{order.user?.name || "N/A"}</td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

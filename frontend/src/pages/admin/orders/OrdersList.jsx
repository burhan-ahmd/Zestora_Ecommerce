import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import api from "../../../utils/api";
import { useAuth } from "../../../context/AuthContext";

const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const { userRole } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const endpoint = userRole === "admin" ? "/orders" : "/orders/my-orders";
      const response = await api.get(endpoint);
      setOrders(response.data.orders);
    } catch (error) {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = statusFilter
    ? orders.filter((o) => o.orderStatus === statusFilter)
    : orders;

  if (loading) {
    return <div className="admin-loading">Loading orders...</div>;
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1>{userRole === "admin" ? "All Orders" : "My Orders"}</h1>
          <p className="admin-page-subtitle">{orders.length} total orders</p>
        </div>
        <div className="admin-header-filters">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="admin-select"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="admin-empty">
          <div className="admin-empty-icon">🛒</div>
          <h3>No orders found</h3>
          <p>
            {userRole === "admin"
              ? "Orders will appear here when customers place them."
              : "You haven't placed any orders yet."}
          </p>
          {userRole !== "admin" && (
            <button onClick={() => navigate("/products")} className="admin-btn-primary">
              Start Shopping
            </button>
          )}
        </div>
      ) : (
        <div className="admin-card">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Items</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Status</th>
                {userRole === "admin" && <th>Customer</th>}
                <th style={{ width: "100px" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order._id}>
                  <td>
                    <span className="admin-cell-mono">#{order._id.slice(-6).toUpperCase()}</span>
                  </td>
                  <td className="admin-cell-muted">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td>{order.items.length}</td>
                  <td>
                    <span className="admin-cell-bold">${order.total.toFixed(2)}</span>
                  </td>
                  <td>
                    <span className={`admin-badge ${
                      order.paymentStatus === "paid" ? "admin-badge-success" :
                      order.paymentStatus === "failed" ? "admin-badge-danger" :
                      "admin-badge-warning"
                    }`}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td>
                    <span className={`admin-badge ${
                      order.orderStatus === "delivered" ? "admin-badge-success" :
                      order.orderStatus === "cancelled" ? "admin-badge-danger" :
                      order.orderStatus === "shipped" ? "admin-badge-info" :
                      order.orderStatus === "confirmed" ? "admin-badge-info" :
                      "admin-badge-warning"
                    }`}>
                      {order.orderStatus}
                    </span>
                  </td>
                  {userRole === "admin" && (
                    <td className="admin-cell-muted">{order.user?.name || "N/A"}</td>
                  )}
                  <td>
                    <button
                      onClick={() => navigate(`/dashboard/orders/${order._id}`)}
                      className="admin-btn-view"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrdersList;

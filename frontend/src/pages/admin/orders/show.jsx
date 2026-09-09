import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import toast from "react-hot-toast";
import api from "../../../utils/api";
import { useAuth } from "../../../context/AuthContext";

const OrderShow = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userRole } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const response = await api.get(`/orders/${id}`);
      setOrder(response.data.order);
    } catch (error) {
      toast.error("Failed to load order");
      navigate("/dashboard/orders");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    setUpdating(true);
    try {
      await api.put(`/orders/${id}/status`, { status: newStatus });
      setOrder((prev) => ({ ...prev, orderStatus: newStatus }));
      toast.success("Order status updated");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="admin-loading">Loading order...</div>;
  if (!order) return null;

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1>Order #{order._id.slice(-6).toUpperCase()}</h1>
          <p className="admin-page-subtitle">
            Placed on {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </div>
        <button onClick={() => navigate("/dashboard/orders")} className="admin-btn-secondary">
          ← Back to Orders
        </button>
      </div>

      <div className="admin-detail-grid">
        <div className="admin-card">
          <div className="admin-card-header">
            <h2>Order Info</h2>
          </div>
          <div className="admin-card-body">
            <div className="admin-detail-row">
              <span className="admin-detail-label">Payment Method</span>
              <span className="admin-detail-value">{order.paymentMethod.toUpperCase()}</span>
            </div>
            <div className="admin-detail-row">
              <span className="admin-detail-label">Payment Status</span>
              <span className={`admin-badge ${
                order.paymentStatus === "paid" ? "admin-badge-success" :
                order.paymentStatus === "failed" ? "admin-badge-danger" :
                "admin-badge-warning"
              }`}>{order.paymentStatus}</span>
            </div>
            <div className="admin-detail-row">
              <span className="admin-detail-label">Order Status</span>
              <span className={`admin-badge ${
                order.orderStatus === "delivered" ? "admin-badge-success" :
                order.orderStatus === "cancelled" ? "admin-badge-danger" :
                order.orderStatus === "shipped" ? "admin-badge-info" :
                "admin-badge-warning"
              }`}>{order.orderStatus}</span>
            </div>
          </div>
        </div>

        <div className="admin-card">
          <div className="admin-card-header">
            <h2>Shipping Address</h2>
          </div>
          <div className="admin-card-body">
            <p>{order.shippingAddress.address}</p>
            {order.shippingAddress.apartment && <p>{order.shippingAddress.apartment}</p>}
            <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
          </div>
        </div>

        {userRole === "admin" && order.user && (
          <div className="admin-card">
            <div className="admin-card-header">
              <h2>Customer</h2>
            </div>
            <div className="admin-card-body">
              <div className="admin-detail-row">
                <span className="admin-detail-label">Name</span>
                <span className="admin-detail-value">{order.user.name}</span>
              </div>
              <div className="admin-detail-row">
                <span className="admin-detail-label">Email</span>
                <span className="admin-detail-value">{order.user.email}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <h2>Order Items</h2>
        </div>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Price</th>
              <th>Qty</th>
              <th style={{ textAlign: "right" }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item, index) => (
              <tr key={index}>
                <td>
                  <span className="admin-cell-bold">{item.name}</span>
                </td>
                <td>${item.price.toFixed(2)}</td>
                <td>{item.quantity}</td>
                <td style={{ textAlign: "right" }}>
                  <span className="admin-cell-bold">${(item.price * item.quantity).toFixed(2)}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="admin-order-totals">
          <div className="admin-total-row">
            <span>Subtotal</span>
            <span>${order.subtotal.toFixed(2)}</span>
          </div>
          <div className="admin-total-row">
            <span>Shipping</span>
            <span>${order.shipping.toFixed(2)}</span>
          </div>
          <div className="admin-total-row admin-total-final">
            <span>Total</span>
            <span>${order.total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {userRole === "admin" && (
        <div className="admin-card">
          <div className="admin-card-header">
            <h2>Update Status</h2>
          </div>
          <div className="admin-card-body">
            <div className="admin-status-buttons">
              {["pending", "confirmed", "shipped", "delivered", "cancelled"].map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusUpdate(status)}
                  disabled={updating || order.orderStatus === status}
                  className={`admin-status-btn ${status} ${order.orderStatus === status ? "current" : ""}`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderShow;

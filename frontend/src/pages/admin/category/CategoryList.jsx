import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import api from "../../../utils/api";

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", status: true });
  const [editingId, setEditingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get("/categories");
      setCategories(response.data.categories);
    } catch (error) {
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/categories/${editingId}`, formData);
        toast.success("Category updated");
      } else {
        await api.post("/categories", formData);
        toast.success("Category created");
      }
      resetForm();
      fetchCategories();
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    }
  };

  const handleEdit = (category) => {
    setFormData({ name: category.name, status: category.status });
    setEditingId(category._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category?")) return;
    try {
      await api.delete(`/categories/${id}`);
      toast.success("Category deleted");
      fetchCategories();
    } catch (error) {
      toast.error("Failed to delete category");
    }
  };

  const resetForm = () => {
    setFormData({ name: "", status: true });
    setEditingId(null);
    setShowForm(false);
  };

  if (loading) {
    return <div className="admin-loading">Loading categories...</div>;
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1>Categories</h1>
          <p className="admin-page-subtitle">Manage your product categories</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="admin-btn-primary"
        >
          + New Category
        </button>
      </div>

      {showForm && (
        <div className="admin-card">
          <div className="admin-card-header">
            <h2>{editingId ? "Edit Category" : "Add New Category"}</h2>
            <button onClick={resetForm} className="admin-btn-close">×</button>
          </div>
          <form onSubmit={handleSubmit} className="admin-form">
            <div className="admin-form-row">
              <div className="admin-form-group admin-form-flex">
                <label>Category Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Electronics, Clothing, Home..."
                  required
                />
              </div>
              <div className="admin-form-group admin-form-checkbox">
                <label className="admin-checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.checked })}
                  />
                  <span>Active</span>
                </label>
              </div>
            </div>
            <div className="admin-form-actions">
              <button type="submit" className="admin-btn-primary">
                {editingId ? "Update Category" : "Save Category"}
              </button>
              <button type="button" onClick={resetForm} className="admin-btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {categories.length === 0 ? (
        <div className="admin-empty">
          <div className="admin-empty-icon">📁</div>
          <h3>No categories yet</h3>
          <p>Create your first category to start organizing products.</p>
        </div>
      ) : (
        <div className="admin-card">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Category Name</th>
                <th>Status</th>
                <th>Created</th>
                <th style={{ width: "150px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat._id}>
                  <td>
                    <span className="admin-cell-bold">{cat.name}</span>
                  </td>
                  <td>
                    <span className={`admin-badge ${cat.status ? "admin-badge-success" : "admin-badge-danger"}`}>
                      {cat.status ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="admin-cell-muted">
                    {new Date(cat.createdAt).toLocaleDateString()}
                  </td>
                  <td>
                    <div className="admin-actions">
                      <button onClick={() => handleEdit(cat)} className="admin-btn-edit">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(cat._id)} className="admin-btn-delete">
                        Delete
                      </button>
                    </div>
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

export default CategoryList;

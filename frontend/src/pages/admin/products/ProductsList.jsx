import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import api from "../../../utils/api";

const ProductsList = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const emptyForm = {
    name: "",
    description: "",
    price: "",
    oldPrice: "",
    category: "",
    image: "",
    stock: "",
    status: true,
  };
  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get("/products/admin");
      setProducts(response.data.products);
    } catch (error) {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get("/categories");
      setCategories(response.data.categories);
    } catch (error) {
      console.error("Failed to load categories:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/products", {
        ...formData,
        price: Number(formData.price),
        oldPrice: formData.oldPrice ? Number(formData.oldPrice) : 0,
        stock: Number(formData.stock),
      });
      toast.success("Product created");
      setFormData(emptyForm);
      setShowForm(false);
      fetchProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create product");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success("Product deleted");
      fetchProducts();
    } catch (error) {
      toast.error("Failed to delete product");
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <div className="admin-loading">Loading products...</div>;
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1>Products</h1>
          <p className="admin-page-subtitle">{products.length} products in store</p>
        </div>
        <button onClick={() => setShowForm(true)} className="admin-btn-primary">
          + New Product
        </button>
      </div>

      {showForm && (
        <div className="admin-card">
          <div className="admin-card-header">
            <h2>Add New Product</h2>
            <button onClick={() => setShowForm(false)} className="admin-btn-close">×</button>
          </div>
          <form onSubmit={handleSubmit} className="admin-form">
            <div className="admin-form-row admin-form-row-2">
              <div className="admin-form-group">
                <label>Product Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Premium Wireless Headphones"
                  required
                />
              </div>
              <div className="admin-form-group">
                <label>Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="admin-form-group">
              <label>Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                placeholder="Product description..."
              />
            </div>

            <div className="admin-form-row admin-form-row-3">
              <div className="admin-form-group">
                <label>Price *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="0.00"
                  required
                />
              </div>
              <div className="admin-form-group">
                <label>Old Price</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.oldPrice}
                  onChange={(e) => setFormData({ ...formData, oldPrice: e.target.value })}
                  placeholder="0.00"
                />
              </div>
              <div className="admin-form-group">
                <label>Stock *</label>
                <input
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  placeholder="0"
                  required
                />
              </div>
            </div>

            <div className="admin-form-group">
              <label>Image URL</label>
              <input
                type="text"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.checked })}
                />
                <span>Active (visible on store)</span>
              </label>
            </div>

            <div className="admin-form-actions">
              <button type="submit" className="admin-btn-primary">Create Product</button>
              <button type="button" onClick={() => setShowForm(false)} className="admin-btn-secondary">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="admin-card">
        <div className="admin-search-bar">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {filteredProducts.length === 0 ? (
          <div className="admin-empty">
            <div className="admin-empty-icon">📦</div>
            <h3>No products found</h3>
            <p>{search ? "Try a different search term." : "Add your first product to get started."}</p>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th style={{ width: "150px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product._id}>
                  <td>
                    <div className="admin-cell-product">
                      {product.image ? (
                        <img src={product.image} alt={product.name} className="admin-thumb" />
                      ) : (
                        <div className="admin-thumb admin-thumb-empty">—</div>
                      )}
                      <span className="admin-cell-bold">{product.name}</span>
                    </div>
                  </td>
                  <td className="admin-cell-muted">{product.category?.name || "N/A"}</td>
                  <td>
                    <span className="admin-cell-bold">${product.price.toFixed(2)}</span>
                    {product.oldPrice > 0 && (
                      <span className="admin-cell-old-price">${product.oldPrice.toFixed(2)}</span>
                    )}
                  </td>
                  <td>
                    <span className={product.stock <= 5 ? "admin-stock-low" : ""}>
                      {product.stock}
                    </span>
                  </td>
                  <td>
                    <span className={`admin-badge ${product.status ? "admin-badge-success" : "admin-badge-danger"}`}>
                      {product.status ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td>
                    <div className="admin-actions">
                      <button
                        onClick={() => navigate(`/dashboard/products/edit/${product._id}`)}
                        className="admin-btn-edit"
                      >
                        Edit
                      </button>
                      <button onClick={() => handleDelete(product._id)} className="admin-btn-delete">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ProductsList;

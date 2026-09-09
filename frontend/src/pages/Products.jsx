import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import publicApi from "../utils/publicApi";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    totalProducts: 0,
  });

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minRating, setMinRating] = useState("");
  const [sort, setSort] = useState("");
  const [page, setPage] = useState(1);

  const { isAuthenticated } = useAuth();
  const { addToCart, isInCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await publicApi.get("/categories/public");
        setCategories(response.data.categories);
      } catch (error) {
        console.error("Failed to load categories:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.append("page", page);
        params.append("limit", "12");

        if (search) params.append("search", search);
        if (selectedCategory) params.append("category", selectedCategory);
        if (maxPrice) params.append("maxPrice", maxPrice);
        if (minRating) params.append("minRating", minRating);
        if (sort) params.append("sort", sort);

        const response = await publicApi.get(
          `/products?${params.toString()}`
        );

        setProducts(response.data.products);
        setPagination(response.data.pagination);
      } catch (error) {
        console.error("Failed to load products:", error);
        toast.error("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [page, search, selectedCategory, maxPrice, minRating, sort]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setPage(1);
  };

  const handlePriceChange = (e) => {
    setMaxPrice(e.target.value);
    setPage(1);
  };

  const handleRatingChange = (e) => {
    setMinRating(e.target.value);
    setPage(1);
  };

  const handleSortChange = (e) => {
    setSort(e.target.value);
    setPage(1);
  };

  const handleAddToCart = (product) => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to cart");
      navigate("/login");
      return;
    }

    addToCart(product);
    toast.success(`${product.name} added to cart`);
  };

  return (
    <div className="products-page">
      <div className="container">
        <h1>Products</h1>

        <div className="filters-bar">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={handleSearchChange}
            />
          </div>

          <select value={selectedCategory} onChange={handleCategoryChange}>
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>

          <select value={maxPrice} onChange={handlePriceChange}>
            <option value="">Any Price</option>
            <option value="25">Under $25</option>
            <option value="50">Under $50</option>
            <option value="100">Under $100</option>
            <option value="200">Under $200</option>
            <option value="500">Under $500</option>
          </select>

          <select value={minRating} onChange={handleRatingChange}>
            <option value="">Any Rating</option>
            <option value="4">4+ Stars</option>
            <option value="4.5">4.5+ Stars</option>
          </select>

          <select value={sort} onChange={handleSortChange}>
            <option value="">Default Sort</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Rating</option>
          </select>
        </div>

        {loading ? (
          <div className="loading-state">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <p>No products found.</p>
            <p>Try changing your search or filters.</p>
          </div>
        ) : (
          <>
            <div className="products-grid">
              {products.map((product) => (
                <div key={product._id} className="product-card">
                  <div className="product-image">
                    {product.image ? (
                      <img src={product.image} alt={product.name} />
                    ) : (
                      <div className="product-placeholder">No Image</div>
                    )}
                  </div>
                  <div className="product-info">
                    <span className="product-category">
                      {product.category?.name || "Uncategorized"}
                    </span>
                    <h3>{product.name}</h3>
                    <div className="product-rating">
                      <span>
                        {"★".repeat(Math.floor(product.rating))}
                        {product.rating % 1 >= 0.5 ? "½" : ""}
                      </span>
                      <span>({product.reviews})</span>
                    </div>
                    <div className="product-price">
                      <span className="current-price">
                        ${product.price.toFixed(2)}
                      </span>
                      {product.oldPrice > 0 && (
                        <span className="old-price">
                          ${product.oldPrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => handleAddToCart(product)}
                      className={`add-to-cart-btn ${
                        isInCart(product._id) ? "in-cart" : ""
                      }`}
                    >
                      {isInCart(product._id) ? "In Cart" : "Add to Cart"}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {pagination.totalPages > 1 && (
              <div className="pagination">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="page-btn"
                >
                  ← Previous
                </button>

                {Array.from(
                  { length: pagination.totalPages },
                  (_, i) => i + 1
                ).map((num) => (
                  <button
                    key={num}
                    onClick={() => setPage(num)}
                    className={`page-btn ${page === num ? "active" : ""}`}
                  >
                    {num}
                  </button>
                ))}

                <button
                  onClick={() =>
                    setPage((p) =>
                      Math.min(pagination.totalPages, p + 1)
                    )
                  }
                  disabled={page === pagination.totalPages}
                  className="page-btn"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Products;

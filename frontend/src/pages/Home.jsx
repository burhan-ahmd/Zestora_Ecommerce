import { useState, useEffect } from "react";
import { Link } from "react-router";
import publicApi from "../utils/publicApi";

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await publicApi.get(
          "/products?sort=rating&page=1&limit=6"
        );
        setFeaturedProducts(response.data.products);
      } catch (error) {
        console.error("Failed to load featured products:", error);
      }
    };

    fetchFeatured();
  }, []);

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="container">
          <h1>Thoughtfully Designed Essentials</h1>
          <p>
            Discover curated products for modern everyday living. Quality meets
            simplicity.
          </p>
          <Link to="/products" className="hero-btn">
            Shop Now
          </Link>
        </div>
      </section>

      {featuredProducts.length > 0 && (
        <section className="featured-section">
          <div className="container">
            <h2>Featured Products</h2>
            <div className="products-grid">
              {featuredProducts.map((product) => (
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
                  </div>
                </div>
              ))}
            </div>
            <div className="featured-link">
              <Link to="/products">View All Products →</Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;

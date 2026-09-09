import { Link } from "react-router";

function Footer() {
  return (
    <footer className="footer">

      <div className="container footer-container">

        {/* Brand */}

        <div className="footer-brand">

          <h2>
            NOVA
          </h2>

          <p>
            Thoughtfully designed essentials
            for modern everyday living.
          </p>

        </div>


        {/* Shop */}

        <div className="footer-column">

          <h4>
            Shop
          </h4>

          <Link to="/products">
            All Products
          </Link>

          <Link to="/products">
            New Arrivals
          </Link>

          <Link to="/products">
            Best Sellers
          </Link>

        </div>


        {/* Company */}

        <div className="footer-column">

          <h4>
            Company
          </h4>

          <Link to="/contact">
            Contact
          </Link>

          <Link to="/login">
            My Account
          </Link>

          <Link to="/products">
            Collections
          </Link>

        </div>


        {/* Social */}

        <div className="footer-column">

          <h4>
            Follow
          </h4>

          <a
            href="#"
            onClick={(event) => event.preventDefault()}
          >
            Instagram
          </a>

          <a
            href="#"
            onClick={(event) => event.preventDefault()}
          >
            Pinterest
          </a>

          <a
            href="#"
            onClick={(event) => event.preventDefault()}
          >
            Facebook
          </a>

        </div>

      </div>


      {/* Footer Bottom */}

      <div className="container footer-bottom">

        <p>
          © 2026 NOVA. All rights reserved.
        </p>

        <p>
          Designed for everyday living.
        </p>

      </div>

    </footer>
  );
}

export default Footer;
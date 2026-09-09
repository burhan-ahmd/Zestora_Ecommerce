import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router";

import PublicLayout from "./layouts/PublicLayout";
import AuthLayout from "./layouts/AuthLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import RoleRoute from "./layouts/RoleRoute";

import Home from "./pages/Home";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/admin/Dashboard";
import CategoryList from "./pages/admin/category/CategoryList";
import CategoryEdit from "./pages/admin/category/edit";
import ProductsList from "./pages/admin/products/ProductsList";
import ProductEdit from "./pages/admin/products/edit";
import OrdersList from "./pages/admin/orders/OrdersList";
import OrderShow from "./pages/admin/orders/show";

function AppRoutes() {
  const router = createBrowserRouter([
    {
      element: <PublicLayout />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/products",
          element: <Products />,
        },
        {
          path: "/cart",
          element: <Cart />,
        },
        {
          element: <RoleRoute allowedRoles={["admin", "user"]} />,
          children: [
            {
              path: "/checkout",
              element: <Checkout />,
            },
          ],
        },
      ],
    },

    {
      element: <AuthLayout />,
      children: [
        {
          path: "/login",
          element: <Login />,
        },
        {
          path: "/register",
          element: <Register />,
        },
      ],
    },

    {
      element: <DashboardLayout />,
      children: [
        {
          path: "/dashboard",
          element: <Dashboard />,
        },
        {
          path: "/dashboard/orders",
          element: <OrdersList />,
        },
        {
          path: "/dashboard/orders/:id",
          element: <OrderShow />,
        },
        {
          element: <RoleRoute allowedRoles={["admin"]} />,
          children: [
            {
              path: "/dashboard/categories",
              element: <CategoryList />,
            },
            {
              path: "/dashboard/categories/edit/:id",
              element: <CategoryEdit />,
            },
            {
              path: "/dashboard/products",
              element: <ProductsList />,
            },
            {
              path: "/dashboard/products/edit/:id",
              element: <ProductEdit />,
            },
          ],
        },
      ],
    },

    {
      path: "*",
      element: <Navigate to="/" replace />,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default AppRoutes;

import Order from "../models/Order.js";
import Product from "../models/Products.js";
import User from "../models/User.js";
import sendEmail from "../utils/sendEmail.js";

const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        message: "No order items provided",
      });
    }

    if (
      !shippingAddress ||
      !shippingAddress.address ||
      !shippingAddress.city ||
      !shippingAddress.state ||
      !shippingAddress.postalCode
    ) {
      return res.status(400).json({
        message: "Complete shipping address is required",
      });
    }

    const orderItems = [];
    let subtotal = 0;

    for (const item of items) {
      const product = await Product.findById(item.product);

      if (!product) {
        return res.status(400).json({
          message: `Product not found: ${item.product}`,
        });
      }

      if (!product.status) {
        return res.status(400).json({
          message: `Product "${product.name}" is not available`,
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for "${product.name}". Available: ${product.stock}`,
        });
      }

      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: product.image,
      });

      product.stock -= item.quantity;
      await product.save();
    }

    const shipping = 10;
    const total = subtotal + shipping;

    const order = await Order.create({
      user: req.user,
      items: orderItems,
      shippingAddress,
      paymentMethod: paymentMethod || "cod",
      paymentStatus: paymentMethod === "cod" ? "pending" : "pending",
      orderStatus: "pending",
      subtotal,
      shipping,
      total,
    });

    const customer = await User.findById(req.user).select("name email");
    const admin = await User.findOne({ type: "admin" }).select("name email");

    const itemsList = orderItems
      .map((item) => `<li>${item.name} x ${item.quantity} — $${(item.price * item.quantity).toFixed(2)}</li>`)
      .join("");

    const address = [shippingAddress.address, shippingAddress.apartment, shippingAddress.city, shippingAddress.state, shippingAddress.postalCode].filter(Boolean).join(", ");

    if (customer?.email) {
      sendEmail({
        to: customer.email,
        subject: `Order Confirmation - #${order._id}`,
        html: `
          <h2>Thank you for your order, ${customer.name}!</h2>
          <p><strong>Order ID:</strong> ${order._id}</p>
          <p><strong>Items:</strong></p>
          <ul>${itemsList}</ul>
          <p><strong>Subtotal:</strong> $${subtotal.toFixed(2)}</p>
          <p><strong>Shipping:</strong> $${shipping.toFixed(2)}</p>
          <p><strong>Total:</strong> $${total.toFixed(2)}</p>
          <p><strong>Shipping Address:</strong> ${address}</p>
          <p><strong>Payment Method:</strong> ${order.paymentMethod.toUpperCase()}</p>
          <br/>
          <p>We'll notify you when your order ships.</p>
          <p>— Zestora Team</p>
        `,
      }).catch((err) => console.error("Customer email error:", err.message));
    }

    if (admin?.email) {
      sendEmail({
        to: admin.email,
        subject: `New Order Received - #${order._id}`,
        html: `
          <h2>New order placed!</h2>
          <p><strong>Customer:</strong> ${customer?.name || "Unknown"} (${customer?.email || "N/A"})</p>
          <p><strong>Order ID:</strong> ${order._id}</p>
          <p><strong>Items:</strong></p>
          <ul>${itemsList}</ul>
          <p><strong>Total:</strong> $${total.toFixed(2)}</p>
          <p><strong>Shipping Address:</strong> ${address}</p>
          <p><strong>Payment:</strong> ${order.paymentMethod.toUpperCase()}</p>
          <br/>
          <p>— Zestora System</p>
        `,
      }).catch((err) => console.error("Admin email error:", err.message));
    }

    res.status(201).json({
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    console.error("Create order error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Get my orders error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email"
    );

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    if (
      order.user._id.toString() !== req.user &&
      req.userRole !== "admin"
    ) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Get order error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Get all orders error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const validStatuses = [
      "pending",
      "confirmed",
      "shipped",
      "delivered",
      "cancelled",
    ];

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    order.orderStatus = status;

    if (status === "delivered") {
      order.paymentStatus = "paid";
    }

    await order.save();

    res.status(200).json({
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    console.error("Update order status error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({
      orderStatus: "pending",
    });
    const deliveredOrders = await Order.countDocuments({
      orderStatus: "delivered",
    });

    const totalRevenue = await Order.aggregate([
      { $match: { orderStatus: { $ne: "cancelled" } } },
      { $group: { _id: null, total: { $sum: "$total" } } },
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalOrders,
        pendingOrders,
        deliveredOrders,
        totalRevenue: totalRevenue.length > 0 ? totalRevenue[0].total : 0,
      },
    });
  } catch (error) {
    console.error("Get dashboard stats error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

export {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  getDashboardStats,
};

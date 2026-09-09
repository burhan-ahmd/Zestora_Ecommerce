const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    
    if (!req.userRole) {
      return res.status(403).json({
        message: "Access denied, no role found",
      });
    }

    if (!allowedRoles.includes(req.userRole)) {
      return res.status(403).json({
        message: "Access denied, insufficient permissions",
      });
    }

    next();
  };
};

export default roleMiddleware;

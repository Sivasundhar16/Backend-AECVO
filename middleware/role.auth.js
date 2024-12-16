export const roleAuth = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      // Check if req.user is populated and role is available
      if (!req.user || !req.user.role) {
        return res.status(401).json({ message: "User is not authenticated" });
      }

      // Check if user's role matches one of the allowed roles
      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ message: "You are not allowed" });
      }

      next();
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
};

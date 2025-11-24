import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

/* =======================================================
   🔹 VERIFY JWT TOKEN (protect)
======================================================= */
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Access denied. Token missing.",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info to request
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (err) {
    return res.status(403).json({
      message: "Invalid or expired token",
      error: err.message,
    });
  }
};

/* =======================================================
   🔹 ROLE AUTHORIZATION (authorize)
======================================================= */
export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied. Required roles: ${allowedRoles.join(", ")}`,
      });
    }
    next();
  };
};

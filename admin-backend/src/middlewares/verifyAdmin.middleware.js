import jwt from "jsonwebtoken";

export const verifyAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  console.log("[AUTH HEADER]", authHeader);           // 👈 inspect in console

  // Header must exist and start with “Bearer ”
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({
      statusCode: 401,
      data: null,
      success: false,
      errors: ["No token provided"],
    });
  }

  // Extract token (handles multiple spaces)
  const token = authHeader.split(/\s+/)[1];
  console.log("[TOKEN]", token);                      // 👈 inspect in console

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "admin") {
      return res.status(403).json({
        statusCode: 403,
        data: null,
        success: false,
        errors: ["Forbidden: Admins only"],
      });
    }

   req.admin = decoded;                        // attach user info
    next();
  } catch (err) {
    console.error("JWT verify failed:", err);
    return res.status(401).json({
      statusCode: 401,
      data: null,
      success: false,
      errors: [err.message],
    });
  }
};

import jwt from "jsonwebtoken";

export const generateToken = (id) => {
  return jwt.sign(
    { id: id },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract token

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token
    req.user = decoded; // Attach user data to request
    next(); // Proceed to next middleware
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
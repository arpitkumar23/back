import jwt from "jsonwebtoken";  
import { User } from "../models/userModel.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized request" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ message: "Unauthorized request" });

    req.user = user; // ✅ Attach user to request
    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized request", error: error.message });
  }
};

import jwt from "jsonwebtoken";
import redisClient from "../services/redis.service.js";


export const authUser = async (req, res, next) => {
  try {
    const token =
      req.cookies?.token || req.headers?.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    const isBlackListed = await redisClient.get(token);
    if (isBlackListed) {
      res.clearCookie("token");
      return res.status(401).json({ error: "Unauthorized: Token blacklisted" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Auth error:", error.message);
    res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
};

require("dotenv").config();
const jwt = require("jsonwebtoken");

if (!process.env.JWT_SECRET || !process.env.JWT_EXPIRED_IN) {
  throw new Error(
    "JWT_SECRET or JWT_EXPIRED_IN is not defined in the environment variables"
  );
}

exports.sign = (payload, options = {}) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRED_IN,
    ...options,
  });
};

exports.verify = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error("Token verification failed");
  }
};

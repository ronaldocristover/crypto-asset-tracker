const express = require("express");
const router = express.Router();

// Simple hardcoded credentials for demo purposes
const validCredentials = {
  admin: "password",
  user: "123456",
  demo: "demo123",
};

// Login endpoint
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        error: "Username and password are required",
      });
    }

    if (validCredentials[username] && validCredentials[username] === password) {
      // Generate a simple token (in production, use JWT)
      const token = Buffer.from(`${username}:${password}`).toString("base64");

      const userData = {
        id: 1,
        username: username,
        name: username.charAt(0).toUpperCase() + username.slice(1),
        role: username === "admin" ? "admin" : "user",
      };

      res.json({
        success: true,
        token: token,
        user: userData,
        message: "Login successful",
      });
    } else {
      res.status(401).json({
        error: "Invalid username or password",
      });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
});

// Verify token endpoint
router.get("/verify", (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        error: "No token provided",
      });
    }

    const token = authHeader.substring(7);

    try {
      const decoded = Buffer.from(token, "base64").toString("ascii");
      const [username, password] = decoded.split(":");

      if (
        validCredentials[username] &&
        validCredentials[username] === password
      ) {
        const userData = {
          id: 1,
          username: username,
          name: username.charAt(0).toUpperCase() + username.slice(1),
          role: username === "admin" ? "admin" : "user",
        };

        res.json({
          success: true,
          user: userData,
        });
      } else {
        res.status(401).json({
          error: "Invalid token",
        });
      }
    } catch (decodeError) {
      res.status(401).json({
        error: "Invalid token format",
      });
    }
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
});

// Logout endpoint
router.post("/logout", (req, res) => {
  res.json({
    success: true,
    message: "Logout successful",
  });
});

module.exports = router;

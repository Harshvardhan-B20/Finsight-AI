const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ========================================
// REGISTER USER
// ========================================
const registerUser = async (req, res) => {
  try {
    const { name, email, password, account_type } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        status: "error",
        message: "Name, email and password are required",
      });
    }

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanAccountType =
      account_type && account_type.trim()
        ? account_type.trim()
        : "Finance Admin";

    const existingUser = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [cleanEmail]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        status: "error",
        message: "User with this email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users
        (name, email, password, account_type)
       VALUES
        ($1, $2, $3, $4)
       RETURNING
        id, name, email, account_type, created_at`,
      [
        cleanName,
        cleanEmail,
        hashedPassword,
        cleanAccountType,
      ]
    );

    return res.status(201).json({
      status: "success",
      message: "User registered successfully",
      user: result.rows[0],
    });
  } catch (error) {
    console.error("Register error:", error);

    return res.status(500).json({
      status: "error",
      message: "Server error during registration",
    });
  }
};

// ========================================
// LOGIN USER
// ========================================
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: "error",
        message: "Email and password are required",
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [cleanEmail]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        status: "error",
        message: "Invalid email or password",
      });
    }

    const user = result.rows[0];

    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        status: "error",
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    return res.status(200).json({
      status: "success",
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        account_type: user.account_type,
        created_at: user.created_at,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      status: "error",
      message: "Server error during login",
    });
  }
};

// ========================================
// UPDATE USER PROFILE
// ========================================
const updateProfile = async (req, res) => {
  try {
    const { name, email, account_type } = req.body;

    // ----------------------------------------
    // Get current user
    // ----------------------------------------

    const currentUserResult = await pool.query(
      `SELECT
         id,
         name,
         email,
         account_type,
         created_at
       FROM users
       WHERE id = $1`,
      [req.user.id]
    );

    if (currentUserResult.rows.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    const currentUser = currentUserResult.rows[0];

    // ----------------------------------------
    // Keep old values if not provided
    // ----------------------------------------

    const cleanName =
      typeof name === "string" && name.trim()
        ? name.trim()
        : currentUser.name;

    const cleanEmail =
      typeof email === "string" && email.trim()
        ? email.trim().toLowerCase()
        : currentUser.email;

    const cleanAccountType =
      typeof account_type === "string" && account_type.trim()
        ? account_type.trim()
        : currentUser.account_type;

    // ----------------------------------------
    // Check duplicate email
    // ----------------------------------------

    const existingUser = await pool.query(
      `SELECT id
       FROM users
       WHERE email = $1
       AND id != $2`,
      [cleanEmail, req.user.id]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        status: "error",
        message:
          "This email is already being used by another account",
      });
    }

    // ----------------------------------------
    // Update database
    // ----------------------------------------

    const result = await pool.query(
      `UPDATE users
       SET
         name = $1,
         email = $2,
         account_type = $3
       WHERE id = $4
       RETURNING
         id,
         name,
         email,
         account_type,
         created_at`,
      [
        cleanName,
        cleanEmail,
        cleanAccountType,
        req.user.id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    const updatedUser = result.rows[0];

    // ----------------------------------------
    // Create fresh token
    // ----------------------------------------

    const newToken = jwt.sign(
      {
        id: updatedUser.id,
        email: updatedUser.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // ----------------------------------------
    // Response
    // ----------------------------------------

    return res.status(200).json({
      status: "success",
      message: "Profile updated successfully",
      token: newToken,
      user: updatedUser,
    });
  } catch (error) {
    console.error("Profile update error:", error);

    return res.status(500).json({
      status: "error",
      message: "Server error while updating profile",
    });
  }
};

// ========================================
// EXPORT
// ========================================

module.exports = {
  registerUser,
  loginUser,
  updateProfile,
};
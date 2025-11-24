import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import {
  createUser,
  findUserByEmail,
  getAllUsers as getUsers,
} from "../models/userModel.js";

dotenv.config();

/* =======================================================
   🔹 REGISTER USER (customer, outlet, delivery, admin)
======================================================= */
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, address, location, phone } = req.body;

    console.log("📥 Registration Data:", req.body);

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // 1️⃣ Check if user exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 2️⃣ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3️⃣ Create user
    const newUser = await createUser(
      name,
      email,
      hashedPassword,
      role,
      address || "",
      location || { lat: 0, long: 0 },
      phone || ""
    );

    console.log("✅ User created:", newUser);

    // 4️⃣ Response
    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (err) {
    console.error("❌ Registration Error:", err);
    res.status(500).json({ message: "Registration failed", error: err.message });
  }
};

/* =======================================================
   🔹 LOGIN USER
======================================================= */
export const loginUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email & password required" });
    }

    // 1️⃣ Find user
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 2️⃣ Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 3️⃣ Validate role
    if (role && user.role.toLowerCase() !== role.toLowerCase()) {
      return res.status(403).json({
        message: `Incorrect role selected. Your role is "${user.role}".`,
      });
    }

    // 4️⃣ Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // 5️⃣ Response
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("❌ Login Error:", err);
    res.status(500).json({
      message: "Internal server error during login",
      error: err.message,
    });
  }
};

/* =======================================================
   🔹 GET ALL USERS (ADMIN ONLY)
======================================================= */
export const getAllUsers = async (req, res) => {
  try {
    const users = await getUsers();
    res.status(200).json(users);
  } catch (err) {
    console.error("❌ Error fetching users:", err);
    res.status(500).json({ error: err.message });
  }
};

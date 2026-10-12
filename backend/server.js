const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// --- Database Schemas & Models (Mongoose) ---
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    category: { type: String, default: "General" },
    coverImage: { type: String, default: "" },
    userId: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    authorName: { type: String, default: "Anonymous" },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
const Blog = mongoose.model("Blog", blogSchema);

// --- Authentication Middleware ---
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).json({ message: "Access token required" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }
    req.user = user;
    next();
  });
}

// --- API Routes ---

// Health Check
app.get("/", (req, res) => {
  res.send("Blog backend is running with Mongoose!");
});

app.get("/api/test", (req, res) => {
  res.json({ message: "REST API is working!" });
});

// Get all blogs (sorted by newest first)
app.get("/api/blogs", async (req, res) => {
  try {
    const blogs = await Blog.find({}).sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve blogs", error: error.message });
  }
});

// Get authenticated user's own blogs
app.get("/api/my-blogs", authenticateToken, async (req, res) => {
  try {
    const blogs = await Blog.find({ userId: req.user.userId }).sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve user blogs", error: error.message });
  }
});

// Get user profile
app.get("/api/profile", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get a single blog by ID
app.get("/api/blogs/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: "Invalid blog ID or server error" });
  }
});

// User Registration
app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.json({
      message: "Registration successful!",
      user: {
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Registration failed", error: error.message });
  }
});

// User Login
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    const passwordMatch = user && (await bcrypt.compare(password, user.password));

    if (!user || !passwordMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        name: user.name,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful!",
      token,
      user: {
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
});

// Create Blog
app.post("/api/blogs", authenticateToken, async (req, res) => {
  try {
    const { title, excerpt, content, category, coverImage } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required" });
    }

    // Lookup user to attach author name
    const user = await User.findById(req.user.userId);
    const authorName = user ? user.name : "Anonymous";

    const newBlog = await Blog.create({
      title,
      excerpt: excerpt || title.substring(0, 100),
      content,
      category: category || "General",
      coverImage: coverImage || "",
      userId: req.user.userId,
      author: user ? user._id : null,
      authorName,
    });

    res.status(201).json({
      message: "Blog created successfully!",
      blog: newBlog,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to create blog", error: error.message });
  }
});

// Update Blog
app.put("/api/blogs/:id", authenticateToken, async (req, res) => {
  try {
    const blogId = req.params.id;
    const { title, excerpt, content, category, coverImage } = req.body;

    const updatedBlog = await Blog.findOneAndUpdate(
      { _id: blogId, userId: req.user.userId },
      {
        $set: {
          title,
          excerpt,
          content,
          category,
          coverImage,
        },
      },
      { new: true }
    );

    if (!updatedBlog) {
      return res.status(404).json({ message: "Blog not found or unauthorized" });
    }

    res.json({ message: "Blog updated successfully", blog: updatedBlog });
  } catch (error) {
    res.status(500).json({ message: "Failed to update blog", error: error.message });
  }
});

// Delete Blog
app.delete("/api/blogs/:id", authenticateToken, async (req, res) => {
  try {
    const result = await Blog.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!result) {
      return res.status(404).json({ message: "Blog not found or unauthorized" });
    }

    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// --- Connect to Database & Start Server ---
async function startServer() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB via Mongoose!");

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}!`);
    });
  } catch (error) {
    console.error("MongoDB connection failed:", error);
  }
}

startServer();

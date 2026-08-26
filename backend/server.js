const express = require("express");

const cors = require("cors");

const { MongoClient, ObjectId } = require("mongodb");

const bcrypt = require("bcrypt");

require("dotenv").config();

const jwt = require("jsonwebtoken");

const client = new MongoClient(process.env.MONGODB_URI);

const db = client.db("blog_app");

const blogsCollection = db.collection("blogs");

const usersCollection = db.collection("users");

const app = express();



app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Blog backend is running!");
});

function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];

    if (!authHeader) {
    return res.status(401).json({
        message: "Access token required"
    });
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
        return res.status(403).json({
            message: "Invalid or expired token"
        });
    }

    req.user = user;
    next();
});
    
}

app.get("/api/protected", authenticateToken, (req, res) => {
    res.json({
        message: "You accessed a protected route!",
        user: req.user
    });
});
app.get("/api/test", (req, res) => {
    res.json({
        message: "REST API is working!"
    });
});

app.get("/api/blogs", async (req, res) => {
    const blogs = await blogsCollection.find({}).toArray();
    res.json(blogs);
});

app.get("/api/my-blogs", authenticateToken, async (req, res) => {
    const blogs = await blogsCollection.find({
        userId: req.user.userId
    }).toArray();

    res.json(blogs);

});

app.get("/api/profile", authenticateToken, async (req, res) => {
    const user = await usersCollection.findOne({
        _id: new ObjectId(req.user.userId)
    });

    res.json({
        name: user.name,
        email: user.email
    });
});

app.get("/api/blogs/:id", async (req, res) => {
    const id = req.params.id;
    const blog = await blogsCollection.findOne({ _id: new ObjectId(id) });
    res.json(blog);
});

app.post("/api/register", async (req, res) => {
    const { name, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

   await usersCollection.insertOne({
    name: name,
    email: email,
    password: hashedPassword
});

    res.json({
        message: "Registration successful!",
        user: {
            name: name,
            email: email
        }
    });
});

app.post("/api/login", async (req, res) => {

    const { email, password } = req.body;

    const user = await usersCollection.findOne({ email: email });

    const passwordMatch = user && await bcrypt.compare(password, user.password);

    if (!user || !passwordMatch) {
        return res.status(401).json({
            message: "Invalid email or password"
        });
    }

    const token = jwt.sign(
    {
        userId: user._id,
        email: user.email
    },
    process.env.JWT_SECRET,
    {
        expiresIn: "1h"
    }
);

    res.json({
        message: "Login successful!",
        token: token,
        user: {
            name: user.name,
            email: user.email
        }
    });

});

app.post("/api/blogs", authenticateToken, async (req, res) => {
    const { title, excerpt, category } = req.body;

    const newBlog = {
        title: title,
        excerpt: excerpt,
        category: category,
        userId: req.user.userId
};



await blogsCollection.insertOne(newBlog);
    res.json({
        message: "Blog created successfully!",
        blog: {
            title: title,
            excerpt: excerpt,
            category: category
        }
        
   });
  

});

app.put("/api/blogs/:id", authenticateToken, async (req, res) => {
    const blogId = req.params.id;
    const { title, excerpt, category } = req.body;
    const result = await blogsCollection.updateOne(
        {  
             _id: new ObjectId(blogId),
         
             userId: req.user.userId
        },
        {
            $set: {
                title: title,
                excerpt: excerpt,
                category: category
            }
        }
        
    );
    
    if (result.matchedCount === 0) {
        return res.status(404).json({ message: "Blog not found" });
    }

    res.json({ message: "Blog updated successfully" });
});

app.delete("/api/blogs/:id", authenticateToken, async (req, res) => {
    try {
       const id = req.params.id;
       const objectId = new ObjectId(id);
       const result = await blogsCollection.deleteOne({
           _id: objectId,
           userId: req.user.userId
        });
       if (result.deletedCount === 1) {
           res.status(200).json({ message: "Blog deleted successfully" });
       } else {
        res.status(404).json({ message: "Blog not found" });
    }
    } catch (error) {
        res.status(500).json({ message: "server error" });
    }
});


async function connectToDatabase() {
    try {
        await client.connect();
        console.log("Connected to MongoDB!");

        app.listen(3000, () => {
            console.log("Server is running on http://localhost:3000");
        });

    } catch (error) {
        console.error("MongoDB connection failed:", error);
    }
}

connectToDatabase();

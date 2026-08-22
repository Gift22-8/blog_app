const express = require("express");

const cors = require("cors");

const { MongoClient } = require("mongodb");

const bcrypt = require("bcrypt");

require("dotenv").config();

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

app.get("/api/test", (req, res) => {
    res.json({
        message: "REST API is working!"
    });
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

    res.json({
        message: "Login successful!",
        user: {
            name: user.name,
            email: user.email
        }
    });

});

app.post("/api/blogs", async (req, res) => {
    const { title, excerpt, category } = req.body;

    const newBlog = {
        title: title,
        excerpt: excerpt,
        category: category
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

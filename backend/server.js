const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const users = [];
const blogs = [];

app.get("/", (req, res) => {
    res.send("Blog backend is running!");
});

app.get("/api/test", (req, res) => {
    res.json({
        message: "REST API is working!"
    });
});


app.post("/api/register", (req, res) => {
    const { name, email, password } = req.body;

    users.push({
    name: name,
    email: email,
    password: password
});

    res.json({
        message: "Registration successful!",
        user: {
            name: name,
            email: email
        }
    });
});

app.post("/api/login", (req, res) => {

    const { email, password } = req.body;
    const user = users.find(user => user.email === email);

    if (!user || user.password !== password) {
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

app.post("/api/blogs", (req, res) => {
    const { title, content } = req.body;

    blogs.push({
        title: title,
        content: content
    });

    res.json({
        message: "Blog created successfully!",
        blog: {
            title: title,
            content: content
        }
        
   });
  

});


app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});

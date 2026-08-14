const express = require("express");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Blog backend is running!");
});

app.get("/api/test", (req, res) => {
    res.json({
        message: "REST API is working!"
    });
});

app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});
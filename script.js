const posts = [
    {
        title: "Getting Started with Web Development",
        excerpt: "Learn the basics of html, css, and javascript and start building your first website.",
        category: "Web Development"
    },
    {
        title: "Why Javascript matters",
        excerpt: "Discover how javascript makes websites interactive and brings your frotend to life.",
        category: "Web Development"
    },
    {
        title: "Tips for Becoming a better Developer",
        excerpt: "Simple habits that can help you improve your coding skills and become a better developer.",
        category: "Programming"
    }
];
const blogPosts = document.getElementById("blog-posts");
if (blogPosts) {
    posts.forEach((post) => {
        const article = document.createElement("article");

         article.innerHTML = `
             <h3>${post.title}</h3>
             <p>${post.excerpt}</p>
             <p>${post.category}</p>
             <a href="#">Read More</a>
         `;
         blogPosts.appendChild(article);
   });
}

const postForm= document.getElementById("post-form");

if (postForm) {
    postForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const title = document.getElementById("title").value;
    const excerpt = document.getElementById("excerpt").value;
    const category = document.getElementById("category").value;


    const article = document.createElement("article");

    article.innerHTML = `
       <h3>${title}</h3>
        <p>${excerpt}</p>
        <p>${category}</p>
        <a href="#">Read More</a>
    `;

    blogPosts.appendChild(article);
    console.log(title);
    console.log(excerpt);
    console.log(category);

});

}
const registerForm = document.getElementById("register-form");

if (registerForm) {
    registerForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirm-password").value;

        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        localStorage.setItem("userName", name);
        localStorage.setItem("userEmail", email);
        localStorage.setItem("userPassword", password);

        alert("Registration successful!");

        window.location.href = "login.html";
    });
}
const loginForm = document.getElementById("login-form");

if (loginForm) {
    loginForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        const savedEmail = localStorage.getItem("userEmail");
        const savedPassword = localStorage.getItem("userPassword");

        if (email === savedEmail && password === savedPassword) {
            alert("Login successful!");
            window.location.href = "dashboard.html";
        } else {
            alert("Invalid email or password.");
        }
    });
}
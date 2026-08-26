const token = localStorage.getItem("token");

if (!token && window.location.pathname.includes("dashboard.html")) {
    window.location.href = "login.html";
}

const blogPosts = document.getElementById("blog-posts");

const apiUrl = window.location.pathname.includes("dashboard.html")
    ? "http://localhost:3000/api/my-blogs"
    : "http://localhost:3000/api/blogs";

if (blogPosts) {

   const token = localStorage.getItem("token");

   fetch(apiUrl, {
       headers: {
           "Authorization": `Bearer ${token}`
       }
   })
        .then(response => response.json())
        .then(blogs => {
            blogs.forEach((blog) => {
                const article = document.createElement("article");

                article.innerHTML = `
                    <h3>${blog.title}</h3>
                    <p>${blog.excerpt}</p>
                    <p>Category: ${blog.category}</p>
                    <a href="blog-details.html?id=${blog._id}">Read More</a>
                    <a href="create-blog.html?id=${blog._id}">Edit</a>
                    <button type="button" class="delete-btn" data-id="${blog._id}">Delete</button>
                `;
                blogPosts.appendChild(article);
            });
    

        document.querySelectorAll(".delete-btn").forEach((button) => {
            button.addEventListener("click", () => {
                const id = button.dataset.id;
                fetch(`http://localhost:3000/api/blogs/${id}`, {
                    method: "DELETE",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                
                })
                   .then(response => response.json())
                   .then(data => {
                       console.log(data);
                   });
            });
        });
    });
}

const postForm= document.getElementById("post-form");

if (postForm) {
    postForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const token = localStorage.getItem("token");

        const title = document.getElementById("title").value;
        const excerpt = document.getElementById("excerpt").value;
        const category = document.getElementById("category").value;

    fetch(blogId ? `http://localhost:3000/api/blogs/${blogId}` : "http://localhost:3000/api/blogs", {
        method: blogId ? "PUT" :  "POST",
        headers: {
            "Content-Type": "application/json",
             "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
            title: title,
            excerpt: excerpt,
            category: category
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
    });

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

        fetch("http://localhost:3000/api/register", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        name: name,
        email: email,
        password: password
    })
})
.then(response => response.json())
.then(data => {
    console.log(data);
});
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

        fetch("http://localhost:3000/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);

            if (data.message === "Login successful!") {
                localStorage.setItem("token", data.token);
                
                alert("Login successful!");
                window.location.href = "dashboard.html";
            }
        });
    });
}

const profileButton = document.getElementById("profile-button");
const profileMenu = document.getElementById("profile-menu");
const profileName = document.getElementById("profile-name");
const profileEmail = document.getElementById("profile-email");

if (profileButton && profileMenu) {

    profileMenu.style.display = "none";

    profileButton.addEventListener("click", () => {
        if (profileMenu.style.display === "none") {
            profileMenu.style.display = "block";
        } else {
            profileMenu.style.display = "none";
        }
    });

    const token = localStorage.getItem("token");

    fetch("http://localhost:3000/api/profile", {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
        .then(response => response.json())
        .then(data => {
            profileName.textContent = data.name;
            profileEmail.textContent = data.email;
        });
}

const logoutButton = document.getElementById("logout-button");

if (logoutButton) {
    logoutButton.addEventListener("click", () => {
        localStorage.removeItem("token");
        window.location.href = "login.html";
    });
}


const urlParams = new URLSearchParams(window.location.search);
const blogId = urlParams.get("id");
if (blogId) {
    console.log("Edit mode. Blog ID:", blogId);

    const detailsUrl = `http://localhost:3000/api/blogs/${blogId}`;

    fetch(detailsUrl)
        .then(response => response.json())
        .then(blog => {
            const blogDetails = document.getElementById("blog-details");

            blogDetails.innerHTML = `
                <h1>${blog.title}</h1>
                <p>${blog.excerpt}</p>
                <p>Category: ${blog.category}</p>
            `;
        });
} else {
    console.log("Create mode");
}
// --- Theme Handling (Dark / Light Mode) ---
(function initTheme() {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light") {
        document.body.classList.add("light-theme");
    }

    function setupThemeToggle() {
        const toggleBtn = document.getElementById("theme-toggle");
        if (!toggleBtn) return;

        const updateIcon = () => {
            const isLight = document.body.classList.contains("light-theme");
            toggleBtn.textContent = isLight ? "🌙" : "☀️";
            toggleBtn.setAttribute("title", isLight ? "Switch to Dark Mode" : "Switch to Light Mode");
        };

        updateIcon();

        toggleBtn.addEventListener("click", () => {
            document.body.classList.toggle("light-theme");
            const isLight = document.body.classList.contains("light-theme");
            localStorage.setItem("theme", isLight ? "light" : "dark");
            updateIcon();
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", setupThemeToggle);
    } else {
        setupThemeToggle();
    }
})();

function showToast(message) {
    const toast = document.getElementById("toast");

    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}
const token = localStorage.getItem("token");

if (!token && window.location.pathname.includes("dashboard.html")) {
    window.location.href = "login.html";
}

const blogPosts = document.getElementById("blog-posts");

const apiUrl = window.location.pathname.includes("dashboard.html")
    ? "https://blog-app-backend-5vzv.onrender.com/api/my-blogs"
    : "https://blog-app-backend-5vzv.onrender.com/api/blogs";

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

                 const shortExcerpt = blog.excerpt.length > 120
                     ? blog.excerpt.substring(0, 120) + "..."
                     : blog.excerpt;

                const article = document.createElement("article");

                article.innerHTML = `
                    <h3>${blog.title}</h3>
                    <p>${shortExcerpt}</p>
                    <p>Category: ${blog.category}</p>
                    <a href="blog-details.html?id=${blog._id}">Read More</a>
                   <a href="create-blog.html?id=${blog._id}" class="edit-btn">Edit</a>
                    <button type="button" class="delete-btn" data-id="${blog._id}">Delete</button>
                `;
                blogPosts.appendChild(article);
            });
    

        document.querySelectorAll(".delete-btn").forEach((button) => {
            button.addEventListener("click", () => {
                if (!confirm("Are you sure you want to delete this blog?")) {
                    return;
                }
                const id = button.dataset.id;
                fetch(`https://blog-app-backend-5vzv.onrender.com/api/blogs/${id}`, {
                    method: "DELETE",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                
                })
                  
            });
        });
    });
}

const postForm = document.getElementById("post-form");

if (postForm) {
    postForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const token = localStorage.getItem("token");

        const title = document.getElementById("title").value;
        const excerpt = document.getElementById("excerpt").value;
        const content = document.getElementById("content").value;
        const category = document.getElementById("category").value;

    fetch(blogId ? `https://blog-app-backend-5vzv.onrender.com/api/blogs/${blogId}` : "https://blog-app-backend-5vzv.onrender.com/api/blogs", {
        method: blogId ? "PUT" : "POST",
        headers: {
            "Content-Type": "application/json",
             "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
            title: title,
            excerpt: excerpt,
            content: content,
            category: category
        })
    })
    .then(response => response.json())
    .then(data => {
        
         if (data.message) {
             window.location.href = "dashboard.html";
    }
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
           showToast("Passwords do not match.");
            return;
        }

        fetch("https://blog-app-backend-5vzv.onrender.com/api/register", {
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
            if (data.message === "Registration successful!") {
                localStorage.setItem("toastMessage", "Registration successful!");
                window.location.href = "login.html";
            }else {
               showToast(data.message);
            }
        });
    });
}
const loginForm = document.getElementById("login-form");

if (loginForm) {
    loginForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        fetch("https://blog-app-backend-5vzv.onrender.com/api/login", {
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
           

            if (data.message === "Login successful!") {
                localStorage.setItem("token", data.token);
                
                localStorage.setItem("toastMessage", "Login successful!");
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

    fetch("https://blog-app-backend-5vzv.onrender.com/api/profile", {
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
   

    const detailsUrl = `https://blog-app-backend-5vzv.onrender.com/api/blogs/${blogId}`;

    fetch(detailsUrl)
        .then(response => response.json())
        .then(blog => {
            const blogDetails = document.getElementById("blog-details");

            const content = blog.content || "";

            blogDetails.innerHTML = `
                <h1>${blog.title}</h1>
                <p>${blog.excerpt}</p>
                ${content ? `<p>${content}</p>` : ""}
                <p>Category: ${blog.category}</p>
            `;
        });
}

const toastMessage = localStorage.getItem("toastMessage");

if (toastMessage) {
    showToast(toastMessage);
    localStorage.removeItem("toastMessage");
}
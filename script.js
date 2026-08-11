const posts = [
    {
        title: "Getting Started with Web Development",
        excerpt: "Learn the basics of html, css, and javascript and start building your first website.",
        catagory: "Web Development"
    },
    {
        title: "Why Javascript matters",
        excerpt: "Discover how javascript makes websites interactive and brings your frotend to life.",
        catagory: "Web Development"
    },
    {
        title: "Tips for Becoming a better Developer",
        excerpt: "Simple habits that can help you improve your coding skills and become a better developer.",
        catagory: "Programming"
    }
];
const blogPosts = document.getElementById("blog-posts");
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
const postForm= document.getElementById("post-form");

postForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const title = document.getElementById("title").value;
    const excerpt = document.getElementById("excerpt").value;
    const category = document.getElementById("category").value;

    console.log(title);
    console.log(excerpt);
    console.log(category);

});
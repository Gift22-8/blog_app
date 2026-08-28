# Blog Application

A full-stack blog application that allows users to register, log in, create, view, edit, and delete their own blog posts.

---

## 🛠️ Technologies Used

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)

---
## ✨ Features

- **Authentication:** User registration and login with secure bcrypt password hashing.
- **Security:** Protected routes using JWT (JSON Web Tokens).
- **Dashboard:** Private dashboard for logged-in users.
- **CRUD Operations:** Full ability to create, view, edit, and delete personal blog posts.
- **User Profiles:** Personalized user profile management and logout functionality.
- **UI Feedback:** Interactive toast notifications for user actions.
- **Database:** Full integration with MongoDB.

---
## 🚀 How to Run

1. **Clone the repository:**
   ```bash
   git clone <your-repository-url>
    ```
2. **Navigate to project directory:**
   ```bash
   cd blog-application
   code .
   ```
3. **Install dependencies:**
   ```bash
   npm install

   ```
4. Set up Environment Variables:

Configure your environment variables in the backend directory.

5. **Start the backend server:**
   ```
      node server.js
   ```
6. Launch Frontend:
Open the frontend HTML files in your browser.
   
   ## 🔑 Environment Variables

Create a `.env` file inside the `backend` folder and add:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

## 📡 API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/register` | Register a new user |
| `POST` | `/api/login` | Log in a user |
| `GET` | `/api/blogs` | Get all published blogs |
| `GET` | `/api/blogs/:id` | Get a specific blog by ID |
| `GET` | `/api/my-blogs` | Get all blogs by the logged-in user |
| `GET` | `/api/profile` | Get logged-in user profile details |
| `POST` | `/api/blogs` | Create a new blog post |
| `PUT` | `/api/blogs/:id` | Update an existing blog post |
| `DELETE` | `/api/blogs/:id` | Delete a blog post |
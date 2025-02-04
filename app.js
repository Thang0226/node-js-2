import express from "express";
import { fileURLToPath } from "url";
import { dirname } from "path";
import morgan from "morgan";
import mongoose from "mongoose";
import Blog from "./models/blog.js";

const __filename = fileURLToPath(import.meta.url); // get file path
const __dirname = dirname(__filename); // get folder path from file path, because sendFile() use absolute path

const app = express();

app.set("view engine", "ejs"); // set view engine to ejs, default folder is views

// app.listen(3000);

// const blogs = [
//   {
//     title: "Yoshi finds eggs",
//     snippet: "Lorem ipsum dolor sit amet consectetur",
//     body: "Lorem ipsum dolor sit amet consectetur",
//   },
//   {
//     title: "Mario finds stars",
//     snippet: "Lorem ipsum dolor sit amet consectetur",
//     body: "Lorem ipsum dolor sit amet consectetur",
//   },
//   {
//     title: "How to defeat bowser",
//     snippet: "Lorem ipsum dolor sit amet consectetur",
//     body: "Lorem ipsum dolor sit amet consectetur",
//   },
// ];

// Connect to MongoDB database
const dbURI =
  "mongodb+srv://thangnd0226:thangnd0226@cluster-thang.so4v6.mongodb.net/greeting";
mongoose
  .connect(dbURI)
  .then((result) => {
    console.log("Connected to database");
    app.listen(3000);
  })
  .catch((err) => console.log(err));

// pre-handle requests
// app.use((req, res, next) => {
//   console.log();
//   console.log("New request made:");
//   console.log("Host: ", req.hostname);
//   console.log("Path: ", req.url);
//   console.log("Method: ", req.method);
//   next(); // move to next middleware
// });

// Middleware & Static files
app.use(morgan("dev")); // log requests
app.use(express.static("public")); // serve static files
app.use(express.urlencoded({ extended: true })); // enable parsing form data

// Listen to requests
app.get("/", (req, res) => {
  Blog.find()
    .sort({ createdAt: -1 }) // sort by createdAt field, -1 is descending
    .then((result) => {
      res.render("index", { blogs: result });
    })
    .catch((err) => console.log(err));
});

// Retrieve all blogs
app.get("/blogs", (req, res) => {
  res.setHeader("Cache-Control", "no-cache");
  res.redirect("/");
});

// Retrieve single blog
app.get("/blogs/:id", (req, res) => {
  const id = req.params.id;
  Blog.findById(id)
    .then((result) => {
      res.render("details", { blog: result });
    })
    .catch((err) => console.log(err));
});

// Create new blog
app.get("/blogs/create", (req, res) => {
  res.render("create");
});

app.post("/blogs", (req, res) => {
  let { title, snippet, body } = req.body;
  const blog = new Blog({
    title,
    snippet,
    body,
  });
  blog
    .save()
    .then((result) => {
      res.redirect("/blogs");
    })
    .catch((err) => console.log(err));
});

// Delete a blog
app.get("/blogs/:id/delete", (req, res) => {
  const id = req.params.id;
  Blog.findByIdAndDelete(id)
    .then((result) => {
      res.redirect("/blogs");
    })
    .catch((err) => console.log(err));
});

app.get("/about", (req, res) => {
  res.render("about");
});

// Redirects
app.get("/about-us", (req, res) => {
  res.setHeader("Cache-Control", "no-cache"); // to prevent still-handling old request after this is modified
  res.redirect("/about");
});

// Default case ~ error handling --> Has to be at the end!
app.use((req, res) => {
  res.status(404).render("error");
});

import express from "express";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url); // get file path
const __dirname = dirname(__filename); // get folder path from file path, because sendFile() use absolute path

const app = express();

app.set("view engine", "ejs"); // set view engine to ejs, default folder is views

app.listen(3000);

const blogs = [
  {
    title: "Yoshi finds eggs",
    snippet: "Lorem ipsum dolor sit amet consectetur",
    body: "Lorem ipsum dolor sit amet consectetur",
  },
  {
    title: "Mario finds stars",
    snippet: "Lorem ipsum dolor sit amet consectetur",
    body: "Lorem ipsum dolor sit amet consectetur",
  },
  {
    title: "How to defeat bowser",
    snippet: "Lorem ipsum dolor sit amet consectetur",
    body: "Lorem ipsum dolor sit amet consectetur",
  },
];

// Listen to requests
app.get("/", (req, res) => {
  res.render("index", { blogs: blogs }); // automatically looks for .ejs file in views folder
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/blogs/create", (req, res) => {
  res.render("create");
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

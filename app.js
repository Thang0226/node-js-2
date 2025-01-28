import express from "express";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url); // get file path
const __dirname = dirname(__filename); // get folder path from file path, because sendFile() use absolute path

const app = express();
app.listen(3000);

// Listen to requests
app.get("/", (req, res) => {
  res.sendFile("./views/index.html", { root: __dirname });
});

app.get("/about", (req, res) => {
  res.sendFile("./views/about.html", { root: __dirname });
});

// Redirects
app.get("/about-us", (req, res) => {
  res.setHeader("Cache-Control", "no-cache"); // to prevent still-handling old request after this is modified
  res.redirect("/about");
});

// Default case ~ error handling --> Has to be at the end!
app.use((req, res) => {
  res.status(404).sendFile("./views/error.html", { root: __dirname });
});

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const mysql = require('mysql2');

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "password",
  database: "ecommerce",
});

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

db.getConnection(function(error, connection) {
  if (error) throw error;
  console.log('Connected to database!');
  connection.release();
});

// Contact form
app.post("/submit-form", (req, res) => {
  const { firstName, lastName, email, subject } = req.body;
  if (!firstName || !lastName || !email || !subject) {
    return res.status(400).json({ error: "All fields are required" });
  }
  const sql =
    "INSERT INTO contact_form (first_name, last_name, email, subject) VALUES (?, ?, ?, ?)";
  db.execute(sql, [firstName, lastName, email, subject], (err, results) => {
    if (err) {
      console.error("DB insert error:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.status(201).json({ message: "Form data inserted", id: results.insertId });
  });
});

// Products with search
app.get("/api/ecommerce/products", (req, res) => {
  const searchTerm = req.query.search || '';
  const sql = `SELECT * FROM products WHERE name LIKE ?`;
  const values = [`%${searchTerm}%`];
  db.query(sql, values, (err, result) => {
    res.setHeader("Content-Type", "application/json");
    res.json(result);
  });
});

// Shopping cart
app.get("/api/ecommerce/cart", (req, res) => {
  const sql = "SELECT * FROM cart";
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send("Server error");
      return;
    }
    res.setHeader("Content-Type", "application/json");
    res.json(result);
  });
});

app.post("/api/ecommerce/cart", (req, res) => {
  const { id, name, description, image_url, price } = req.body.product;
  const sql = "INSERT INTO cart (id, name, description, image_url, price) VALUES (?, ?, ?, ?, ?)";
  const values = [id, name, description, image_url, price];
  db.query(sql, values, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send("Server error");
      return;
    }
    res.setHeader("Content-Type", "application/json");
    res.json(result);
  });
});

app.delete("/api/ecommerce/cart/:id", (req, res) => {
  const productId = req.params.id;
  const sql = "DELETE FROM cart WHERE id = ?";
  const values = [productId];
  db.query(sql, values, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send("Server error");
      return;
    }
    res.json(result);
  });
});

app.use((req, res) => {
  res.status(404).send("Not found");
});

app.listen(3001, () => {
  console.log('Server started on port 3001');
});

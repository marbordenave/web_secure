require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { body } = require("express-validator");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const rateLimit = require("express-rate-limit");
const bodyParser = require("body-parser");
const fs = require("fs"); // Ajoutez cette ligne
const checkRole = require("./middlewares/checkRole");
const validate = require("./middlewares/validate");

const app = express();
//
// 2. Applique le CORS (doit être avant les vérifications d’API key)
app.use(
  cors({
    origin: "http://localhost:3001",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-api-key"],
    credentials: true,
  })
);

app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// 1. Gère les requêtes CORS préflight
app.options("*", cors());

const PORT = 3000;
const SECRET_KEY = process.env.SECRET_KEY;
const DB_FILE = process.env.DB_FILE;

// Middleware to authenticate JWT tokens
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "Missing token" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: "Invalid or expired token" });
  }
};

//  3. Applique le rate limiter
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
      error: "Too many requests from this IP, please try again later.",
    },
    standardHeaders: true,
    legacyHeaders: false,
  })
);

// 4. Parse JSON
app.use(bodyParser.json());

// 5. Vérifie la clé API sauf sur certaines routes
const checkApiKey = (req, res, next) => {
  const key = req.headers["x-api-key"];
  if (key !== process.env.API_KEY) {
    return res.status(403).json({ error: "Invalid API key" });
  }
  next();
};

app.use((req, res, next) => {
  if (["/login", "/register", "/me"].includes(req.path)) return next();
  if (req.method === "OPTIONS") return next(); // 🔑 NE PAS bloquer les préflight
  checkApiKey(req, res, next);
});

// Functions to handle the database
function loadDB() {
  try {
    const data = fs.readFileSync(DB_FILE, "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading db.json file:", err);
    return {
      attractions: [],
      parc: {},
      tarifs: [],
      parcours: [],
      users: [],
    };
  }
}

function saveDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // Remplacer * par votre front en production
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// Authentication routes

app.post(
  "/login",
  [
    body("email").isEmail().withMessage("Email invalide").normalizeEmail(),
    body("password").notEmpty().withMessage("Mot de passe requis").trim(),
    validate,
  ],
  async (req, res) => {
    try {
      const { email, password } = req.body;
      console.log("Login attempt:", email);

      const db = loadDB();
      console.log("Users in DB:", db.users);

      // Insensible à la casse sur email
      const user = db.users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase()
      );

      if (!user) {
        console.log("User not found");
        return res.status(401).json({ error: "Invalid email or password" });
      }

      const match = await bcrypt.compare(password, user.password);
      console.log("Password match:", match);

      if (!match) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role || "user" },
        SECRET_KEY,
        { expiresIn: "1h" }
      );

      res.json({
        token,
        user: {
          id: user.id,
          email: user.email,
          role: user.role || "user",
          isAdmin: (user.role || "user") === "admin",
        },
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  }
);

app.get("/me", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Missing token" });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const db = loadDB();
    const userExists = db.users.some((u) => u.id === decoded.id);

    if (!userExists) {
      return res.status(401).json({ error: "User not found" });
    }

    res.json({
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
      isAdmin: decoded.role === "admin",
    });
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
});

app.post(
  "/register",
  [
    body("email").isEmail().withMessage("Email invalide").normalizeEmail(),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Mot de passe requis")
      .trim(),
    validate,
  ],
  async (req, res) => {
    const { email, password } = req.body;

    const db = loadDB();

    if (db.users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return res.status(409).json({ error: "Email already in use" });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      let newId;
      if (db.users.length > 0) {
        const maxId = Math.max(...db.users.map((u) => parseInt(u.id, 10) || 0));
        newId = (maxId + 1).toString();
      } else {
        newId = "1";
      }

      const newUser = {
        id: newId,
        email: email.trim(),
        password: hashedPassword,
        role: "user",
      };

      db.users.push(newUser);
      saveDB(db);

      res.status(201).json({
        message: "User successfully created",
        user: { id: newUser.id, email: newUser.email },
      });
    } catch (err) {
      console.error("Error during registration:", err);
      res.status(500).json({ error: "Server error" });
    }
  }
);

// Attractions routes
app.get("/api/attractions", (req, res) => {
  const db = loadDB();
  res.json(db.attractions);
});

app.post(
  "/api/attractions",
  authenticateJWT,
  checkRole("admin"),
  [
    body("nom")
      .isString()
      .withMessage("Le nom doit être une chaîne de caractères")
      .notEmpty()
      .withMessage("Le nom est requis")
      .trim()
      .escape(),
    body("description")
      .optional()
      .isString()
      .withMessage("La description doit être une chaîne")
      .trim()
      .escape(),
    body("categorie")
      .optional()
      .isString()
      .withMessage("La catégorie doit être une chaîne")
      .trim()
      .escape(),
    body("image")
      .optional()
      .isURL()
      .withMessage("L'image doit être une URL valide")
      .matches(/\.(jpg|jpeg|png|gif)$/i)
      .withMessage("L'URL de l'image doit pointer vers un fichier image"),
    validate,
  ],
  (req, res) => {
    const db = loadDB();
    const newAttraction = {
      id: Date.now().toString(),
      ...req.body,
      commentaires: [],
    };
    db.attractions.push(newAttraction);
    saveDB(db);
    res.status(201).json(newAttraction);
  }
);

app.put(
  "/api/attractions/:id",
  authenticateJWT,
  checkRole("admin"),
  [
    body("nom")
      .optional()
      .isString()
      .withMessage("Le nom doit être une chaîne de caractères")
      .trim()
      .escape(),
    body("description")
      .optional()
      .isString()
      .withMessage("La description doit être une chaîne")
      .trim()
      .escape(),
    body("categorie")
      .optional()
      .isString()
      .withMessage("La catégorie doit être une chaîne")
      .trim()
      .escape(),
    body("image")
      .optional()
      .isURL()
      .withMessage("L'image doit être une URL valide")
      .matches(/\.(jpg|jpeg|png|gif)$/i)
      .withMessage("L'URL de l'image doit pointer vers un fichier image"),
    validate,
  ],
  (req, res) => {
    const db = loadDB();
    const index = db.attractions.findIndex((a) => a.id === req.params.id);
    if (index === -1)
      return res.status(404).json({ error: "Attraction not found" });

    db.attractions[index] = {
      ...db.attractions[index],
      ...req.body,
    };
    saveDB(db);
    res.json(db.attractions[index]);
  }
);

app.delete(
  "/api/attractions/:id",
  authenticateJWT,
  checkRole("admin"),
  (req, res) => {
    const db = loadDB();
    const index = db.attractions.findIndex((a) => a.id === req.params.id);
    if (index === -1)
      return res.status(404).json({ error: "Attraction not found" });
    db.attractions.splice(index, 1);
    saveDB(db);
    res.json({ message: "Attraction successfully deleted" });
  }
);

// Park routes
app.get("/api/parc", (req, res) => {
  const db = loadDB();
  res.json(db.parc);
});

app.put(
  "/api/parc",
  authenticateJWT,
  checkRole("admin"),
  [
    // Validation des champs possibles du parc
    body("nom").optional().isString().notEmpty().trim().escape(),
    body("description").optional().isString().trim().escape(),
    // Ajoute les champs du parc ici avec validations
    validate,
  ],
  (req, res) => {
    const db = loadDB();
    db.parc = { ...db.parc, ...req.body };
    saveDB(db);
    res.json(db.parc);
  }
);

// Tariffs routes
app.get("/api/tarifs", (req, res) => {
  const db = loadDB();
  res.json(db.tarifs);
});

// User routes
app.get("/api/users", authenticateJWT, checkRole("admin"), (req, res) => {
  const db = loadDB();
  res.json(db.users);
});

app.put(
  "/api/users/:id",
  authenticateJWT,
  checkRole("admin"),
  [
    body("email")
      .optional()
      .isEmail()
      .withMessage("Email invalide")
      .normalizeEmail(),
    body("role")
      .optional()
      .isIn(["user", "admin"])
      .withMessage("Role invalide"),
    // Ne pas permettre de modifier le mot de passe ici sans procédure dédiée
    validate,
  ],
  (req, res) => {
    const db = loadDB();
    const index = db.users.findIndex((u) => u.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: "User not found" });
    db.users[index] = { ...db.users[index], ...req.body };
    saveDB(db);
    res.json(db.users[index]);
  }
);

app.delete(
  "/api/users/:id",
  authenticateJWT,
  checkRole("admin"),
  (req, res) => {
    const db = loadDB();
    const index = db.users.findIndex((u) => u.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: "User not found" });
    db.users.splice(index, 1);
    saveDB(db);
    res.json({ message: "User successfully deleted" });
  }
);

app.post(
  "/api/attractions/:id/commentaires",
  authenticateJWT,
  [
    body("commentaire")
      .isString()
      .notEmpty()
      .withMessage("Le commentaire ne peut pas être vide")
      .trim()
      .escape(),
    validate,
  ],
  (req, res) => {
    try {
      const decoded = req.user;
      const db = loadDB();
      const attraction = db.attractions.find((a) => a.id === req.params.id);
      if (!attraction)
        return res.status(404).json({ error: "Attraction not found" });

      const { commentaire } = req.body;

      const user = db.users.find((u) => u.id === decoded.id);
      if (!user) return res.status(404).json({ error: "User not found" });

      const newComment = {
        id: Date.now().toString(),
        userId: user.id,
        userEmail: user.email,
        texte: commentaire,
        date: new Date().toISOString(),
      };

      attraction.commentaires.push(newComment);
      saveDB(db);
      res.status(201).json(newComment);
    } catch (err) {
      res.status(401).json({ error: "Invalid token" });
    }
  }
);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({ error: "Server error" });
});

// Avant app.listen, après toutes les routes
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const app = express();
const PORT = 3000;
const SECRET_KEY = 'votre_cle_secrete'; // À changer en production !
const DB_FILE = 'db.json';

// Middlewares de base
app.use(cors());
app.use(bodyParser.json());

// Charger la base de données
function loadDB() {
  try {
    const data = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error("Erreur de lecture du fichier db.json:", err);
    return { users: [] }; // Retourne une structure vide si fichier inexistant
  }
}

// Sauvegarder la base de données
function saveDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// Route de login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // 1. Vérification des champs
  if (!email || !password) {
    return res.status(400).json({ error: 'Email et mot de passe requis' });
  }

  const db = loadDB();
  
  // 2. Recherche de l'utilisateur
  const user = db.users.find(u => u.email === email);
  
  if (!user) {
    return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
  }

  // 3. Vérification du mot de passe avec bcrypt
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
  }

  // 4. Création du token JWT
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role
    },
    SECRET_KEY,
    { expiresIn: '1h' }
  );

  // 5. Réponse avec le token et les infos utilisateur
  res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      isAdmin: user.role === 'admin'
    }
  });
});

// Route /me pour vérifier le token
app.get('/me', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Token manquant' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    
    // Vérification que l'utilisateur existe toujours
    const db = loadDB();
    const userExists = db.users.some(u => u.id === decoded.id);
    
    if (!userExists) {
      return res.status(401).json({ error: 'Utilisateur introuvable' });
    }

    res.json({
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
      isAdmin: decoded.role === 'admin'
    });
  } catch (err) {
    res.status(401).json({ error: 'Token invalide' });
  }
});

// Route d'inscription (optionnelle mais recommandée)
app.post('/register', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email et mot de passe requis' });
  }

  const db = loadDB();
  
  if (db.users.some(u => u.email === email)) {
    return res.status(409).json({ error: 'Email déjà utilisé' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = {
      id: db.users.length > 0 ? Math.max(...db.users.map(u => u.id)) + 1 : 1,
      email,
      password: hashedPassword,
      role: 'user' // Par défaut
    };

    db.users.push(newUser);
    saveDB(db);

    res.status(201).json({ message: 'Utilisateur créé avec succès' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
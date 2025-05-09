const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const app = express();
const PORT = 3000;
const SECRET_KEY = 'votre_cle_secrete';
const DB_FILE = 'db.json';

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Fonctions pour gérer la base de données
function loadDB() {
  try {
    const data = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error("Erreur de lecture du fichier db.json:", err);
    return {
      attractions: [],
      parc: {},
      tarifs: [],
      parcours: [],
      users: []
    };
  }
}

function saveDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// Routes d'authentification
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email et mot de passe requis' });
  }
  console.log(req.body); 

  const db = loadDB();
  const user = db.users.find(u => u.email === email);

  if (!user) {
    return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
  }
  console.log(user)

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role || 'user' },
    SECRET_KEY,
    { expiresIn: '1h' }
  );

  res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role || 'user',
      isAdmin: (user.role || 'user') === 'admin'
    }
  });
});

app.get('/me', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token manquant' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
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

app.post('/register', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email et mot de passe requis' });
  }

  const db = loadDB();

  // Vérification plus robuste de l'email existant
  if (db.users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
    return res.status(409).json({ error: 'Email déjà utilisé' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // Génération d'un ID cohérent
    let newId;
    if (db.users.length > 0) {
      // Convertit tous les IDs en nombres et prend le max
      const maxId = Math.max(...db.users.map(u => {
        const idAsNumber = parseInt(u.id, 10); // Préciser la base (10) pour éviter des conversions incorrectes
        return isNaN(idAsNumber) ? 0 : idAsNumber; // Si l'ID n'est pas un nombre valide, on le remplace par 0
      }));
    
      newId = (maxId + 1).toString(); // Incrémente le maxId pour générer un nouvel ID
    } else {
      newId = "1"; // Premier ID
    }
    
    const newUser = {
      id: newId, // Toujours une string pour consistance
      email: email.trim(), // Nettoyage de l'email
      password: hashedPassword,
      role: 'user'
    };

    db.users.push(newUser);
    saveDB(db);

    res.status(201).json({ 
      message: 'Utilisateur créé avec succès',
      user: { id: newUser.id, email: newUser.email } 
    });
  } catch (err) {
    console.error('Erreur lors de l\'inscription:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Routes pour les attractions
app.get('/api/attractions', (req, res) => {
  const db = loadDB();
  res.json(db.attractions);
});

app.post('/api/attractions', (req, res) => {
  const db = loadDB();
  const newAttraction = {
    id: Date.now().toString(),
    ...req.body,
    commentaires: []
  };
  db.attractions.push(newAttraction);
  saveDB(db);
  res.status(201).json(newAttraction);
});

app.put('/api/attractions/:id', (req, res) => {
  const db = loadDB();
  const index = db.attractions.findIndex(a => a.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Attraction non trouvée' });
  db.attractions[index] = { ...db.attractions[index], ...req.body };
  saveDB(db);
  res.json(db.attractions[index]);
});

app.delete('/api/attractions/:id', (req, res) => {
  const db = loadDB();
  const index = db.attractions.findIndex(a => a.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Attraction non trouvée' });
  db.attractions.splice(index, 1);
  saveDB(db);
  res.json({ message: 'Attraction supprimée avec succès' });
});

// Routes pour le parc
app.get('/api/parc', (req, res) => {
  const db = loadDB();
  res.json(db.parc);
});

app.put('/api/parc', (req, res) => {
  const db = loadDB();
  db.parc = { ...db.parc, ...req.body };
  saveDB(db);
  res.json(db.parc);
});

// Routes pour les tarifs
app.get('/api/tarifs', (req, res) => {
  const db = loadDB();
  res.json(db.tarifs);
});


app.get('/api/users', (req, res) => {
  const db = loadDB();
  res.json(db.users);
});

// Mettre à jour un utilisateur existant
app.patch('/api/users/:id', (req, res) => {
  const db = loadDB();
  const index = db.users.findIndex(u => u.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Utilisateur non trouvé' });

  db.users[index] = { ...db.users[index], ...req.body };
  saveDB(db);
  res.json(db.users[index]);
});


// Supprimer un utilisateur
app.delete('/api/users/:id', (req, res) => {
  const db = loadDB();
  const index = db.users.findIndex(u => u.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Utilisateur non trouvé' });
  db.users.splice(index, 1);
  saveDB(db);
  res.json({ message: 'Utilisateur supprimé avec succès' });
});


// Routes pour les parcours
app.get('/api/parcours', (req, res) => {
  try {
    const db = loadDB();
    const parcoursWithAttractions = db.parcours.map(p => {
      const attraction = db.attractions.find(a => a.id === p.attraction_id);
      return {
        ...p,
        attraction: attraction || null
      };
    });
    res.json(parcoursWithAttractions);
  } catch (err) {
    console.error(err);
    res.status(500).json([]);
  }
});

app.post('/api/parcours', (req, res) => {
  const db = loadDB();
  const newParcours = {
    id: `parcours-${Date.now()}`,
    ...req.body
  };
  db.parcours.push(newParcours);
  saveDB(db);
  res.status(201).json(newParcours);
});

app.delete('/api/parcours/:id', (req, res) => {
  const db = loadDB();
  db.parcours = db.parcours.filter(p => p.id !== req.params.id);
  saveDB(db);
  res.json({ message: 'Parcours supprimé' });
});

// Ajouter un commentaire à une attraction
app.post('/api/attractions/:id/commentaires', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token manquant' });

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const db = loadDB();
    const attraction = db.attractions.find(a => a.id === req.params.id);
    if (!attraction) return res.status(404).json({ error: 'Attraction non trouvée' });

    const { commentaire } = req.body;
    if (!commentaire || commentaire.trim() === '') {
      return res.status(400).json({ error: 'Le commentaire ne peut pas être vide' });
    }

    const user = db.users.find(u => u.id === decoded.id);
    if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });

    const newComment = {
      id: Date.now().toString(),
      userId: user.id,
      userEmail: user.email,
      texte: commentaire,
      date: new Date().toISOString()
    };

    attraction.commentaires.push(newComment);
    saveDB(db);
    res.status(201).json(newComment);
  } catch (err) {
    res.status(401).json({ error: 'Token invalide' });
  }
});

// Middleware d'erreur
app.use((err, req, res, next) => {
  console.error('Erreur:', err);
  res.status(500).json({ error: 'Erreur serveur' });
});

app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});

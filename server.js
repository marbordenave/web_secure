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

// Functions to handle the database
function loadDB() {
  try {
    const data = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading db.json file:", err);
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

// Authentication routes
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  console.log(req.body); // Log incoming request body

  const db = loadDB();
  const user = db.users.find(u => u.email === email);

  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }
  console.log(user); // Log found user

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(401).json({ error: 'Invalid email or password' });
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
    return res.status(401).json({ error: 'Missing token' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const db = loadDB();
    const userExists = db.users.some(u => u.id === decoded.id);

    if (!userExists) {
      return res.status(401).json({ error: 'User not found' });
    }

    res.json({
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
      isAdmin: decoded.role === 'admin'
    });
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

app.post('/register', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const db = loadDB();

  // Robust check for existing email
  if (db.users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
    return res.status(409).json({ error: 'Email already in use' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Generate a consistent ID
    let newId;
    if (db.users.length > 0) {
      const maxId = Math.max(...db.users.map(u => {
        const idAsNumber = parseInt(u.id, 10);
        return isNaN(idAsNumber) ? 0 : idAsNumber;
      }));

      newId = (maxId + 1).toString();
    } else {
      newId = "1";
    }

    const newUser = {
      id: newId,
      email: email.trim(),
      password: hashedPassword,
      role: 'user'
    };

    db.users.push(newUser);
    saveDB(db);

    res.status(201).json({ 
      message: 'User successfully created',
      user: { id: newUser.id, email: newUser.email } 
    });
  } catch (err) {
    console.error('Error during registration:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Attractions routes
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
  if (index === -1) return res.status(404).json({ error: 'Attraction not found' });
  db.attractions[index] = { ...db.attractions[index], ...req.body };
  saveDB(db);
  res.json(db.attractions[index]);
});

app.delete('/api/attractions/:id', (req, res) => {
  const db = loadDB();
  const index = db.attractions.findIndex(a => a.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Attraction not found' });
  db.attractions.splice(index, 1);
  saveDB(db);
  res.json({ message: 'Attraction successfully deleted' });
});

// Park routes
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

// Tariffs routes
app.get('/api/tarifs', (req, res) => {
  const db = loadDB();
  res.json(db.tarifs);
});

// User routes
app.get('/api/users', (req, res) => {
  const db = loadDB();
  res.json(db.users);
});

// Update an existing user
app.patch('/api/users/:id', (req, res) => {
  const db = loadDB();
  const index = db.users.findIndex(u => u.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'User not found' });

  db.users[index] = { ...db.users[index], ...req.body };
  saveDB(db);
  res.json(db.users[index]);
});

// Delete a user
app.delete('/api/users/:id', (req, res) => {
  const db = loadDB();
  const index = db.users.findIndex(u => u.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'User not found' });
  db.users.splice(index, 1);
  saveDB(db);
  res.json({ message: 'User successfully deleted' });
});

// Add a comment to an attraction
app.post('/api/attractions/:id/commentaires', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Missing token' });

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const db = loadDB();
    const attraction = db.attractions.find(a => a.id === req.params.id);
    if (!attraction) return res.status(404).json({ error: 'Attraction not found' });

    const { commentaire } = req.body;
    if (!commentaire || commentaire.trim() === '') {
      return res.status(400).json({ error: 'Comment cannot be empty' });
    }

    const user = db.users.find(u => u.id === decoded.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

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
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Server error' });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

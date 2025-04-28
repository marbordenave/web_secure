const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = 3000;
const SECRET_KEY = 'votre_cle_ultra_secrete';

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Lire les utilisateurs depuis un fichier JSON
const users = JSON.parse(fs.readFileSync('users.json', 'utf8'));

// Route de connexion
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
        return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    const token = jwt.sign(
        { id: user.id, email: user.email },
        SECRET_KEY,
        { expiresIn: '2h' } // Le token expire dans 2 heures
    );

    res.json({ token });
});

// Exemple de route protégée
app.get('/protected', (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Token manquant' });
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ message: 'Token invalide' });

        res.json({ message: 'Accès autorisé', user });
    });
});

// Lancement du serveur
app.listen(PORT, () => {
    console.log(`Serveur authentification lancé sur http://localhost:${PORT}`);
});

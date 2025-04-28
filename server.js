

// server.js
const jsonServer = require('json-server');

const auth = require("json-server-auth");
const cors = require("cors");

const app = jsonServer.create();
const router = jsonServer.router("db.json");

// Définit les règles d'authentification si besoin
// const rules = auth.rewriter({
//   users: 600, // seuls les admins peuvent accéder aux utilisateurs
// });

app.db = router.db; // obligatoirement avant d'utiliser json-server-auth

app.use(cors());
app.use(jsonServer.defaults());
// app.use(rules); // (décommenter si tu veux définir des règles)
app.use(auth);
app.use(router);

app.listen(3000, () => {
  console.log("🚀 Serveur JSON Server Auth lancé sur http://localhost:3000");
});

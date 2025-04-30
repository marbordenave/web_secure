const bcrypt = require('bcrypt');

async function generateHash(password) {
  const hash = await bcrypt.hash(password, 10);
  console.log(`Hash pour "${password}":`, hash);
}

generateHash('admin123'); // Remplacez par vos mots de passe
generateHash('user123');
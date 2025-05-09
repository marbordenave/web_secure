const bcrypt = require('bcrypt');

async function testBcrypt() {
  const password = 'monmotdepasse';
  console.log('Mot de passe original:', password);

  // Hachage
  const hash = await bcrypt.hash(password, 10);
  console.log('Mot de passe hashé:', hash);

  // Vérification
  const match = await bcrypt.compare(password, hash);
  console.log('Comparaison correcte:', match);

  const wrongMatch = await bcrypt.compare('fauxmotdepasse', hash);
  console.log('Comparaison incorrecte:', wrongMatch);
}

testBcrypt();

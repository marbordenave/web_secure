import React, {useState} from 'react';
import {logUser} from '../../services/api';

// Fonction pour afficher le formulaire de connexion
function FormulaireConnexion({setPage}) {
  const [email, setEmail] = useState(''); // Changé de pseudo à email
  const [password, setPassword] = useState('');
  const [errorIdentifiant, setErrorIdentifiant] = useState('');
  
  // Fonction pour réinitialiser les champs
  function ResetAll(){
    setEmail(''); // Changé ici aussi
    setPassword('');
  }

  function handleLog() {
    logUser(email, password)
      .then(data => {
        localStorage.setItem('token', data.token);
        ResetAll();
        setPage('accueil');
      })
      .catch(error => {
        setErrorIdentifiant(error.message); 
      });
  }
  return (
    <>
    <div id="formulaire">
      <div>
        <label htmlFor="email">Email</label>
        <input type='email' id='email' onChange={(e) => setEmail(e.target.value)} value={email}/>
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <input type='password' id='password' onChange={(e) => setPassword(e.target.value)} value={password} />
      </div>
      <span className='error'>{errorIdentifiant}</span>
      <button onClick={handleLog}>Se connecter</button>
    </div>
    </>
  );
}

export default FormulaireConnexion;
import React, {useState} from 'react';
import {logUser} from '../../services/api';

//Fonction pour afficher le formualaire de connection et se connecter
function FormulaireConnexion({setPage}) {
  const [pseudo, setPseudo] = useState('');
  const [password, setPassword] = useState('');
  const [errorIdentifiant, setErrorIdentifiant] = useState('');
  
  //fonction pour enlever le pseudo et le password des champs d'input
  function ResetAll(){
  setPseudo('');
  setPassword('');
  }

  function handleLog() {
    //Lorsqu'on clique sur "Se connecter", on envoie la requête de connexion
    logUser(pseudo, password).then(response => {
      if(response.result) {
        // Si la reponse est OK, on enregistre le token dans le localStorage
        localStorage.setItem('token', response.token);
        ResetAll();
        //On retourne à l'Accueil
        setPage('accueil');
      } 
      else 
      {
        //Si les identifiants sont incorrects on affiche un message pour le dire à l'utilisateur 
        console.error('Identifiants incorrects');
        setErrorIdentifiant("Votre identifiant ou votre mot de passe est incorecte.")
      }
    }) 
  };

  //On retourne un formulaire permttant d'ajouter son pseudo, son mot de passe et d'appuyer sur un bouton pour se connecter
  return (
    <>
    <div id ="formulaire">
      <div>
        <label htmlFor="pseudo">Pseudo</label>
        <input type='text' id='pseudo' onChange={(e) => setPseudo(e.target.value)} value={pseudo}/>
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
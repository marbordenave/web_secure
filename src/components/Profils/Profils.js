import React, {useState, useEffect} from 'react';
import {getme, updateuser} from '../../services/api';

//Fonction pour la page de profil
function Profils() {
  const [email, setMail] = useState('');
  const [newmail, setNewMail] = useState(null); // Initialisé à null pour éviter l'erreur
  const [id, setId] = useState();
  const [change, setWantChange] = useState(false);

  useEffect(() => {
    // Lorsque le composant a été rendu, on récupère les infos de l'utilisateur
    getuserinfo();
  }, []);

  // On récupère les informations de l'utilisateur
  const getuserinfo = () => {
    getme(localStorage.getItem('token'))
      .then(result => {
        setMail(result.email);
        setId(result.id);
        // On initialise newmail avec la valeur actuelle du mail
        setNewMail(result.mail);
      });
  }

  // Si il y a un changement dans le mail on l'enregistre
  function handleChangeMail(e) {
    let value = e.target.value;
    setNewMail(value);
  }

  // Si le bouton pour valider la modification est cliqué on effectue les changements
  function handleUpdate() {
    updateuser(localStorage.getItem('token'),id,newmail)
      .then(result => {
        setMail(newmail);
        setWantChange(false);
      })
      .catch(error => {
        console.error("Une erreur s'est produite lors de la mise à jour : ", error);
      });
  }

  // On affiche un formulaire avec les informations des utilisateurs et un bouton pour pouvoir modifier les informations.
  return (
    <div id='formulaire'>
      <label>Adresse Mail</label>
      <p>{email}</p>
      
      {/* Bouton pour passer en mode modification */}
      {!change && (
        <button onClick={() => setWantChange(true)}>Modifier</button>
      )}
      
      {/* Formulaire de modification */}
      {change && (
        <>
          <label>Modifier Adresse Mail</label>
          <input 
            type='email' 
            id='mail' 
            value={newmail || ''} // Solution pour l'erreur controlled/uncontrolled
            onChange={handleChangeMail}
          />
          <button onClick={handleUpdate}>Valider la modification</button>
        </>
      )}
    </div>
  );
}

export default Profils;
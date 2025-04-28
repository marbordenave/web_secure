import React, {useState, useEffect} from 'react';
import {getme,updateuser, } from '../../services/api';

//Fonction pour la page de profil
function Profils() {
  const [pseudo, setPseudo] = useState('');
  const [newpseudo, setnewPseudo] = useState(null);

  const [mail, setMail]=useState('');
  const [newmail, setnewMail]=useState('');
  
  const [id, setId]= useState();
  const[change,setwantchange]=useState(false);

  useEffect(() => {
    // Lorsque le composant a été rendu, on récupère les infos du parc.
    getuserinfo();
  }, []);
  //on récupère les informations de l'utilisateur
  const getuserinfo = () => {
    getme(localStorage.getItem('token'))
        .then(result => {
          setPseudo(result.pseudo);
          setMail(result.mail)
          setId(result.id)          
        })
    }
  
  //Si il y a un pseudo alors on remplit newpseudo et newmail pour pouvoir les modifier après
  if(newpseudo==null && pseudo!=''){
    setnewPseudo(pseudo);
    setnewMail(mail);
  }
  
  //Si il y a un changement dans le pseudo on l'enregistre
  function handleChangePseudo(e) {
    let value = e.target.value;
    setnewPseudo(value);
  }

  //Si il y a un changement dans le mail on l'enregistre
  function handleChangeMail(e){
    let value=e.target.value
    setnewMail(value)
}

  //Si le bouton pour valider la modification est cliqué on effectue les changements
  function handleUpdate() {
    updateuser(localStorage.getItem('token'),id,newpseudo,newmail)
      .then(result => {
        setPseudo(newpseudo);
        setMail(newmail);
        setwantchange(false)
      })
      .catch(error => {
        console.error("Une erreur s'est produite lors de la mise à jour : ", error);
      });
  }

  //On affiche un formulaire avec les informations des utilisateurs et un bouton pour pouvoir modifier les informations.
  return (
      <div id='formulaire'>
        <label>Pseudo</label>
        <p>{pseudo}</p>
        <label>Adresse Mail</label>
        <p>{mail}</p>
        {change==false &&(<button onClick={()=>setwantchange(true)}>Modifier</button>)}
      
        {change==true && (
        <>
          <label>Modifier Pseudo</label>
          <input type='text' id='pseudo' value={newpseudo} onChange={handleChangePseudo}/>
          <label>Modifier Adresse Mail</label>
          <input type='text' id='mail' value={newmail} onChange={handleChangeMail}/>
          <button onClick={handleUpdate}>Valider la modification</button>
        </>)}
      </div>
  );
}

export default Profils;
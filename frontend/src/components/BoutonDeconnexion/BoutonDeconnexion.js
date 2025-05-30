import React,{useState} from 'react';

//Boutton pour faire en sorte que l'utilisateur se déconnecte
function BoutonDeconnexion({setPage}) {
const [token,setToken]=useState(localStorage.getItem("token"))

  function handleLogout(){
    //Si le bouton est cliqué on va déconnecter l'utilisateur
    //on clear le localStorage(pour enlever le token)
    localStorage.clear();
    //On set le token à undefined
    setToken(undefined)
    //On revient sur la page pour se déconnecter
    setPage('connexion');
  }

  //On return juste le bouton si le token est non null
  return (
    <>
      {token && <button onClick={handleLogout}>Se Deconnecter</button>}
    </>
  );
}

export default BoutonDeconnexion;
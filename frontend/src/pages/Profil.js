import React from 'react';
import '../App.css';
import Profils from '../components/Profils' 
import BoutonDeconnexion from '../components/BoutonDeconnexion/BoutonDeconnexion';

//page de profil avec la possibilité de le modifier et de se déconnecter
function Profil({setPage}) {
  return (
    <div>
        <h1>Mon Profil</h1>
        <Profils />
        < BoutonDeconnexion setPage={setPage}/>
    </div>
  );
}

export default Profil;
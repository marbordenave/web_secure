import React from 'react';
import '../App.css';
import Profils from '../components/Profils' 
import BoutonDeconnexion from '../components/BoutonDeconnexion/BoutonDeconnexion';

// Profile page with the ability to modify it and log out
function Profil({setPage}) {
  return (
    <div>
        <h1>My Profile</h1>
        <Profils />
        < BoutonDeconnexion setPage={setPage}/>
    </div>
  );
}

export default Profil;
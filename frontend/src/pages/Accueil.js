import React from 'react';
import '../App.css';
import Tarif from '../components/Tarif';
import DisplayParc from '../components/DisplayParc'

//Dans l'accueil on affiche les informations du parc ainsi que les tarifs
function Accueil({ setPage }) {
  return (
    <div>
        <DisplayParc />
        <Tarif />
    </div>
  );
}

export default Accueil;
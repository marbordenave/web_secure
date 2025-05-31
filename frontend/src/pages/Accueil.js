import React from 'react';
import '../App.css';
import Tarif from '../components/Tarif';
import DisplayParc from '../components/DisplayParc'

// In the home page we display the park information and rates
function Accueil({ setPage }) {
  return (
    <div>
        <DisplayParc />
        <Tarif />
    </div>
  );
}

export default Accueil;
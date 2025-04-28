import React from 'react';
import '../App.css';
import ParcoursAttractions from '../components/ParcoursAttractions/ParcoursAttractions';
import FormulaireConnexion from '../components/FormulaireConnexion/FormulaireConnexion';

//page pour former son parcour
function Parcours({ setPage }) {
  const token = localStorage.getItem("token");
  return (
    <div>
        <h1>Enregistre ton propre parcours !</h1>
        {token ? < ParcoursAttractions token={token}/> : <FormulaireConnexion setPage={setPage}/>}
    </div>
  );
}

export default Parcours;
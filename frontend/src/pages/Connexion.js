import React from 'react';
import '../App.css';
import FormulaireConnexion from '../components/FormulaireConnexion/FormulaireConnexion';

//Page de connexion
function Connexion({ setPage }) {
  return (
    <div >
      <h1>Connexion</h1>
      <FormulaireConnexion setPage={setPage}/>
    </div>
  );
}

export default Connexion;
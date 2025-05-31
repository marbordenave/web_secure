import React from 'react';
import '../App.css';
import FormulaireConnexion from '../components/FormulaireConnexion/FormulaireConnexion';

// Login page
function Connexion({ setPage }) {
  return (
    <div >
      <h1>Login</h1>
      <FormulaireConnexion setPage={setPage}/>
    </div>
  );
}

export default Connexion;
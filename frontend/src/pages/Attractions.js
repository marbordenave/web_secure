import React from 'react';
import '../App.css';
import DisplayAttraction from '../components/DisplayAttraction';

//Page d'affichage des attractions
function Attractions({ setPage }) {
  return (
    <div className="Home">
      <h1>Nos attractions</h1>
      <DisplayAttraction/>
    </div>
  );
}

export default Attractions;
import React from 'react';
import '../App.css';
import DisplayAttraction from '../components/DisplayAttraction';

// Attractions display page
function Attractions({ setPage }) {
  return (
    <div className="Home">
      <h1>Our attractions</h1>
      <DisplayAttraction/>
    </div>
  );
}

export default Attractions;
import React from 'react';
import '../App.css';
import TicketPurchase from '../components/TicketPurchase/TicketPurchase';
import FormulaireConnexion from '../components/FormulaireConnexion/FormulaireConnexion';


function Reservation({ setPage }) {
  const token = localStorage.getItem("token");
  return (
    <div>
        {token ? < TicketPurchase token={token}/> : <FormulaireConnexion setPage={setPage}/>}
    </div>
  );
}

export default Reservation;
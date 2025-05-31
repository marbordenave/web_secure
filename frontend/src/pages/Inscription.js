import React from "react";
import "../App.css";
import FormulaireInscription from "../components/FormulaireInscription/FormulaireInscription";

// Registration page
function Inscription({ setPage }) {
  return (
    <div>
      <h1>Registration</h1>
      <FormulaireInscription />
      <br></br>
      <p>
        If you already have an account, please log in below:
        <button className="connexion" onClick={() => setPage("connexion")}>
          Log in{" "}
        </button>
      </p>
    </div>
  );
}

export default Inscription;

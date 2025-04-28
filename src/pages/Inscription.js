import React from "react";
import "../App.css";
import FormulaireInscription from "../components/FormulaireInscription/FormulaireInscription";

//Page d'inscription
function Inscription({ setPage }) {
  return (
    <div>
      <h1>Inscription</h1>
      <FormulaireInscription />
      <br></br>
      <p>
        Si vous avez déjà un compte, veuillez vous connecter ci-dessous :
        <button className="connexion" onClick={() => setPage("connexion")}>
          Se connecter{" "}
        </button>
      </p>
    </div>
  );
}

export default Inscription;

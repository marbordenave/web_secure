import React from "react";
import "../App.css";
import FormulaireModiferParc from "../components/FormulaireModiferParc";
import FormulaireAttraction from "../components/FormulaireAttraction";
import ModificationAttraction from "../components/ModificationAttraction/ModificationAttraction";
import DisplayUsers from "../components/DisplayUsers";
import "./Administrateur.css";

//Page de gestion du parc avec le formulaire pour modifier le parc, la gestion des utilisateurs
//le formulaire de création d'attraction et la gestion des attractions
function Administrateur({ setParcname }) {
  let token = localStorage.getItem("token");
  return (
    <div>
      <h1>Page de l'administrateur</h1>
      <ol className="sommaire" id="Sommaire">
        <li>
          <a href="#Parc">Modifier le parc</a>
        </li>
        <li>
          <a href="#User">Gérer les utilisateurs</a>
        </li>
        <li>
          <a href="#CreerAtt">Ajouter une attraction</a>
        </li>
        <li>
          <a href="#Attra">Gérer les attractions</a>
        </li>
      </ol>
      <div id="Parc">
        <FormulaireModiferParc setParcName={setParcname} />
        <button className="RevenirSommaire">
          <a href="#Sommaire">Revenir au sommaire </a>
        </button>
      </div>
      <div id="User">
        <DisplayUsers token={token} />
        <button className="RevenirSommaire">
          <a href="#Sommaire">Revenir au sommaire </a>
        </button>
      </div>
      <div id="CreerAtt">
        <FormulaireAttraction token={token} />
      </div>
      <button className="RevenirSommaire">
        <a href="#Sommaire">Revenir au sommaire </a>
      </button>
      <div id="Attra">
        <ModificationAttraction token={token} />
        <button className="RevenirSommaire">
          <a href="#Sommaire">Revenir au sommaire </a>
        </button>
      </div>
    </div>
  );
}

export default Administrateur;

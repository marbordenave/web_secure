import React, { useState, useEffect } from "react";
import {
  getAttraction,
  sendParcours,
  getParcours,
  deleteParcours,
} from "../../services/api";

//fonction pour qu'un utilisateur puisse créer son parcours
function ParcoursAttractions({ token }) {
  const [attractions, setAttractions] = useState([]);
  const [parcours, setParcours] = useState([]);

  //On récupère les attractions et le parcours de l'utilisateur
  useEffect(() => {
    getAttraction(token)
      .then((result) => {
        setAttractions(result);
      })
      .catch((error) => {
        console.error("Erreur", error);
      });
    getParcours(token)
      .then((result) => {
        setParcours(result);
      })
      .catch((error) => {
        console.error("Erreur", error);
      });
  }, [token]);

  //On ajoute une attraction au parcours
  const handleAddAttraction = (attractionId) => {
    sendParcours(token, attractionId)
      .then((result) => {
        setParcours(result);
      })
      .catch((error) => {
        console.error("Erreur", error);
      });
  };

  //on enlève une attraction au parcours
  const handleDeleteAttraction = (attractionId) => {
    deleteParcours(token, attractionId).then((result) => {
      setParcours(result);
    });
  };

  //On affiche les attractions et les boutons pour les ajouter
  const displayAttractions = () => {
    return attractions.map((attraction) => {
      const attractionInParcours = parcours.find(
        (parcour) => parcour.attraction.id === attraction.id
      );
      // Si l'attraction est déjà dans le parcours, ne pas afficher le bouton "Ajouter"
      return (
        <tr key={attraction.id} className="list-item">
          <td>
            {" "}
            {attractionInParcours ? (
              <p>Déjà ajouté</p>
            ) : (
              <button
                className="btn-modifier"
                onClick={() => handleAddAttraction(attraction.id)}
              >
                Ajouter
              </button>
            )}
          </td>
          <td>{attraction.nom}</td>
          <td>{attraction.attente}</td>
        </tr>
      );
    });
  };

  //On affiche le parcours et le bouton pour supprimer les attractions du parcours
  const displayParcours = () => {
    return parcours.map((parcoursattraction) => (
      <tr key={parcoursattraction.order} className="list-item">
        <td>
          <button
            className="btn-supprimer"
            onClick={() =>
              handleDeleteAttraction(parcoursattraction.attraction.id)
            }
          >
            Supprimer
          </button>
        </td>
        <td>{parcoursattraction.attraction.nom}</td>
        <td>{parcoursattraction.attraction.attente}</td>
      </tr>
    ));
  };

  //On crée les tableaux pour afficher les attractions et le parcours
  return (
    <div>
      <h2>Mon parcours</h2>
      <table key="table_parcours" className="divtab">
        <thead>
          <tr key="table_header_parcours">
            <th>Supprimer</th>
            <th>Nom</th>
            <th>Attente</th>
          </tr>
        </thead>
        <tbody id="parcours">{displayParcours()}</tbody>
      </table>
      <h2>Liste des attractions</h2>
      <table key="table_attractions" className="divtab">
        <thead>
          <tr key="table_header_attractions">
            <th>Ajouter</th>
            <th>Nom</th>
            <th>Attente</th>
          </tr>
        </thead>
        <tbody id="attraction">{displayAttractions()}</tbody>
      </table>
    </div>
  );
}

export default ParcoursAttractions;

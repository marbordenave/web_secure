import React, { useState, useEffect } from "react";
import {
  getAttraction,
  deleteAttraction,
  updateAttraction,
} from "../../services/api";
import "./ModificationAttraction.css";

//Fonction pour modifier et supprimer les attractions
function ModificationAttraction({ token }) {
  const [attractions, setAttractions] = useState([]);
  const [editAttractionData, setEditAttractionData] = useState(null);

  const [popupDeleteNom, setPopupDeleteNom] = useState("");
  const [popupDeleteId, setPopupDeleteId] = useState("");
  const [popupEdit, setPopupEdit] = useState(false);

  //On récupère les attractions
  useEffect(() => {
    fetchAttractions();
  }, [token]);

  //On récupère les attractions
  const fetchAttractions = () => {
    getAttraction(token)
      .then((result) => {
        setAttractions(result);
      })
      .catch((error) => {
        console.error("Erreur", error);
      });
  };

  //Fonction pour afficher une popup pour s'assurer que l'administrateur veut supprimer une attraction
  const handleDeleteAttraction = (attractionId, attractionName) => {
    setPopupDeleteNom(attractionName);
    setPopupDeleteId(attractionId);
  };

  //fonction pour supprimer une attraction par son id
  const deleteAttractionById = (attractionId) => {
    deleteAttraction(token, attractionId)
      .then((result) => {
        //on ferme la popup et on recupere les attractions si la suppression c'est bien faite
        closePopupDelete();
        fetchAttractions();
      })
      .catch((error) => {
        console.error("Erreur suppression attraction", error);
      });
  };

  //fonction pour afficher une popup pour midifier une attraction
  const handleEditAttraction = (attraction) => {
    setEditAttractionData(attraction);
    setPopupEdit(true);
  };

  //fonction pour effectuer les changements sur les valeurs des champs de l'attraction si il y en a
  const handleChange = (e) => {
    const updatedAttractionData = {
      ...editAttractionData,
      [e.target.name]: e.target.value,
    };
    setEditAttractionData(updatedAttractionData);
  };

  //fonction pour mettre à jour l'attraction avec les informations qui ont changés en utilisant son id
  const handleUpdate = () => {
    updateAttraction(token, editAttractionData.id, editAttractionData)
      .then((response) => {
        //on récupère les attractions et on enleve la popup
        fetchAttractions();
        setEditAttractionData(null);
        setPopupEdit(false);
      })
      .catch((error) => {
        console.error("Erreur lors de la mise à jour de l'attraction:", error);
      });
  };

  //fonction pour afficher les attractions
  const displayAttractions = () => {
    return attractions.map((attraction) => (
      <tr key={attraction.id} className="list-item">
        <td>
          <button
            className="btn-supprimer"
            onClick={() =>
              handleDeleteAttraction(attraction.id, attraction.nom)
            }
          >
            Supprimer
          </button>
        </td>
        <td>
          <button
            className="btn-modifier"
            onClick={() => handleEditAttraction(attraction)}
          >
            Modifier
          </button>
        </td>
        <td>{attraction.nom}</td>
        <td>
          <span
            className="description-preview"
            onClick={(e) => toggleDescription(e.target)}
          >
            {attraction.description.split(" ").slice(0, 5).join(" ")}
            <span className="expand-trigger"> Voir plus</span>
          </span>
          <span className="description-full">{attraction.description}</span>
        </td>
        <td>{attraction.duree}</td>
        <td>{attraction.age_minimum}</td>
        <td>{attraction.date_creation}</td>
        <td>{attraction.image}</td>
      </tr>
    ));
  };

  //Comme la description peut être trop longue on conditionne son affichage complet à un clic
  const toggleDescription = (element) => {
    const description = element
      .closest("tr")
      .querySelector(".description-full");
    const preview = element.closest("tr").querySelector(".description-preview");
    if (!description.classList.contains("expanded")) {
      description.style.display = "inline";
      preview.style.display = "none";
      element.innerText = "Réduire";
    } else {
      description.style.display = "none";
      preview.style.display = "inline";
      element.innerText = "Voir plus";
    }
  };

  //fonction pour fermer la popup delete
  const closePopupDelete = () => {
    setPopupDeleteId(false);
  };

  //On affiche le tableau dans lequel les informations des informations seront affichées
  //permet de gérer l'affichage des popup de delete et d'edition d'attractions
  return (
    <div>
      <h2>Gestion des attractions</h2>
      <div className="divtab">
        <table>
          <thead>
            <tr>
              <th>Supprimer</th>
              <th>Modifier</th>
              <th>Nom</th>
              <th>Description</th>
              <th>Durée</th>
              <th>Âge minimum</th>
              <th>Date de création</th>
              <th>Image</th>
            </tr>
          </thead>
          <tbody id="attraction">{displayAttractions()}</tbody>
        </table>

        {popupDeleteId && (
          <div className="popup-bg active">
            <div className="popupDelete">
              <p>
                Etes-vous sûr de vouloir supprimer cet attraction:{" "}
                {popupDeleteNom}
              </p>
              <div className="btns">
                <button
                  className="btn-supprimer"
                  onClick={() => deleteAttractionById(popupDeleteId)}
                >
                  Supprimer
                </button>
                <button
                  className="btn-annuler"
                  onClick={() => closePopupDelete()}
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        )}

        {popupEdit && editAttractionData && (
          <div className="popup-bg active">
            <div className="popupEdit">
              <h2>Modifier l'attraction</h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleUpdate();
                }}
              >
                <div>
                  <label htmlFor="nom">Nom</label>
                  <input
                    type="text"
                    name="nom"
                    value={editAttractionData.nom || ""}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label htmlFor="description">Description</label>
                  <textarea
                    rows="3"
                    cols="97"
                    name="description"
                    value={editAttractionData.description || ""}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label htmlFor="duree">Durée</label>
                  <input
                    type="number"
                    name="duree"
                    value={editAttractionData.duree || ""}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label htmlFor="age_minimum">Âge minimum</label>
                  <input
                    type="number"
                    name="age_minimum"
                    value={editAttractionData.age_minimum}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label htmlFor="date_creation">Date création</label>
                  <input
                    type="date"
                    name="date_creation"
                    value={editAttractionData.date_creation}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label htmlFor="image">Image</label>
                  <input
                    type="url"
                    name="image"
                    value={editAttractionData.image}
                    onChange={handleChange}
                  />
                </div>
                <div className="btns">
                  <button className="btn-enregistrer" type="submit">
                    Enregistrer
                  </button>
                  <button
                    className="btn-annuler"
                    onClick={() => setEditAttractionData(null)}
                  >
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ModificationAttraction;

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
            Delete
          </button>
        </td>
        <td>
          <button
            className="btn-modifier"
            onClick={() => handleEditAttraction(attraction)}
          >
            Edit
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
      <h2>Attractions Management</h2>
      <div className="divtab">
        <table>
          <thead>
            <tr>
              <th>Delete</th>
              <th>Edit</th>
              <th>Name</th>
              <th>Description</th>
              <th>Duration</th>
              <th>Minimum Age</th>
              <th>Creation Date</th>
              <th>Image</th>
            </tr>
          </thead>
          <tbody id="attraction">{displayAttractions()}</tbody>
        </table>

        {popupDeleteId && (
          <div className="popup-bg active">
            <div className="popupDelete">
              <p>
                Are you sure you want to delete this attraction: {" "}
                {popupDeleteNom}
              </p>
              <div className="btns">
                <button
                  className="btn-supprimer"
                  onClick={() => deleteAttractionById(popupDeleteId)}
                >
                  Delete
                </button>
                <button
                  className="btn-annuler"
                  onClick={() => closePopupDelete()}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {popupEdit && editAttractionData && (
          <div className="popup-bg active">
            <div className="popupEdit">
              <h2>Edit Attraction</h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleUpdate();
                }}
              >
                <div>
                  <label htmlFor="nom">Name</label>
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
                  <label htmlFor="duree">Duration</label>
                  <input
                    type="number"
                    name="duree"
                    value={editAttractionData.duree || ""}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label htmlFor="age_minimum">Minimum Age</label>
                  <input
                    type="number"
                    name="age_minimum"
                    value={editAttractionData.age_minimum}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label htmlFor="date_creation">Creation Date</label>
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
                    Save
                  </button>
                  <button
                    className="btn-annuler"
                    onClick={() => setEditAttractionData(null)}
                  >
                    Cancel
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

import React, { useState, useEffect } from "react";
import {
  getAttraction,
  deleteAttraction,
  updateAttraction,
} from "../../services/api";
import "./ModificationAttraction.css";

//Function to modify and delete attractions
function ModificationAttraction({ token }) {
  const [attractions, setAttractions] = useState([]);
  const [editAttractionData, setEditAttractionData] = useState(null);

  const [popupDeleteNom, setPopupDeleteNom] = useState("");
  const [popupDeleteId, setPopupDeleteId] = useState("");
  const [popupEdit, setPopupEdit] = useState(false);

  //We fetch the attractions
  useEffect(() => {
    fetchAttractions();
  }, [token]);

  //We fetch the attractions
  const fetchAttractions = () => {
    getAttraction(token)
      .then((result) => {
        setAttractions(result);
      })
      .catch((error) => {
        console.error("Error", error);
      });
  };

  //Function to display a popup to confirm that the administrator wants to delete an attraction
  const handleDeleteAttraction = (attractionId, attractionName) => {
    setPopupDeleteNom(attractionName);
    setPopupDeleteId(attractionId);
  };

  //Function to delete an attraction by its id
  const deleteAttractionById = (attractionId) => {
    deleteAttraction(token, attractionId)
      .then((result) => {
        //We close the popup and fetch the attractions if the deletion was successful
        closePopupDelete();
        fetchAttractions();
      })
      .catch((error) => {
        console.error("Error deleting attraction", error);
      });
  };

  //Function to display a popup to modify an attraction
  const handleEditAttraction = (attraction) => {
    setEditAttractionData(attraction);
    setPopupEdit(true);
  };

  //Function to update the attraction field values if there are any changes
  const handleChange = (e) => {
    const updatedAttractionData = {
      ...editAttractionData,
      [e.target.name]: e.target.value,
    };
    setEditAttractionData(updatedAttractionData);
  };

  //Function to update the attraction with the changed information using its id
  const handleUpdate = () => {
    updateAttraction(token, editAttractionData.id, editAttractionData)
      .then((response) => {
        //We fetch the attractions and remove the popup
        fetchAttractions();
        setEditAttractionData(null);
        setPopupEdit(false);
      })
      .catch((error) => {
        console.error("Error updating attraction:", error);
      });
  };

  //Function to display the attractions
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
            <span className="expand-trigger"> See more</span>
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

  //Since the description can be too long, we condition its full display to a click
  const toggleDescription = (element) => {
    const description = element
      .closest("tr")
      .querySelector(".description-full");
    const preview = element.closest("tr").querySelector(".description-preview");
    if (!description.classList.contains("expanded")) {
      description.style.display = "inline";
      preview.style.display = "none";
      element.innerText = "Reduce";
    } else {
      description.style.display = "none";
      preview.style.display = "inline";
      element.innerText = "See more";
    }
  };

  //Function to close the delete popup
  const closePopupDelete = () => {
    setPopupDeleteId(false);
  };

  //We display the table in which the attraction information will be shown
  //Allows to manage the display of delete and edit attraction popups
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
              <th>Duration (in minutes)</th>
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
                    type="text"
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

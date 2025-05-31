import React, { useState } from "react";
import { sendAttraction } from "../../services/api";

// Add an attraction
function AjouterAttractions() {
  const [nom, setNom] = useState("");
  const [description, setDescription] = useState("");
  const [duree, setDuree] = useState("");
  const [ageMinimum, setAgeMinimum] = useState("");
  const [dateCreation, setDateCreation] = useState("");
  const [image, setImage] = useState("");
  const [AttrCree, setAttrCree] = useState(false);

  // Add the attraction with the API and clear all states
  const handleAttraction = () => {
    let token = localStorage.getItem("token");
    sendAttraction(
      token,
      nom,
      description,
      1,
      true,
      duree,
      ageMinimum,
      dateCreation,
      image
    );
    if (
      (nom != "") &
      (description != "") &
      (duree != "") &
      (ageMinimum != "") &
      (dateCreation != "") &
      (image != "")
    ) {
      setAttrCree(true);
    }
    setNom("");
    setDescription("");
    setDuree("");
    setAgeMinimum("");
    setDateCreation("");
    setImage("");
  };

  // Display a form to enter all the information for different attractions
  return (
    <div>
      <h2>Add Attraction</h2>
      <div id="formulaire">
        <div>
          <label htmlFor="nom">Name</label>
          <input
            type="text"
            id="nom"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="description">Description</label>
          <input
            type="text"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="duree">Duration</label>
          <input
            type="number"
            id="duree"
            value={duree}
            onChange={(e) => setDuree(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="age_minimum">Minimum Age</label>
          <input
            type="number"
            id="age_minimum"
            value={ageMinimum}
            onChange={(e) => setAgeMinimum(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="date_creation">Creation Date</label>
          <input
            type="date"
            id="date_creation"
            value={dateCreation}
            onChange={(e) => setDateCreation(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="image">Image (provide https link)</label>
          <input
            type="text"
            id="image"
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />
        </div>
        <button onClick={handleAttraction}>Add Attraction</button>
        {AttrCree === true && <p id="actionValide">Attraction added</p>}
      </div>
    </div>
  );
}

export default AjouterAttractions;

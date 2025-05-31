import React, { useState, useEffect } from "react";
import { getMyParc, updateMyParc } from "../../services/api";
// Function to display and allow modification of park information
function FormulaireModiferParc({ setParcName }) {
  const [parc, setParc] = useState({ nom: "", description: "" });
  const [ModifPark, setModifPark] = useState(false);

  useEffect(() => {
    // When the component has been rendered, we get the park information
    getMyParc().then((data) => setParc(data));
  }, []);

  // Function that performs modifications of the name and description fields
  function handleChange(e) {
    // Get the park id
    const id = e.target.id;
    const value = e.target.value;
    // Change its information
    setParc((parc) => ({ ...parc, [id]: value }));
    setModifPark(false);
  }

  // When we click on modify, we launch the function to update the park information
  function handleUpdate() {
    // API call
    updateMyParc(
      localStorage.getItem("token"),
      parc.nom,
      parc.description
    ).catch((error) => {
      console.error(
        "An error occurred during the update: ",
        error
      );
    });
    setParcName(parc.nom);
    setModifPark(true);
  }

  // Display a form in which park information is entered and can be modified
  return (
    <>
      <h2>Modify Park Information</h2>
      <div id="formulaire">
        <label htmlFor="parcname">Park Name</label>
        <input type="text" id="nom" value={parc.nom} onChange={handleChange} />
        <label htmlFor="Description">Park Description</label>
        <textarea
          rows="3"
          cols="93"
          id="description"
          value={parc.description}
          onChange={handleChange}
        />
        <button onClick={handleUpdate}>Modify</button>
        {ModifPark === true && (
          <p id="actionValide">Park information has been modified</p>
        )}
      </div>
    </>
  );
}

export default FormulaireModiferParc;

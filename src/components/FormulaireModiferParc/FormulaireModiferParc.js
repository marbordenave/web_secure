import React, { useState, useEffect } from "react";
import { getMyParc, updateMyParc } from "../../services/api";
//Fonction pour afficher et permettre de modifier les informations du parc
function FormulaireModiferParc({ setParcName }) {
  const [parc, setParc] = useState({ nom: "", description: "" });
  const [ModifPark, setModifPark] = useState(false);

  useEffect(() => {
    // Lorsque le composant a été rendu, on récupère les infos du parc.
    getMyParc().then((data) => setParc(data));
  }, []);

  //Fonction qui effectue les modifications de valeur des champs npm et description
  function handleChange(e) {
    //On recupère l'id du parc
    const id = e.target.id;
    const value = e.target.value;
    //On change ses info
    setParc((parc) => ({ ...parc, [id]: value }));
    setModifPark(false);
  }

  //Quand on appuie sur modifier on lance la fonction pour mettre à jour les infos du parc
  function handleUpdate() {
    //appel à l'API
    updateMyParc(
      localStorage.getItem("token"),
      parc.nom,
      parc.description
    ).catch((error) => {
      console.error(
        "Une erreur s'est produite lors de la mise à jour : ",
        error
      );
    });
    setParcName(parc.nom);
    setModifPark(true);
  }

  //On affiche un formulaire dans lequel les infos du parc sont rentrées et peuvent être modifiées
  return (
    <>
      <h2>Modification des données du parc</h2>
      <div id="formulaire">
        <label htmlFor="parcname">Nom du parc</label>
        <input type="text" id="nom" value={parc.nom} onChange={handleChange} />
        <label htmlFor="Description">Description du parc</label>
        <textarea
          rows="3"
          cols="93"
          id="description"
          value={parc.description}
          onChange={handleChange}
        />
        <button onClick={handleUpdate}>Modifier</button>
        {ModifPark === true && (
          <p id="actionValide">Les informations du parc ont été modifiées</p>
        )}
      </div>
    </>
  );
}

export default FormulaireModiferParc;

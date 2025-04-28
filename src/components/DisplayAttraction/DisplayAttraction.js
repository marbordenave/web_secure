import React, { useState, useEffect } from "react";
import { getAttraction, sendCommentaire } from "../../services/api";
import "./DisplayAttraction.css";

function DisplayAttraction() {
  const [listeAttraction, setListAttractions] = useState([]);
  const [selectedAttraction, setSelectedAttraction] = useState(null);
  const [formCommentaire, setFormCommentaire] = useState(false);
  const [commentaire, setCommentaire] = useState("");
  const [ajoutCommentaire, setAjoutCommentaire] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    getAttraction().then((result) => {
      setListAttractions(result);
    });
  }, [selectedAttraction]);

  //fonction pour afficher les détails des attractions
  const afficherDetails = (attraction) => {
    setSelectedAttraction(attraction);
    setAjoutCommentaire(false);
  };

  //Fonction faisant appel à l'API pour ajouter un commentaire
  const ajouterCommentaire = (attractionId, commentaire) => {
    sendCommentaire(token, attractionId, commentaire)
      .then(() => {
        setFormCommentaire(false);
        setCommentaire("");
        setAjoutCommentaire(true);
      })
      .catch((error) => {
        console.error(
          "Une erreur s'est produite lors de l'envoi du commentaire :",
          error
        );
      });
  };

  //Fonction pour afficher les attractions avec leurs informations essentielles
  const AfficheAttraction = ({ nom, duree, id, image }) => {
    //on affiche son image, son nom, son temps d'attente
    return (
      <article className="afficheAttraction">
        <img src={image} alt={nom} />
        <h2>{nom}</h2>
        <p>Temps d'attente : {duree}</p>
      </article>
    );
  };

  return (
    <div id="listeAttraction">
      {selectedAttraction && (
        <section id="detailsAttraction">
          <div id="btnCloseDetails">
            <button
              className="btn-supprimer"
              onClick={() => setSelectedAttraction(null)}
            >
              Fermer
            </button>
          </div>
          <div>
            <img src={selectedAttraction.image} alt="ImageAttraction" />
          </div>
          <div className="textes">
            <h2>{selectedAttraction.nom}</h2>
            <p>
              <span className="detailsLabel">Description:</span>{" "}
              {selectedAttraction.description}
            </p>
            <p>
              <span className="detailsLabel">Durée:</span>{" "}
              {selectedAttraction.duree}
            </p>
            <p>
              <span className="detailsLabel">Age minimum:</span>{" "}
              {selectedAttraction.age_minimum}
            </p>
            <p>
              <span className="detailsLabel">Attente:</span>{" "}
              {selectedAttraction.attente}
            </p>
            <p className="detailsLabel">Commentaire:</p>

            <ul>
              {selectedAttraction.commentaires.map((commentaire, index) => (
                <li key={index}>{commentaire.commentaire}</li>
              ))}
            </ul>
            {/* Si le form pour ajouter un commentaire n'est pas affiché on met un bouton pour le faire afficher si l'utilisateur est connecté
                        Si le form ajouter un commentaire est affiché on peut entrer un commentaire et l'ajouter */}
            {formCommentaire == false && token && (
              <button
                className="btn-commentaire"
                onClick={() => {
                  setFormCommentaire(true);
                }}
              >
                Ajouter Commentaire
              </button>
            )}
            {formCommentaire && token && (
              <section className="Ajoutcommentaire">
                <label htmlFor="commentaire">Entrer un commentaire</label>
                <textarea
                  rows="3"
                  cols="30"
                  placeholder="Entrez votre commentaire"
                  id="commentaire"
                  value={commentaire}
                  onChange={(e) => setCommentaire(e.target.value)}
                ></textarea>
                <button
                  onClick={() =>
                    ajouterCommentaire(selectedAttraction.id, commentaire)
                  }
                >
                  Ajouter
                </button>
              </section>
            )}
            {ajoutCommentaire === true && (
              <p id="actionValide">Votre commentaire à bien été ajouté ! </p>
            )}
          </div>
        </section>
      )}
      {listeAttraction.map((attraction) => (
        <div key={attraction.id} onClick={() => afficherDetails(attraction)}>
          <AfficheAttraction
            nom={attraction.nom}
            duree={attraction.attente}
            id={attraction.id}
            image={attraction.image}
          />
        </div>
      ))}
    </div>
  );
}

export default DisplayAttraction;

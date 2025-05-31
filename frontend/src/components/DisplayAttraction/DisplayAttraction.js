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

  // Function to display attraction details
  const afficherDetails = (attraction) => {
    setSelectedAttraction(attraction);
    setAjoutCommentaire(false);
  };

  // Function calling the API to add a comment
  const ajouterCommentaire = (attractionId, commentaire) => {
    sendCommentaire(token, attractionId, commentaire)
      .then(() => {
        setFormCommentaire(false);
        setCommentaire("");
        setAjoutCommentaire(true);
      })
      .catch((error) => {
        console.error(
          "An error occurred while sending the comment:",
          error
        );
      });
  };

  // Function to display attractions with their essential information
  const AfficheAttraction = ({ nom, duree, id, image }) => {
    // Display its image, name, and wait time
    return (
      <article className="afficheAttraction">
        <img src={image} alt={nom} />
        <h2>{nom}</h2>
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
              Close
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
              <span className="detailsLabel">Duration:</span>{" "}
              {selectedAttraction.duree}
            </p>
            <p>
              <span className="detailsLabel">Minimum:</span>{" "}
              {selectedAttraction.age_minimum}
            </p>
            <p className="detailsLabel">Comments:</p>

            <table>
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Comment</th>
                </tr>
              </thead>
              <tbody>
                {selectedAttraction.commentaires.map((commentaire, index) => (
                  <tr key={index}>
                    <td>{commentaire.userEmail}</td>
                    <td>{commentaire.texte}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* If the form to add a comment is not displayed, we add a button to display it if the user is logged in
                        If the add comment form is displayed, we can enter a comment and add it */}
            {formCommentaire == false && token && (
              <button
                className="btn-commentaire"
                onClick={() => {
                  setFormCommentaire(true);
                }}
              >
                Add Comment
              </button>
            )}
            {formCommentaire && token && (
              <section className="Ajoutcommentaire">
                <label htmlFor="commentaire">Enter a comment</label>
                <textarea
                  rows="3"
                  cols="30"
                  placeholder="Enter your comment"
                  id="commentaire"
                  value={commentaire}
                  onChange={(e) => setCommentaire(e.target.value)}
                ></textarea>
                <button
                  onClick={() =>
                    ajouterCommentaire(selectedAttraction.id, commentaire)
                  }
                >
                  Add
                </button>
              </section>
            )}
            {ajoutCommentaire === true && (
              <p id="actionValide">Your comment has been successfully added!</p>
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

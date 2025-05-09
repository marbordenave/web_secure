import React, { useState, useEffect } from "react";
import { getUsers, updateUsersAdmin, deleteUsers } from "../../services/api";

//fonction pour afficher les différents utilisateurs et pour les supprimer ou leur ajouter des droits
function DisplayUsers({ token }) {
  const [listeUsers, setListeUsers] = useState([]);

  const [popupDeleteNom, setPopupDeleteNom] = useState("");
  const [popupDeleteId, setPopupDeleteId] = useState("");

  //on récupère la liste des utilisateurs
  useEffect(() => {
    fetchUser();
  }, [token]);

  const handleDeleteUser = (userid, username) => {
    setPopupDeleteNom(username);
    setPopupDeleteId(userid);
  };

  const closePopupDelete = () => {
    setPopupDeleteId(false);
  };

  //avec l'API o récupère la liste des utilisateurs et leurs informations
  const fetchUser = () => {
    getUsers(token)
      .then((result) => {
        setListeUsers(result);
      })
      .catch((error) => {
        console.error("Erreur", error);
      });
  };

  //si les users ne sont pas admin on les mets en administrateurs
  const handleAdmin = (userId, userAdmin) => {
    if (userAdmin == false) {
      updateUsersAdmin(token, userId)
        .then((result) => {
          fetchUser(result);
        })
        .catch((error) => {
          console.error(
            "Erreur lors de la mise à jour de l'utilisateur",
            error
          );
        });
    }
  };

  //Appel à l'API pour supprimer un utilisateur
  const deleteUserById = (userId) => {
    deleteUsers(token, userId)
      .then((result) => {
        fetchUser(result);
        closePopupDelete();
      })
      .catch((error) => {
        console.error("Erreur lors de la mise à jour de l'utilisateur", error);
      });
  };

  //Affichage de la liste des utilisateurs avec leur pseudo, leur mail, si ils sont administrateurs,
  //un bouton pour les ajouter en admin et un pour supprimer l'utilisateur
  const displayUsers = () => {
    return listeUsers.map((user) => (
      <tr key={user.id} className="list-item">
        <td>{user.email}</td>
        <td>{user.admin ? "Oui" : "Non"}</td>
        <td>
          <button
            className="btn-modifier"
            onClick={() => handleAdmin(user.id, user.admin)}
          >
            {user.admin ? "Déjà administrateur" : "Ajouter administrateur"}{" "}
          </button>
        </td>
        {user.pseudo !== "admin" ? (
          <td>
            <button
              className="btn-supprimer"
              onClick={() => handleDeleteUser(user.id, user.pseudo)}
            >
              Supprimer
            </button>
          </td>
        ) : (
          <td></td>
        )}
      </tr>
    ));
  };
  //On crée le tableau dans lequel les utilisateurs vont être affichés
  return (
    <div>
      <h2>Gestion des utilisateurs</h2>
      <div className="divtab">
        <table>
          <thead>
            <tr>
              <th>Mail</th>
              <th>Administrateur</th>
              <th>Ajouter administrateur</th>
              <th>Supprimer</th>
            </tr>
          </thead>
          <tbody id="listeUsers">{displayUsers()}</tbody>
        </table>
        {popupDeleteId && (
          <div className="popup-bg active">
            <div className="popupDelete">
              <p>
                Etes-vous sûr de vouloir supprimer cet utilisateur:{" "}
                {popupDeleteNom}
              </p>
              <div className="btns">
                <button
                  className="btn-supprimer"
                  onClick={() => deleteUserById(popupDeleteId)}
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
      </div>
    </div>
  );
}

export default DisplayUsers;

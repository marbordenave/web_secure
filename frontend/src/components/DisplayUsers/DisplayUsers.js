import React, { useState, useEffect } from "react";
import { getUsers, deleteUsers } from "../../services/api";

// Function to display different users and to delete them or add rights
function DisplayUsers({ token }) {
  const [listeUsers, setListeUsers] = useState([]);

  const [popupDeleteNom, setPopupDeleteNom] = useState("");
  const [popupDeleteId, setPopupDeleteId] = useState("");

  // Get the list of users
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

  // With the API we get the list of users and their information
  const fetchUser = () => {
    getUsers(token)
      .then((result) => {
        setListeUsers(result);
      })
      .catch((error) => {
        console.error("Error", error);
      });
  };

  // If users are not admin we make them administrators
  const handleAdmin = (userId, userAdmin) => {
    if (userAdmin == false) {
      updateUsersAdmin(token, userId)
        .then((result) => {
          fetchUser(result);
        })
        .catch((error) => {
          console.error(
            "Error updating user",
            error
          );
        });
    }
  };

  // API call to delete a user
  const deleteUserById = (userId) => {
    deleteUsers(token, userId)
      .then((result) => {
        fetchUser(result);
        closePopupDelete();
      })
      .catch((error) => {
        console.error("Error updating user", error);
      });
  };

  // Display the list of users with their username, email, if they are administrators,
  // a button to add them as admin and one to delete the user
  const displayUsers = () => {
    return listeUsers.map((user) => (
      <tr key={user.id} className="list-item">
        <td>{user.email}</td>
        <td>{user.admin ? "Yes" : "No"}</td>
        {user.pseudo !== "admin" ? (
          <td>
            <button
              className="btn-supprimer"
              onClick={() => handleDeleteUser(user.id, user.pseudo)}
            >
              Delete
            </button>
          </td>
        ) : (
          <td></td>
        )}
      </tr>
    ));
  };
  // Create the table in which users will be displayed
  return (
    <div>
      <h2>User Management</h2>
      <div className="divtab">
        <table>
          <thead>
            <tr>
              <th>Email</th>
              <th>Administrator</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody id="listeUsers">{displayUsers()}</tbody>
        </table>
        {popupDeleteId && (
          <div className="popup-bg active">
            <div className="popupDelete">
              <p>
                Are you sure you want to delete this user:{" "}
                {popupDeleteNom}
              </p>
              <div className="btns">
                <button
                  className="btn-supprimer"
                  onClick={() => deleteUserById(popupDeleteId)}
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
      </div>
    </div>
  );
}

export default DisplayUsers;

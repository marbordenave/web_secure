import config from "../config";

// Clé API
const apiKey = config.apiKey;

// ---------------------- UTILISATEURS ----------------------

// Inscription d'un utilisateur
export const sendUser = (pseudo, mail, password) => {
  let uri = "http://localhost:3000/users";
  var data = JSON.stringify({ pseudo, mail, password });
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
    },
    body: data,
  };
  return fetch(uri, requestOptions).then(handleResponse);
};

// Récupérer ses infos
// Fonction de récupération des données de l'utilisateur
export const getme = (token) => {
  let uri = "http://localhost:3000/users";
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  return fetch(uri, requestOptions).then((response) => {
    if (!response.ok) {
      throw new Error("Erreur");
    }
    return response.json();
  });
};


// Modifier pseudo / mail
export const updateuser = (token, id, pseudo, mail) => {
  return fetch(`http://localhost:3000/users/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ pseudo, mail }),
  }).then(handleResponse);
};

// Connexion utilisateur
export const logUser = (email, password) => {
  return fetch("http://localhost:3000/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Identifiants incorrects");
      }
      return response.json();
    });
};



// Liste des utilisateurs
export const getUsers = (token) => {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      Authorization: `Bearer ${token}`,
    },
  };
  return fetch("http://localhost:3000/users", requestOptions).then(handleResponse);
};

// Passer utilisateur en admin
export const updateUsersAdmin = (token, userId) => {
  return fetch(`http://localhost:3000/users/${userId}`, {
    method: "PATCH", // PATCH pour modifier partiellement
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ isAdmin: true }),
  }).then(handleResponse);
};

// Supprimer un utilisateur
export const deleteUsers = (token, userId) => {
  const requestOptions = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      Authorization: `Bearer ${token}`,
    },
  };
  return fetch(`http://localhost:3000/users/${userId}`, requestOptions).then(handleResponse);
};

// ---------------------- ATTRACTIONS ----------------------

// Ajouter une attraction
export const sendAttraction = (token, nom, description, type, status, duree, age_minimum, date_creation, image) => {
  let uri = "http://localhost:3000/attractions";
  var data = JSON.stringify({
    nom, description, type, status, duree, age_minimum, date_creation, image, commentaires: [],
  });
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      Authorization: `Bearer ${token}`,
    },
    body: data,
  };
  return fetch(uri, requestOptions).then(handleResponse);
};

// Récupérer attractions
export const getAttraction = () => {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
    },
  };
  return fetch("http://localhost:3000/attractions", requestOptions).then(handleResponse);
};

// Supprimer une attraction
export const deleteAttraction = (token, attractionId) => {
  const requestOptions = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      Authorization: `Bearer ${token}`,
    },
  };
  return fetch(`http://localhost:3000/attractions/${attractionId}`, requestOptions).then(handleResponse);
};

// Modifier une attraction
export const updateAttraction = (token, attractionId, attractionData) => {
  return fetch(`http://localhost:3000/attractions/${attractionId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(attractionData),
  }).then(handleResponse);
};

// Ajouter un commentaire
export const sendCommentaire = (token, attractionId, commentaire) => {
  return fetch(`http://localhost:3000/attractions/${attractionId}/commentaires`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ commentaire, note: 0 }),
  }).then(handleResponse);
};

// ---------------------- PARCOURS ----------------------

// Ajouter au parcours
export const sendParcours = (token, attractionId) => {
  let uri = "http://localhost:3000/parcours";
  var data = JSON.stringify({ attraction_id: attractionId, order: 0 });
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      Authorization: `Bearer ${token}`,
    },
    body: data,
  };
  return fetch(uri, requestOptions).then(handleResponse);
};

// Récupérer parcours
export const getParcours = (token) => {
  let uri = "http://localhost:3000/parcours";
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      Authorization: `Bearer ${token}`,
    },
  };
  return fetch(uri, requestOptions).then(handleResponse);
};

// Supprimer attraction du parcours
export const deleteParcours = (token, attractionId) => {
  return fetch(`http://localhost:3000/parcours/${attractionId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      Authorization: `Bearer ${token}`,
    },
  }).then(handleResponse);
};

// ---------------------- PARC INFOS ----------------------

// Infos sur le parc
export const getMyParc = () => {
  return fetch("http://localhost:3000/parc", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
    },
  }).then(handleResponse);
};

// Modifier le parc
export const updateMyParc = (token, nomparc, descriptionparc) => {
  return fetch("http://localhost:3000/parc", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ nom: nomparc, description: descriptionparc }),
  }).then(handleResponse);
};

// ---------------------- TARIFS ----------------------

// Récupérer les tarifs
export const getTarif = () => {
  return fetch("http://localhost:3000/tarifs", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
    },
  }).then(handleResponse);
};

// ---------------------- GESTION D'ERREURS ----------------------

const handleResponse = (response) => {
  if (!response.ok) {
    throw new Error("Erreur");
  }
  return response.json();
};

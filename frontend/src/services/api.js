// import config from "../config";

// // Clé API
// const apiKey = config.apiKey;

// // ---------------------- UTILISATEURS ----------------------

// // Inscription d'un utilisateur
// export const sendUser = (email, password) => {
//   let uri = `${config.apiUrl}/register`;
// ;
//   var data = JSON.stringify({ email, password });
//   const requestOptions = {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       "x-api-key": apiKey,
//     },
//     body: data,
//   };
//   return fetch(uri, requestOptions).then(handleResponse);
// };

// // Récupérer ses infos
// // Fonction de récupération des données de l'utilisateur
// export const getme = (token) => {
//   let uri = "http://localhost:3000/me";
//   const requestOptions = {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`,
//     },
//   };
//   return fetch(uri, requestOptions).then((response) => {
//     if (!response.ok) {
//       throw new Error("Erreur");
//     }
//     return response.json();
//   });
// };

// // Modifier pseudo / mail
// export const updateuser = (token, id, email) => {
//   return fetch(`http://localhost:3000/api/users/${id}`, {
//     method: "PUT",
//     headers: {
//       "Content-Type": "application/json",
//       "x-api-key": apiKey,
//       Authorization: `Bearer ${token}`,
//     },
//     body: JSON.stringify({ email }),
//   }).then(handleResponse);
// };

// export const logUser = async (email, password) => {
//   try {
//     const response = await fetch("http://localhost:3000/login", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ email, password }),
//     });

//     if (!response.ok) {
//       throw new Error("Email ou mot de passe incorrecte");
//     }
//     const data = await res.json();

//     return data;
//   } catch (error) {
//     console.error("Erreur API logUser:", error);
//     throw error;
//   }
// };

// // Liste des utilisateurs
// export const getUsers = (token) => {
//   const requestOptions = {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//       "x-api-key": apiKey,
//       Authorization: `Bearer ${token}`,
//     },
//   };
//   return fetch("http://localhost:3000/api/users", requestOptions).then(
//     handleResponse
//   );
// };

// // Supprimer un utilisateur
// export const deleteUsers = (token, userId) => {
//   const requestOptions = {
//     method: "DELETE",
//     headers: {
//       "Content-Type": "application/json",
//       "x-api-key": apiKey,
//       Authorization: `Bearer ${token}`,
//     },
//   };
//   return fetch(
//     `http://localhost:3000/api/users/${userId}`,
//     requestOptions
//   ).then(handleResponse);
// };

// // ---------------------- ATTRACTIONS ----------------------

// // Ajouter une attraction
// export const sendAttraction = (
//   token,
//   nom,
//   description,
//   type,
//   status,
//   duree,
//   age_minimum,
//   date_creation,
//   image
// ) => {
//   let uri = "http://localhost:3000/api/attractions";
//   var data = JSON.stringify({
//     nom,
//     description,
//     type,
//     status,
//     duree,
//     age_minimum,
//     date_creation,
//     image,
//     commentaires: [],
//   });
//   const requestOptions = {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       "x-api-key": apiKey,
//       Authorization: `Bearer ${token}`,
//     },
//     body: data,
//   };
//   return fetch(uri, requestOptions).then(handleResponse);
// };

// // Récupérer attractions
// export const getAttraction = () => {
//   const requestOptions = {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//       "x-api-key": apiKey,
//     },
//   };
//   return fetch("http://localhost:3000/api/attractions", requestOptions).then(
//     handleResponse
//   );
// };

// // Supprimer une attraction
// export const deleteAttraction = (token, attractionId) => {
//   const requestOptions = {
//     method: "DELETE",
//     headers: {
//       "Content-Type": "application/json",
//       "x-api-key": apiKey,
//       Authorization: `Bearer ${token}`,
//     },
//   };
//   return fetch(
//     `http://localhost:3000/api/attractions/${attractionId}`,
//     requestOptions
//   ).then(handleResponse);
// };

// // Modifier une attraction
// export const updateAttraction = (token, attractionId, attractionData) => {
//   return fetch(`http://localhost:3000/api/attractions/${attractionId}`, {
//     method: "PUT",
//     headers: {
//       "Content-Type": "application/json",
//       "x-api-key": apiKey,
//       Authorization: `Bearer ${token}`,
//     },
//     body: JSON.stringify(attractionData),
//   }).then(handleResponse);
// };

// // Ajouter un commentaire
// export const sendCommentaire = (token, attractionId, commentaire) => {
//   return fetch(
//     `http://localhost:3000/api/attractions/${attractionId}/commentaires`,
//     {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify({ commentaire }),
//     }
//   ).then(handleResponse);
// };

// // ---------------------- PARC INFOS ----------------------

// // Infos sur le parc
// export const getMyParc = () => {
//   return fetch("http://localhost:4000/parc", {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//       "x-api-key": apiKey,
//     },
//   }).then(handleResponse);
// };

// // Modifier le parc
// export const updateMyParc = (token, nomparc, descriptionparc) => {
//   return fetch("http://localhost:4000/parc", {
//     method: "PUT",
//     headers: {
//       "Content-Type": "application/json",
//       "x-api-key": apiKey,
//       Authorization: `Bearer ${token}`,
//     },
//     body: JSON.stringify({ nom: nomparc, description: descriptionparc }),
//   }).then(handleResponse);
// };

// // ---------------------- TARIFS ----------------------

// // Récupérer les tarifs
// export const getTarif = () => {
//   return fetch("http://localhost:4000/tarifs", {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//       "x-api-key": apiKey,
//     },
//   }).then(handleResponse);
// };

// // ---------------------- GESTION D'ERREURS ----------------------

// const handleResponse = (response) => {
//   if (!response.ok) {
//     throw new Error("Erreur");
//   }
//   return response.json();
// };

import config from "../config";

const apiKey = config.apiKey;

// ---------------------- UTILISATEURS ----------------------

export const sendUser = (email, password) => {
  const uri = `${config.apiUrl}/register`;
  const data = JSON.stringify({ email, password });

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

export const getme = (token) => {
  const uri = `${config.apiUrl}/me`;
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

export const updateuser = (token, id, email) => {
  return fetch(`${config.apiUrl}/api/users/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ email }),
  }).then(handleResponse);
};

export const logUser = async (email, password) => {
  try {
    const response = await fetch(`${config.apiUrl}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error("Email ou mot de passe incorrecte");
    }

    const data = await response.json(); // 🔧 corrigé : `res` -> `response`
    return data;
  } catch (error) {
    console.error("Erreur API logUser:", error);
    throw error;
  }
};

export const getUsers = (token) => {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      Authorization: `Bearer ${token}`,
    },
  };

  return fetch(`${config.apiUrl}/api/users`, requestOptions).then(
    handleResponse
  );
};

export const deleteUsers = (token, userId) => {
  const requestOptions = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      Authorization: `Bearer ${token}`,
    },
  };

  return fetch(`${config.apiUrl}/api/users/${userId}`, requestOptions).then(
    handleResponse
  );
};

// ---------------------- ATTRACTIONS ----------------------

export const sendAttraction = (
  token,
  nom,
  description,
  type,
  status,
  duree,
  age_minimum,
  date_creation,
  image
) => {
  const uri = `${config.apiUrl}/api/attractions`;
  const data = JSON.stringify({
    nom,
    description,
    type,
    status,
    duree,
    age_minimum,
    date_creation,
    image,
    commentaires: [],
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

export const getAttraction = () => {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
    },
  };

  return fetch(`${config.apiUrl}/api/attractions`, requestOptions).then(
    handleResponse
  );
};

export const deleteAttraction = (token, attractionId) => {
  const requestOptions = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      Authorization: `Bearer ${token}`,
    },
  };

  return fetch(
    `${config.apiUrl}/api/attractions/${attractionId}`,
    requestOptions
  ).then(handleResponse);
};

export const updateAttraction = (token, attractionId, attractionData) => {
  return fetch(`${config.apiUrl}/api/attractions/${attractionId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(attractionData),
  }).then(handleResponse);
};

export const sendCommentaire = (token, attractionId, commentaire) => {
  return fetch(
    `${config.apiUrl}/api/attractions/${attractionId}/commentaires`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ commentaire }),
    }
  ).then(handleResponse);
};

// ---------------------- PARC INFOS ----------------------

export const getMyParc = () => {
  return fetch(`${config.parcServiceUrl}/parc`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
    },
  }).then(handleResponse);
};

export const updateMyParc = (token, nomparc, descriptionparc) => {
  return fetch(`${config.parcServiceUrl}/parc`, {
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

export const getTarif = () => {
  return fetch(`${config.parcServiceUrl}/tarifs`, {
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

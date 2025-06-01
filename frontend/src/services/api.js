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
      headers: { "Content-Type": "application/json", "x-api-key": apiKey },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error("Incorrect email or password");
    }

    const data = await response.json(); // 🔧 corrected: `res` -> `response`
    return data;
  } catch (error) {
    console.error("API logUser error:", error);
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
        "x-api-key": apiKey,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ commentaire }),
    }
  ).then(handleResponse);
};

// ---------------------- PARC INFOS ----------------------

export const getMyParc = () => {
  return fetch(`${config.apiUrl}/api/parc`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
    },
  }).then(handleResponse);
};

export const updateMyParc = (token, nomparc, descriptionparc) => {
  return fetch(`${config.apiUrl}/api/parc`, {
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
  return fetch(`${config.apiUrl}/api/tarifs`, {
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

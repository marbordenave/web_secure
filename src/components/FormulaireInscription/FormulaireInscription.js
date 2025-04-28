import React, { useState } from "react";
import { sendUser } from "../../services/api";
import "./FormulaireInscription.css";

//Fonction pour effectuer l'inscription des utilisateurs et vérifier
function FormulaireInscription() {
  const [popup, setPopup] = useState("");

  const [pseudo, setPseudo] = useState("");
  const [pseudoError, setPseudoError] = useState("");

  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordConfirmError, setPasswordConfirmError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  const [mail, setMail] = useState("");
  const [mailError, setMailError] = useState("");

  const [submitError, setSubmitError] = useState("");

  //fonction pour remettre a 0 toutes les composantes
  function resetAll() {
    setPseudo("");
    setPassword("");
    setMail("");
    setPasswordConfirm("");
    setPasswordSuccess("");
  }

  //Fonction pour effecter les changements pour le pseudo
  function handleChangePseudo(event) {
    setPseudo(event.target.value);
    checkPseudo(event.target.value);
  }

  //Fonction pour effecter les changements pour le mot de passe
  function handleChangePassword(event) {
    setPassword(event.target.value);
    checkPassword(event.target.value);
  }

  //Fonction pour effecter les changements pour la vérification du mot de passe
  function handleChangePasswordConfirm(event) {
    setPasswordConfirm(event.target.value);
    checkPasswordConfirm(event.target.value);
  }

  //Fonction pour effecter les changements pour l'email
  function handleChangeMail(event) {
    setMail(event.target.value);
    checkMail(event.target.value);
  }

  //On vérifie si le pseudo fait plus de 5 caractères
  const checkPseudo = (value) => {
    if (value.length < 5) {
      setPseudoError("Le pseudo doit faire plus de 5 caractères.");
    } else {
      setPseudoError("");
    }
  };

  //On vérifie si le mot de passe est assez long, qu'il contient au moins une maj et un chiffre
  const checkPassword = (value) => {
    let error = "Le mot de passe doit contenir ; \n";
    setPasswordSuccess("");
    // Pour vérifier que la chaine de caractère contient au moins une majuscule, on la convertit en minuscules, si la chaine de caractères n'a pas changé, alors elle ne contenait pas de majuscules.
    let maj = value.toLowerCase() != value;
    // Pour vérifier que la chaine de caractère contient au moins une minuscule, on la convertit en majuscules, si la chaine de caractères n'a pas changé, alors elle ne contenait pas de minuscules.
    let min = value.toUpperCase() != value;
    // Pour vérifier que la chaine de caractères contient au moins un chiffre, on parcourt la chaine de caractères, et pour chaque caractères, on essaye de le convertir en entier. Si la fonction parseInt() renvoi NaN (Not a Number), alors il ne s'agit pas d'un chiffre.
    let num = false;
    for (let i = 0; i < value.length; i++) {
      if (!isNaN(parseInt(value[i]))) num = true;
    }
    // Pour vérifier que la chaine de caractères contient au moins un caractère spécial, on créé une chaine de caractères contenant tous ceux que le souhaite vérifier. On parcourt ensuite notre mot de passe et pour chaque caractères on vérifie s'il est dans la chaine des caractères spéciaux.
    let caracters = "!@#$%^&*()_+-=[]{}|;:,.<>?";
    let car = false;
    for (let i = 0; i < value.length; i++) {
      if (caracters.includes(value[i])) car = true;
    }

    //Si le mot de passe fait moins de 9 caratères
    if (value.length < 9) {
      error += "-plus de 9 caractères\n";
    } else {
      setPasswordError("");
    }
    //Si le mot de passe ne contient pas de minuscule
    if (!min) {
      error += "-au moins une minuscule \n";
    } else {
      setPasswordError("");
    }
    //Si le mot de passe ne contient pas de majuscule
    if (!maj) {
      error += "-au moins une majuscule \n";
    } else {
      setPasswordError("");
    }
    //Si le mot de passe ne contient pas au moins un chiffre
    if (!num) {
      error += "-au moins un chiffre \n";
    } else {
      setPasswordError("");
    }
    //Si le mot de passe ne contient pas au moins un caractère spécial
    if (!car) {
      error += "-au moins un caractère spécial \n";
    } else {
      setPasswordError("");
    }
    //Si toutes les conditions sont réunies on change le mot de passe
    if (maj == true && min == true && num == true && car == true) {
      setPasswordSuccess("Mot de passe robuste");
      return setPasswordError("");
    }
    //Sinon on retourne l'erreur
    return setPasswordError(error);
  };

  //On verifie que le mot de passe de vérification soit le même que le mot de passe de base
  const checkPasswordConfirm = (value) => {
    if (value !== password) {
      setPasswordConfirmError("Les mots de passe entrés ne correspondent pas.");
    } else {
      setPasswordConfirmError("");
    }
  };
  //On vérifie que le mail est conforme
  const checkMail = (value) => {
    if (value.length < 5 || !value.includes("@")) {
      setMailError("L'adresse mail n'est pas valide.");
    } else {
      setMailError("");
    }
  };

  //On inscrit l'utilisateur
  function handleInscription() {
    //Si il n'y a aucune erreur
    if (!mailError && !passwordConfirmError && !passwordError && !pseudoError) {
      setSubmitError(""); // Réinitialisation de l'erreur de soumission
      // Envoyer les données utilisateur
      sendUser(pseudo, mail, password);
      //on met une popup pour montrer à l'utilisateur qu'il est bien inscrit
      setPopup(true);
      //On reset les valeurs envoyées
      resetAll();
    }
    //Si il y a des erreurs on affiche un message demandant de les corriger
    else {
      setSubmitError(
        "Veuillez corriger les erreurs avant de soumettre le formulaire."
      );
      if (!pseudo) {
        setPseudoError("Le pseudo est requis.");
      }
      if (!password) {
        setPasswordError("Le mot de passe est requis.");
      }
      if (!passwordConfirm) {
        setPasswordConfirmError("La confirmation du mot de passe est requise.");
      }
      if (!mail) {
        setMailError("L'adresse mail est requise.");
      }
    }
  }
  //On ferme la popup
  const closePopup = () => {
    setPopup(false);
  };

  //On affiche un formulaire dans lequel on peut inscrire un pseudo, un mot de passe, sa vérification ainsi que son adresse email
  // ainsi qu'un bouton pour envoyer ce formulaire
  //Il y a aussi la popup qui s'affiche si l'utilisateur a bien été inscrit
  return (
    <div className="forminscr">
      <div>
        <label htmlFor="pseudo">Pseudo</label>
        <input
          type="text"
          id="pseudo"
          onChange={handleChangePseudo}
          value={pseudo}
        />
        <span className="error">{pseudoError}</span>
      </div>
      <div>
        <label htmlFor="password">Mot de passe</label>
        <input
          type="password"
          id=""
          onChange={handleChangePassword}
          value={password}
        />
        <span className="error">{passwordError}</span>
        <span className="valid">{passwordSuccess}</span>
      </div>
      <div>
        <label htmlFor="re-password">Confirmer le mot de passe</label>
        <input
          type="password"
          id="re-password"
          onChange={handleChangePasswordConfirm}
          value={passwordConfirm}
        />
        <span className="error">{passwordConfirmError}</span>
      </div>
      <div>
        <label htmlFor="mail">Mail</label>
        <input
          type="email"
          id="mail"
          onChange={handleChangeMail}
          value={mail}
        />
        <span className="error">{mailError}</span>
      </div>
      <span className="error">{submitError}</span>
      <button onClick={handleInscription}>S'inscrire</button>
      {popup && (
        <div className="popup-bg active">
          <div className="popupDelete">
            <p>Vous êtes désormais inscris</p>
            <button className="btn-annuler" onClick={() => closePopup()}>
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default FormulaireInscription;

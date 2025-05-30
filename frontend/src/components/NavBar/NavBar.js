import React, { useState, useEffect } from "react";
import "./NavBar.css";
import BoutonDeconnexion from "../BoutonDeconnexion/BoutonDeconnexion";

//Fonction qui affiche les pages sur lesquelles l'utilisateur peut naviger en fonction de sa connexion et de son statut
function Navbar({ currentPage, setPage, Admin, parcName }) {
  let is_token_presence = localStorage.getItem("token");

  //On recupère les différents onglets sur lesquels on va pouvoir naviguer avec des conditions pour certaines pages
  //Les conditions sont l'absence d'un token, la présence d'un token et le fait que l'utilisateur soit un administrateur
  return (
    <header>
      <h3>{parcName != undefined ? parcName : ""}</h3>
      <nav>
        <div id="test">
          <p
            className={currentPage === "accueil" ? "active" : ""}
            onClick={() => setPage("accueil")}
          >
            Accueil
          </p>
          <p
            className={currentPage === "attraction" ? "active" : ""}
            onClick={() => setPage("attraction")}
          >
            Attraction
          </p>
          {is_token_presence == null && (
            <>
              <p
                className={currentPage === "connexion" ? "active" : ""}
                onClick={() => setPage("connexion")}
              >
                Connexion
              </p>
              <p
                className={currentPage === "inscription" ? "active" : ""}
                onClick={() => setPage("inscription")}
              >
                Inscription
              </p>
            </>
          )}
          {is_token_presence != null && (
            <>
              <p
                className={currentPage === "reservation" ? "active" : ""}
                onClick={() => setPage("reservation")}
              >
                Reservation
              </p>
              <p
                className={currentPage === "profil" ? "active" : ""}
                onClick={() => setPage("profil")}
              >
                Mon Profil
              </p>
            </>
          )}
          {Admin && (
            <p
              className={currentPage === "admin" ? "active" : ""}
              onClick={() => setPage("admin")}
            >
              Gestion
              <br />
              du parc{" "}
            </p>
          )}
          {is_token_presence != null && <BoutonDeconnexion setPage={setPage} />}
        </div>
      </nav>
    </header>
  );
}

export default Navbar;

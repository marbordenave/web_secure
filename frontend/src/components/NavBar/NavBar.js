import React, { useState, useEffect } from "react";
import "./NavBar.css";
import BoutonDeconnexion from "../BoutonDeconnexion/BoutonDeconnexion";

// Function that displays the pages the user can navigate to based on their login status and role
function Navbar({ currentPage, setPage, Admin, parcName }) {
  let is_token_presence = localStorage.getItem("token");

  // We get the different tabs we can navigate to with conditions for certain pages
  // The conditions are the absence of a token, the presence of a token and whether the user is an administrator
  return (
    <header>
      <h3>{parcName != undefined ? parcName : ""}</h3>
      <nav>
        <div id="test">
          <p
            className={currentPage === "accueil" ? "active" : ""}
            onClick={() => setPage("accueil")}
          >
            Home
          </p>
          <p
            className={currentPage === "attraction" ? "active" : ""}
            onClick={() => setPage("attraction")}
          >
            Attractions
          </p>
          {is_token_presence == null && (
            <>
              <p
                className={currentPage === "connexion" ? "active" : ""}
                onClick={() => setPage("connexion")}
              >
                Login
              </p>
              <p
                className={currentPage === "inscription" ? "active" : ""}
                onClick={() => setPage("inscription")}
              >
                Register
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
                My Profile
              </p>
            </>
          )}
          {Admin && (
            <p
              className={currentPage === "admin" ? "active" : ""}
              onClick={() => setPage("admin")}
            >
              Park
              <br />
              Management{" "}
            </p>
          )}
          {is_token_presence != null && <BoutonDeconnexion setPage={setPage} />}
        </div>
      </nav>
    </header>
  );
}

export default Navbar;

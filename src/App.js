import React, { useState, useEffect } from "react";
import "./App.css";
import { getme, getMyParc } from "./services/api";
import Administrateur from "./pages/Administrateur";
import Inscription from "./pages/Inscription";
import Accueil from "./pages/Accueil.js";
import Navbar from "./components/NavBar/NavBar.js";
import Attractions from "./pages/Attractions.js";
import Connexion from "./pages/Connexion.js";
import Profil from "./pages/Profil.js";
import Parcours from "./pages/Parcours.js";
import Footer from './components/Footer/Footer.js';

function App() {
  const [isAdmin, set_admin] = useState(false);
  const [page, setPage] = useState("accueil");
  const [parcName, setParcName] = useState();

  //on récupère les infos du parc pour afficher son nom
  useEffect(() => {
    getMyParc().then((data) => setParcName(data.nom));
  }, []);

  //vérifie si l'utilisateur est un administrateur sur App pour qu'elle se fasse à tout moment et mette à jour les composants
  let token = localStorage.getItem("token");
  //si l'utilisateur administrateur se déconnecte isAdmin passe à false
  if (token == null && isAdmin == true) {
    set_admin(false);
  }
  //si l'utilisateur se connecte et qu'il est un admin on met isAdmin à true
  if (token != null && isAdmin == false) {
    getme(localStorage.getItem("token")).then((result) => {
      set_admin(result.admin);
    });
    console.log("token", localStorage.getItem("token"));
  }

  //Affiche le composatn dont la page est mise en current page
  return (
    <div>
      <Navbar
        currentPage={page}
        setPage={setPage}
        Admin={isAdmin}
        parcName={parcName}
      />
      {page === "connexion" && <Connexion setPage={setPage} />}
      {page === "profil" && <Profil setPage={setPage} />}
      {page === "attraction" && <Attractions setPage={setPage} />}
      {page === "parcours" && <Parcours setPage={setPage} />}
      {page === "accueil" && <Accueil setPage={setPage} />}
      {page === "inscription" && <Inscription setPage={setPage} />}
      {page === "admin" && <Administrateur setParcname={setParcName} />}
      <Footer setPage={setPage} />
    </div>
  );
}

export default App;

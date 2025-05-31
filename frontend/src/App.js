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
import Reservation from "./pages/Reservation.js";
import Footer from './components/Footer/Footer.js';

function App() {
  const [isAdmin, set_admin] = useState(false);
  const [page, setPage] = useState("accueil");
  const [parcName, setParcName] = useState();

  // Get park information to display its name
  useEffect(() => {
    getMyParc().then((data) => setParcName(data.nom));
  }, []);

  // Check if user is an administrator on App so it's done at all times and updates components
  let token = localStorage.getItem("token");
  // If administrator user logs out, isAdmin becomes false
  console.log(isAdmin)
  if (token == null && isAdmin == true) {
    set_admin(false);
  }

  if (token != null && isAdmin == false) {
    getme(localStorage.getItem("token")).then((result) => {
      set_admin(result.role === 'admin'); // Modified here
    });
  }

  // Display the component whose page is set as current page
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
      {page === "reservation" && <Reservation setPage={setPage} />}
      {page === "accueil" && <Accueil setPage={setPage} />}
      {page === "inscription" && <Inscription setPage={setPage} />}
      {page === "admin" && <Administrateur setParcname={setParcName} />}
      <Footer setPage={setPage} />
    </div>
  );
}

export default App;
import React,{useState} from 'react';

// Button to allow the user to log out
function BoutonDeconnexion({setPage}) {
const [token,setToken]=useState(localStorage.getItem("token"))

  function handleLogout(){
    // If the button is clicked, log out the user
    // Clear localStorage (to remove the token)
    localStorage.clear();
    // Set the token to undefined
    setToken(undefined)
    // Return to the login page
    setPage('connexion');
  }

  // Only return the button if the token is not null
  return (
    <>
      {token && <button onClick={handleLogout}>Log out</button>}
    </>
  );
}

export default BoutonDeconnexion;
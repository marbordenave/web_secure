import React, {useState} from 'react';
import {logUser} from '../../services/api';

// Function to display the login form
function FormulaireConnexion({setPage}) {
  const [email, setEmail] = useState(''); // Changed from username to email
  const [password, setPassword] = useState('');
  const [errorIdentifiant, setErrorIdentifiant] = useState('');
  
  // Function to reset fields
  function ResetAll(){
    setEmail(''); // Changed here too
    setPassword('');
  }

  function handleLog() {
    logUser(email, password)
      .then(data => {
        localStorage.setItem('token', data.token);
        ResetAll();
        setPage('accueil');
      })
      .catch(error => {
        setErrorIdentifiant(error.message); 
      });
  }
  return (
    <>
    <div id="formulaire">
      <div>
        <label htmlFor="email">Email</label>
        <input type='email' id='email' onChange={(e) => setEmail(e.target.value)} value={email}/>
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <input type='password' id='password' onChange={(e) => setPassword(e.target.value)} value={password} />
      </div>
      <span className='error'>{errorIdentifiant}</span>
      <button onClick={handleLog}>Log in</button>
    </div>
    </>
  );
}

export default FormulaireConnexion;
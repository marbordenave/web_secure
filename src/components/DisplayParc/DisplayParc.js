import React, {useState, useEffect} from 'react';
import { getMyParc } from '../../services/api';
import './DisplayParc.css'; 

//Fonction pour afficher les données du parc
function DisplayParc() {
  const [parc, setParc] = useState();
  
  useEffect(() => {
    // Lorsque le composant a été rendu, on récupère les info du parc.
    getMyParc().then(data => setParc(data));
  }, []);

  //On affiche le parc avec son nom et sa description
  return (
      <div className='donneesparc'>
        <h2 className='parcnom'>Welcome : {parc != undefined ? parc.nom : ''}</h2>
        <h3 className='parcdecription'>{parc != undefined ? parc.description : ''}</h3>
        <br></br>
      </div>
  
  );
}

export default DisplayParc;
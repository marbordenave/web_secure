import React, {useState, useEffect} from 'react';
import {getme, updateuser} from '../../services/api';

// Function for the profile page
function Profils() {
  const [email, setMail] = useState('');
  const [newmail, setNewMail] = useState(null); // Initialized to null to avoid the error
  const [id, setId] = useState();
  const [change, setWantChange] = useState(false);

  useEffect(() => {
    // When the component is rendered, we get the user's info
    getuserinfo();
  }, []);

  // We get the user's information
  const getuserinfo = () => {
    getme(localStorage.getItem('token'))
      .then(result => {
        setMail(result.email);
        setId(result.id);
        // We initialize newmail with the current mail value
        setNewMail(result.mail);
      });
  }

  // If there is a change in the email, we save it
  function handleChangeMail(e) {
    let value = e.target.value;
    setNewMail(value);
  }

  // If the button to validate the modification is clicked, we make the changes
  function handleUpdate() {
    updateuser(localStorage.getItem('token'),id,newmail)
      .then(result => {
        setMail(newmail);
        setWantChange(false);
      })
      .catch(error => {
        console.error("An error occurred during the update: ", error);
      });
  }

  // We display a form with the user's information and a button to allow modifying the information.
  return (
    <div id='formulaire'>
      <label>Email Address</label>
      <p>{email}</p>
      
      {/* Button to switch to edit mode */}
      {!change && (
        <button onClick={() => setWantChange(true)}>Edit</button>
      )}
      
      {/* Edit form */}
      {change && (
        <>
          <label>Edit Email Address</label>
          <input 
            type='email' 
            id='mail' 
            value={newmail || ''} // Solution for controlled/uncontrolled error
            onChange={handleChangeMail}
          />
          <button onClick={handleUpdate}>Save Changes</button>
        </>
      )}
    </div>
  );
}

export default Profils;
import React from 'react';

const UpdateDisplay = () => {
    localStorage.setItem('token')
    if(localStorage.getItem("token")) {
        admini.style.display = "block"
    } else {
        admini.style.display = "none"
    }
} 
let admini = document.getElementById('admini');

export default UpdateDisplay
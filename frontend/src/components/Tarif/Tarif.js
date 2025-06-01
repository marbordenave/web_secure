import React, { useState, useEffect } from 'react';
import { getTarif } from '../../services/api';
import './Tarif.css'; 

//Function to display park rates
function Tarif() {
    const [listeTarif, setTarif] = useState([]);

    //We fetch the different park rates
    useEffect(() => {
        getTarif().then(result => {
            setTarif(result);
        });
    }, []);

    //We display the rates
    const ajouterTarif= (nom, prix, description) => {
        return (
            <article className="afficheTarif">
                <h2>{nom}</h2>
                <h3>{prix} €</h3>
                <h4>{description}</h4>
            </article>
        );
    }; 

    //We break down the display of rates one by one
    const displayTarif = (TarifList) => {
        return TarifList.map((tarif, idx) => (
            <div key={idx}>
                {ajouterTarif(tarif.nom, tarif.prix, tarif.description)}
            </div>
        ));
    };

    //We display the rates
    return (
        <div>
            <section id="listeTarif">
                {displayTarif(listeTarif)}
            </section>
        </div>
    );
}

export default Tarif;

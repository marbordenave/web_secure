import React, { useState, useEffect } from 'react';
import { getTarif } from '../../services/api';
import './Tarif.css'; 

//Fonction pour afficher les tarifs du parc
function Tarif() {
    const [listeTarif, setTarif] = useState([]);

    //on récupère les différents tarifs du parc
    useEffect(() => {
        getTarif().then(result => {
            setTarif(result);
        });
    }, []);

    //On affiche les tarifs
    const ajouterTarif= (nom, prix, description) => {
        return (
            <article className="afficheTarif">
                <h2>{nom}</h2>
                <h3>{prix} €</h3>
                <h4>{description}</h4>
            </article>
        );
    }; 

    //On décompose l'affichage des tarifs que l'on fait 1 par 1
    const displayTarif = (TarifList) => {
        return TarifList.map((tarif, idx) => (
            <div key={idx}>
                {ajouterTarif(tarif.nom, tarif.prix, tarif.description)}
            </div>
        ));
    };

    //On affiche les tarifs
    return (
        <div>
            <section id="listeTarif">
                {displayTarif(listeTarif)}
            </section>
        </div>
    );
}

export default Tarif;

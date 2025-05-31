import React from 'react';
import FormulaireModiferParc from "../components/FormulaireModiferParc";
import FormulaireAttraction from "../components/FormulaireAttraction";
import ModificationAttraction from "../components/ModificationAttraction/ModificationAttraction";
import DisplayUsers from "../components/DisplayUsers";
import './Administrateur.css';

function Administrateur({ setParcname }) {
    let token = localStorage.getItem("token");

    return (
        <div className="admin-container">
            <h1>Park Management</h1>
            <div className="admin-grid">
                <a href="#modify-park" className="admin-card modify-park">
                    <div className="icon">🏞️</div>
                    <h3>Modify Park</h3>
                    <p>Update park information, description, and settings</p>
                    <span className="btn">Modify Park</span>
                </a>

                <a href="#manage-users" className="admin-card manage-users">
                    <div className="icon">👥</div>
                    <h3>Manage Users</h3>
                    <p>View, edit, and manage user accounts and permissions</p>
                    <span className="btn">Manage Users</span>
                </a>

                <a href="#add-attraction" className="admin-card add-attraction">
                    <div className="icon">🎡</div>
                    <h3>Add Attraction</h3>
                    <p>Create and add new attractions to the park</p>
                    <span className="btn">Add Attraction</span>
                </a>

                <a href="#manage-attractions" className="admin-card manage-attractions">
                    <div className="icon">🎢</div>
                    <h3>Manage Attractions</h3>
                    <p>Edit, update, or remove existing attractions</p>
                    <span className="btn">Manage Attractions</span>
                </a>
            </div>

            <div id="modify-park" className="section">
                <FormulaireModiferParc setParcName={setParcname} />
                <a href="#" className="back-to-top">Back to top</a>
            </div>

            <div id="manage-users" className="section">
                <DisplayUsers token={token} />
                <a href="#" className="back-to-top">Back to top</a>
            </div>

            <div id="add-attraction" className="section">
                <FormulaireAttraction token={token} />
                <a href="#" className="back-to-top">Back to top</a>
            </div>

            <div id="manage-attractions" className="section">
                <ModificationAttraction token={token} />
                <a href="#" className="back-to-top">Back to top</a>
            </div>
        </div>
    );
}

export default Administrateur;

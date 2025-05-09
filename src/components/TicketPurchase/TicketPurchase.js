import React, { useState, useEffect } from "react";
import { getTarif } from "../../services/api";
import './TicketPurchase.css'

function TicketPurchase({ token }) {
  const [tarifs, setTarifs] = useState([]);
  const [cart, setCart] = useState([]);

  // Fetch tarifs from the API when the component mounts
  useEffect(() => {
    getTarif()
      .then((data) => {
        setTarifs(data);
        // Initialize quantity to 0 for each ticket type
        const initializedCart = data.map((tarif) => ({
          ...tarif,
          quantité: 0,
        }));
        setCart(initializedCart);
      })
      .catch((error) => {
        console.error("Error fetching tariffs:", error);
      });
  }, []);

  // Handle quantity input changes
  const handleQuantityChange = (id, newQuantity) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantité: parseInt(newQuantity) || 0 }
          : item
      )
    );
  };

  // Calculate total cost
  const total = cart.reduce(
    (sum, item) => sum + item.prix * item.quantité,
    0
  );

  // Simulate ticket purchase
  const handlePurchase = () => {
    const purchasedTickets = cart.filter((item) => item.quantité > 0);
    console.log("Purchased tickets:", purchasedTickets);
    alert("Purchase successful (simulated)!");
  };

  return (
    <div>
      <h2>Ticket Purchase</h2>
      <table className="divtab">
        <thead>
          <tr>
            <th>Type</th>
            <th>Description</th>
            <th>Price</th>
            <th>Quantity</th>
          </tr>
        </thead>
        <tbody>
          {cart.map((tarif) => (
            <tr key={tarif.id}>
              <td>{tarif.nom}</td>
              <td>{tarif.description}</td>
              <td>{tarif.prix} €</td>
              <td>
                <input
                  type="number"
                  min="0"
                  value={tarif.quantité}
                  onChange={(e) =>
                    handleQuantityChange(tarif.id, e.target.value)
                  }
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3 id="total">Total: {total} €</h3>
      <button onClick={handlePurchase}>Purchase</button>
    </div>
  );
}

export default TicketPurchase;

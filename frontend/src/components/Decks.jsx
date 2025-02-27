import { useEffect, useState } from "react";
import { useUser } from "./UserContext";
import { useNavigate } from "react-router-dom";

const Decks = () => {
    const { isAuthenticated, loading } = useUser();
    const [decks, setDecks] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && isAuthenticated) {
            fetchDecks();
        }
    }, [isAuthenticated, loading]);

    const fetchDecks = async () => {
        try {
            const response = await fetch("http://127.0.0.1:5000/decks", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (!response.ok) throw new Error("Failed to fetch decks");

            const data = await response.json();
            setDecks(data);
        } catch (error) {
            console.error("Error fetching decks:", error);
        }
    };

    const handleCreateDeck = async () => {
        const title = prompt("Enter deck title:");
        const description = prompt("Enter deck description:");
        if (!title) return;

        try {
            const response = await fetch("http://127.0.0.1:5000/decks", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({ title, description }),
            });

            if (!response.ok) throw new Error("Failed to create deck");

            const newDeck = await response.json();
            setDecks([...decks, newDeck]);
        } catch (error) {
            console.error("Error creating deck:", error);
        }
    };

    const handleDeleteDeck = async (id) => {
        if (!window.confirm("Are you sure you want to delete this deck?")) return;

        try {
            const response = await fetch(`http://127.0.0.1:5000/decks/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });

            if (!response.ok) throw new Error("Failed to delete deck");

            setDecks(decks.filter(deck => deck.id !== id));
        } catch (error) {
            console.error("Error deleting deck:", error);
        }
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div>
            <h2>Decks</h2>
            <button onClick={handleCreateDeck}>Create New Deck</button>
            <ul>
                {decks.map((deck) => (
                    <li key={deck.id}>
                        <span 
                            onClick={() => navigate(`/decks/${deck.id}`)} 
                            style={{ cursor: "pointer", textDecoration: "underline" }}
                        >
                            {deck.title}
                        </span>
                        <button onClick={() => handleDeleteDeck(deck.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Decks;

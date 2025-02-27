import { useEffect, useState } from "react";
import { useUser } from "./UserContext";
import { useNavigate } from "react-router-dom";

const Decks = () => {
    const { isAuthenticate, loading } = useUser();
    const [decks, setDecks] = useState([]);
    const navigate = useNavigate();

    import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext"; // Import UserContext
import { useNavigate } from "react-router-dom";

const Decks = () => {
    // Get authentication state and loading state from UserContext
    const { isAuthenticated, loading } = useUser();
    const [decks, setDecks] = useState([]); // Store fetched decks
    const navigate = useNavigate();

    useEffect(() => {
        // Redirect to login if user is not authenticated and loading is complete
        if (!loading && !isAuthenticated) {
            navigate("/login");
            return;
        }

        // Fetch decks from the backend
        const fetchDecks = async () => {
            try {
                const response = await fetch("http://127.0.0.1:5000/decks", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch decks");
                }

                const data = await response.json();
                setDecks(data); // Update state with fetched decks
            } catch (error) {
                console.error("Error fetching decks:", error);
            }
        };

        fetchDecks();
    }, [isAuthenticated, loading, navigate]);

    if (loading) return <p>Loading...</p>; // Show loading message while checking auth

    return (
        <div>
            <h2>Decks</h2>
            <button onClick={() => navigate("/create-deck")}>Create New Deck</button>
            <ul>
                {decks.map((deck) => (
                    <li key={deck.id}>{deck.title}</li>
                ))}
            </ul>
        </div>
    );
};

export default Decks;

}
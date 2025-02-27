import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "./UserContext";

const DeckView = () => {
    const { isAuthenticated, loading } = useUser();
    const { id } = useParams();
    const [deck, setDeck] = useState(null);
    const [flashcards, setFlashcards] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && isAuthenticated) {
            fetchDeck();
        }
    }, [id, isAuthenticated, loading]);

    const fetchDeck = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:5000/decks/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (!response.ok) throw new Error("Failed to fetch deck");

            const data = await response.json();
            setDeck(data);
            setFlashcards(data.flashcards || []);
        } catch (error) {
            console.error("Error fetching deck:", error);
        }
    };

    const handleCreateFlashcard = async () => {
        const question = prompt("Enter flashcard question:");
        const answer = prompt("Enter flashcard answer:");
        if (!question || !answer) return;

        try {
            const response = await fetch(`http://127.0.0.1:5000/decks/${id}/flashcards`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({ question, answer }),
            });

            if (!response.ok) throw new Error("Failed to create flashcard");

            const newFlashcard = await response.json();
            setFlashcards([...flashcards, newFlashcard]);
        } catch (error) {
            console.error("Error creating flashcard:", error);
        }
    };

    const handleDeleteFlashcard = async (flashcardId) => {
        if (!window.confirm("Are you sure you want to delete this flashcard?")) return;

        try {
            const response = await fetch(`http://127.0.0.1:5000/decks/${id}/flashcards/${flashcardId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });

            if (!response.ok) throw new Error("Failed to delete flashcard");

            setFlashcards(flashcards.filter(flashcard => flashcard.id !== flashcardId));
        } catch (error) {
            console.error("Error deleting flashcard:", error);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (!deck) return <p>Deck not found</p>;

    return (
        <div>
            <h2>{deck.title}</h2>
            <p>{deck.description}</p>
            <button onClick={handleCreateFlashcard}>Create Flashcard</button>
            <ul>
                {flashcards.map((flashcard) => (
                    <li key={flashcard.id}>
                        <strong>Q:</strong> {flashcard.question} <br />
                        <strong>A:</strong> {flashcard.answer}
                        <button onClick={() => handleDeleteFlashcard(flashcard.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default DeckView;

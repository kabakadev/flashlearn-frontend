"use client";

import { useState, useEffect, useCallback } from "react";

export const useStudySession = (
  deckId,
  API_URL,
  startTimeRef,
  sessionStartTimeRef
) => {
  const [flashcards, setFlashcards] = useState([]);
  const [progress, setProgress] = useState([]);
  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sessionStats, setSessionStats] = useState({
    totalCards: 0,
    correctAnswers: 0,
    incorrectAnswers: 0,
    timeSpent: 0,
    cardsLearned: 0,
  });
  const [showSummary, setShowSummary] = useState(false);
  const [deck, setDeck] = useState(null);
  const [answeredCards, setAnsweredCards] = useState(new Set());

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const deckResponse = await fetch(`${API_URL}/decks/${deckId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!deckResponse.ok) throw new Error("Failed to fetch deck details");
        const deckData = await deckResponse.json();
        setDeck(deckData);
        const flashcardsResponse = await fetch(`${API_URL}/flashcards`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!flashcardsResponse.ok)
          throw new Error("Failed to fetch flashcards");
        const flashcardsData = await flashcardsResponse.json();

        // Handle the paginated response structure
        const deckFlashcards = Array.isArray(flashcardsData.items)
          ? flashcardsData.items.filter(
              (card) => card.deck_id === Number.parseInt(deckId)
            )
          : [];

        setFlashcards(deckFlashcards);
        const progressResponse = await fetch(
          `${API_URL}/progress/deck/${deckId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!progressResponse.ok) throw new Error("Failed to fetch progress");
        const progressData = await progressResponse.json();
        setProgress(Array.isArray(progressData) ? progressData : []);

        setSessionStats((prev) => ({
          ...prev,
          totalCards: deckFlashcards.length,
        }));
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load study session. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [deckId, API_URL]);

  const getCardProgress = useCallback(
    (flashcardId) => {
      return (
        progress.find((p) => p.flashcard_id === flashcardId) || {
          study_count: 0,
          correct_attempts: 0,
          incorrect_attempts: 0,
          is_learned: false,
        }
      );
    },
    [progress]
  );

  const handleFlashcardResponse = useCallback(
    async (wasCorrect) => {
      const currentFlashcard = flashcards[currentFlashcardIndex];
      const timeSpent = (Date.now() - startTimeRef.current) / 60000; // Convert to minutes

      try {
        const token = localStorage.getItem("authToken");
        const response = await fetch(`${API_URL}/progress`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            deck_id: Number.parseInt(deckId),
            flashcard_id: currentFlashcard.id,
            was_correct: wasCorrect,
            time_spent: timeSpent,
          }),
        });

        if (!response.ok) throw new Error("Failed to update progress");

        // Track answered card
        setAnsweredCards((prev) => new Set(prev).add(currentFlashcardIndex));

        setSessionStats((prev) => ({
          ...prev,
          correctAnswers: prev.correctAnswers + (wasCorrect ? 1 : 0),
          incorrectAnswers: prev.incorrectAnswers + (wasCorrect ? 0 : 1),
          timeSpent: prev.timeSpent + timeSpent,
        }));
      } catch (error) {
        console.error("Error updating progress:", error);
        setError("Failed to save your progress. Please try again.");
      }
    },
    [API_URL, currentFlashcardIndex, deckId, flashcards, startTimeRef]
  );

  const handleFinishSession = useCallback(() => {
    const totalTimeSpent = (Date.now() - sessionStartTimeRef.current) / 60000;
    setSessionStats((prev) => ({
      ...prev,
      timeSpent: totalTimeSpent,
    }));
    setShowSummary(true);
  }, [sessionStartTimeRef]);

  const handleMarkAsLearned = useCallback(async () => {
    const currentFlashcard = flashcards[currentFlashcardIndex];

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`${API_URL}/progress`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          deck_id: Number.parseInt(deckId),
          flashcard_id: currentFlashcard.id,
          was_correct: true,
          time_spent: 0,
          is_learned: true,
        }),
      });

      if (!response.ok) throw new Error("Failed to update progress");
      setProgress((prevProgress) => {
        const updatedProgress = [...prevProgress];
        const index = updatedProgress.findIndex(
          (p) => p.flashcard_id === currentFlashcard.id
        );

        if (index !== -1) {
          updatedProgress[index] = {
            ...updatedProgress[index],
            is_learned: true,
            review_status: "mastered",
          };
        } else {
          updatedProgress.push({
            flashcard_id: currentFlashcard.id,
            deck_id: Number.parseInt(deckId),
            is_learned: true,
            review_status: "mastered",
            study_count: 1,
            correct_attempts: 1,
            incorrect_attempts: 0,
          });
        }

        return updatedProgress;
      });

      // Update session stats
      setSessionStats((prev) => ({
        ...prev,
        cardsLearned: prev.cardsLearned + 1,
      }));
    } catch (error) {
      console.error("Error marking card as learned:", error);
      setError("Failed to mark card as learned. Please try again.");
    }
  }, [API_URL, currentFlashcardIndex, deckId, flashcards]);

  return {
    deck,
    flashcards,
    progress,
    currentFlashcardIndex,
    setCurrentFlashcardIndex,
    showAnswer,
    setShowAnswer,
    loading,
    error,
    sessionStats,
    setSessionStats,
    showSummary,
    setShowSummary,
    handleFlashcardResponse,
    handleMarkAsLearned,
    getCardProgress,
    answeredCards,
    handleFinishSession,
  };
};

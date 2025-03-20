"use client";

import { useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Container, Alert, Button } from "@mui/material";
import NavBar from "../NavBar";
import StudyHeader from "./StudyMode/StudyHeader";
import StudyProgress from "./StudyMode/StudyProgress";
import FlashcardDisplay from "./StudyMode/FlashcardDisplay";
import StudyActions from "./StudyMode/StudyActions";
import StudySummary from "./StudyMode/StudySummary";
import { useStudySession } from "./StudyMode/useStudySession";
import LoadingState from "./LoadingState";
import EmptyDeckState from "./StudyMode/EmptyDeckState";

const API_URL = "https://flashlearn-backend-ityf.onrender.com";

const StudyMode = () => {
  const { deckId } = useParams();
  const navigate = useNavigate();
  const sessionStartTimeRef = useRef(Date.now());
  const startTimeRef = useRef(Date.now());

  const {
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
  } = useStudySession(deckId, API_URL, startTimeRef, sessionStartTimeRef);
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        setShowAnswer(!showAnswer);
      } else if (e.key === "ArrowRight") {
        if (showAnswer && !answeredCards.has(currentFlashcardIndex)) {
          handleFlashcardResponse(true);
        } else if (currentFlashcardIndex < flashcards.length - 1) {
          setCurrentFlashcardIndex(currentFlashcardIndex + 1);
          setShowAnswer(false);
          startTimeRef.current = Date.now();
        }
      } else if (e.key === "ArrowLeft") {
        if (showAnswer && !answeredCards.has(currentFlashcardIndex)) {
          handleFlashcardResponse(false);
        } else if (currentFlashcardIndex > 0) {
          setCurrentFlashcardIndex(currentFlashcardIndex - 1);
          setShowAnswer(false);
          startTimeRef.current = Date.now();
        }
      } else if (showAnswer && !answeredCards.has(currentFlashcardIndex)) {
        if (e.key === "1") {
          handleFlashcardResponse(true);
        } else if (e.key === "0") {
          handleFlashcardResponse(false);
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [
    showAnswer,
    currentFlashcardIndex,
    flashcards.length,
    handleFlashcardResponse,
    setCurrentFlashcardIndex,
    setShowAnswer,
    answeredCards,
  ]);

  const handleExitStudy = () => {
    navigate("/study");
  };

  const handleRestartStudy = () => {
    setShowSummary(false);
    setCurrentFlashcardIndex(0);
    setShowAnswer(false);
    startTimeRef.current = Date.now();
    setSessionStats({
      totalCards: flashcards.length,
      correctAnswers: 0,
      incorrectAnswers: 0,
      timeSpent: 0,
      cardsLearned: 0,
    });
  };

  if (loading) {
    return <LoadingState message="Loading study session..." />;
  }

  if (error) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Alert
          severity="error"
          action={
            <Button
              color="inherit"
              size="small"
              onClick={() => navigate("/study")}
            >
              Go Back
            </Button>
          }
        >
          {error}
        </Alert>
      </Container>
    );
  }

  if (flashcards.length === 0) {
    return <EmptyDeckState deckId={deckId} />;
  }

  const currentFlashcard = flashcards[currentFlashcardIndex];
  const cardProgress = getCardProgress(currentFlashcard.id);
  const progressPercentage =
    ((currentFlashcardIndex + 1) / flashcards.length) * 100;

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
      <NavBar />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <StudyHeader deck={deck} handleExitStudy={handleExitStudy} />

        <StudyProgress
          currentIndex={currentFlashcardIndex}
          totalCards={flashcards.length}
          progressPercentage={progressPercentage}
          onNextCard={() => {
            if (currentFlashcardIndex < flashcards.length - 1) {
              setCurrentFlashcardIndex(currentFlashcardIndex + 1);
              setShowAnswer(false);
              startTimeRef.current = Date.now();
            }
          }}
          showAnswer={showAnswer}
          answeredCards={answeredCards}
        />

        <FlashcardDisplay
          currentFlashcard={currentFlashcard}
          showAnswer={showAnswer}
          setShowAnswer={setShowAnswer}
          cardProgress={cardProgress}
        />

        <StudyActions
          showAnswer={showAnswer}
          setShowAnswer={setShowAnswer}
          currentFlashcardIndex={currentFlashcardIndex}
          flashcardsLength={flashcards.length}
          setCurrentFlashcardIndex={setCurrentFlashcardIndex}
          startTimeRef={startTimeRef}
          handleFlashcardResponse={handleFlashcardResponse}
          cardProgress={cardProgress}
          handleMarkAsLearned={handleMarkAsLearned}
          handleFinishSession={handleFinishSession}
          answeredCards={answeredCards}
        />

        <StudySummary
          showSummary={showSummary}
          sessionStats={sessionStats}
          handleExitStudy={handleExitStudy}
        />
      </Container>
    </Box>
  );
};

export default StudyMode;

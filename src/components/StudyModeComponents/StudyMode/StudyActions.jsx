import { Box, Button, IconButton, Tooltip } from "@mui/material";
import {
  ArrowLeft,
  Rotate3D,
  ThumbsUp,
  ThumbsDown,
  Trophy,
  CheckCircle,
  Play,
  Pause,
} from "lucide-react";
import React, { useState, useEffect } from "react";

const StudyActions = ({
  showAnswer,
  setShowAnswer,
  currentFlashcardIndex,
  flashcardsLength,
  setCurrentFlashcardIndex,
  startTimeRef,
  handleFlashcardResponse,
  cardProgress,
  handleMarkAsLearned,
  handleFinishSession,
  answeredCards,
}) => {
  const [isAutoplay, setIsAutoplay] = useState(false);
  const [questionDelay, setQuestionDelay] = useState(2000); // 2 seconds to view question
  const [answerDelay, setAnswerDelay] = useState(3000); // 3 seconds to view answer
  const [userInteraction, setUserInteraction] = useState(false);
  const [waitingForResponse, setWaitingForResponse] = useState(false);

  const isCurrentCardAnswered = answeredCards.has(currentFlashcardIndex);
  const allCardsAnswered = answeredCards.size === flashcardsLength;

  // Handle automatic progression
  useEffect(() => {
    let timer;
    if (isAutoplay && !userInteraction) {
      if (!showAnswer) {
        // Show question for questionDelay
        timer = setTimeout(() => {
          setShowAnswer(true);
        }, questionDelay);
      } else if (!isCurrentCardAnswered && !waitingForResponse) {
        // Show answer and wait for user response
        setWaitingForResponse(true);
      } else if (isCurrentCardAnswered) {
        // After user has responded, wait briefly then move to next card
        timer = setTimeout(() => {
          if (currentFlashcardIndex < flashcardsLength - 1) {
            setCurrentFlashcardIndex(currentFlashcardIndex + 1);
            setShowAnswer(false);
            startTimeRef.current = Date.now();
          }
        }, 1000); // 1 second delay before next card
      }
    }
    return () => clearTimeout(timer);
  }, [
    isAutoplay,
    showAnswer,
    currentFlashcardIndex,
    isCurrentCardAnswered,
    flashcardsLength,
    setCurrentFlashcardIndex,
    setShowAnswer,
    startTimeRef,
    questionDelay,
    answerDelay,
    userInteraction,
    waitingForResponse,
  ]);

  // Reset user interaction and waiting state when card changes
  useEffect(() => {
    setUserInteraction(false);
    setWaitingForResponse(false);
  }, [currentFlashcardIndex]);

  const handleAutoplayToggle = () => {
    setIsAutoplay(!isAutoplay);
    setUserInteraction(false);
    setWaitingForResponse(false);
  };

  const handleManualFlip = () => {
    setUserInteraction(true);
    setShowAnswer(!showAnswer);
  };

  const handleResponse = (wasCorrect) => {
    setUserInteraction(true);
    setWaitingForResponse(false);
    handleFlashcardResponse(wasCorrect);
    // If in autoplay mode, allow the effect to handle the transition
    if (isAutoplay) {
      setUserInteraction(false);
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 2,
          mb: allCardsAnswered ? 2 : 0,
        }}
      >
        {!showAnswer ? (
          <Button
            variant="contained"
            size="large"
            onClick={handleManualFlip}
            startIcon={<Rotate3D size={20} />}
            sx={{
              minWidth: 200,
              py: 1.5,
            }}
          >
            Show Answer
          </Button>
        ) : (
          <>
            {!isCurrentCardAnswered ? (
              <>
                <Tooltip title="Press Left Arrow or 0">
                  <Button
                    variant="contained"
                    size="large"
                    color="error"
                    onClick={() => handleResponse(false)}
                    startIcon={<ThumbsDown size={20} />}
                    sx={{
                      minWidth: 160,
                      py: 1.5,
                    }}
                  >
                    Incorrect
                  </Button>
                </Tooltip>
                <Tooltip title="Press Right Arrow or 1">
                  <Button
                    variant="contained"
                    size="large"
                    color="success"
                    onClick={() => handleResponse(true)}
                    startIcon={<ThumbsUp size={20} />}
                    sx={{
                      minWidth: 160,
                      py: 1.5,
                    }}
                  >
                    Correct
                  </Button>
                </Tooltip>
              </>
            ) : (
              <Button
                variant="contained"
                size="large"
                onClick={handleManualFlip}
                startIcon={<Rotate3D size={20} />}
                sx={{
                  minWidth: 200,
                  py: 1.5,
                }}
              >
                Show Question
              </Button>
            )}
          </>
        )}
      </Box>

      {allCardsAnswered && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleFinishSession}
            startIcon={<CheckCircle size={20} />}
            sx={{
              minWidth: 200,
              py: 1.5,
            }}
          >
            Finish Study Session
          </Button>
        </Box>
      )}

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          mt: 4,
        }}
      >
        <Box sx={{ display: "flex", gap: 2 }}>
          <Tooltip title="Previous Card (Left Arrow)">
            <span>
              <IconButton
                onClick={() => {
                  setUserInteraction(true);
                  if (currentFlashcardIndex > 0) {
                    setCurrentFlashcardIndex(currentFlashcardIndex - 1);
                    setShowAnswer(false);
                    startTimeRef.current = Date.now();
                  }
                }}
                disabled={currentFlashcardIndex === 0}
                sx={{
                  bgcolor: "background.paper",
                  boxShadow: 1,
                  "&:hover": { bgcolor: "action.hover" },
                  "&.Mui-disabled": { opacity: 0.5 },
                }}
              >
                <ArrowLeft size={24} />
              </IconButton>
            </span>
          </Tooltip>

          <Tooltip title={isAutoplay ? "Pause Autoplay" : "Enable Autoplay"}>
            <IconButton
              onClick={handleAutoplayToggle}
              sx={{
                bgcolor: "background.paper",
                boxShadow: 1,
                color: isAutoplay ? "primary.main" : "text.secondary",
                "&:hover": {
                  bgcolor: "action.hover",
                  color: "primary.main",
                },
              }}
            >
              {isAutoplay ? <Pause size={24} /> : <Play size={24} />}
            </IconButton>
          </Tooltip>
        </Box>

        <Tooltip title="Next Card (Right Arrow)">
          <span>
            <IconButton
              onClick={() => {
                setUserInteraction(true);
                if (currentFlashcardIndex < flashcardsLength - 1) {
                  setCurrentFlashcardIndex(currentFlashcardIndex + 1);
                  setShowAnswer(false);
                  startTimeRef.current = Date.now();
                }
              }}
              disabled={currentFlashcardIndex === flashcardsLength - 1}
              sx={{
                bgcolor: "background.paper",
                boxShadow: 1,
                "&:hover": { bgcolor: "action.hover" },
                "&.Mui-disabled": { opacity: 0.5 },
              }}
            >
              <ArrowLeft size={24} style={{ transform: "rotate(180deg)" }} />
            </IconButton>
          </span>
        </Tooltip>
      </Box>
    </Box>
  );
};

export default StudyActions;

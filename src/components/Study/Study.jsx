"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import NavBar from "../NavBar";
import {
  Box,
  Container,
  Typography,
  CircularProgress,
  Pagination,
  Skeleton,
  Grid,
  Grid2,
  Card,
  CardContent,
} from "@mui/material";
import StatsOverview from "./StatsOverview";
import DecksList from "./DecksList";
import WeeklyGoalDialog from "./WeeklyGoalDialog";
import NotificationSnackbar from "./NotificationSnackbar";
import { fetchDecks } from "../../utils/deckApi";

const Study = () => {
  const { user, isAuthenticated, loading } = useUser();
  const navigate = useNavigate();
  const [decks, setDecks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const decksPerPage = 6;
  const [userStats, setUserStats] = useState({
    weekly_goal: 50,
    mastery_level: 0,
    study_streak: 0,
    retention_rate: 0,
    cards_mastered: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [goalDialogOpen, setGoalDialogOpen] = useState(false);
  const [newWeeklyGoal, setNewWeeklyGoal] = useState(50);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/login");
    }
  }, [loading, isAuthenticated, navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchDecksData();
      fetchUserStats();
    }
  }, [isAuthenticated, currentPage]);

  const fetchDecksData = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const { decks, pagination } = await fetchDecks(
        token,
        currentPage,
        decksPerPage
      );
      setDecks(Array.isArray(decks) ? decks : []);
      setTotalPages(pagination.total_pages);
      setTotalItems(pagination.total_items);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching decks:", error);
      setSnackbar({
        open: true,
        message: "Failed to load decks",
        severity: "error",
      });
    }
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    setIsLoading(true);
  };

  const fetchUserStats = async () => {
    try {
      const response = await fetch(
        "https://flashlearn-backend-ityf.onrender.com/dashboard",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setUserStats({
          weekly_goal: data.weekly_goal || 50,
          mastery_level: data.mastery_level || 0,
          study_streak: data.study_streak || 0,
          retention_rate: data.retention_rate || 0,
          cards_mastered: data.cards_mastered || 0,
        });
        setNewWeeklyGoal(data.weekly_goal || 50);
      } else {
        console.error("Failed to fetch user stats");
      }
    } catch (error) {
      console.error("Error fetching user stats:", error);
    }
  };

  const updateWeeklyGoal = async () => {
    try {
      const response = await fetch(
        "https://flashlearn-backend-ityf.onrender.com/user/stats",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          body: JSON.stringify({
            weekly_goal: newWeeklyGoal,
          }),
        }
      );

      if (response.ok) {
        setUserStats({
          ...userStats,
          weekly_goal: newWeeklyGoal,
        });
        setGoalDialogOpen(false);
        setSnackbar({
          open: true,
          message: "Weekly goal updated successfully!",
          severity: "success",
        });
      } else {
        setSnackbar({
          open: true,
          message: "Failed to update weekly goal",
          severity: "error",
        });
      }
    } catch (error) {
      console.error("Error updating weekly goal:", error);
      setSnackbar({
        open: true,
        message: "Error updating weekly goal",
        severity: "error",
      });
    }
  };

  const handleDeckClick = (deckId) => {
    navigate(`/study/${deckId}`);
  };
  if (loading || isLoading) {
    return (
      <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
        <NavBar />
        <Container maxWidth="xl" sx={{ py: 4 }}>
          {/* Title Skeleton - Matches your h4 styling */}
          <Skeleton
            variant="text"
            width={300}
            height={48}
            sx={{
              mb: 4,
              fontSize: "2.125rem",
              lineHeight: 1.235,
              fontWeight: "bold",
            }}
          />

          {/* Stats Overview Skeleton - Matches your 3-column layout */}
          <Box
            sx={{
              mb: 4,
              p: 3,
              borderRadius: 2,
              bgcolor: "background.paper",
              border: 1,
              borderColor: "divider",
            }}
          >
            <Grid container spacing={3}>
              {[...Array(3)].map((_, i) => (
                <Grid item xs={12} md={4} key={i}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Skeleton
                      variant="circular"
                      width={48}
                      height={48}
                      sx={{
                        bgcolor:
                          i === 0
                            ? "primary.light"
                            : i === 1
                            ? "secondary.light"
                            : "primary.light",
                      }}
                    />
                    <Box sx={{ flexGrow: 1 }}>
                      <Skeleton
                        variant="text"
                        width="60%"
                        height={24}
                        sx={{ mb: 0.5 }}
                      />
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Skeleton variant="text" width="40%" height={32} />
                        {i === 0 && (
                          <Skeleton
                            variant="rectangular"
                            width={80}
                            height={32}
                            sx={{ borderRadius: 1 }}
                          />
                        )}
                      </Box>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Decks Title Skeleton - Matches your h5 styling */}
          <Skeleton
            variant="text"
            width={200}
            height={36}
            sx={{
              mb: 3,
              fontSize: "1.5rem",
              lineHeight: 1.334,
              fontWeight: "bold",
            }}
          />

          {/* Decks List Skeleton - Matches your card layout exactly */}
          <Grid container spacing={3}>
            {[...Array(6)].map((_, i) => (
              <Grid item xs={12} sm={6} md={4} key={i}>
                <Card
                  sx={{
                    borderRadius: 3,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <CardContent
                    sx={{
                      p: 0,
                      flexGrow: 1,
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    {/* Header */}
                    <Box sx={{ p: 3, borderBottom: 1, borderColor: "divider" }}>
                      <Skeleton variant="text" width="80%" height={32} />
                    </Box>

                    {/* Body */}
                    <Box sx={{ p: 3, flexGrow: 1 }}>
                      <Skeleton
                        variant="text"
                        width="100%"
                        height={20}
                        sx={{ mb: 1 }}
                      />
                      <Skeleton
                        variant="text"
                        width="90%"
                        height={20}
                        sx={{ mb: 2 }}
                      />
                      <Skeleton
                        variant="rectangular"
                        width={80}
                        height={32}
                        sx={{ borderRadius: 16 }}
                      />
                    </Box>

                    {/* Footer */}
                    <Box sx={{ p: 2, borderTop: 1, borderColor: "divider" }}>
                      <Skeleton
                        variant="rectangular"
                        height={40}
                        sx={{ borderRadius: 2 }}
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Pagination Skeleton */}
          {totalPages > 1 && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                mt: { xs: 3, sm: 4 },
                mb: { xs: 2, sm: 3 },
              }}
            >
              <Skeleton
                variant="rectangular"
                width={300}
                height={40}
                sx={{
                  borderRadius: 2,
                  "& .MuiPaginationItem-root": {
                    color: "text.primary",
                  },
                }}
              />
            </Box>
          )}
        </Container>
      </Box>
    );
  }

  return (
    <>
      <NavBar />
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{ mb: 4, fontWeight: "bold" }}
        >
          Study Dashboard
        </Typography>
        <StatsOverview
          userStats={userStats}
          onUpdateGoalClick={() => setGoalDialogOpen(true)}
          isLoading={loading || isLoading}
        />
        <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold" }}>
          Your Decks
        </Typography>

        <DecksList
          decks={decks}
          onDeckClick={handleDeckClick}
          onCreateDeckClick={() => navigate("/mydecks")}
          isLoading={loading || isLoading}
        />

        {totalPages > 1 && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mt: { xs: 3, sm: 4 },
              mb: { xs: 2, sm: 3 },
            }}
          >
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
              size="medium"
              sx={{
                "& .MuiPaginationItem-root": {
                  color: "text.primary",
                  "&.Mui-selected": {
                    bgcolor: "primary.main",
                    color: "primary.contrastText",
                    "&:hover": {
                      bgcolor: "primary.dark",
                    },
                  },
                },
              }}
            />
          </Box>
        )}

        <WeeklyGoalDialog
          open={goalDialogOpen}
          onClose={() => setGoalDialogOpen(false)}
          weeklyGoal={newWeeklyGoal}
          onWeeklyGoalChange={(newValue) => setNewWeeklyGoal(newValue)}
          onSave={updateWeeklyGoal}
        />
        <NotificationSnackbar
          open={snackbar.open}
          message={snackbar.message}
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        />
      </Container>
    </>
  );
};

export default Study;

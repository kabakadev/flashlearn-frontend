"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "./context/UserContext";
import {
  Box,
  Container,
  Grid,
  useTheme,
  CircularProgress,
  useMediaQuery,
  Skeleton,
  Card,
  CardContent,
} from "@mui/material";
import NavBar from "./NavBar";

import WelcomeSection from "./Dashboard/WelcomeSection";
import ProgressCard from "./Dashboard/ProgressCard";
import QuickStudyCard from "./Dashboard/QuickStudyCard";
import LearningTipsCard from "./Dashboard/LeadingTipsCard";
import { calculateStudyStreak, getDeckStats } from "../utils/dashBoardutil";
import DecksSection from "./Dashboard/DeckSection";
import { fetchDecks } from "../utils/deckApi";

const Dashboard = () => {
  const { user, isAuthenticated, loading } = useUser();
  const navigate = useNavigate();
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [decks, setDecks] = useState([]);
  const [progress, setProgress] = useState([]);
  const [stats, setStats] = useState({
    total_flashcards_studied: 0,
    weekly_goal: 0,
    study_streak: 0,
    mastery_level: 0,
    cards_mastered: 0,
    retention_rate: 0,
    average_study_time: 0,
  });
  const API_URL = "https://flashlearn-backend-ityf.onrender.com";
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/login");
    }
  }, [loading, isAuthenticated, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      setIsLoading(true);
      try {
        const token = localStorage.getItem("authToken");
        const [decksData, progressData, userStats] = await Promise.all([
          fetchDecksData(token),
          fetchProgress(token),
          fetchUserStats(token),
        ]);
        setDecks(decksData);
        setProgress(progressData);
        calculateStats(progressData, userStats.weekly_goal);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false); // Set loading to false when done
      }
    };

    fetchData();
  }, [user]);

  const fetchUserStats = async (token) => {
    try {
      const response = await fetch(`${API_URL}/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        return {
          weekly_goal: data.weekly_goal || 0,
          mastery_level: data.mastery_level || 0,
          study_streak: data.study_streak || 0,
          focus_score: data.focus_score || 0,
          retention_rate: data.retention_rate || 0,
          cards_mastered: data.cards_mastered || 0,
          minutes_per_day: data.minutes_per_day || 0,
          accuracy: data.accuracy || 0,
        };
      }

      throw new Error("Failed to fetch dashboard data");
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      return {
        weekly_goal: 0,
        mastery_level: 0,
        study_streak: 0,
        focus_score: 0,
        retention_rate: 0,
        cards_mastered: 0,
        minutes_per_day: 0,
        accuracy: 0,
      };
    }
  };

  const fetchDecksData = async (token) => {
    try {
      const { decks, pagination } = await fetchDecks(token, 1, 10); // Fetch first page with 10 decks
      return decks;
    } catch (error) {
      console.error("Error fetching decks:", error);
      return [];
    }
  };

  const fetchProgress = async (token) => {
    const response = await fetch(`${API_URL}/progress`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Failed to fetch progress");
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  };

  const calculateStats = (progressData, weekly_goal) => {
    //Ensure progressData is an array
    const safeProgressData = Array.isArray(progressData) ? progressData : [];
    const totalAttempts = progressData.reduce(
      (sum, p) => sum + (p.study_count || 0),
      0
    );
    const totalCorrect = progressData.reduce(
      (sum, p) => sum + (p.correct_attempts || 0),
      0
    );
    const totalStudyTime = progressData.reduce(
      (sum, p) => sum + (p.total_study_time || 0),
      0
    );
    const cardsLearned = safeProgressData.filter((p) => p.is_learned).length;
    const cardsStudiedThisWeek = getCardsStudiedThisWeek(progressData);
    const streak = calculateStudyStreak(safeProgressData);
    const averageStudyTime = calculateAverageStudyTime(
      safeProgressData,
      totalStudyTime
    );

    setStats({
      total_flashcards_studied: cardsStudiedThisWeek || 0,
      weekly_goal: weekly_goal || 0,
      study_streak: streak || 0,
      mastery_level:
        totalAttempts > 0
          ? Math.round((totalCorrect / totalAttempts) * 100)
          : 0,
      cards_mastered: cardsLearned || 0,
      retention_rate:
        totalAttempts > 0
          ? Math.round((totalCorrect / totalAttempts) * 100)
          : 0,
      average_study_time: averageStudyTime || 0,
    });
  };

  const getCardsStudiedThisWeek = (progressData) => {
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    startOfWeek.setHours(0, 0, 0, 0);
    return progressData.filter(
      (p) => new Date(p.last_studied_at) >= startOfWeek
    ).length;
  };

  const calculateAverageStudyTime = (progressData, totalStudyTime) => {
    const uniqueDays = new Set(
      progressData
        .map((p) => p.last_studied_at)
        .filter((date) => date)
        .map((date) => new Date(date).toDateString())
    ).size;
    return uniqueDays > 0 ? Math.round(totalStudyTime / uniqueDays) : 0;
  };

  if (loading || isLoading) {
    return (
      <Box sx={{ bgcolor: "background.default", minHeight: "100vh", pb: 8 }}>
        <NavBar />
        <Container
          maxWidth="xl"
          sx={{
            mt: { xs: 2, sm: 3, md: 4 },
            px: { xs: 2, sm: 3, md: 4 },
          }}
        >
          {/* Welcome Section Skeleton */}
          <Box sx={{ mb: 4 }}>
            <Skeleton
              variant="text"
              width={300}
              height={48}
              sx={{
                fontSize: "2.125rem",
                lineHeight: 1.235,
                fontWeight: "bold",
              }}
            />
            <Skeleton
              variant="text"
              width={200}
              height={32}
              sx={{
                fontSize: "1.5rem",
                lineHeight: 1.334,
              }}
            />
          </Box>

          <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
            {/* Main Content (Left Side) */}
            <Grid item xs={12} md={8} order={{ xs: 2, md: 1 }}>
              {/* Progress Card Skeleton */}
              <Card
                sx={{
                  borderRadius: { xs: 2, sm: 3 },
                  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                  mb: { xs: 3, sm: 4 },
                  overflow: "hidden",
                }}
              >
                <CardContent sx={{ p: 0 }}>
                  {/* Header */}
                  <Box
                    sx={{
                      p: { xs: 2, sm: 3 },
                      borderBottom: 1,
                      borderColor: "divider",
                    }}
                  >
                    <Skeleton
                      variant="text"
                      width="40%"
                      height={30}
                      sx={{
                        fontSize: isMobile ? "1rem" : "1.25rem",
                        fontWeight: "bold",
                      }}
                    />
                  </Box>

                  {/* Progress Content */}
                  <Box sx={{ p: { xs: 2, sm: 3 } }}>
                    {/* Weekly Goal Progress */}
                    <Box sx={{ mb: { xs: 3, sm: 4 } }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mb: 1,
                        }}
                      >
                        <Skeleton variant="text" width="30%" height={24} />
                        <Skeleton variant="text" width="20%" height={24} />
                      </Box>
                      <Skeleton
                        variant="rectangular"
                        height={8}
                        sx={{ borderRadius: 4 }}
                      />
                      <Skeleton
                        variant="text"
                        width="20%"
                        height={20}
                        sx={{ mt: 1 }}
                      />
                    </Box>

                    {/* Stats Grid */}
                    <Grid container spacing={{ xs: 1.5, sm: 2 }}>
                      {[
                        "Cards Mastered",
                        "Retention Rate",
                        "Avg. Study Time",
                        "Mastery Level",
                      ].map((label, i) => (
                        <Grid item xs={6} sm={6} md={3} key={i}>
                          <Box sx={{ textAlign: "center" }}>
                            <Skeleton
                              variant="text"
                              width="60%"
                              height={24}
                              sx={{ mx: "auto" }}
                            />
                            <Skeleton
                              variant="text"
                              width="40%"
                              height={32}
                              sx={{ mx: "auto", fontWeight: "bold" }}
                            />
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                </CardContent>
              </Card>

              {/* Decks Section Skeleton */}
              <Box sx={{ mt: { xs: 2, sm: 3, md: 4 } }}>
                <Skeleton
                  variant="text"
                  width="30%"
                  height={40}
                  sx={{
                    fontSize: isMobile ? "1.25rem" : "1.5rem",
                    fontWeight: "bold",
                  }}
                />
                <Box sx={{ mt: 2 }}>
                  {[...Array(3)].map((_, i) => (
                    <Card
                      key={i}
                      sx={{
                        borderRadius: { xs: 2, sm: 3 },
                        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                        mb: 2,
                        overflow: "hidden",
                      }}
                    >
                      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                        <Skeleton variant="text" width="80%" height={28} />
                        <Box sx={{ display: "flex", gap: 1, mt: 1.5 }}>
                          <Skeleton variant="text" width="30%" height={24} />
                          <Skeleton variant="text" width="30%" height={24} />
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              </Box>
            </Grid>

            {/* Sidebar (Right Side) */}
            <Grid item xs={12} md={4} order={{ xs: 1, md: 2 }}>
              {/* Quick Study Skeleton */}
              <Card
                sx={{
                  borderRadius: { xs: 2, sm: 3 },
                  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                  overflow: "hidden",
                }}
              >
                <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                  <Skeleton
                    variant="text"
                    width="50%"
                    height={30}
                    sx={{ mb: 2 }}
                  />
                  <Skeleton
                    variant="rectangular"
                    height={100}
                    sx={{ borderRadius: 2 }}
                  />
                  <Skeleton
                    variant="text"
                    width="80%"
                    height={24}
                    sx={{ mt: 2, mx: "auto" }}
                  />
                </CardContent>
              </Card>

              {/* Learning Tips Skeleton */}
              <Box sx={{ mt: { xs: 2, sm: 3, md: 4 } }}>
                <Card
                  sx={{
                    borderRadius: { xs: 2, sm: 3 },
                    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                    overflow: "hidden",
                  }}
                >
                  <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                    <Skeleton
                      variant="text"
                      width="50%"
                      height={30}
                      sx={{ mb: 2 }}
                    />
                    {[...Array(3)].map((_, i) => (
                      <Skeleton
                        key={i}
                        variant="text"
                        width="100%"
                        height={20}
                        sx={{ mb: 1 }}
                      />
                    ))}
                  </CardContent>
                </Card>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh", pb: 8 }}>
      <NavBar />
      <Container
        maxWidth="xl"
        sx={{
          mt: { xs: 2, sm: 3, md: 4 },
          px: { xs: 2, sm: 3, md: 4 },
        }}
      >
        <WelcomeSection username={user?.username} />
        <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
          {/* Main content - takes full width on mobile, 8/12 on larger screens */}
          <Grid item xs={12} md={8} order={{ xs: 2, md: 1 }}>
            <ProgressCard stats={stats} theme={theme} isDarkMode={isDarkMode} />
            <DecksSection
              decks={decks}
              getDeckStats={(deckId) => getDeckStats(deckId, progress)}
              navigate={navigate}
              theme={theme}
              isLoading={isLoading}
            />
          </Grid>

          {/* Sidebar content - takes full width on mobile, 4/12 on larger screens */}
          <Grid item xs={12} md={4} order={{ xs: 1, md: 2 }}>
            <QuickStudyCard />
            <Box sx={{ mt: { xs: 2, sm: 3, md: 4 } }}>
              <LearningTipsCard />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Dashboard;

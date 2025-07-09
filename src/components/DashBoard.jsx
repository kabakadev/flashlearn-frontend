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

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/login");
    }
  }, [loading, isAuthenticated, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      try {
        const token = localStorage.getItem("authToken");
        const decksData = await fetchDecksData(token);
        const progressData = await fetchProgress(token);
        const userStats = await fetchUserStats(token);
        setDecks(decksData);
        setProgress(progressData);
        calculateStats(progressData, userStats.weekly_goal);
      } catch (error) {
        console.error("Error fetching data:", error);
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

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
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

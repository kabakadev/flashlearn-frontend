"use client";

import { motion } from "framer-motion";
import {
  GraduationCap,
  Target,
  Clock,
  BookOpen,
  Brain,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { Link as RouterLink } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  Grid,
  Card,
  CardContent,
  useTheme,
  Divider,
} from "@mui/material";
import ThemeToggle from "./ThemeComponents/ThemeToggle";
import FlashCard from "./HomepageComponents/FlashCard";
import ProgressStats from "./HomepageComponents/ProgressStats";
import FeatureCard from "./HomepageComponents/FeatureCard";

const features = [
  {
    Icon: GraduationCap,
    title: "Build decks effortlessly",
    description:
      "Create custom flashcard decks with our intuitive interface. Import content or start from scratch.",
  },
  {
    Icon: Target,
    title: "Track your Study progress",
    description:
      "Monitor your learning journey with detailed analytics and progress tracking.",
  },
  {
    Icon: Clock,
    title: "Review at the perfect time",
    description:
      "Our spaced repetition system ensures you review cards at optimal intervals.",
  },
  {
    Icon: BookOpen,
    title: "Smart Learning Paths",
    description:
      "Follow structured learning paths designed to maximize your retention and understanding.",
  },
  {
    Icon: Brain,
    title: "Memory Techniques",
    description:
      "Learn and apply proven memory techniques to enhance your study sessions.",
  },
  {
    Icon: Sparkles,
    title: "Personalized Insights",
    description:
      "Get personalized recommendations based on your learning patterns and progress.",
  },
];

export default function Homepage() {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  return (
    <Box
      sx={{
        bgcolor: "background.default",
        minHeight: "100vh",
        transition: "background-color 0.3s ease",
      }}
    >
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: "background.nav",
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Toolbar>
          <Typography
            variant="h5"
            component="h1"
            sx={{ flexGrow: 1, fontWeight: "bold", color: "text.primary" }}
          >
            Flashlearn
          </Typography>
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <ThemeToggle />
            <Button
              variant="contained"
              component={RouterLink}
              to="/signup"
              sx={{
                bgcolor: "primary.main",
                color: "primary.contrastText",
                "&:hover": {
                  bgcolor: "primary.dark",
                },
              }}
              
            >
              Get Started
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ mb: 10 }}>
          <Typography
            variant="h3"
            component="h2"
            align="center"
            sx={{
              mb: 2,
              fontWeight: "bold",
              color: "text.primary",
            }}
          >
            Features Designed for Effective Learning
          </Typography>
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <FeatureCard {...feature} />
              </Grid>
            ))}
          </Grid>
        </Box>

        <Divider sx={{ my: 8 }} />
        <ProgressStats />
        <Divider sx={{ my: 8 }} />
      </Container>

      <Box
        component="footer"
        sx={{
          py: 6,
          bgcolor: isDarkMode ? "background.paper" : "background.nav",
          borderTop: 1,
          borderColor: "divider",
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
                Flashlearn
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                The smart way to learn anything. Create, study, and master any
                subject with our powerful flashcard platform.
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Box sx={{ textAlign: "center", py: 3 }}>
        <Typography variant="body2" color="text.secondary">
          © {new Date().getFullYear()} Flashlearn. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
}

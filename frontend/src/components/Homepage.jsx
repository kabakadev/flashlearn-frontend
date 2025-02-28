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
import FeatureCard from "./HomepageComponents/FeatureCard";
import ProgressStats from "./HomepageComponents/ProgressStats";

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
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
      <AppBar position="sticky" elevation={0} sx={{ bgcolor: "background.paper", borderBottom: 1, borderColor: "divider" }}>
        <Toolbar>
          <Typography variant="h5" sx={{ flexGrow: 1, fontWeight: "bold", color: "text.primary" }}>
            Flashlearn
          </Typography>
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <ThemeToggle />
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="outlined" component={RouterLink} to="/login">
                Sign In
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="contained" component={RouterLink} to="/signup">
                Get Started
              </Button>
            </motion.div>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box sx={{ py: 10, bgcolor: isDarkMode ? "background.default" : "background.paper" }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
                <Typography variant="h2" sx={{ mb: 2, fontWeight: 800, color: "text.primary" }}>
                  Master Any Subject with Smart Flashcards
                </Typography>
                <Typography variant="h6" sx={{ mb: 4, color: "text.secondary" }}>
                  Create personalized decks, track your progress, and optimize your learning with spaced repetition.
                </Typography>
                <Box sx={{ display: "flex", gap: 2 }}>
                  <Button variant="contained" size="large" component={RouterLink} to="/signup" endIcon={<ArrowRight />}>
                    Start learning for free
                  </Button>
                  <Button variant="outlined" size="large">
                    How it works
                  </Button>
                </Box>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={6}>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
                <Box
                  component="img"
                  src="https://images.unsplash.com/photo-1625750331870-624de6fd3452?w=500&auto=format&fit=crop&q=60"
                  alt="Chess king representing mastery"
                  sx={{ width: "100%", height: "400px", objectFit: "cover", borderRadius: 4 }}
                />
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ mb: 10 }}>
          <Typography variant="h3" align="center" sx={{ mb: 2, fontWeight: "bold", color: "text.primary" }}>
            Features Designed for Effective Learning
          </Typography>
          <Typography variant="h6" align="center" sx={{ mb: 6, color: "text.secondary", maxWidth: "800px", mx: "auto" }}>
            Our platform combines proven learning techniques with modern technology to help you learn faster and remember longer.
          </Typography>

          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <FeatureCard {...feature} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>

      {/* Progress Stats Section */}
      <Container maxWidth="lg">
        <Box sx={{ mb: 10 }}>
          <Typography variant="h3" align="center" sx={{ mb: 2, fontWeight: "bold", color: "text.primary" }}>
            Track Your Learning Progress
          </Typography>
          <Typography variant="h6" align="center" sx={{ mb: 6, color: "text.secondary", maxWidth: "800px", mx: "auto" }}>
            Visualize your learning journey with detailed analytics and progress tracking to stay motivated.
          </Typography>

          <ProgressStats />
        </Box>
      </Container>

      {/* Footer */}
      <Box component="footer" sx={{ py: 6, bgcolor: isDarkMode ? "background.paper" : "background.default", borderTop: 1, borderColor: "divider" }}>
        <Container maxWidth="lg">
          <Typography variant="h5" sx={{ fontWeight: "bold", color: "text.primary" }}>
            Flashlearn
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            The smart way to learn anything. Create, study, and master any subject with our powerful flashcard platform.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}

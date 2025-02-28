"use client";

import { motion } from "framer-motion";
import { Brain, Trophy, Clock, Target } from "lucide-react";
import { Card, CardContent, Typography, useTheme, Grid, Box } from "@mui/material";
import { CircularProgress } from "./CircularProgress";

const stats = [
  { icon: Brain, value: 85, label: "Retention Rate", description: "Average memory retention" },
  { icon: Trophy, value: 120, label: "Cards Mastered", description: "Successfully learned" },
  { icon: Clock, value: 15, label: "Minutes/Day", description: "Average study time" },
  { icon: Target, value: 92, label: "Accuracy", description: "Correct answers" },
];

const progressData = [
  { value: 85, label: "Weekly Goal" },
  { value: 92, label: "Mastery Level" },
  { value: 78, label: "Study Streak" },
  { value: 95, label: "Focus Score" },
];

export default function ProgressStats() {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  return (
    <Box sx={{ maxWidth: "1200px", mx: "auto", px: 2 }}>
      <Grid container spacing={4}>
        {/* Circular Progress Section */}
        <Grid item xs={12} md={6}>
          <AnimatedCard>
            <Grid container spacing={4}>
              {progressData.map((item, i) => (
                <Grid item xs={6} key={i}>
                  <CircularProgress percentage={item.value} label={item.label} />
                </Grid>
              ))}
            </Grid>
          </AnimatedCard>
        </Grid>

        {/* Stats Cards */}
        <Grid item xs={12} md={6}>
          <Grid container spacing={3}>
            {stats.map((stat, index) => (
              <Grid item xs={6} key={index}>
                <AnimatedCard delay={index * 0.1}>
                  <StatCard stat={stat} isDarkMode={isDarkMode} />
                </AnimatedCard>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}

function AnimatedCard({ children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
    >
      <Card
        sx={{
          height: "100%",
          bgcolor: "background.paper",
          borderRadius: "16px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          transition: "all 0.3s ease",
          "&:hover": { boxShadow: "0 8px 24px rgba(0,0,0,0.12)" },
        }}
      >
        <CardContent sx={{ p: 3 }}>{children}</CardContent>
      </Card>
    </motion.div>
  );
}

function StatCard({ stat, isDarkMode }) {
  const theme = useTheme();
  return (
    <>
      <Box
        sx={{
          backgroundColor: isDarkMode ? "rgba(124, 58, 237, 0.15)" : "rgba(124, 58, 237, 0.08)",
          padding: "12px",
          borderRadius: "12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "48px",
          height: "48px",
          mb: 2,
          boxShadow: isDarkMode ? "none" : "0 4px 8px rgba(124, 58, 237, 0.1)",
        }}
      >
        <stat.icon style={{ color: theme.palette.primary.main, strokeWidth: 2.5 }} />
      </Box>
      <Typography variant="h4" sx={{ color: "text.primary", mb: 1, fontWeight: "bold" }}>
        {stat.value}
        {stat.label.includes("Rate") || stat.label.includes("Accuracy") ? "%" : ""}
      </Typography>
      <Typography variant="subtitle1" sx={{ color: "text.primary", mb: 0.5, fontWeight: "medium" }}>
        {stat.label}
      </Typography>
      <Typography variant="body2" sx={{ color: "text.secondary" }}>
        {stat.description}
      </Typography>
    </>
  );
}

"use client";

import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import { motion } from "framer-motion";

const WelcomeSection = ({ username }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box
        sx={{
          mb: { xs: 2, sm: 3, md: 4 },
          px: { xs: 1, sm: 0 },
        }}
      >
        <Typography
          variant={isMobile ? "h5" : "h4"}
          sx={{
            fontWeight: "bold",
            color: "text.primary",
            mb: { xs: 0.5, sm: 1 },
            lineHeight: 1.3,
          }}
        >
          Welcome back, {username || "Learner"}!
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: "text.secondary",
            fontSize: { xs: "0.9rem", sm: "1rem" },
          }}
        >
          Track your progress, review your decks, and continue your learning
          journey.
        </Typography>
      </Box>
    </motion.div>
  );
};

export default WelcomeSection;

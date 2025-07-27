"use client";

import {
  Box,
  Button,
  Grid,
  Typography,
  Card,
  useMediaQuery,
} from "@mui/material";
import { BookOpen, Plus } from "lucide-react";
import { Link as RouterLink } from "react-router-dom";
import DeckCard from "./DeckCard";
import { motion } from "framer-motion";

const DecksSection = ({ decks, getDeckStats, navigate, theme }) => {
  console.log("Decks data:", decks);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <Box
        sx={{
          mb: { xs: 2, sm: 2, md: 3 },
          display: "flex",
          justifyContent: "space-between",
          alignItems: { xs: isMobile ? "flex-start" : "center", sm: "center" },
          flexDirection: { xs: isMobile ? "column" : "row", sm: "row" },
          gap: { xs: isMobile ? 1.5 : 0, sm: 0 },
        }}
      >
        <Typography
          variant={isMobile ? "h6" : "h5"}
          sx={{
            fontWeight: "bold",
            color: "text.primary",
            display: "flex",
            alignItems: "center",
            gap: 1,
            mb: { xs: isMobile ? 1 : 0, sm: 0 },
          }}
        >
          <BookOpen size={isMobile ? 20 : 24} />
          Recent Decks
        </Typography>
        <Button
          variant="contained"
          startIcon={<Plus size={isMobile ? 16 : 18} />}
          component={RouterLink}
          to="/mydecks"
          size={isMobile ? "small" : "medium"}
          sx={{
            bgcolor: "primary.main",
            color: "primary.contrastText",
            "&:hover": {
              bgcolor: "primary.dark",
            },
            borderRadius: { xs: 1.5, sm: 2 },
            alignSelf: { xs: isMobile ? "flex-start" : "auto", sm: "auto" },
          }}
        >
          Create Deck
        </Button>
      </Box>

      <Grid container spacing={{ xs: 1.5, sm: 3 }}>
        {decks.length > 0 ? (
          decks.slice(0, 4).map((deck) => {
            const deckStats = getDeckStats(deck.id);
            return (
              <Grid item xs={6} sm={6} key={deck.id}>
                <motion.div variants={itemVariants}>
                  <DeckCard
                    deck={deck}
                    deckStats={deckStats}
                    theme={theme}
                    navigate={navigate}
                    isMobile={isMobile}
                  />
                </motion.div>
              </Grid>
            );
          })
        ) : (
          <Grid item xs={12}>
            <Card
              sx={{
                borderRadius: { xs: 2, sm: 3 },
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                p: { xs: 3, sm: 4 },
                textAlign: "center",
              }}
            >
              <Typography
                variant={isMobile ? "subtitle1" : "h6"}
                sx={{
                  color: "text.secondary",
                  mb: { xs: 1.5, sm: 2 },
                }}
              >
                You don't have any decks yet
              </Typography>
              <Button
                variant="contained"
                startIcon={<Plus size={isMobile ? 16 : 18} />}
                component={RouterLink}
                to="/mydecks"
                size={isMobile ? "small" : "medium"}
                sx={{
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                  "&:hover": {
                    bgcolor: "primary.dark",
                  },
                  borderRadius: { xs: 1.5, sm: 2 },
                }}
              >
                Create Your First Deck
              </Button>
            </Card>
          </Grid>
        )}
      </Grid>

      {decks.length > 4 && (
        <Box sx={{ mt: { xs: 2, sm: 3 }, textAlign: "center" }}>
          <Button
            variant="outlined"
            component={RouterLink}
            to="/mydecks"
            size={isMobile ? "small" : "medium"}
            sx={{
              borderColor: "primary.main",
              color: "primary.main",
              "&:hover": {
                borderColor: "primary.dark",
                bgcolor: "rgba(124, 58, 237, 0.04)",
              },
              borderRadius: { xs: 1.5, sm: 2 },
            }}
          >
            View All Decks
          </Button>
        </Box>
      )}
    </motion.div>
  );
};

export default DecksSection;

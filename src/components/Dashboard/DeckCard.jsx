"use client";

import {
  Box,
  Button,
  Card,
  CardContent,
  LinearProgress,
  Typography,
} from "@mui/material";
import { PlayCircle } from "lucide-react";
import { motion } from "framer-motion";
import { getRelativeTime } from "../../utils/dashBoardutil";

const DeckCard = ({ deck, deckStats, theme, navigate, isMobile }) => (
  <motion.div whileHover={{ y: -5, transition: { duration: 0.2 } }}>
    <Card
      sx={{
        borderRadius: { xs: 2, sm: 3 },
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
        },
        maxWidth: { xs: "100%", sm: "100%" },
      }}
    >
      <CardContent
        sx={{ p: 0, flexGrow: 1, display: "flex", flexDirection: "column" }}
      >
        <Box
          sx={{
            p: { xs: 1.5, sm: 3 },
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          <Typography
            variant={isMobile ? "subtitle1" : "h6"}
            sx={{
              fontWeight: "bold",
              color: "text.primary",
              lineHeight: 1.3,
              fontSize: { xs: "0.9rem", sm: "1.25rem" },
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 1,
              WebkitBoxOrient: "vertical",
            }}
          >
            {deck.title}
          </Typography>
        </Box>
        <Box
          sx={{
            p: { xs: 1.5, sm: 3 },
            flexGrow: 1,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              mb: { xs: 1, sm: 2 },
              fontSize: { xs: "0.75rem", sm: "0.875rem" },
              lineHeight: 1.4,
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              height: { xs: "2.8em", sm: "auto" },
            }}
          >
            {deck.description || "No description available."}
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mb: { xs: 1, sm: 2 },
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: "text.secondary",
                fontSize: { xs: "0.625rem", sm: "0.75rem" },
              }}
            >
              Last: {getRelativeTime(deckStats.lastStudied)}
            </Typography>
          </Box>
          <Box sx={{ mb: { xs: 1, sm: 2 } }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 0.5,
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: "text.secondary",
                  fontSize: { xs: "0.625rem", sm: "0.75rem" },
                }}
              >
                Mastery
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: "text.primary",
                  fontWeight: "bold",
                  fontSize: { xs: "0.625rem", sm: "0.75rem" },
                }}
              >
                {deckStats.mastery}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={deckStats.mastery}
              sx={{
                height: { xs: 3, sm: 6 },
                borderRadius: 3,
                bgcolor:
                  theme.palette.mode === "dark"
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(0,0,0,0.1)",
                "& .MuiLinearProgress-bar": {
                  bgcolor: "primary.main",
                  borderRadius: 3,
                },
              }}
            />
          </Box>
        </Box>
        <Box
          sx={{
            p: { xs: 1, sm: 2 },
            borderTop: 1,
            borderColor: "divider",
          }}
        >
          <Button
            variant="contained"
            fullWidth
            startIcon={<PlayCircle size={isMobile ? 14 : 18} />}
            onClick={() => navigate(`/study/${deck.id}`)}
            size={isMobile ? "small" : "medium"}
            sx={{
              bgcolor: "primary.main",
              color: "primary.contrastText",
              "&:hover": {
                bgcolor: "primary.dark",
              },
              borderRadius: { xs: 1, sm: 2 },
              py: { xs: 0.5, sm: undefined },
              px: { xs: 1, sm: undefined },
              fontSize: { xs: "0.7rem", sm: "0.875rem" },
              textTransform: "none",
              minHeight: { xs: "28px", sm: "36px" },
            }}
          >
            Study
          </Button>
        </Box>
      </CardContent>
    </Card>
  </motion.div>
);

export default DeckCard;

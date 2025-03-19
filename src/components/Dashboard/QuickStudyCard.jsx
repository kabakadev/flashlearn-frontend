"use client";

import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Clock } from "lucide-react";
import { Link as RouterLink } from "react-router-dom";
import { motion } from "framer-motion";

const QuickStudyCard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Card
      sx={{
        borderRadius: { xs: 2, sm: 3 },
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        mb: { xs: 3, sm: 4 },
        overflow: "hidden",
        bgcolor: "primary.main",
        color: "primary.contrastText",
      }}
    >
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: 1.5, sm: 2 },
              mb: { xs: 1.5, sm: 2 },
            }}
          >
            <Box
              sx={{
                bgcolor: "rgba(255,255,255,0.2)",
                p: { xs: 0.75, sm: 1 },
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Clock size={isMobile ? 16 : 20} />
            </Box>
            <Typography
              variant={isMobile ? "subtitle1" : "h6"}
              sx={{ fontWeight: "bold" }}
            >
              Quick Study
            </Typography>
          </Box>
          <Typography
            variant={isMobile ? "caption" : "body2"}
            sx={{
              mb: { xs: 2, sm: 3 },
              opacity: 0.9,
              fontSize: { xs: "0.8rem", sm: "0.875rem" },
              lineHeight: 1.5,
            }}
          >
            Ready for a quick study session? Choose a deck to review and improve
            your mastery.
          </Typography>
          <Button
            variant="contained"
            fullWidth
            component={RouterLink}
            to="/study"
            sx={{
              bgcolor: "white",
              color: "primary.main",
              "&:hover": {
                bgcolor: "rgba(255,255,255,0.9)",
              },
              borderRadius: { xs: 1.5, sm: 2 },
              py: { xs: 0.75, sm: 1 },
              fontSize: { xs: "0.875rem", sm: "0.9375rem" },
              textTransform: "none",
            }}
          >
            Start Studying
          </Button>
        </motion.div>
      </CardContent>
    </Card>
  );
};

export default QuickStudyCard;

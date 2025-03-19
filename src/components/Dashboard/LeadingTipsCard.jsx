"use client";

import {
  Box,
  Card,
  CardContent,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Brain } from "lucide-react";
import { motion } from "framer-motion";

const LearningTipsCard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const tips = [
    "Study in short, focused sessions rather than long marathons",
    "Review cards right before bedtime to improve memory consolidation",
    "Explain concepts out loud to enhance understanding",
    "Connect new information to things you already know",
  ];

  return (
    <Card
      sx={{
        borderRadius: { xs: 2, sm: 3 },
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        overflow: "hidden",
      }}
    >
      <CardContent sx={{ p: 0 }}>
        <Box
          sx={{
            p: { xs: 2, sm: 3 },
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          <Typography
            variant={isMobile ? "subtitle1" : "h6"}
            sx={{
              fontWeight: "bold",
              color: "text.primary",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Brain size={isMobile ? 18 : 20} />
            Learning Tips
          </Typography>
        </Box>
        <Box sx={{ p: { xs: 2, sm: 3 } }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Typography
              variant={isMobile ? "body2" : "subtitle2"}
              sx={{
                color: "text.primary",
                mb: { xs: 1.5, sm: 2 },
                fontWeight: "medium",
              }}
            >
              Improve your retention with these strategies:
            </Typography>
            <Box
              component="ul"
              sx={{
                pl: { xs: 1.5, sm: 2 },
                mb: 0,
                mt: 0,
              }}
            >
              {tips.map((tip, index) => (
                <Box
                  component="li"
                  key={index}
                  sx={{
                    mb: { xs: 1, sm: 1.5 },
                    color: "text.secondary",
                    "&:last-child": {
                      mb: 0,
                    },
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: { xs: "0.8125rem", sm: "0.875rem" },
                      lineHeight: 1.5,
                    }}
                  >
                    {tip}
                  </Typography>
                </Box>
              ))}
            </Box>
          </motion.div>
        </Box>
      </CardContent>
    </Card>
  );
};

export default LearningTipsCard;

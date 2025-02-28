"use client";

import { motion } from "framer-motion";
import PropTypes from "prop-types";
import { Card, CardContent, Typography, useTheme, Box } from "@mui/material";

export default function FeatureCard({ Icon, title, description }) {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  return (
    <motion.div whileHover={{ scale: 1.02, y: -5 }} transition={{ duration: 0.2 }}>
      <Card
        sx={{
          bgcolor: "background.paper",
          height: "100%",
          transition: "0.3s ease",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
          "&:hover": {
            boxShadow: "0 12px 24px rgba(0,0,0,0.1)",
            borderColor: isDarkMode ? "primary.main" : "primary.light",
          },
        }}
      >
        <CardContent sx={{ p: 4, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
          <Box
            sx={{
              bgcolor: isDarkMode ? "rgba(124,58,237,0.15)" : "rgba(124,58,237,0.08)",
              p: 1.5,
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 48,
              height: 48,
              mb: 2,
              boxShadow: isDarkMode ? "none" : "0 4px 8px rgba(124,58,237,0.1)",
            }}
          >
            <Icon style={{ color: theme.palette.primary.main, strokeWidth: 2.5 }} />
          </Box>
          <Typography variant="h6" sx={{ color: "text.primary", fontWeight: 600, textAlign: "center", mb: 1 }}>
            {title}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary", textAlign: "center", lineHeight: 1.6 }}>
            {description}
          </Typography>
        </CardContent>
      </Card>
    </motion.div>
  );
}

FeatureCard.propTypes = {
  Icon: PropTypes.elementType.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

"use client";

import { motion } from "framer-motion";
import PropTypes from "prop-types";
import { Box, CircularProgress as MUICircularProgress, Typography, useTheme } from "@mui/material";

export function CircularProgress({ percentage, label, size = 120 }) {
  const theme = useTheme();
  const progressStyles = {
    position: "absolute",
    left: 0,
    color: theme.palette.primary.main,
    circle: { strokeLinecap: "round" },
  };

  return (
    <Box sx={{ textAlign: "center" }}>
      <Box sx={{ position: "relative", width: size, height: size, display: "inline-flex" }}>
        <MUICircularProgress variant="determinate" value={100} size={size} thickness={3.2} sx={{ color: "rgba(0,0,0,0.1)" }} />
        <MUICircularProgress variant="determinate" value={percentage} size={size} thickness={3.2} sx={progressStyles} />
        <Box sx={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
            <Typography variant="h4" sx={{ fontWeight: "bold" }}>{percentage}%</Typography>
          </motion.div>
        </Box>
      </Box>
      <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
        <Typography variant="body1" sx={{ mt: 2, color: "text.secondary", fontWeight: "medium" }}>{label}</Typography>
      </motion.div>
    </Box>
  );
}

CircularProgress.propTypes = {
  percentage: PropTypes.number.isRequired,
  label: PropTypes.string.isRequired,
  size: PropTypes.number,
};

import { Box, Typography } from "@mui/material";

const StatsCard = ({
  icon: Icon,
  value,
  label,
  theme,
  isDarkMode,
  isMobile,
}) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      gap: { xs: 1, sm: 1.5 },
    }}
  >
    <Box
      sx={{
        bgcolor: isDarkMode
          ? "rgba(124, 58, 237, 0.15)"
          : "rgba(124, 58, 237, 0.08)",
        p: { xs: 0.75, sm: 1 },
        borderRadius: { xs: 1.5, sm: 2 },
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Icon size={isMobile ? 16 : 18} color={theme.palette.primary.main} />
    </Box>
    <Box>
      <Typography
        variant={isMobile ? "subtitle1" : "h6"}
        sx={{
          fontWeight: "bold",
          color: "text.primary",
          lineHeight: 1.2,
          fontSize: { xs: "1rem", sm: "1.25rem" },
        }}
      >
        {value}
      </Typography>
      <Typography
        variant="caption"
        sx={{
          color: "text.secondary",
          fontSize: { xs: "0.6875rem", sm: "0.75rem" },
        }}
      >
        {label}
      </Typography>
    </Box>
  </Box>
);

export default StatsCard;

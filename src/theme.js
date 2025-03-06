import { createTheme } from "@mui/material/styles";

// Updated light theme colors
const lightPalette = {
  mode: "light",
  primary: {
    main: "#ff69b4", // Hot Pink
    light: "#ffb6c1", // Light Pink
    dark: "#ff1493", // Deep Pink
    contrastText: "#ffffff",
  },
  secondary: {
    main: "#ffcc00", // Yellow
    light: "#ffff99", // Light Yellow
    dark: "#ff9900", // Orange
    contrastText: "#ffffff",
  },
  background: {
    default: "#fff0f5", // Lavender Blush
    paper: "#ffffff", // White
    nav: "#ffe4e1", // Misty Rose
  },
  text: {
    primary: "#4a148c", // Dark Purple
    secondary: "#880e4f", // Dark Pink
  },
  accent: {
    light: "#ffe4e1", // Misty Rose
    medium: "#ffb6c1", // Light Pink
    highlight: "#ff69b4", // Hot Pink highlight
  },
  sun: {
    main: "#ffeb3b", // Yellow
  },
  moon: {
    main: "#fbc02d", // Dark Yellow
  },
};

// Updated dark theme colors
const darkPalette = {
  mode: "dark",
  primary: {
    main: "#ff69b4", // Hot Pink
    light: "#ffb6c1", // Light Pink
    dark: "#ff1493", // Deep Pink
    contrastText: "#000000",
  },
  secondary: {
    main: "#ffcc00", // Yellow
    light: "#ffff99", // Light Yellow
    dark: "#ff9900", // Orange
    contrastText: "#000000",
  },
  background: {
    default: "#121212", // Dark background
    paper: "#1e1e1e", // Slightly lighter for cards
    nav: "#1e1e1e", // Dark nav background
  },
  text: {
    primary: "#ffffff",
    secondary: "#ffb6c1", // Light Pink
  },
  accent: {
    light: "#37474f", // Dark Gray
    medium: "#455a64", // Medium Gray
    highlight: "#ff69b4", // Hot Pink highlight
  },
  sun: {
    main: "#ffeb3b", // Yellow
  },
  moon: {
    main: "#fbc02d", // Dark Yellow
  },
};

// Common theme settings
const commonSettings = {
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "16px",
          backgroundImage: "none",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: "16px", // Increased border radius for rounded buttons
          fontWeight: 600,
        },
        containedPrimary: {
          "&:hover": {
            backgroundColor: ({ theme }) =>
              theme.palette.mode === "dark" ? "#ff1493" : "#ff69b4", // Adjusted hover color
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          "&:hover": {
            backgroundColor: ({ theme }) =>
              theme.palette.mode === "dark"
                ? "rgba(255, 105, 180, 0.1)"
                : "rgba(255, 105, 180, 0.1)",
          },
        },
      },
    },
  },
  typography: {
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
  },
};

export const theme = createTheme({
  ...commonSettings,
  palette: lightPalette,
});

export const darkTheme = createTheme({
  ...commonSettings,
  palette: darkPalette,
});
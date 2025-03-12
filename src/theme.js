import { createTheme } from "@mui/material/styles";

// Updated light theme colors with blue focus
const lightPalette = {
  mode: "light",
  primary: {
    main: "#4255ff", // Blue as requested
    light: "#6b7bff", // Lighter blue
    dark: "#303cb5", // Darker blue
    contrastText: "#ffffff",
  },
  secondary: {
    main: "#3a86ff", // Secondary blue
    light: "#61a0ff", // Light secondary blue
    dark: "#2563eb", // Dark secondary blue
    contrastText: "#ffffff",
  },
  background: {
    default: "#f5f7fa", // Light grey background
    paper: "#ffffff", // White
    nav: "#e9ecef", // Slightly darker navbar as requested
  },
  text: {
    primary: "#2d3748", // Dark grey text
    secondary: "#4a5568", // Medium grey text
  },
  accent: {
    light: "#e6e9f0", // Light blue-grey
    medium: "#cbd5e0", // Medium blue-grey
    highlight: "#4255ff", // Blue highlight
  },
  sun: {
    main: "#ffc107", // Yellow
  },
  moon: {
    main: "#3f51b5", // Blue
  },
};

// Updated dark theme colors with blue focus
const darkPalette = {
  mode: "dark",
  primary: {
    main: "#4255ff", // Blue as requested
    light: "#6b7bff", // Lighter blue
    dark: "#303cb5", // Darker blue
    contrastText: "#ffffff",
  },
  secondary: {
    main: "#3a86ff", // Secondary blue
    light: "#61a0ff", // Light secondary blue
    dark: "#2563eb", // Dark secondary blue
    contrastText: "#ffffff",
  },
  background: {
    default: "#121620", // Dark blue-tinted background
    paper: "#1e2433", // Slightly lighter for cards
    nav: "#1a1f2e", // Dark blue-tinted nav background
  },
  text: {
    primary: "#ffffff",
    secondary: "#cbd5e0", // Light blue-grey
  },
  accent: {
    light: "#2d3748", // Dark blue-grey
    medium: "#4a5568", // Medium blue-grey
    highlight: "#4255ff", // Blue highlight
  },
  sun: {
    main: "#ffc107", // Yellow
  },
  moon: {
    main: "#3f51b5", // Blue
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
              theme.palette.mode === "dark" ? "#303cb5" : "#6b7bff", // Adjusted hover color
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
                ? "rgba(66, 85, 255, 0.1)"
                : "rgba(66, 85, 255, 0.1)",
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

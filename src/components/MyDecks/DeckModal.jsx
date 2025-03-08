"use client";

import {
  Box,
  Typography,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Alert,
  Modal,
} from "@mui/material";
import { useState } from "react";

const DeckModal = ({
  open,
  onClose,
  editingDeck,
  deckTitle,
  setDeckTitle,
  deckDescription,
  setDeckDescription,
  deckSubject,
  setDeckSubject,
  deckCategory,
  setDeckCategory,
  deckDifficulty,
  setDeckDifficulty,
  onSave,
}) => {
  const [error, setError] = useState("");
  const [touched, setTouched] = useState({
    deckTitle: false,
    deckDescription: false,
    deckSubject: false,
    deckCategory: false,
    deckDifficulty: false,
  });

  // Validate the form
  const validateForm = () => {
    const errors = {};
    if (!deckTitle.trim()) errors.deckTitle = "Title is required";
    if (!deckDescription.trim())
      errors.deckDescription = "Description is required";
    if (!deckSubject.trim()) errors.deckSubject = "Subject is required";
    if (!deckCategory.trim()) errors.deckCategory = "Category is required";
    if (!deckDifficulty) errors.deckDifficulty = "Difficulty Level is required";

    return errors;
  };

  // Handle form submission
  const handleSave = () => {
    const errors = validateForm();
    if (Object.keys(errors).length === 0) {
      setError("");
      onSave();
    } else {
      setError("Please fill in all required fields.");
      // Mark all fields as touched to show errors
      setTouched({
        deckTitle: true,
        deckDescription: true,
        deckSubject: true,
        deckCategory: true,
        deckDifficulty: true,
      });
    }
  };

  // Handle field blur (when user leaves a field)
  const handleBlur = (field) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="deck-modal-title"
      aria-describedby="deck-modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "90%", sm: 500 },
          bgcolor: "background.paper",
          borderRadius: 3,
          boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
          p: 4,
        }}
      >
        <Typography
          variant="h5"
          id="deck-modal-title"
          sx={{ mb: 3, fontWeight: "bold" }}
        >
          {editingDeck ? "Edit Deck" : "Create New Deck"}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError("")}>
            {error}
          </Alert>
        )}

        <Box
          component="form"
          sx={{ display: "flex", flexDirection: "column", gap: 3 }}
        >
          <TextField
            label="Deck Title"
            value={deckTitle}
            onChange={(e) => setDeckTitle(e.target.value)}
            onBlur={handleBlur("deckTitle")}
            fullWidth
            required
            error={touched.deckTitle && !deckTitle.trim()}
            helperText={
              touched.deckTitle && !deckTitle.trim() && "Title is required"
            }
          />

          <TextField
            label="Description"
            value={deckDescription}
            onChange={(e) => setDeckDescription(e.target.value)}
            onBlur={handleBlur("deckDescription")}
            fullWidth
            multiline
            rows={3}
            required
            error={touched.deckDescription && !deckDescription.trim()}
            helperText={
              touched.deckDescription &&
              !deckDescription.trim() &&
              "Description is required"
            }
          />

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Subject"
                value={deckSubject}
                onChange={(e) => setDeckSubject(e.target.value)}
                onBlur={handleBlur("deckSubject")}
                fullWidth
                required
                error={touched.deckSubject && !deckSubject.trim()}
                helperText={
                  touched.deckSubject &&
                  !deckSubject.trim() &&
                  "Subject is required"
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Category"
                value={deckCategory}
                onChange={(e) => setDeckCategory(e.target.value)}
                onBlur={handleBlur("deckCategory")}
                fullWidth
                required
                error={touched.deckCategory && !deckCategory.trim()}
                helperText={
                  touched.deckCategory &&
                  !deckCategory.trim() &&
                  "Category is required"
                }
              />
            </Grid>
          </Grid>

          <FormControl fullWidth>
            <InputLabel>Difficulty Level</InputLabel>
            <Select
              value={deckDifficulty}
              onChange={(e) => setDeckDifficulty(Number(e.target.value))}
              onBlur={handleBlur("deckDifficulty")}
              label="Difficulty Level"
              required
              error={touched.deckDifficulty && !deckDifficulty}
            >
              {[1, 2, 3, 4, 5].map((level) => (
                <MenuItem key={level} value={level}>
                  {level} -{" "}
                  {level === 1
                    ? "Beginner"
                    : level === 5
                    ? "Expert"
                    : `Level ${level}`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
            <Button
              variant="contained"
              onClick={handleSave}
              sx={{
                flex: 1,
                bgcolor: "primary.main",
                color: "primary.contrastText",
                "&:hover": {
                  bgcolor: "primary.dark",
                },
              }}
            >
              {editingDeck ? "Save Changes" : "Create Deck"}
            </Button>
            <Button
              variant="outlined"
              onClick={onClose}
              sx={{
                flex: 1,
                borderColor: "primary.main",
                color: "primary.main",
                "&:hover": {
                  borderColor: "primary.dark",
                  bgcolor: "rgba(124, 58, 237, 0.04)",
                },
              }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default DeckModal;

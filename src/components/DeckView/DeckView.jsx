"use client";

import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import {
  Box,
  Container,
  useTheme,
  Alert,
  CircularProgress,
  useMediaQuery,
  Pagination,
} from "@mui/material";
import NavBar from "../NavBar";
import DeckHeader from "./DeckHeader";
import FlashcardList from "./FlashCardList";
import EditFlashcardModal from "./EditFlashcardModal";
import AddFlashcardModal from "./AddFlashcardModal";
import {
  fetchDeckAndFlashcards,
  addFlashcard,
  updateFlashcard,
  deleteFlashcard,
} from "../../utils/deckApi";
import ConfirmationDialog from "../MyDecks/ConfirmationDialog";

const DeckView = () => {
  const { user, isAuthenticated, loading: userLoading } = useUser();
  const { deckId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const [deck, setDeck] = useState(null);
  const [flashcards, setFlashcards] = useState([]);
  const [selectedFlashcard, setSelectedFlashcard] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newFlashcard, setNewFlashcard] = useState({
    front_text: "",
    back_text: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [flashcardToDelete, setFlashcardToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const cardsPerPage = 10; // Number of cards to show per page

  useEffect(() => {
    if (!userLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [userLoading, isAuthenticated, navigate]);

  useEffect(() => {
    const loadDeckAndFlashcards = async () => {
      if (!user) return;
      try {
        const { deckData, flashcardsData, pagination } =
          await fetchDeckAndFlashcards(deckId, currentPage, cardsPerPage);
        setDeck(deckData);
        setFlashcards(Array.isArray(flashcardsData) ? flashcardsData : []);
        setTotalPages(pagination.total_pages);
        setTotalItems(pagination.total_items);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load deck data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadDeckAndFlashcards();
  }, [deckId, user, currentPage]);

  const handleAddFlashcard = () => {
    setAddModalOpen(true);
  };

  const handleSaveFlashcard = async () => {
    try {
      const newCard = await addFlashcard(deckId, newFlashcard);
      setFlashcards([...flashcards, newCard]);
      setAddModalOpen(false);
      setNewFlashcard({ front_text: "", back_text: "" });
      setError("");
    } catch (error) {
      setError("Failed to add flashcard. Please try again.");
    }
  };

  const handleEditFlashcard = async (editedFlashcard) => {
    try {
      const updatedCard = await updateFlashcard(editedFlashcard);
      setFlashcards((prevFlashcards) =>
        prevFlashcards.map((card) =>
          card.id === updatedCard.id ? updatedCard : card
        )
      );
      setModalOpen(false);
      setError("");
    } catch (error) {
      setError("Failed to update flashcard. Please try again.");
    }
  };

  const handleDeleteFlashcard = (flashcardId) => {
    setFlashcardToDelete(flashcardId);
    setDeleteConfirmationOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!flashcardToDelete) return;

    try {
      console.log("this is the id to delete", flashcardToDelete);
      await deleteFlashcard(flashcardToDelete);
      setFlashcards((prevFlashcards) =>
        prevFlashcards.filter((card) => card.id !== flashcardToDelete)
      );
    } catch (error) {
      console.error("Error deleting flashcard:", error);
      setError("Failed to delete flashcard. Please try again.");
    } finally {
      setDeleteConfirmationOpen(false);
      setFlashcardToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmationOpen(false);
    setFlashcardToDelete(null);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    setLoading(true);
  };

  if (userLoading || loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        bgcolor: "background.default",
        minHeight: "100vh",
        pb: { xs: 4, sm: 8 },
      }}
    >
      <NavBar />
      <Container
        maxWidth="xl"
        sx={{
          mt: { xs: 2, sm: 3, md: 4 },
          px: { xs: 2, sm: 3, md: 4 },
        }}
      >
        <DeckHeader
          deck={deck}
          onAddFlashcard={handleAddFlashcard}
          navigate={navigate}
          isMobile={isMobile}
        />

        {error && (
          <Alert
            severity="error"
            sx={{ mb: { xs: 2, sm: 3 } }}
            onClose={() => setError("")}
          >
            {error}
          </Alert>
        )}

        <FlashcardList
          flashcards={flashcards}
          onEdit={(flashcard) => {
            setSelectedFlashcard(flashcard);
            setModalOpen(true);
          }}
          onDelete={handleDeleteFlashcard}
          navigate={navigate}
          deckId={deckId}
          onAddFlashcard={handleAddFlashcard}
          is_default={deck?.is_default}
          isMobile={isMobile}
        />

        {totalPages > 1 && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mt: { xs: 3, sm: 4 },
              mb: { xs: 2, sm: 3 },
            }}
          >
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
              size={isMobile ? "small" : "medium"}
              sx={{
                "& .MuiPaginationItem-root": {
                  color: "text.primary",
                  "&.Mui-selected": {
                    bgcolor: "primary.main",
                    color: "primary.contrastText",
                    "&:hover": {
                      bgcolor: "primary.dark",
                    },
                  },
                },
              }}
            />
          </Box>
        )}

        <EditFlashcardModal
          open={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setError("");
          }}
          flashcard={selectedFlashcard}
          onSave={handleEditFlashcard}
          error={error}
          setError={setError}
          isMobile={isMobile}
        />

        <AddFlashcardModal
          open={addModalOpen}
          onClose={() => {
            setAddModalOpen(false);
            setError("");
          }}
          newFlashcard={newFlashcard}
          setNewFlashcard={setNewFlashcard}
          onSave={handleSaveFlashcard}
          error={error}
          setError={setError}
          isMobile={isMobile}
        />

        <ConfirmationDialog
          open={deleteConfirmationOpen}
          onClose={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
          title="Delete Flashcard"
          message="Are you sure you want to delete this flashcard? This action cannot be undone."
          isMobile={isMobile}
        />
      </Container>
    </Box>
  );
};

export default DeckView;

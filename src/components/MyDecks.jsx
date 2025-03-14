"use client";

import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "./context/UserContext";
import {
  Box,
  Container,
  Grid,
  useTheme,
  Alert,
  CircularProgress,
} from "@mui/material";
import { motion } from "framer-motion";
import NavBar from "./NavBar";
import ConfirmationDialog from "./MyDecks/ConfirmationDialog";

import EmptyState from "./MyDecks/EmptyState";
import DeckCard from "./MyDecks/DeckCard";
import DeckModal from "./MyDecks/DeckModal";
import FilterSort from "./MyDecks/FilterSort";
import { fetchDecks, createOrUpdateDeck, deleteDeck } from "../utils/deckApi";
import Header from "./MyDecks/Header";

const MyDecks = () => {
  const { user, isAuthenticated, loading: userLoading } = useUser();
  const navigate = useNavigate();
  const theme = useTheme();
  const [decks, setDecks] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDeck, setEditingDeck] = useState(null);
  const [deckTitle, setDeckTitle] = useState("");
  const [deckDescription, setDeckDescription] = useState("");
  const [deckSubject, setDeckSubject] = useState("");
  const [deckCategory, setDeckCategory] = useState("");
  const [deckDifficulty, setDeckDifficulty] = useState(3);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState({
    subject: "",
    category: "",
    difficulty: "",
    search: "",
  });
  const [sortBy, setSortBy] = useState("title");
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [deckToDelete, setDeckToDelete] = useState(null);

  useEffect(() => {
    if (!userLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [userLoading, isAuthenticated, navigate]);

  useEffect(() => {
    const loadDecks = async () => {
      if (!user) return;
      try {
        const token = localStorage.getItem("authToken");
        const fetchedDecks = await fetchDecks(token);
        setDecks(Array.isArray(fetchedDecks) ? fetchedDecks : []);
      } catch (error) {
        console.error("Error fetching decks:", error);
        setError("An error occurred while loading decks.");
        setDecks([]);
      } finally {
        setLoading(false);
      }
    };

    loadDecks();
  }, [user]);
  const handleCreateOrUpdateDeck = async () => {
    if (!deckTitle.trim()) {
      setError("Deck title is required");
      return;
    }

    try {
      const updatedDeck = await createOrUpdateDeck(
        {
          id: editingDeck?.id,
          title: deckTitle,
          description: deckDescription,
          subject: deckSubject,
          category: deckCategory,
          difficulty: deckDifficulty,
        },
        !!editingDeck
      );

      setDecks((prevDecks) =>
        editingDeck
          ? prevDecks.map((d) => (d.id === updatedDeck.id ? updatedDeck : d))
          : [...prevDecks, updatedDeck]
      );
      handleCloseModal();
    } catch (error) {
      console.error("Error saving deck:", error);
      setError("An error occurred while saving the deck.");
    }
  };
  const handleDeleteDeck = (event, deckId) => {
    event.stopPropagation();
    setDeckToDelete(deckId);
    setDeleteConfirmationOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deckToDelete) return;

    try {
      await deleteDeck(deckToDelete);
      setDecks((prevDecks) =>
        prevDecks.filter((deck) => deck.id !== deckToDelete)
      );
    } catch (error) {
      console.error("Error deleting deck:", error);
      setError("An error occurred while deleting the deck.");
    } finally {
      setDeleteConfirmationOpen(false);
      setDeckToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmationOpen(false);
    setDeckToDelete(null);
  };
  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingDeck(null);
    setDeckTitle("");
    setDeckDescription("");
    setDeckSubject("");
    setDeckCategory("");
    setDeckDifficulty(3);
    setError("");
  };

  const handleEditDeck = (event, deck) => {
    event.stopPropagation();
    setEditingDeck(deck);
    setDeckTitle(deck.title);
    setDeckDescription(deck.description);
    setDeckSubject(deck.subject);
    setDeckCategory(deck.category);
    setDeckDifficulty(deck.difficulty);
    setModalOpen(true);
  };

  const handleStudyDeck = (event, deckId) => {
    event.stopPropagation();
    navigate(`/study/${deckId}`);
  };

  const filteredAndSortedDecks = useMemo(() => {
    if (!Array.isArray(decks)) return [];

    return decks
      .filter((deck) => {
        const matchesSubject =
          !filter.subject || deck.subject === filter.subject;
        const matchesCategory =
          !filter.category || deck.category === filter.category;
        const matchesDifficulty =
          !filter.difficulty ||
          deck.difficulty === Number.parseInt(filter.difficulty);
        const matchesSearch =
          !filter.search ||
          deck.title.toLowerCase().includes(filter.search.toLowerCase());
        return (
          matchesSubject &&
          matchesCategory &&
          matchesDifficulty &&
          matchesSearch
        );
      })
      .sort((a, b) => {
        if (sortBy === "title") {
          return a.title.localeCompare(b.title);
        } else if (sortBy === "lastStudied") {
          return new Date(b.last_studied) - new Date(a.last_studied);
        } else if (sortBy === "difficulty") {
          return a.difficulty - b.difficulty;
        }
        return 0;
      });
  }, [decks, filter, sortBy]);

  const subjects = useMemo(
    () => [...new Set(decks.map((deck) => deck.subject))],
    [decks]
  );
  const categories = useMemo(
    () => [...new Set(decks.map((deck) => deck.category))],
    [decks]
  );

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
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh", pb: 8 }}>
      <NavBar />
      <Container maxWidth="xl" sx={{ mt: 4 }}>
        <Header onCreateDeck={() => setModalOpen(true)} />

        {error && (
          <Alert severity="error" sx={{ mb: 4 }} onClose={() => setError("")}>
            {error}
          </Alert>
        )}

        <FilterSort
          subjects={subjects}
          categories={categories}
          filter={filter}
          setFilter={setFilter}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />

        <motion.div
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
          initial="hidden"
          animate="visible"
        >
          {filteredAndSortedDecks.length === 0 ? (
            <EmptyState theme={theme} onCreateDeck={() => setModalOpen(true)} />
          ) : (
            <Grid container spacing={3}>
              {filteredAndSortedDecks.map((deck) => (
                <Grid item xs={12} sm={6} md={4} key={deck.id}>
                  <DeckCard
                    deck={deck}
                    theme={theme}
                    onEdit={handleEditDeck}
                    onDelete={handleDeleteDeck}
                    onStudy={handleStudyDeck}
                    navigate={navigate}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </motion.div>

        <DeckModal
          open={modalOpen}
          onClose={handleCloseModal}
          editingDeck={editingDeck}
          deckTitle={deckTitle}
          setDeckTitle={setDeckTitle}
          deckDescription={deckDescription}
          setDeckDescription={setDeckDescription}
          deckSubject={deckSubject}
          setDeckSubject={setDeckSubject}
          deckCategory={deckCategory}
          setDeckCategory={setDeckCategory}
          deckDifficulty={deckDifficulty}
          setDeckDifficulty={setDeckDifficulty}
          error={error}
          onSave={handleCreateOrUpdateDeck}
        />
        <ConfirmationDialog
          open={deleteConfirmationOpen}
          onClose={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
          title="Delete Deck"
          message="Are you sure you want to delete this deck? This action cannot be undone."
        />
      </Container>
    </Box>
  );
};

export default MyDecks;

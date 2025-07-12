"use client";
import Skeleton from "@mui/material/Skeleton";
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
  useMediaQuery,
  Pagination,
  Card,
  CardContent,
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
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

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
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const decksPerPage = 6; // Number of decks to show per page

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
        const { decks, pagination } = await fetchDecks(
          token,
          currentPage,
          decksPerPage
        );
        setDecks(Array.isArray(decks) ? decks : []);
        setTotalPages(pagination.total_pages);
        setTotalItems(pagination.total_items);
      } catch (error) {
        console.error("Error fetching decks:", error);
        setError("An error occurred while loading decks.");
        setDecks([]);
      } finally {
        setLoading(false);
      }
    };

    loadDecks();
  }, [user, currentPage]);

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

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    setLoading(true);
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
    setCurrentPage(1); // Reset to first page when sort changes
  };

  // Replace the loading state return with:
  if (userLoading || loading) {
    return (
      <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
        <NavBar />
        <Container
          maxWidth="xl"
          sx={{
            mt: { xs: 2, sm: 3, md: 4 },
            px: { xs: 2, sm: 3, md: 4 },
          }}
        >
          {/* Header Skeleton - Matches your Header component */}
          <Box sx={{ mb: 4 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: {
                  xs: isMobile ? "flex-start" : "center",
                  sm: "center",
                },
                flexDirection: { xs: isMobile ? "column" : "row", sm: "row" },
                gap: { xs: isMobile ? 1.5 : 0, sm: 0 },
                mb: { xs: 1, sm: 2 },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Skeleton
                  variant="circular"
                  width={isMobile ? 24 : 32}
                  height={isMobile ? 24 : 32}
                />
                <Skeleton
                  variant="text"
                  width={isMobile ? 180 : 220}
                  height={isMobile ? 32 : 40}
                  sx={{
                    fontSize: { xs: "1.25rem", sm: "1.5rem", md: "2rem" },
                  }}
                />
              </Box>
              <Skeleton
                variant="rectangular"
                width={isMobile ? 150 : 180}
                height={isMobile ? 36 : 40}
                sx={{
                  borderRadius: { xs: 1.5, sm: 2 },
                  alignSelf: {
                    xs: isMobile ? "flex-start" : "auto",
                    sm: "auto",
                  },
                }}
              />
            </Box>
            <Skeleton
              variant="text"
              width="70%"
              height={24}
              sx={{
                fontSize: { xs: "0.875rem", sm: "1rem" },
              }}
            />
          </Box>

          {/* Filter/Sort Skeleton - Matches your FilterSort component */}
          <Box sx={{ mb: 4 }}>
            <Grid container spacing={{ xs: 1, sm: 2 }}>
              {/* Subject Filter */}
              <Grid item xs={6} sm={6} md={3}>
                <Skeleton
                  variant="rectangular"
                  height={isMobile ? 40 : 56}
                  sx={{
                    borderRadius: 1,
                    fontSize: isMobile ? "0.8125rem" : undefined,
                  }}
                />
              </Grid>

              {/* Category Filter */}
              <Grid item xs={6} sm={6} md={3}>
                <Skeleton
                  variant="rectangular"
                  height={isMobile ? 40 : 56}
                  sx={{
                    borderRadius: 1,
                    fontSize: isMobile ? "0.8125rem" : undefined,
                  }}
                />
              </Grid>

              {/* Difficulty Filter */}
              <Grid item xs={6} sm={6} md={3}>
                <Skeleton
                  variant="rectangular"
                  height={isMobile ? 40 : 56}
                  sx={{
                    borderRadius: 1,
                    fontSize: isMobile ? "0.8125rem" : undefined,
                  }}
                />
              </Grid>

              {/* Sort By */}
              <Grid item xs={6} sm={6} md={3}>
                <Skeleton
                  variant="rectangular"
                  height={isMobile ? 40 : 56}
                  sx={{
                    borderRadius: 1,
                    fontSize: isMobile ? "0.8125rem" : undefined,
                  }}
                />
              </Grid>
            </Grid>
          </Box>

          {/* Deck Grid Skeleton - Matches your DeckCard component */}
          <Grid container spacing={{ xs: 2, sm: 2, md: 3 }}>
            {[...Array(6)].map((_, i) => (
              <Grid item xs={6} sm={6} md={4} key={i}>
                <Card
                  sx={{
                    borderRadius: 3,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <CardContent
                    sx={{
                      p: 0,
                      flexGrow: 1,
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    {/* Header */}
                    <Box sx={{ p: 3, borderBottom: 1, borderColor: "divider" }}>
                      <Skeleton variant="text" width="80%" height={32} />
                    </Box>

                    {/* Body */}
                    <Box sx={{ p: 3, flexGrow: 1 }}>
                      <Skeleton
                        variant="text"
                        width="100%"
                        height={20}
                        sx={{ mb: 1 }}
                      />
                      <Skeleton
                        variant="text"
                        width="90%"
                        height={20}
                        sx={{ mb: 2 }}
                      />
                      <Skeleton
                        variant="rectangular"
                        width={80}
                        height={32}
                        sx={{ borderRadius: 16 }}
                      />
                    </Box>

                    {/* Footer */}
                    <Box sx={{ p: 2, borderTop: 1, borderColor: "divider" }}>
                      <Skeleton
                        variant="rectangular"
                        height={40}
                        sx={{ borderRadius: 2 }}
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
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
        <Header
          onCreateDeck={() => setModalOpen(true)}
          isMobile={isMobile}
          isLoading={loading}
        />

        {error && (
          <Alert
            severity="error"
            sx={{ mb: { xs: 2, sm: 3, md: 4 } }}
            onClose={() => setError("")}
          >
            {error}
          </Alert>
        )}

        <FilterSort
          subjects={subjects}
          categories={categories}
          filter={filter}
          setFilter={handleFilterChange}
          sortBy={sortBy}
          setSortBy={handleSortChange}
          isMobile={isMobile}
          isLoading={loading}
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
            <EmptyState
              theme={theme}
              onCreateDeck={() => setModalOpen(true)}
              isMobile={isMobile}
              isLoading={loading}
            />
          ) : (
            <>
              <Grid container spacing={{ xs: 2, sm: 2, md: 3 }}>
                {filteredAndSortedDecks.map((deck) => (
                  <Grid item xs={6} sm={6} md={4} key={deck.id}>
                    <DeckCard
                      deck={deck}
                      theme={theme}
                      onEdit={handleEditDeck}
                      onDelete={handleDeleteDeck}
                      onStudy={handleStudyDeck}
                      navigate={navigate}
                      isMobile={isMobile}
                      isLoading={loading}
                    />
                  </Grid>
                ))}
              </Grid>
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
            </>
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
          isMobile={isMobile}
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

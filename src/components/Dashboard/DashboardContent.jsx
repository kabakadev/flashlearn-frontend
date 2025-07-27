import { Box, Grid } from "@mui/material";
import WelcomeSection from "./WelcomeSection";
import ProgressCard from "./ProgressCard";
import DecksSection from "./DeckSection";
import QuickStudyCard from "./QuickStudyCard";
import LearningTipsCard from "./LeadingTipsCard";
import { getDeckStats } from "../../utils/dashBoardutil";
const DashboardContent = ({
  user,
  stats,
  decks,
  progress,
  isLoading,
  theme,
  isDarkMode,
  navigate,
}) => {
  return (
    <>
      <WelcomeSection username={user?.username} />
      <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
        <Grid item xs={12} md={8} order={{ xs: 2, md: 1 }}>
          <ProgressCard stats={stats} theme={theme} isDarkMode={isDarkMode} />
          <DecksSection
            decks={decks}
            getDeckStats={(deckId) => getDeckStats(deckId, progress)}
            navigate={navigate}
            theme={theme}
            isLoading={isLoading}
          />
        </Grid>
        <Grid item xs={12} md={4} order={{ xs: 1, md: 2 }}>
          <QuickStudyCard />
          <Box sx={{ mt: { xs: 2, sm: 3, md: 4 } }}>
            <LearningTipsCard />
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default DashboardContent;

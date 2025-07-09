import {
  Box,
  Card,
  CardContent,
  Grid,
  LinearProgress,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { BarChart2, Trophy, Brain, Clock, Target } from "lucide-react";
import StatsCard from "./StatsCard";

const ProgressCard = ({ stats, theme, isDarkMode }) => {
  const weeklyProgress = Math.round(
    (stats.total_flashcards_studied / stats.weekly_goal) * 100 || 0
  );

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  return (
    <Card
      sx={{
        borderRadius: { xs: 2, sm: 3 },
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        mb: { xs: 3, sm: 4 },
        overflow: "hidden",
      }}
    >
      <CardContent sx={{ p: 0 }}>
        <Box
          sx={{
            p: { xs: 2, sm: 3 },
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          <Typography
            variant={isMobile ? "subtitle1" : "h6"}
            sx={{
              fontWeight: "bold",
              color: "text.primary",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <BarChart2 size={isMobile ? 18 : 20} />
            Learning Progress
          </Typography>
        </Box>
        <Box sx={{ p: { xs: 2, sm: 3 } }}>
          <Box sx={{ mb: { xs: 3, sm: 4 } }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mb: 1,
                flexDirection: { xs: isMobile ? "column" : "row", sm: "row" },
                alignItems: {
                  xs: isMobile ? "flex-start" : "center",
                  sm: "center",
                },
                gap: { xs: 0.5, sm: 0 },
              }}
            >
              <Typography
                variant={isMobile ? "body2" : "subtitle2"}
                sx={{ color: "text.secondary" }}
              >
                Weekly Goal Progress
              </Typography>
              <Typography
                variant={isMobile ? "body2" : "subtitle2"}
                sx={{ color: "text.primary", fontWeight: "bold" }}
              >
                {stats.total_flashcards_studied} / {stats.weekly_goal}
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={weeklyProgress > 100 ? 100 : weeklyProgress}
              sx={{
                height: { xs: 6, sm: 8 },
                borderRadius: 4,
                bgcolor:
                  theme.palette.mode === "dark"
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(0,0,0,0.1)",
                "& .MuiLinearProgress-bar": {
                  bgcolor: "primary.main",
                  borderRadius: 4,
                },
              }}
            />
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mt: 1,
                flexDirection: { xs: isMobile ? "column" : "row", sm: "row" },
                gap: { xs: 0.5, sm: 0 },
              }}
            >
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                {weeklyProgress}% Complete
              </Typography>
              {/* <Typography variant="caption" sx={{ color: "text.secondary" }}>
                <Calendar
                  size={14}
                  style={{ verticalAlign: "text-bottom", marginRight: 4 }}
                />
                {stats.study_streak} day streak
              </Typography> */}
            </Box>
          </Box>
          <Grid container spacing={{ xs: 1.5, sm: 2 }}>
            <Grid item xs={6} sm={6} md={3}>
              <StatsCard
                icon={Trophy}
                value={stats.cards_mastered}
                label="Cards Mastered"
                theme={theme}
                isDarkMode={isDarkMode}
                isMobile={isMobile}
              />
            </Grid>
            <Grid item xs={6} sm={6} md={3}>
              <StatsCard
                icon={Brain}
                value={`${stats.retention_rate}%`}
                label="Retention Rate"
                theme={theme}
                isDarkMode={isDarkMode}
                isMobile={isMobile}
              />
            </Grid>
            <Grid item xs={6} sm={6} md={3}>
              <StatsCard
                icon={Clock}
                value={`${stats.average_study_time}min`}
                label="Avg. Study Time"
                theme={theme}
                isDarkMode={isDarkMode}
                isMobile={isMobile}
              />
            </Grid>
            <Grid item xs={6} sm={6} md={3}>
              <StatsCard
                icon={Target}
                value={`${stats.mastery_level}%`}
                label="Mastery Level"
                theme={theme}
                isDarkMode={isDarkMode}
                isMobile={isMobile}
              />
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProgressCard;

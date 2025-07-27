import {
  Box,
  Grid,
  Skeleton,
  Card,
  CardContent,
  useMediaQuery,
} from "@mui/material";

const DashboardSkeleton = ({ isMobile }) => {
  return (
    <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
      <Grid item xs={12} md={8} order={{ xs: 2, md: 1 }}>
        {/* Progress Card Skeleton */}
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
              <Skeleton
                variant="text"
                width="40%"
                height={30}
                sx={{
                  fontSize: isMobile ? "1rem" : "1.25rem",
                  fontWeight: "bold",
                }}
              />
            </Box>
            <Box sx={{ p: { xs: 2, sm: 3 } }}>
              <Box sx={{ mb: { xs: 3, sm: 4 } }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Skeleton variant="text" width="30%" height={24} />
                  <Skeleton variant="text" width="20%" height={24} />
                </Box>
                <Skeleton
                  variant="rectangular"
                  height={8}
                  sx={{ borderRadius: 4 }}
                />
                <Skeleton
                  variant="text"
                  width="20%"
                  height={20}
                  sx={{ mt: 1 }}
                />
              </Box>
              <Grid container spacing={{ xs: 1.5, sm: 2 }}>
                {[
                  "Cards Mastered",
                  "Retention Rate",
                  "Avg. Study Time",
                  "Mastery Level",
                ].map((label, i) => (
                  <Grid item xs={6} sm={6} md={3} key={i}>
                    <Box sx={{ textAlign: "center" }}>
                      <Skeleton
                        variant="text"
                        width="60%"
                        height={24}
                        sx={{ mx: "auto" }}
                      />
                      <Skeleton
                        variant="text"
                        width="40%"
                        height={32}
                        sx={{ mx: "auto", fontWeight: "bold" }}
                      />
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </CardContent>
        </Card>

        {/* Decks Section Skeleton */}
        <Box sx={{ mt: { xs: 2, sm: 3, md: 4 } }}>
          <Skeleton
            variant="text"
            width="30%"
            height={40}
            sx={{
              fontSize: isMobile ? "1.25rem" : "1.5rem",
              fontWeight: "bold",
            }}
          />
          <Box sx={{ mt: 2 }}>
            {[...Array(3)].map((_, i) => (
              <Card
                key={i}
                sx={{
                  borderRadius: { xs: 2, sm: 3 },
                  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                  mb: 2,
                  overflow: "hidden",
                }}
              >
                <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                  <Skeleton variant="text" width="80%" height={28} />
                  <Box sx={{ display: "flex", gap: 1, mt: 1.5 }}>
                    <Skeleton variant="text" width="30%" height={24} />
                    <Skeleton variant="text" width="30%" height={24} />
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>
      </Grid>

      <Grid item xs={12} md={4} order={{ xs: 1, md: 2 }}>
        {/* Quick Study Skeleton */}
        <Card
          sx={{
            borderRadius: { xs: 2, sm: 3 },
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            overflow: "hidden",
          }}
        >
          <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
            <Skeleton variant="text" width="50%" height={30} sx={{ mb: 2 }} />
            <Skeleton
              variant="rectangular"
              height={100}
              sx={{ borderRadius: 2 }}
            />
            <Skeleton
              variant="text"
              width="80%"
              height={24}
              sx={{ mt: 2, mx: "auto" }}
            />
          </CardContent>
        </Card>

        {/* Learning Tips Skeleton */}
        <Box sx={{ mt: { xs: 2, sm: 3, md: 4 } }}>
          <Card
            sx={{
              borderRadius: { xs: 2, sm: 3 },
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              overflow: "hidden",
            }}
          >
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Skeleton variant="text" width="50%" height={30} sx={{ mb: 2 }} />
              {[...Array(3)].map((_, i) => (
                <Skeleton
                  key={i}
                  variant="text"
                  width="100%"
                  height={20}
                  sx={{ mb: 1 }}
                />
              ))}
            </CardContent>
          </Card>
        </Box>
      </Grid>
    </Grid>
  );
};

export default DashboardSkeleton;

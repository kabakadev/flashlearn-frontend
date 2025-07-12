// src/components/Dashboard/ProgressCardSkeleton.jsx
"use client";

import { Box, Card, CardContent, Grid, Skeleton } from "@mui/material";

const ProgressCardSkeleton = () => {
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
          <Skeleton variant="text" width="40%" height={30} />
        </Box>
        <Box sx={{ p: { xs: 2, sm: 3 } }}>
          <Box sx={{ mb: { xs: 3, sm: 4 } }}>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
            >
              <Skeleton variant="text" width="30%" height={20} />
              <Skeleton variant="text" width="20%" height={20} />
            </Box>
            <Skeleton
              variant="rectangular"
              height={8}
              sx={{ borderRadius: 4 }}
            />
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}
            >
              <Skeleton variant="text" width="20%" height={20} />
            </Box>
          </Box>
          <Grid container spacing={{ xs: 1.5, sm: 2 }}>
            {[...Array(4)].map((_, i) => (
              <Grid item xs={6} sm={6} md={3} key={i}>
                <Skeleton
                  variant="rectangular"
                  height={100}
                  sx={{ borderRadius: 2 }}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProgressCardSkeleton;

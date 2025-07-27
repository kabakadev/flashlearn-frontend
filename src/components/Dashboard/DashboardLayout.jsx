import { Box, Container, Grid } from "@mui/material";
import NavBar from "../NavBar";

const DashboardLayout = ({ children }) => {
  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh", pb: 8 }}>
      <NavBar />
      <Container
        maxWidth="xl"
        sx={{
          mt: { xs: 2, sm: 3, md: 4 },
          px: { xs: 2, sm: 3, md: 4 },
        }}
      >
        {children}
      </Container>
    </Box>
  );
};

export default DashboardLayout;

import { Outlet } from "react-router-dom";
import Header from "../components/header";
import Sidebar from "../components/sidebar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { useState } from "react";

export default function MainLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <Box sx={{ display: "flex", minHeight: "100svh", width: "100%" }}>
      <Sidebar
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />
      <Box sx={{ flex: 1, minWidth: 0, pb: { xs: 3, md: 4 } }}>
        <Header onMenuClick={() => setMobileMenuOpen(true)} />
        <Container
          component="main"
          maxWidth="xl"
          sx={{
            px: { xs: 1.5, sm: 2.5, md: 3 },
            pt: { xs: 4, md: 5 },
            pb: { xs: 3, md: 5 }
          }}
        >
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
}

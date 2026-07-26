import{ AccessTimeRounded, CalendarMonthRounded, FavoriteRounded } from "@mui/icons-material";
import{ Box, Grid, Paper, Typography }from "@mui/material";
import { motion } from "framer-motion";
import api from "../services/api";
import { useEffect, useState } from "react";
import type { TodaysInquiry } from "../types/TodaysInquiry";



const pulseCards = [
  {
    title: "Today's rhythm",
    detail: "Patients can be checked in, updated, and reviewed quickly from one-handed mobile screens.",
    icon: AccessTimeRounded
  },
  {
    title: "Clinic health",
    detail: "Active therapies and visit history stay visible without crowding the smaller view.",
    icon: FavoriteRounded
  }
];

export default function DashboardPage() {
  const [todaysInquiry, setTodaysInquiry] = useState<TodaysInquiry[]>([]);
  const [error, setError] = useState("");
  const stats = [
  {
    title: "Patients",
    value: 180
  },
  {
    title: "Appointments",
    value: 54
  },
  {
    title: "Active Therapies",
    value: 28
  },
  {
    title: "Revenue",
    value: "$8,400"
  }
  ];  
  async function loadTodaysInquiry() {
    try {
      const response = await api.get<TodaysInquiry[]>("Inquiry/GetTodaysInquiry");
      console.log(response);
    } catch {
      setError("Could not load branches. Please try again.");
    }
  }

    useEffect(() => {
      loadTodaysInquiry();
    }, []);

  return (
    <Box>
      <Grid container spacing={{ xs: 2, sm: 3 }}>
        {stats.map((item) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={item.title}>
            <motion.div whileHover={{ scale: 1.02 }}>
              <Paper
                sx={{
                  p: { xs: 2.5, sm: 3 },
                  borderRadius: 2,
                  background: item.title === "Revenue"
                    ? "linear-gradient(135deg,#f97316,#ea580c)"
                    : "linear-gradient(135deg,#2dd4bf,#115e59)",
                  color: "#fff"
                }}
              >
                <Typography>{item.title}</Typography>
                <Typography variant="h4">{item.value}</Typography>
              </Paper>
            </motion.div>
          </Grid>
        ))}

        {pulseCards.map((card) => {
          const Icon = card.icon;
          return (
            <Grid size={{ xs: 12, md: 6 }} key={card.title}>
              <Paper sx={{ p: 3, borderRadius: 2 }}>
                <Box sx={{ mb: 1.5, display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Box
                    sx={{
                      width: 46,
                      height: 46,
                      borderRadius: 1.5,
                      display: "grid",
                      placeItems: "center",
                      bgcolor: "rgba(15, 118, 110, 0.12)",
                      color: "primary.main"
                    }}
                  >
                    <Icon />
                  </Box>
                  <Typography variant="h6">{card.title}</Typography>
                </Box>
                <Typography color="text.secondary">{card.detail}</Typography>
              </Paper>
            </Grid>
          );
        })}

        <Grid size={{ xs: 12 }}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Box sx={{ mb: 1, display: "flex", alignItems: "center", gap: 1.5 }}>
              <CalendarMonthRounded color="primary" />
              <Typography variant="h6">Designed for the next tap</Typography>
            </Box>
            <Typography color="text.secondary">
              The dashboard now acts like the home screen of a mobile app: summary first, quick orientation second, and large touch targets throughout.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

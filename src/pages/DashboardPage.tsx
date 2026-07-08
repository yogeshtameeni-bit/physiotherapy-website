import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { motion } from "framer-motion";

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

const pulseCards = [
  {
    title: "Today's rhythm",
    detail: "Patients can be checked in, updated, and reviewed quickly from one-handed mobile screens.",
    icon: AccessTimeRoundedIcon
  },
  {
    title: "Clinic health",
    detail: "Active therapies and visit history stay visible without crowding the smaller view.",
    icon: FavoriteRoundedIcon
  }
];

export default function DashboardPage() {
  return (
    <Box>
      <Paper
        sx={{
          p: { xs: 2.5, sm: 3.5 },
          mb: 2.5,
          borderRadius: 2,
          background: "linear-gradient(145deg, #0f766e 0%, #164e63 55%, #f97316 140%)",
          color: "#fff",
          overflow: "hidden"
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 2,
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", md: "center" }
          }}
        >
          <Box sx={{ maxWidth: 620 }}>
            <Typography variant="overline" sx={{ letterSpacing: 1.5, opacity: 0.8 }}>
              Everyday clinic control
            </Typography>
            <Typography variant="h4" sx={{ mt: 0.5, mb: 1.25, fontSize: { xs: "1.9rem", sm: "2.5rem" } }}>
              A cleaner mobile rhythm for staff on the move
            </Typography>
            <Typography sx={{ maxWidth: 520, opacity: 0.88 }}>
              The whole interface now leans into quick taps, readable cards, and fewer cramped desktop leftovers.
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<TrendingUpRoundedIcon />}
            sx={{ bgcolor: "#fff", color: "#0f766e", px: 2.5, "&:hover": { bgcolor: "#fff7ed" } }}
          >
            Daily overview
          </Button>
        </Box>
      </Paper>

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
              <CalendarMonthRoundedIcon color="primary" />
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

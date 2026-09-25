import AccessibilityNewRoundedIcon from "@mui/icons-material/AccessibilityNewRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import MonitorWeightRoundedIcon from "@mui/icons-material/MonitorWeightRounded";
import { Box, Button, Grid, Paper, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

const programSteps = [
  {
    title: "Understand the starting point",
    description: "Create a complete picture of each patient's goals, routine, and current health markers.",
    icon: AccessibilityNewRoundedIcon,
    color: "#0f766e"
  },
  {
    title: "Build a practical routine",
    description: "Shape movement and lifestyle recommendations around what the patient can sustain every day.",
    icon: CalendarMonthRoundedIcon,
    color: "#ea580c"
  },
  {
    title: "Measure progress together",
    description: "Use regular check-ins to celebrate progress, adjust the plan, and keep momentum visible.",
    icon: MonitorWeightRoundedIcon,
    color: "#2563eb"
  }
];

const programOutcomes = [
  "Personalized guidance for every patient",
  "Progress that is easy to review at a glance",
  "A supportive plan built for lasting change"
];

export default function WeightLossProgramPage() {
  return (
    <Box>
      <Paper
        sx={{
          position: "relative",
          overflow: "hidden",
          p: { xs: 2.5, sm: 4, md: 5 },
          mb: { xs: 2.5, md: 3 },
          borderRadius: 2,
          background: "linear-gradient(125deg, #164e63 0%, #0f766e 62%, #0d9488 100%)",
          color: "#fff"
        }}
      >
        <Box
          sx={{
            position: "absolute",
            right: { xs: -80, sm: 10 },
            bottom: -105,
            width: { xs: 220, sm: 330 },
            height: { xs: 220, sm: 330 },
            borderRadius: "50%",
            border: "42px solid rgba(255,255,255,0.08)"
          }}
        />
        <Box sx={{ position: "relative", maxWidth: 700 }}>
          <Typography variant="overline" sx={{ letterSpacing: 1.5, fontWeight: 800, opacity: 0.76 }}>
            Niyat wellness pathway
          </Typography>
          <Typography variant="h3" component="h1" sx={{ mt: 0.5, fontWeight: 800, maxWidth: 620 }}>
            Small steps. Stronger health.
          </Typography>
          <Typography sx={{ mt: 1.5, maxWidth: 570, color: "rgba(255,255,255,0.84)", fontSize: { sm: "1.05rem" } }}>
            A guided weight-loss program that helps patients build confidence, consistency, and habits that last.
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, mt: 3 }}>
            <Button
              component={RouterLink}
              to="/patients/add"
              variant="contained"
              startIcon={<AddRoundedIcon />}
              sx={{ bgcolor: "#fff", color: "#0f766e", "&:hover": { bgcolor: "#ecfeff" } }}
            >
              Add a patient
            </Button>
            <Button
              component={RouterLink}
              to="/inquiries"
              variant="outlined"
              endIcon={<ArrowForwardRoundedIcon />}
              sx={{ borderColor: "rgba(255,255,255,0.45)", color: "#fff", "&:hover": { borderColor: "#fff", bgcolor: "rgba(255,255,255,0.08)" } }}
            >
              View inquiries
            </Button>
          </Box>
        </Box>
      </Paper>

      <Box sx={{ mb: { xs: 2.5, md: 3 } }}>
        <Typography variant="h5" component="h2" sx={{ mb: 0.75 }}>
          A plan patients can live with
        </Typography>
        <Typography color="text.secondary" sx={{ maxWidth: 650 }}>
          Keep each conversation focused and each next step clear, from the first consultation to the latest check-in.
        </Typography>
      </Box>

      <Grid container spacing={{ xs: 2, md: 2.5 }}>
        {programSteps.map((step) => {
          const Icon = step.icon;
          return (
            <Grid size={{ xs: 12, md: 4 }} key={step.title}>
              <Paper sx={{ height: "100%", p: { xs: 2.5, sm: 3 }, borderRadius: 2 }}>
                <Box sx={{ width: 48, height: 48, mb: 2, borderRadius: 1.5, display: "grid", placeItems: "center", bgcolor: `${step.color}18`, color: step.color }}>
                  <Icon />
                </Box>
                <Typography variant="h6" sx={{ mb: 1 }}>{step.title}</Typography>
                <Typography color="text.secondary">{step.description}</Typography>
              </Paper>
            </Grid>
          );
        })}

        <Grid size={{ xs: 12, md: 7 }}>
          <Paper sx={{ height: "100%", p: { xs: 2.5, sm: 3 }, borderRadius: 2, background: "#fffaf4" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
              <GroupsRoundedIcon color="primary" />
              <Typography variant="h6">What every plan includes</Typography>
            </Box>
            <Box sx={{ display: "grid", gap: 1.25 }}>
              {programOutcomes.map((outcome) => (
                <Box key={outcome} sx={{ display: "flex", alignItems: "flex-start", gap: 1.25 }}>
                  <CheckCircleRoundedIcon sx={{ mt: 0.15, color: "secondary.main", fontSize: 20 }} />
                  <Typography color="text.secondary">{outcome}</Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <Paper sx={{ height: "100%", p: { xs: 2.5, sm: 3 }, borderRadius: 2, background: "linear-gradient(145deg, #fff7ed, #ffedd5)" }}>
            <Typography variant="overline" sx={{ color: "#c2410c", fontWeight: 800, letterSpacing: 1.1 }}>
              Ready when you are
            </Typography>
            <Typography variant="h6" sx={{ mt: 0.5, mb: 1 }}>
              Start with a conversation
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 2 }}>
              Capture a new inquiry and turn interest into a clear next step for your care team.
            </Typography>
            <Button component={RouterLink} to="/inquiries/add" variant="contained" color="secondary" endIcon={<ArrowForwardRoundedIcon />}>
              Add inquiry
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
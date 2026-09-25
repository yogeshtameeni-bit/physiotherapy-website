import AccountBalanceRoundedIcon from "@mui/icons-material/AccountBalanceRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import AssessmentRoundedIcon from "@mui/icons-material/AssessmentRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import CurrencyRupeeRoundedIcon from "@mui/icons-material/CurrencyRupeeRounded";
import { Box, Button, Grid, Paper, Typography } from "@mui/material";

const overviewCards = [
  {
    title: "Record collections",
    description: "Keep payments and branch collections together as the income history grows.",
    icon: AddRoundedIcon,
    action: "Add income"
  },
  {
    title: "Review performance",
    description: "Use income trends to understand how each branch is contributing over time.",
    icon: AssessmentRoundedIcon,
    action: "View reports"
  },
  {
    title: "Stay on schedule",
    description: "A clear record of received payments makes daily follow-up easier for the team.",
    icon: CalendarMonthRoundedIcon,
    action: "View calendar"
  }
];

export default function IncomePage() {
  return (
    <Box>
      <Paper
        sx={{
          position: "relative",
          overflow: "hidden",
          p: { xs: 2.5, sm: 4 },
          mb: 2.5,
          borderRadius: 2,
          background: "linear-gradient(145deg, #164e63 0%, #0f766e 58%, #0d9488 100%)",
          color: "#fff"
        }}
      >
        <Box
          sx={{
            position: "absolute",
            right: { xs: -45, sm: 24 },
            top: { xs: 18, sm: 28 },
            width: { xs: 120, sm: 170 },
            height: { xs: 120, sm: 170 },
            borderRadius: "50%",
            border: "1px solid rgba(255,255,255,0.2)",
            display: "grid",
            placeItems: "center",
            color: "rgba(255,255,255,0.7)"
          }}
        >
          <CurrencyRupeeRoundedIcon sx={{ fontSize: { xs: 58, sm: 82 } }} />
        </Box>
        <Box sx={{ position: "relative", maxWidth: 620 }}>
          <Typography variant="overline" sx={{ fontWeight: 800, letterSpacing: 1.2, opacity: 0.78 }}>
            Financial workspace
          </Typography>
          <Typography variant="h4" component="h1" sx={{ mt: 0.5, fontWeight: 800 }}>
            Income
          </Typography>
          <Typography sx={{ mt: 1.25, maxWidth: 540, color: "rgba(255,255,255,0.82)" }}>
            A clear home for collections, branch performance, and the payments that keep the clinic moving.
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddRoundedIcon />}
            sx={{ mt: 2.5, bgcolor: "#fff", color: "#0f766e", "&:hover": { bgcolor: "#ecfeff" } }}
          >
            Record income
          </Button>
        </Box>
      </Paper>

      <Grid container spacing={{ xs: 2, md: 2.5 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ height: "100%", p: { xs: 2.5, sm: 3 }, borderRadius: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
              <Box
                sx={{
                  width: 46,
                  height: 46,
                  borderRadius: 1.5,
                  display: "grid",
                  placeItems: "center",
                  bgcolor: "rgba(13, 148, 136, 0.12)",
                  color: "primary.main"
                }}
              >
                <AccountBalanceRoundedIcon />
              </Box>
              <Box>
                <Typography variant="overline" color="text.secondary" sx={{ lineHeight: 1.2 }}>
                  Current view
                </Typography>
                <Typography variant="h6" sx={{ lineHeight: 1.2 }}>
                  Income overview
                </Typography>
              </Box>
            </Box>
            <Typography color="text.secondary">
              Start by recording received payments. Branch totals and income history will have a dedicated view as entries are added.
            </Typography>
          </Paper>
        </Grid>

        {overviewCards.map((card) => {
          const Icon = card.icon;
          return (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={card.title}>
              <Paper sx={{ height: "100%", p: { xs: 2.5, sm: 3 }, borderRadius: 2 }}>
                <Box
                  sx={{
                    width: 42,
                    height: 42,
                    mb: 2,
                    borderRadius: 1.5,
                    display: "grid",
                    placeItems: "center",
                    bgcolor: "rgba(249, 115, 22, 0.12)",
                    color: "#ea580c"
                  }}
                >
                  <Icon />
                </Box>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  {card.title}
                </Typography>
                <Typography color="text.secondary" sx={{ minHeight: 72 }}>
                  {card.description}
                </Typography>
                <Button
                  variant="text"
                  disabled
                  sx={{ px: 0, mt: 1, justifyContent: "flex-start", textTransform: "none" }}
                >
                  {card.action}
                </Button>
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}

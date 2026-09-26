import { useEffect, useMemo, useState } from "react";
import AccountBalanceRoundedIcon from "@mui/icons-material/AccountBalanceRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import AssessmentRoundedIcon from "@mui/icons-material/AssessmentRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import { Grid } from "@mui/material";
import{ Alert, Box, Button, MenuItem, Paper, Table, TableBody, TableCell, TableContainer,
  TableRow, TableHead, TableSortLabel, TextField, Typography, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle
} from "@mui/material";
import type { Branch } from "../types/Branch";
import type { IncomeReport } from "../types/IncomeReport";

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

type SortField = "amount" | "date" | "branchName";
type SortDirection = "asc" | "desc";

export default function IncomePage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expenses, setIncomeData] = useState<IncomeReport[]>([]);
  const [month, setMonth] = useState("0");
  const [year, setYear] = useState("0");
  const [branchId, setBranchId] = useState<number | "0">("0");
  const [branches, setBranches] = useState<Branch[]>([]);
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [sortField, setSortField] = useState<SortField>("date");
  
  

  const selectedBranchName = useMemo(
    () => branchId === "0" ? undefined : branches.find((branch) => branch.id === branchId)?.friendlyName,
    [branchId, branches]
  );

  const sortedData = useMemo(() => expenses
    .filter((expense) => {
      const expenseDate = new Date(expense.date);

        return (month === "0" || expenseDate.getMonth() + 1 === Number(month))
        && (year === "0" || expenseDate.getFullYear() === Number(year))
        && (branchId === "0" || expense.branchName === selectedBranchName);
    })
    .sort((a, b) => {
    const direction = sortDirection === "asc" ? 1 : -1;

    if (sortField === "amount") {
      return (a.amount - b.amount) * direction;
    }

    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return (dateA - dateB) * direction;
    }), [expenses, month, year, branchId, selectedBranchName, sortDirection, sortField]);

  const totalIncome = useMemo(
    () => sortedData.reduce((total, expense) => total + expense.amount, 0),
    [sortedData]
  );

  const years = useMemo(() => {
    const availableYears = new Set(expenses.map((expense) => new Date(expense.date).getFullYear()));
    return [...availableYears].filter(Number.isFinite).sort((a, b) => b - a);
  }, [expenses]);

  return (
    <Box>
      <Paper
          sx={{
            p: { xs: 2.25, sm: 3 },
            mb: 2.5,
            borderRadius: 2,
            background: "linear-gradient(145deg, rgba(15,118,110,0.96), rgba(22,78,99,0.9))",
            color: "#fff"
          }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 2,
            alignItems: "center",
            justifyContent: "space-between"
          }}>
          <Box sx={{ flex: "1 1 auto", minWidth: 0 }}>
            <Typography
              variant="h5"
              component="h1"
              sx={{
                fontWeight: 800,
                textAlign: "left",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap"
              }}>
              Income Report 
            </Typography>
            {!loading && (
              <Box
                key={totalIncome}
                sx={{
                  display: "inline-flex",
                  alignItems: "baseline",
                  gap: 1,
                  mt: 0.75,
                  px: 1.25,
                  py: 0.6,
                  borderRadius: 1.5,
                  bgcolor: "rgba(255, 255, 255, 0.18)",
                  border: "1px solid rgba(255, 255, 255, 0.36)",
                  animation: "totalExpensePulse 700ms ease-out",
                  "@keyframes totalExpensePulse": {
                    "0%": { transform: "scale(1)", bgcolor: "rgba(255, 255, 255, 0.18)" },
                    "45%": { transform: "scale(1.06)", bgcolor: "rgba(255, 255, 255, 0.42)" },
                    "100%": { transform: "scale(1)", bgcolor: "rgba(255, 255, 255, 0.18)" }
                  }
                }}>
                <Typography variant="caption" sx={{ fontWeight: 700, letterSpacing: 0.4, textTransform: "uppercase" }}>
                  Total Income
                </Typography>
                <Typography variant="h6" component="output" sx={{ fontWeight: 800, lineHeight: 1.1 }}>
                  {totalIncome.toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 0, style: "currency", currency: "INR" })}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Paper>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {!loading && (
        <Paper sx={{ p: { xs: 2, sm: 2.5 }, mb: 2.5, borderRadius: 2, overflow: "hidden" }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, minmax(0, 1fr))",
                md: "repeat(3, minmax(0, 1fr))"
              },
              gap: 1.5,
              alignItems: "center",
              width: "100%"
            }}>

            <TextField
              select label="Month" value={month}
              onChange={(event) => setMonth(event.target.value)}
              fullWidth size="small">
              <MenuItem value="0">All</MenuItem>
              <MenuItem value="1">January</MenuItem>
              <MenuItem value="2">February</MenuItem>
              <MenuItem value="3">March</MenuItem>
              <MenuItem value="4">April</MenuItem>
              <MenuItem value="5">May</MenuItem>
              <MenuItem value="6">June</MenuItem>
              <MenuItem value="7">July</MenuItem>
              <MenuItem value="8">August</MenuItem>
              <MenuItem value="9">September</MenuItem>
              <MenuItem value="10">October</MenuItem>
              <MenuItem value="11">November</MenuItem>
              <MenuItem value="12">December</MenuItem>
            </TextField>
            <TextField
              select
              label="Year"
              value={year}
              onChange={(event) => setYear(event.target.value)}
              size="small"
              fullWidth>
              {years.map((availableYear) => (
                <MenuItem key={availableYear} value={String(availableYear)}>{availableYear}</MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Branch"
              value={branchId}
              onChange={(event) => setBranchId(Number(event.target.value))}
              size="small"
              fullWidth>
              {branches.map((branch) => (
                <MenuItem key={branch.id} value={branch.id}>
                  {branch.friendlyName}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        </Paper>
      )}

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

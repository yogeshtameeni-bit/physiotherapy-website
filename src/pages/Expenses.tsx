import AddRoundedIcon from "@mui/icons-material/AddRounded";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import type { Expenses } from "../types/Expenses";

type SortField = "description" | "amount" | "paymentDate";
type SortDirection = "asc" | "desc";

const sortableColumns: Array<{ field: SortField; label: string }> = [
  { field: "description", label: "Description" },
  { field: "amount", label: "Amount" },
  { field: "paymentDate", label: "Payment Date" }
];

function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expenses[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [gender, setGender] = useState("");
  const [sortField, setSortField] = useState<SortField>("paymentDate");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const navigate = useNavigate();

  async function loadExpenses() {
    try {
      const response = await api.get<Expenses[]>(`/Expenses`);
      setExpenses(response.data || []);
    } catch (loadError) {
      console.error("Error fetching expenses:", loadError);
      setError("Could not load expenses. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadExpenses();
  }, []);

  function changeSort(field: SortField) {
    if (sortField === field) {
      setSortDirection((current) => current === "asc" ? "desc" : "asc");
      return;
    }

    setSortField(field);
    setSortDirection("asc");
  }

  async function deleteExpense(expense: Expenses) {
    if (!window.confirm(`Delete ${expense.Description}?`)) return;

    setDeletingId(expense.expenseId);
    setError("");
    try {
      await api.patch(`/Expenses/DeleteExpense/${expense.expenseId}`);
      await loadExpenses();
    } catch (deleteError) {
      console.error("Error deleting expense:", deleteError);
      setError("Could not delete the expense. Please try again.");
    } finally {
      setDeletingId(null);
    }
  }

  const sortedData = [...expenses].sort((a, b) => {
    const direction = sortDirection === "asc" ? 1 : -1;

    if (sortField === "amount") {
      return (a.amount - b.amount) * direction;
    }

    const dateA = new Date(a.paymentDate).getTime();
    const dateB = new Date(b.paymentDate).getTime();
    return (dateA - dateB) * direction;
  });

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
              Expenses
            </Typography>
            {!loading && (
              <Typography variant="body2" sx={{ opacity: 0.82 }}>
                Total expense
              </Typography>
            )}
          </Box>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<AddRoundedIcon />}
            onClick={() => navigate("/inquiries/add")}
            sx={{ bgcolor: "#fff", color: "primary.main", "&:hover": { bgcolor: "#fff7ed" } }}>
            Add Expense
          </Button>
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
                sm: "minmax(220px, 2fr) 120px 180px auto"
              },
              gap: 1.5,
              alignItems: "center",
              width: "100%"
            }}>

            <TextField
              select
              label="Month"
              value={gender}
              onChange={(event) => setGender(event.target.value)}
              sx={{ width: { xs: "100%", sm: 120 }, minWidth: 0 }}
              size="small">
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
              value={branchId}
              onChange={(event) => setBranchId(event.target.value === "" ? "" : Number(event.target.value))}
              size="small"
              sx={{ width: { xs: "100%", sm: 180 }, minWidth: 0 }}>
              <MenuItem value="2026">2026</MenuItem>
            </TextField>
          </Box>

        </Paper>
      )}

      <TableContainer component={Paper} sx={{ width: "100%", overflowX: "auto", borderRadius: 2 }}>
        <Table sx={{ minWidth: { xs: 320, sm: 680 } }} aria-label="Payment History">
          <TableHead>
            <TableRow>
              {sortableColumns.map((column) => (
                <TableCell
                  key={column.field}
                  sortDirection={sortField === column.field ? sortDirection : false}
                  sx={{ fontWeight: 700, py: { xs: 1.25, sm: 1.5 } }}>
                  <TableSortLabel
                    active={sortField === column.field}
                    direction={sortField === column.field ? sortDirection : "asc"}
                    onClick={() => changeSort(column.field)}>
                    {column.label}
                  </TableSortLabel>
                </TableCell>
              ))}
              <TableCell align="right" sx={{ fontWeight: 700, py: { xs: 1.25, sm: 1.5 }, width: { xs: 72, sm: "auto" } }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedData.map((ph) => (
              <TableRow key={ph.expenseId} hover>
                <TableCell sx={{ fontWeight: 600, py: { xs: 1, sm: 1.25 } }}>{ph.amount}</TableCell>
                <TableCell sx={{ py: { xs: 1, sm: 1.25 } }}>{String(new Date(ph.paymentDate).toLocaleDateString())}</TableCell>
                <TableCell align="right" sx={{ whiteSpace: "nowrap", py: { xs: 1, sm: 1.25 } }}>
                  <Button
                    size="small"
                    color="error"
                    onClick={() => deleteExpense(ph)}
                    disabled={deletingId === ph.expenseId}>
                    {deletingId === ph.expenseId ? "Deleting..." : "Delete"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}

            {expenses.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 6, color: "text.secondary" }}>
                  No records have been added yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default ExpensesPage;

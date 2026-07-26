import AddRoundedIcon from "@mui/icons-material/AddRounded";
import{ Alert, Box, Button, MenuItem, Paper, Table, TableBody, TableCell, TableContainer,
  TableRow, TableHead, TableSortLabel, TextField, Typography, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import type { Expenses } from "../types/Expenses";
import type { Branch } from "../types/Branch";

type SortField = "description" | "amount" | "paymentDate" | "branchName";
type SortDirection = "asc" | "desc";

const sortableColumns: Array<{ field: SortField; label: string }> = [
  { field: "description", label: "Description" },
  { field: "amount", label: "Amount" },
  { field: "paymentDate", label: "Payment Date" },
  { field: "branchName", label: "Branch" }
];

function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expenses[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [month, setMonth] = useState("0");
  const [year, setYear] = useState("0");
  const [branchId, setBranchId] = useState<number | "0">("0");
  const [branchId_add, setBranchId_add] = useState<number | "">("");
  const [sortField, setSortField] = useState<SortField>("paymentDate");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().slice(0, 10));
  const [description, setDescription] = useState("");
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  async function loadExpenses() {
    try {
      const response = await api.get<Expenses[]>(`/Expense`);
      setExpenses(response.data || []);
    } catch (loadError) {
      console.error("Error fetching expenses:", loadError);
      setError("Could not load expenses. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function loadBranches() {
    try {
      const response = await api.get<Branch[]>("/Branch");
      setBranches(response.data);
    } catch {
      setError("Could not load branches. Please try again.");
    }
  }

  useEffect(() => {
    loadBranches();
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
    if (!window.confirm(`Delete ${expense.description}?`)) return;

    setDeletingId(expense.expenseId);
    setError("");
    try {
      await api.patch(`/Expense/DeleteExpense/${expense.expenseId}`);
      await loadExpenses();
    } catch (deleteError) {
      console.error("Error deleting expense:", deleteError);
      setError("Could not delete the expense. Please try again.");
    } finally {
      setDeletingId(null);
    }
  }

  function openDialog() {
    setError("");
    setPaymentAmount("");
    setPaymentDate(new Date().toISOString().slice(0, 10));
    setDescription("");
    setBranchId_add(branches[0]?.id ?? "");
    setDialogOpen(true);
  }

  const years = useMemo(() => {
    const availableYears = new Set(expenses.map((expense) => new Date(expense.paymentDate).getFullYear()));
    return [...availableYears].filter(Number.isFinite).sort((a, b) => b - a);
  }, [expenses]);

  useEffect(() => {
    if (year === "0" && years[0] !== undefined) {
      setYear(String(years[0]));
    }
  }, [year, years]);

    useEffect(() => {
    if (branchId === "0" && branches[0] !== undefined) {
      setBranchId(branches[0].id);
    }
  }, [branchId, branches]);

  const selectedBranchName = useMemo(
    () => branchId === "0" ? undefined : branches.find((branch) => branch.id === branchId)?.friendlyName,
    [branchId, branches]
  );

  const sortedData = useMemo(() => expenses
    .filter((expense) => {
      const expenseDate = new Date(expense.paymentDate);

        return (month === "0" || expenseDate.getMonth() + 1 === Number(month))
        && (year === "0" || expenseDate.getFullYear() === Number(year))
        && (branchId === "0" || expense.branchName === selectedBranchName);
    })
    .sort((a, b) => {
    const direction = sortDirection === "asc" ? 1 : -1;

    if (sortField === "amount") {
      return (a.amount - b.amount) * direction;
    }

    const dateA = new Date(a.paymentDate).getTime();
    const dateB = new Date(b.paymentDate).getTime();
    return (dateA - dateB) * direction;
    }), [expenses, month, year, branchId, selectedBranchName, sortDirection, sortField]);

  const totalExpense = useMemo(
    () => sortedData.reduce((total, expense) => total + expense.amount, 0),
    [sortedData]
  );
  
  async function saveRecord() {
    const amountValue = Number(paymentAmount);
    if (!paymentAmount || Number.isNaN(amountValue) || amountValue <= 0 || amountValue < 0) {
      setError("Please enter a valid amount.");
      return;
    }

    setSaving(true);
    setError("");
    try {
      await api.post("Expense", {
        Amount: amountValue,
        PaymentDate:paymentDate,
        Description:description,
        BranchId: branchId_add
      });
      setDialogOpen(false);
      loadExpenses();
    } catch (saveError) {
      console.error("Error saving expense record:", saveError);
      setError("Could not add the expense record. Please try again.");
    } finally {
      setSaving(false);
    }
  };

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
              <Box
                key={totalExpense}
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
                  Total expense
                </Typography>
                <Typography variant="h6" component="output" sx={{ fontWeight: 800, lineHeight: 1.1 }}>
                  {totalExpense.toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 0, style: "currency", currency: "INR" })}
                </Typography>
              </Box>
            )}
          </Box>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<AddRoundedIcon />}
            onClick={openDialog}
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
                sm: "repeat(2, minmax(0, 1fr))",
                md: "repeat(3, minmax(0, 1fr))"
              },
              gap: 1.5,
              alignItems: "center",
              width: "100%"
            }}>

            <TextField
              select
              label="Month"
              value={month}
              onChange={(event) => setMonth(event.target.value)}
              fullWidth
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

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Add expense record</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "grid", gap: 2, mt: 0.5 }}>
            <TextField
              label="Amount"
              // type="number"
              value={paymentAmount}
              onChange={(event) => {
                const nextValue = event.target.value;
                if (nextValue === "" || Number(nextValue) >= 0) {
                  setPaymentAmount(nextValue);
                }
              }}
              fullWidth required
              slotProps={{ htmlInput: {inputMode: "numeric", min: 0, step: "1", pattern: "[0-9]+" } }} />
              
              <TextField
                label="Payment date"
                type="date" required
                value={paymentDate}
                onChange={(event) => setPaymentDate(event.target.value)}
                slotProps={{ inputLabel: { shrink: true } }}
                sx={{ width: { xs: "100%", sm: 220 } }} />
              <TextField
                  select label="Branch"
                  value={branchId_add}
                  onChange={(event) => setBranchId_add(Number(event.target.value))}
                  // disabled={branchesLoading}
                  // helperText={branchesLoading ? "Loading branches..." : undefined}
                  >
                  {branches.length === 0 && //!branchesLoading && 
                  (
                    <MenuItem value="" disabled>No branches available</MenuItem>
                  )}
                  {branches.map((branch) => (
                    <MenuItem key={branch.id} value={branch.id}>
                      {branch.friendlyName}
                    </MenuItem>
                  ))}
              </TextField>
              <TextField
                label="Description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                fullWidth required />
            
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => void saveRecord()} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

    {loading ? (
      <CircularProgress aria-label="Loading patients" />
    ):(
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
                <TableCell sx={{ fontWeight: 600, py: { xs: 1, sm: 1.25 } }}>{ph.description}</TableCell>
                <TableCell sx={{ fontWeight: 600, py: { xs: 1, sm: 1.25 } }}>{ph.amount}</TableCell>
                <TableCell sx={{ py: { xs: 1, sm: 1.25 } }}>{String(new Date(ph.paymentDate).toLocaleDateString())}</TableCell>
                <TableCell sx={{ py: { xs: 1, sm: 1.25 } }}>{ph.branchName}</TableCell>
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

            {sortedData.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 6, color: "text.secondary" }}>
                  {expenses.length === 0 ? "No records have been added yet." : "No expenses match the selected filters."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    )}
    </Box>
  );
}

export default ExpensesPage;

import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Divider from "@mui/material/Divider";
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
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import type { Patient } from "../types/Patient";
import type { PaymentHistory } from "../types/PaymentHistory";
import type { Treatment_Sittings } from "../types/Treatment_Sittings";

type SortField = "amount" | "paymentMode" | "paymentDate";
type SortDirection = "asc" | "desc";
const sortableColumns: Array<{ field: SortField; label: string }> = [
  { field: "amount", label: "Amount" },
  { field: "paymentMode", label: "Payment Mode" },
  { field: "paymentDate", label: "Payment Date" }
];

type Treatment_SortField = "sitting_Date" | "remarks";
const Treatment_sortableColumns: Array<{ field: Treatment_SortField; label: string }> = [
  { field: "sitting_Date", label: "Sitting Date" },
  { field: "remarks", label: "Remarks" }
];

function PaymentHistoryPage() {
  const { id } = useParams<{ id?: string }>();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistory[]>([]);
  const [sittingHistory, setSittingHistory] = useState<Treatment_Sittings[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [sortField, setSortField] = useState<SortField>("paymentDate");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [treatment_sortDirection, setTreatment_SortDirection] = useState<SortDirection>("desc");
  const [treatment_sortField, setTreatment_setSortField] = useState<Treatment_SortField>("sitting_Date");
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [sittingsDialogOpen, setSittingsDialogOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().slice(0, 10));
  const [sittingsDate, setSittingsDate] = useState(new Date().toISOString().slice(0, 10));
  const [sittingsRemarks, setSittingsRemarks] = useState("");
  const [paymentMode, setPaymentMode] = useState("C");
  const [savingPayment, setSavingPayment] = useState(false);
  const [savingSitting, setSavingSitting] = useState(false);

  async function loadPatients() {
    setLoading(true);
    setError("");
    try {
      const response = await api.get<Patient[]>("/Patients");
      setPatients(response.data || []);
      console.log("Patients loaded:", response.data);
    } catch (err) {
      console.error("Error loading patients", err);
      setError("Could not load patients");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadPatients();
  }, []);

  useEffect(() => {
    void loadPaymentHistory();
  }, [id]);

  useEffect(() => {
    if (!id || patients.length === 0) {
      return;
    }

    const patient = patients.find((p) => p.id === Number(id));
    if (patient) {
      setSelectedPatient(patient);
      loadPaymentHistory();
    }
  }, [patients, id]);

  function changeSort(field: SortField) {
    if (sortField === field) {
      setSortDirection((current) => current === "asc" ? "desc" : "asc");
      return;
    }

    setSortField(field);
    setSortDirection("asc");
  }

  function changeTreatmentSort(field: Treatment_SortField) {
    if (treatment_sortField === field) {
      setTreatment_SortDirection((current) => current === "asc" ? "desc" : "asc");
      return;
    }

    setTreatment_setSortField(field);
    setTreatment_SortDirection("asc");
  }

  async function loadPaymentHistory(patientIdArg?: number) {
    setLoading(true);
    setError("");

    const patientId = patientIdArg ?? (id ? Number(id) : selectedPatient?.id);
    if (!patientId) {
      setPaymentHistory([]);
      setSittingHistory([]);
      setLoading(false);
      return;
    }

    try {
      const response = await api.get<PaymentHistory[]>(`/Patients/GetPaymentHistory?patientId=${patientId}`);
      setPaymentHistory(response.data || []);
    } catch (loadError) {
      console.error("Error fetching payment history:", loadError);
      setError("Could not load payment history. Please try again.");
    } finally {
      setLoading(false);
    }

    await loadSittingsHistory(patientId);
  }

  async function loadSittingsHistory(patientId?: number) {
    try {
      const response = await api.get<Treatment_Sittings[]>(`/Patients/GetSittingHistory?patientId=${patientId}`);
      setSittingHistory(response.data || []);
    } catch (loadError) {
      console.error("Error fetching sitting history:", loadError);
      setError("Could not load sitting history. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function openPaymentDialog() {
    if (!selectedPatient) {
      setError("Please select a patient first.");
      return;
    }

    setError("");
    setPaymentAmount("");
    setPaymentDate(new Date().toISOString().slice(0, 10));
    setPaymentMode("C");
    setPaymentDialogOpen(true);
  }

  function openSittingsDialog(){
    if (!selectedPatient) {
      setError("Please select a patient first.");
      return;
    }

    setError("");
    setSittingsDate(new Date().toISOString().slice(0, 10));
    setSittingsRemarks("");
    setSittingsDialogOpen(true);
  }

  async function savePaymentRecord() {
    if (!selectedPatient) {
      setError("Please select a patient first.");
      return;
    }

    const amountValue = Number(paymentAmount);
    if (!paymentAmount || Number.isNaN(amountValue) || amountValue <= 0 || amountValue < 0) {
      setError("Please enter a valid amount.");
      return;
    }

    setSavingPayment(true);
    setError("");
    try {
      await api.post("Patients/SavePaymentHistory", {
        patientId: selectedPatient.id,
        amount: amountValue,
        paymentDate,
        paymentMode
      });
      setPaymentDialogOpen(false);
      await loadPaymentHistory(selectedPatient.id);
    } catch (saveError) {
      console.error("Error saving payment record:", saveError);
      setError("Could not add the payment record. Please try again.");
    } finally {
      setSavingPayment(false);
    }
  }

  async function saveSittingRecord() {
    if (!selectedPatient) {
      setError("Please select a patient first.");
      return;
    }

    if (!sittingsDate) {
      setError("Please enter a sitting date.");
      return;
    }

    setSavingSitting(true);
    setError("");
    try {
      await api.post("Patients/SaveSaveSittings", {
        patientId: selectedPatient.id,
        Sitting_Date: sittingsDate,
        Remarks: sittingsRemarks
      });
      setSittingsDialogOpen(false);
      await loadSittingsHistory(selectedPatient.id);
    } catch (saveError) {
      console.error("Error saving sitting record:", saveError);
      setError("Could not add the sitting record. Please try again.");
    } finally {
      setSavingSitting(false);
    }
  }

  async function deletePaymentEntry(paymentHistoryId: number) {
    if (!window.confirm(`Delete payment entry?`)) return;

    setDeletingId(paymentHistoryId);
    setError("");
    try {
      await api.delete(`Patients/DeletePaymentHistory/${paymentHistoryId}`);
      await loadPaymentHistory(selectedPatient?.id);
    } catch (deleteError) {
      console.error("Error deleting payment entry:", deleteError);
      setError("Could not delete the payment entry. Please try again.");
    } finally {
      setDeletingId(null);
    }
  }

  const sortedPaymentHistory = [...paymentHistory].sort((a, b) => {
    const direction = sortDirection === "asc" ? 1 : -1;

    if (sortField === "amount") {
      return (a.amount - b.amount) * direction;
    }

    const dateA = new Date(a.paymentDate).getTime();
    const dateB = new Date(b.paymentDate).getTime();
    return (dateA - dateB) * direction;
  });

  const sortedSittingHistory = [...sittingHistory].sort((a, b) => {
    const direction = treatment_sortDirection === "asc" ? 1 : -1;

    const dateA = new Date(a.sitting_Date).getTime();
    const dateB = new Date(b.sitting_Date).getTime();
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
        <Typography variant="h5" component="h1" sx={{ fontWeight: 800, textAlign: "left" }}>
          Payment & Sittings History
        </Typography>
      </Paper>

      <Paper sx={{ p: { xs: 2, sm: 2.5 }, mb: 2.5, maxWidth: 760, borderRadius: 2 }}>
        <Box sx={{ display: "flex", gap: 1.25, alignItems: "center", flexWrap: "wrap" }}>
          <Autocomplete
            sx={{ flex: 1, minWidth: 280 }}
            options={patients}
            getOptionLabel={(option) => `${option.fullName} (${option.phone}) - ${option.branchName}`}
            loading={loading}
            value={selectedPatient}
            onChange={(_event, newValue) => {
              setSelectedPatient(newValue);
              void loadPaymentHistory(newValue?.id);
            }}
            isOptionEqualToValue={(option, value) => option.id === value?.id}
            renderInput={(params) => {
              return (
                <TextField
                  {...params}
                  label="Select patient"
                  size="small"
                  error={!!error}
                  helperText={error || undefined}
                />
              );
            }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={openPaymentDialog}
            disabled={!selectedPatient || savingPayment}>
            {savingPayment ? "Saving..." : "Add payment"}
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={openSittingsDialog}
            disabled={!selectedPatient || savingSitting}>
            {savingSitting ? "Saving..." : "Add Sitting"}
          </Button>
        </Box>
      </Paper>

      <Dialog open={paymentDialogOpen} onClose={() => setPaymentDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Add payment record</DialogTitle>
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
              fullWidth
              slotProps={{ htmlInput: {inputMode: "numeric", min: 0, step: "1", pattern: "[0-9]+" } }}
            />
            <TextField
              select
              label="Payment mode"
              value={paymentMode}
              onChange={(event) => setPaymentMode(event.target.value)}
              fullWidth
            >
              <MenuItem value="C">Cash</MenuItem>
              <MenuItem value="U">UPI</MenuItem>
            </TextField>
            <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
              <TextField
                label="Payment date"
                type="date"
                value={paymentDate}
                onChange={(event) => setPaymentDate(event.target.value)}
                slotProps={{ inputLabel: { shrink: true } }}
                sx={{ width: { xs: "100%", sm: 220 } }}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPaymentDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => void savePaymentRecord()} disabled={savingPayment}>
            {savingPayment ? "Saving..." : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={sittingsDialogOpen} onClose={() => setSittingsDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Add Sitting record</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "grid", gap: 2, mt: 0.5 }}>
            <TextField
              label="Sitting date"
              type="date"
              value={sittingsDate}
              onChange={(event) => setSittingsDate(event.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
              fullWidth
            />
            <TextField
              label="Remarks"
              value={sittingsRemarks}
              onChange={(event) => setSittingsRemarks(event.target.value)}
              multiline
              minRows={3}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSittingsDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => void saveSittingRecord()} disabled={savingSitting}>
            {savingSitting ? "Saving..." : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

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
            {sortedPaymentHistory.map((ph) => (
              <TableRow key={ph.paymentHistoryId} hover>
                <TableCell sx={{ fontWeight: 600, py: { xs: 1, sm: 1.25 } }}>{ph.amount}</TableCell>
                <TableCell sx={{ py: { xs: 1, sm: 1.25 } }}>{ph.paymentMode === "U" ? "UPI" : "Cash"}</TableCell>
                <TableCell sx={{ py: { xs: 1, sm: 1.25 } }}>{String(new Date(ph.paymentDate).toLocaleDateString())}</TableCell>
                <TableCell align="right" sx={{ whiteSpace: "nowrap", py: { xs: 1, sm: 1.25 } }}>
                  <Button
                    size="small"
                    color="error"
                    onClick={() => deletePaymentEntry(ph.paymentHistoryId)}
                    disabled={deletingId === ph.paymentHistoryId}>
                    {deletingId === ph.paymentHistoryId ? "Deleting..." : "Delete"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}

            {paymentHistory.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 6, color: "text.secondary" }}>
                  No records have been added yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      <Divider sx={{ my: 3 }} />

      <TableContainer component={Paper} sx={{ width: "100%", overflowX: "auto", borderRadius: 2 }}>
        <Table sx={{ minWidth: { xs: 320, sm: 680 } }} aria-label="Sittings History">
          <TableHead>
            <TableRow>
              {Treatment_sortableColumns.map((column) => (
                <TableCell
                  key={column.field}
                  sortDirection={treatment_sortField === column.field ? treatment_sortDirection : false}
                  sx={{ fontWeight: 700, py: { xs: 1.25, sm: 1.5 } }}>
                  <TableSortLabel
                    active={treatment_sortField === column.field}
                    direction={treatment_sortField === column.field ? treatment_sortDirection : "asc"}
                    onClick={() => changeTreatmentSort(column.field)}>
                    {column.label}
                  </TableSortLabel>
                </TableCell>
              ))}
              <TableCell align="right" sx={{ fontWeight: 700, py: { xs: 1.25, sm: 1.5 }, width: { xs: 72, sm: "auto" } }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedSittingHistory.map((ph) => (
              <TableRow key={ph.treatment_sittings_Id} hover>
                <TableCell sx={{ py: { xs: 1, sm: 1.25 } }}>{String(new Date(ph.sitting_Date).toLocaleDateString())}</TableCell>
                <TableCell sx={{ py: { xs: 1, sm: 1.25 } }}>{ph.remarks || "-"}</TableCell>
                <TableCell align="right" sx={{ whiteSpace: "nowrap", py: { xs: 1, sm: 1.25 } }}>
                  <Button
                    size="small"
                    color="error"
                    onClick={() => deletePaymentEntry(ph.treatment_sittings_Id)}
                    disabled={deletingId === ph.treatment_sittings_Id}>
                    {deletingId === ph.treatment_sittings_Id ? "Deleting..." : "Delete"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}

            {sittingHistory.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 6, color: "text.secondary" }}>
                  No records have been added yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* {selectedPatient && (
        <Paper sx={{ p: 2.5, borderRadius: 2, maxWidth: 720 }}>
          <Box sx={{ display: "grid", gap: 0.75 }}>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>{selectedPatient.fullName}</Typography>
            <Typography variant="body2" color="text.secondary">
              {selectedPatient.branchName || "-"} • {selectedPatient.phone}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Detailed payment and sitting entries can be placed here next using this same mobile card pattern.
            </Typography>
          </Box>
        </Paper>
      )} */}
      
    </Box>
  );
}

export default PaymentHistoryPage;

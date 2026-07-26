import AddRoundedIcon from "@mui/icons-material/AddRounded";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
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
import useMediaQuery from "@mui/material/useMediaQuery";
import type { Theme } from "@mui/material/styles";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../services/api";
import type { Branch } from "../types/Branch";
import type { Patient } from "../types/Patient";

type SortField = "fullName" | "gender" | "age" | "phone" | "branchName" | "createdDate";
type SortDirection = "asc" | "desc";

const sortableColumns: Array<{ field: SortField; label: string }> = [
  { field: "fullName", label: "Name" },
  { field: "branchName", label: "Branch" },
  { field: "phone", label: "Phone" },
  { field: "createdDate", label: "Inquiry Date" },
  { field: "gender", label: "Gender" },
  { field: "age", label: "Age" }
];

function InquiriesPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [gender, setGender] = useState("");
  const [searchParams] = useSearchParams();
  const requestedBranchId = Number(searchParams.get("branchId"));
  const hasRequestedBranch = Number.isInteger(requestedBranchId) && requestedBranchId > 0;
  const [branchId, setBranchId] = useState<number | "">(() => {
    return hasRequestedBranch ? requestedBranchId : "";
  });
  const [sortField, setSortField] = useState<SortField>(() => hasRequestedBranch ? "createdDate" : "fullName");
  const [sortDirection, setSortDirection] = useState<SortDirection>(() => hasRequestedBranch ? "desc" : "asc");
  const navigate = useNavigate();
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down("md"));

  async function loadPatients() {
    try {
      const response = await api.get<Patient[]>("/Inquiry");
      setPatients(response.data);
    } catch (loadError) {
      console.error("Error fetching inquiries:", loadError);
      setError("Could not load inquiries. Please try again.");
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
    loadPatients();
    loadBranches();
  }, []);

  const visiblePatients = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase();

    return patients
      .filter((patient) => {
        const matchesSearch = normalizedSearch === "" || [
          patient.fullName,
          String(patient.phone),
          patient.address,
        ].some((value) => value.toLocaleLowerCase().includes(normalizedSearch));

        return matchesSearch
          && (gender === "" || patient.gender === gender)
          && (branchId === "" || patient.branchId === branchId);
      })
      .sort((first, second) => {
        const firstValue = first[sortField];
        const secondValue = second[sortField];
        const comparison = typeof firstValue === "string"
          ? firstValue.localeCompare(String(secondValue), undefined, { sensitivity: "base" })
          : Number(firstValue) - Number(secondValue);

        return sortDirection === "asc" ? comparison : -comparison;
      });
  }, [branchId, gender, patients, search, sortDirection, sortField]);

  const hasActiveFilters = search !== "" || gender !== "" || branchId !== "";

  function changeSort(field: SortField) {
    if (sortField === field) {
      setSortDirection((current) => current === "asc" ? "desc" : "asc");
      return;
    }

    setSortField(field);
    setSortDirection("asc");
  }

  function clearFilters() {
    setSearch("");
    setGender("");
    setBranchId("");
  }

  async function deletePatient(patient: Patient) {
    if (!window.confirm(`Delete ${patient.fullName}?`)) return;

    setDeletingId(patient.id);
    setError("");
    try {
      await api.patch(`/Patients/DeletePatient/${patient.id}`);
      await loadPatients();
    } catch (deleteError) {
      console.error("Error deleting patient:", deleteError);
      setError("Could not delete the patient. Please try again.");
    } finally {
      setDeletingId(null);
    }
  }

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
              }}
            >
              Inquiries
            </Typography>
            {!loading && (
              <Typography variant="body2" sx={{ opacity: 0.82 }}>
                {visiblePatients.length} of {patients.length} Inquiry
              </Typography>
            )}
          </Box>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<AddRoundedIcon />}
            onClick={() => navigate("/inquiries/add")}
            sx={{ bgcolor: "#fff", color: "primary.main", "&:hover": { bgcolor: "#fff7ed" } }}
          >
            Add Inquiry
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
            }}
          >
            <TextField
              label="Search inquiries"
              placeholder="Name, phone or address"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              size="small"
              sx={{ minWidth: 0 }}
            />
            <TextField
              select
              label="Gender"
              value={gender}
              onChange={(event) => setGender(event.target.value)}
              sx={{ width: { xs: "100%", sm: 120 }, minWidth: 0 }}
              size="small"
            >
              <MenuItem value="">All genders</MenuItem>
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </TextField>
            <TextField
              select
              label="Branch"
              value={branchId}
              onChange={(event) => setBranchId(event.target.value === "" ? "" : Number(event.target.value))}
              size="small"
              sx={{ width: { xs: "100%", sm: 180 }, minWidth: 0 }}
            >
              <MenuItem value="">All branches</MenuItem>
              {branches.map((branch) => (
                <MenuItem key={branch.id} value={branch.id}>
                  {branch.friendlyName}
                </MenuItem>
              ))}
            </TextField>
            <Button
              onClick={clearFilters}
              disabled={!hasActiveFilters}
              sx={{
                whiteSpace: "nowrap",
                width: { xs: "100%", sm: "auto" },
                minWidth: 0
              }}
            >
              Clear filters
            </Button>
          </Box>

        </Paper>
      )}

      {loading ? (
        <CircularProgress aria-label="Loading inquiries" />
      ) : isMobile ? (
        <Box sx={{ display: "grid", gap: 2 }}>
          {visiblePatients.map((patient) => (
            <Paper key={patient.id} sx={{ p: 2.25, borderRadius: 2, overflow: "hidden" }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  gap: 0.75
                }}>
                <Box sx={{ minWidth: 0 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontSize: "1.05rem",
                      overflowWrap: "anywhere"
                    }}>
                    {patient.fullName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {patient.branchName || "No branch"} | {patient.phone}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 0.75 }}>
                  <Typography variant="body2" color="text.secondary">
                    {patient.gender || "Unknown"}
                  </Typography>
                  <Box
                    sx={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 0.75,
                      px: 1,
                      py: 0.5,
                      borderRadius: 1.25,
                      bgcolor: "rgba(14, 116, 144, 0.1)",
                      border: "1px solid rgba(14, 116, 144, 0.35)",
                      color: "primary.dark"
                    }}>
                    <Typography variant="caption" sx={{ fontWeight: 800, textTransform: "uppercase", letterSpacing: 0.35 }}>
                      Inquiry date
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 800 }}>
                      {String(new Date(patient.createdDate).toLocaleDateString())}
                    </Typography>
                  </Box>
                </Box>
              </Box>
              <Divider sx={{ my: 1.5 }} />
              <Box sx={{ mb: 2, display: "grid", gap: 0.75 }}>
                <Typography variant="body2" color="text.secondary">Age: {patient.age}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Address: {patient.address || "Not added yet"}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                  gap: 1
                }}
              >
                <Button
                  size="small"
                  variant="contained"
                  onClick={() => navigate(`/inquiries/${patient.id}/edit`)}
                  sx={{ minWidth: 0 }}>
                  Edit
                </Button>
                <Button
                  size="small"
                  color="error"
                  onClick={() => deletePatient(patient)}
                  disabled={deletingId === patient.id}
                  sx={{ minWidth: 0, gridColumn: "1 / -1" }}>
                  {deletingId === patient.id ? "Deleting..." : "Delete"}
                </Button>
              </Box>
            </Paper>
          ))}

          {visiblePatients.length === 0 && (
            <Paper sx={{ p: 4, borderRadius: 2, textAlign: "center" }}>
              <Typography color="text.secondary">
                {patients.length === 0 ? "No inquiries have been added yet." : "No inquiries match these filters."}
              </Typography>
            </Paper>
          )}
        </Box>
      ) : (
        <TableContainer component={Paper} sx={{ width: "100%", overflowX: "auto", borderRadius: 2 }}>
          <Table sx={{ minWidth: 680 }} aria-label="Patients">
            <TableHead>
              <TableRow>
                {sortableColumns.map((column) => (
                  <TableCell
                    key={column.field}
                    sortDirection={sortField === column.field ? sortDirection : false}
                    sx={{ fontWeight: 700 }}
                  >
                    <TableSortLabel
                      active={sortField === column.field}
                      direction={sortField === column.field ? sortDirection : "asc"}
                      onClick={() => changeSort(column.field)}
                    >
                      {column.label}
                    </TableSortLabel>
                  </TableCell>
                ))}
                <TableCell align="right" sx={{ fontWeight: 700 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {visiblePatients.map((patient) => (
                <TableRow key={patient.id} hover>
                  <TableCell sx={{ fontWeight: 600 }}>{patient.fullName}</TableCell>
                  <TableCell>{patient.branchName || "-"}</TableCell>
                  <TableCell>{patient.phone}</TableCell>
                  <TableCell>{String(new Date(patient.createdDate).toLocaleDateString())}</TableCell>
                  <TableCell>{patient.gender || "-"}</TableCell>
                  <TableCell>{patient.age}</TableCell>
                  <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                    <Button size="small" onClick={() => navigate(`/inquiries/${patient.id}/edit`)}>
                      Edit
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      onClick={() => deletePatient(patient)}
                      disabled={deletingId === patient.id}
                    >
                      {deletingId === patient.id ? "Deleting..." : "Delete"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}

              {visiblePatients.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6, color: "text.secondary" }}>
                    {patients.length === 0 ? "No inquiries have been added yet." : "No inquiries match these filters."}
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

export default InquiriesPage;

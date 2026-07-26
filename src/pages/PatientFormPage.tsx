import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import type { Branch } from "../types/Branch";
import type { Patient } from "../types/Patient";

type PatientFormData = Omit<Patient, "id">;

const emptyPatient: PatientFormData = {
  branchId: 0,
  fullName: "",
  gender: "",
  age: 0,
  phone: 0,
  address: "",
  medicalHistory: "",
  complain: "",
  diagnosis: "",
  treatmentPlan: "",
  branchName: "",
  isInquiryConvertedToPatient:true,
  createdDate: new Date()
};

export default function PatientFormPage() {
  const formRef = useRef<HTMLFormElement | null>(null);
  const pageRef = useRef<HTMLDivElement | null>(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const [form, setForm] = useState<PatientFormData>(emptyPatient);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [branchesLoading, setBranchesLoading] = useState(true);
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadBranches() {
      try {
        const response = await api.get<Branch[]>("/Branch");
        setBranches(response.data);
      } catch {
        setError("Could not load branches. Please try again.");
      } finally {
        setBranchesLoading(false);
      }
    }

    loadBranches();
  }, []);

  useEffect(() => {
    if (!id) return;

    async function loadPatient() {
      try {
        const response = await api.get<Patient>(`/Patients/${id}`);
        const patient = response.data;
        setForm({
          branchId: patient.branchId,
          fullName: patient.fullName,
          gender: patient.gender,
          age: patient.age,
          phone: patient.phone,
          address: patient.address,
          medicalHistory: patient.medicalHistory,
          complain: patient.complain,
          diagnosis: patient.diagnosis,
          treatmentPlan: patient.treatmentPlan,
          branchName: patient.branchName,
          isInquiryConvertedToPatient: patient.isInquiryConvertedToPatient,
          createdDate: patient.createdDate
        });
      } catch {
        setError("Could not load the patient. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    loadPatient();
  }, [id]);

  function updateField<K extends keyof PatientFormData>(
    field: K,
    value: PatientFormData[K],
  ) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formElement = formRef.current;
    if (formElement && !formElement.reportValidity()) {
      pageRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    setSaving(true);
    setError("");

    try {
      try {
        const existsResp = await api.get<{ exists: boolean; id?: number }>(
          `/Patients/CheckPatientByPhone?phone=${encodeURIComponent(form.phone)}${isEditing ? `&patientId=${id}` : ""}`
        );
        if (existsResp.data?.id && existsResp.data.id > 0) {
          setError("This phone number is already used by another patient.");
          pageRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
          setSaving(false);
          return;
        }
      } catch (checkError) {
        console.error(checkError);
        setError("Could not check the patient for duplicates. Please check the details and try again.");
        pageRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }

      const payload = {
        branchId: form.branchId,
        fullName: form.fullName,
        gender: form.gender,
        age: form.age,
        phone: form.phone,
        address: form.address,
        medicalHistory: form.medicalHistory,
        complain: form.complain,
        diagnosis: form.diagnosis,
        treatmentPlan: form.treatmentPlan,
        isActive: true,
        isInquiryConvertedToPatient: form.isInquiryConvertedToPatient
      };

      if (isEditing) {
        await api.post(`/Patients/${id}`, { id: Number(id), ...payload });
      } else {
        await api.post("/Patients", payload);
      }
      navigate("/patients");
    } catch (saveError) {
      console.error(saveError);
      setError(`Could not ${isEditing ? "update" : "add"} the patient. Please check the details and try again.`);
      pageRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <CircularProgress aria-label="Loading patient" />;
  }

  return (
    <Box ref={pageRef} sx={{ maxWidth: 900 }}>
      <Paper
        sx={{
          p: { xs: 2.25, sm: 3 },
          mb: 2.5,
          borderRadius: 2,
          background: "linear-gradient(145deg, rgba(15,118,110,0.96), rgba(22,78,99,0.9))",
          color: "#fff"
        }}>
        <Typography variant="h5" component="h1" sx={{ fontWeight: 800, mb: 0.5 }}>
          {isEditing ? "Edit patient" : "Add patient"}
        </Typography>
        <Typography sx={{ opacity: 0.84 }}>
          Your patient information. Make phone number unique to avoid duplicates. You can edit this information later.
        </Typography>
      </Paper>

      <Paper component="form" ref={formRef} onSubmit={handleSubmit} sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2 }}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1.5 }}>
          Patient basics
        </Typography>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
          <TextField
            label="Full name"
            value={form.fullName}
            onChange={(event) => updateField("fullName", event.target.value)}
            slotProps={{ htmlInput: { maxLength: 500 } }}
            required
          />
          <TextField
            select
            label="Gender"
            value={form.gender}
            onChange={(event) => updateField("gender", event.target.value)}
            required
          >
            <MenuItem value="Male">Male</MenuItem>
            <MenuItem value="Female">Female</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </TextField>
          <TextField
            label="Age"
            type="text"
            value={form.age === 0 ? "" : String(form.age)}
            onChange={(event) => updateField("age", event.target.value ? Number(event.target.value.slice(0, 3)) : 0)}
            slotProps={{ htmlInput: { inputMode: "numeric", pattern: "[0-9]*", maxLength: 3 } }}
            required
          />
          <TextField
            label="Phone"
            type="tel"
            value={form.phone || ""}
            onChange={(event) => updateField("phone", Number(event.target.value))}
            slotProps={{ htmlInput: { inputMode: "numeric", pattern: "[0-9]+", maxLength: 10 } }}
            required
          />
          <TextField
            select
            label="Branch"
            value={form.branchId || ""}
            onChange={(event) => updateField("branchId", Number(event.target.value))}
            disabled={branchesLoading}
            helperText={branchesLoading ? "Loading branches..." : undefined}
            required
          >
            {branches.length === 0 && !branchesLoading && (
              <MenuItem value="" disabled>No branches available</MenuItem>
            )}
            {branches.map((branch) => (
              <MenuItem key={branch.id} value={branch.id}>
                {branch.friendlyName}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Address"
            value={form.address}
            onChange={(event) => updateField("address", event.target.value)}
          />
          <TextField
            label="Medical history"
            value={form.medicalHistory}
            onChange={(event) => updateField("medicalHistory", event.target.value)}
            multiline
            minRows={3}
          />
          <TextField
            label="Chief complain"
            value={form.complain}
            onChange={(event) => updateField("complain", event.target.value)}
            multiline
            minRows={3}
          />
          <TextField
            label="Diagnosis"
            value={form.diagnosis}
            onChange={(event) => updateField("diagnosis", event.target.value)}
            multiline
            minRows={2}
            sx={{ gridColumn: { sm: "1 / -1" } }}
          />
          <TextField
            label="Treatment plan"
            value={form.treatmentPlan}
            onChange={(event) => updateField("treatmentPlan", event.target.value)}
            multiline
            minRows={2}
            sx={{ gridColumn: { sm: "1 / -1" } }}
          />
        </Box>

        <Divider sx={{ my: 3 }} />
        <Box sx={{ display: "flex", flexDirection: { xs: "column-reverse", sm: "row" }, gap: 1.5 }}>
          <Button
            type="button"
            variant="outlined"
            startIcon={<ArrowBackRoundedIcon />}
            onClick={() => navigate("/patients")}
            disabled={saving}
          >
            Back to patients
          </Button>
          <Button type="submit" variant="contained" startIcon={<SaveRoundedIcon />} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

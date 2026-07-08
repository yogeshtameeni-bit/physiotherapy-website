export interface Patient {
  id: number;

  branchId: number;

  fullName: string;

  gender: string;

  age: number;

  phone: number;

  address: string;

  medicalHistory: string;

  complain:string;
  diagnosis:string;
  treatmentPlan:string;
  branchName: string;
}
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
  isInquiryConvertedToPatient: boolean;
  treatmentPlan:string;
  branchName: string;
  createdDate:Date;
}
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import NoteRoundedIcon from "@mui/icons-material/NoteRounded";
import ExplicitIcon from '@mui/icons-material/Explicit';

export type NavigationItem = {
  title: string;
  path: string;
  icon: typeof DashboardRoundedIcon;
  matchPrefix?: boolean;
};

export const navigationItems: NavigationItem[] = [
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: DashboardRoundedIcon
  },
  {
    title: "Inquiries",
    path: "/inquiries",
    icon: NoteRoundedIcon
  },
  {
    title: "Patients",
    path: "/patients",
    icon: GroupsRoundedIcon,
    matchPrefix: true
  },
  {
    title: "History",
    path: "/payment-history",
    icon: ReceiptLongRoundedIcon,
    matchPrefix: true
  },
  {
    title: "Expenses",
    path: "/expenses",
    icon: ExplicitIcon,
    matchPrefix: true
  }
];

export function getPageTitle(pathname: string) {
  if (pathname.startsWith("/patients/add")) return "New patient";
  if (pathname.includes("/edit")) return "Edit patient";
  if (pathname.startsWith("/patients")) return "Patients";
  if (pathname.startsWith("/payment-history")) return "Payment history";
  return "Dashboard";
}

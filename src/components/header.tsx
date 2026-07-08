import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import logo from "../assets/images/logo.jpg";

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {

  return (
    <AppBar
      position="sticky"
      sx={{
        top: 12,
        mx: { xs: 1.5, md: 2.5 },
        width: "auto",
        borderRadius: 2,
        background: "rgba(15, 118, 110, 0.92)",
        backdropFilter: "blur(22px)",
        boxShadow: "0 18px 40px rgba(15, 118, 110, 0.18)"
      }}>
      <Toolbar sx={{ minHeight: { xs: 72, md: 84 }, px: { xs: 1, sm: 1.5 } }}>
        <IconButton
          color="inherit"
          onClick={onMenuClick}
          sx={{ display: { xs: "inline-flex", md: "none" }, mr: 1 }}>
          <MenuRoundedIcon />
        </IconButton>
        <Box sx={{ minWidth: 0, display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            component="img"
            src={logo}
            alt="logo"
            sx={{
              width: { xs: 42, md: 52 },
              height: { xs: 42, md: 52 },
              borderRadius: 1.5,
              objectFit: "cover",
              border: "2px solid rgba(255,255,255,0.35)"
            }}/>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="h6" sx={{ display: "block", opacity: 0.8, letterSpacing: 1 }}>
              NIYAT PHYSIOTHERAPY AND OBESITY CENTER
            </Typography>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

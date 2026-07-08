import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import { useLocation, useNavigate } from "react-router-dom";
import { navigationItems } from "../navigation";

const drawerWidth = 280;

type SidebarProps = {
  mobileOpen: boolean;
  onMobileClose: () => void;
};

export default function Sidebar({ mobileOpen, onMobileClose }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  function isActive(path: string, matchPrefix?: boolean) {
    return matchPrefix
      ? location.pathname.startsWith(path)
      : location.pathname === path;
  }

  const menuList = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column", p: 2 }}>
      <Box
        sx={{
          p: 2.25,
          mb: 2,
          borderRadius: 2,
          background: "linear-gradient(160deg, #0f766e 0%, #164e63 100%)",
          color: "#fff"
        }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Avatar sx={{ bgcolor: "rgba(255,255,255,0.16)", color: "#fff" }}>N</Avatar>
          <Box>
            <Typography variant="subtitle2" sx={{ opacity: 0.76 }}>
              WELCOME
            </Typography>
            <Typography variant="h6" sx={{ lineHeight: 1.1 }}>
              User
            </Typography>
          </Box>
        </Box>
      </Box>
      <List sx={{ p: 0 }}>
        {navigationItems.map((menu) => {
          const Icon = menu.icon;
          const active = isActive(menu.path, menu.matchPrefix);

          return (
            <ListItemButton
              key={menu.title}
              onClick={() => {
                navigate(menu.path);
                onMobileClose();
              }}
              selected={active}
              sx={{
                mb: 1,
                borderRadius: 1.5,
                px: 1.25,
                py: 1,
                "&.Mui-selected": {
                  bgcolor: "rgba(15, 118, 110, 0.1)",
                  color: "primary.main"
                }
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: "inherit" }}>
                <Icon />
              </ListItemIcon>
              <ListItemText primary={menu.title} />
            </ListItemButton>
          );
        })}
      </List>
    </Box>
  );

  return (
    <>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", md: "block" },
          width: drawerWidth,
          flexShrink: 0,
          p: 2,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            position: "relative",
            boxSizing: "border-box",
            background: "transparent",
            border: "none",
            p: 2
          }
        }}>
        {menuList}
      </Drawer>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            background: "#fffaf4"
          }
        }}>
        {menuList}
      </Drawer>
    </>
  );
}

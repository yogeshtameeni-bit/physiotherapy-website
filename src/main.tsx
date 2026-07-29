import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import "./main.css";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";

const theme = createTheme({
  palette: {
    primary: {
      main: "#0f766e",
      light: "#5eead4",
      dark: "#134e4a"
    },
    secondary: {
      main: "#f97316"
    },
    background: {
      default: "#f4efe7",
      paper: "#fffaf4"
    },
    text: {
      primary: "#1f2937",
      secondary: "#5b6473"
    }
  },
  shape: {
    borderRadius: 8
  },
  typography: {
    fontFamily: '"Aptos", "Trebuchet MS", "Segoe UI", sans-serif',
    h4: {
      fontWeight: 800
    },
    h5: {
      fontWeight: 800
    },
    h6: {
      fontWeight: 700
    },
    button: {
      fontWeight: 700,
      textTransform: "none"
    }
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          minHeight: "100svh",
          background:
            "radial-gradient(circle at top, #d6fff7 0%, #f4efe7 45%, #efe4d6 100%)",
          backgroundAttachment: "fixed"
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          boxShadow: "0 18px 40px rgba(74, 84, 104, 0.08)"
        }
      }
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true
      },
      styleOverrides: {
        root: {
          borderRadius: 8
        }
      }
    },
    MuiTextField: {
      defaultProps: {
        fullWidth: true
      }
    }
  }
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      
        <App />
      
    </ThemeProvider>
  </StrictMode>,
)

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {Box, Button, CircularProgress, Container, TextField, Typography, Alert,
  InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import api from '../services/api';
import LogoImage from '../assets/images/logo.jpg';

interface LoginProps {
  onLogin?: () => void;
}

interface LoginResponse {
  token: string;
  expires: string;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!userName.trim() || !password.trim()) {
      setError('Please enter both username and password');
      return;
    }

    setIsSubmitting(true);

    try {
      const resp = await api.post<LoginResponse>('/Auth/Login', {
        UserName: userName,
        Password: password
      });
      const { token, expires } = resp.data;
      localStorage.setItem('token', token);
      localStorage.setItem('tokenExpires', expires);
      onLogin?.();
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      setError(err?.response?.data?.message ?? err?.response?.data ?? 'Login failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4
      }}
    >
      <Container maxWidth="md" sx={{ px: { xs: 2, sm: 4 } }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1.2fr 1fr' },

            gap: 0,
            alignItems: 'stretch',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            background: '#fff'
          }}
        >
          {/* Left Side - Image/Info */}
          <Box
            sx={{
              background: 'linear-gradient(135deg, #0f766e 0%, #164e63 100%)',
              display: { xs: 'none', sm: 'flex' },
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              p: 4,
              color: '#fff',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: -50,
                right: -50,
                width: 200,
                height: 200,
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '50%'
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                bottom: -30,
                left: -30,
                width: 150,
                height: 150,
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '50%'
              }}
            />
            <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <Box
                component="img"
                src={LogoImage}
                alt="Niyat Physiotherapy Logo"
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '3px solid rgba(255, 255, 255, 0.2)'
                }}
              />
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 800,
                  mb: 1,
                  fontSize: { xs: '1.2rem', sm: '1.5rem' },
                  lineHeight: 1.3,
                  textAlign: 'center'
                }}>
                NIYAT PHYSIOTHERAPY & OBESITY CENTER
              </Typography>
              {/* <Typography
                variant="h6"
                sx={{
                  fontWeight: 800,
                  mb: 2,
                  fontSize: { xs: '0.9rem', sm: '1.1rem' },
                  lineHeight: 1.3,
                  textAlign: 'center'
                }}
              >
                & OBESITY CENTER
              </Typography> */}
              <Typography
                variant="body1"
                sx={{
                  mb: 3,
                  fontSize: '0.95rem',
                  opacity: 0.95,
                  lineHeight: 1.6
                }}>
                Welcome back to your daily records management
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  gap: 2,
                  justifyContent: 'center',
                  mt: 4
                }}
              >
                {['✓ Secure Access', '✓ Patient Care', '✓ Progress Tracking'].map((item) => (
                  <Typography key={item} variant="caption" sx={{ fontSize: '0.8rem' }}>
                    {item}
                  </Typography>
                ))}
              </Box>
            </Box>
          </Box>

          {/* Right Side - Login Form */}
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              p: { xs: 3, sm: 4 },
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}
          >
            <Box sx={{ mb: 1 }}>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  mb: 1,
                  color: '#1a1a1a'
                }}
              >
                Sign In
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: '#666',
                  mb: 3
                }}
              >
                Enter your credentials to access your account
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 2.5, borderRadius: '8px' }}>
                {error}
              </Alert>
            )}

            <TextField
              fullWidth
              label="Username"
              variant="outlined"
              value={userName}
              onChange={(e) => {
                setUserName(e.target.value);
                setError(null);
              }}
              disabled={isSubmitting}
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  '&:hover fieldset': {
                    borderColor: '#0f766e'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#0f766e'
                  }
                }
              }}
              placeholder="Enter your username"
            />

            <TextField
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              variant="outlined"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(null);
              }}
              disabled={isSubmitting}
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  '&:hover fieldset': {
                    borderColor: '#0f766e'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#0f766e'
                  }
                }
              }}
              placeholder="Enter your password"
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleClickShowPassword}
                        edge="end"
                        disabled={isSubmitting}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }
              }}
            />

            <Button
              fullWidth
              type="submit"
              variant="contained"
              disabled={isSubmitting}
              sx={{
                py: 1.5,
                mb: 2,
                background: 'linear-gradient(135deg, #0f766e 0%, #164e63 100%)',
                color: '#fff',
                fontWeight: 600,
                fontSize: '1rem',
                borderRadius: '8px',
                textTransform: 'none',
                boxShadow: '0 4px 15px rgba(15, 118, 110, 0.3)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: '0 6px 20px rgba(15, 118, 110, 0.4)',
                  transform: 'translateY(-2px)'
                },
                '&:disabled': {
                  background: 'linear-gradient(135deg, #0f766e 0%, #164e63 100%)',
                  opacity: 0.7
                }
              }}
            >
              {isSubmitting ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress size={20} sx={{ color: '#fff' }} />
                  <span>Signing in...</span>
                </Box>
              ) : (
                'Sign In'
              )}
            </Button>

            <Typography
              variant="caption"
              sx={{
                textAlign: 'center',
                color: '#999',
                fontSize: '0.8rem'
              }}
            >
              Secure login • Your data is protected
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Login;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

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
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
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
      setError(err?.response?.data ?? 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: 380, padding: 24, borderRadius: 12, background: '#fff', boxShadow: '0 12px 30px rgba(0,0,0,0.12)' }}>
        <h2 style={{ marginTop: 0, marginBottom: 20 }}>Login</h2>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 6 }}>Username</label>
          <input value={userName} onChange={e => setUserName(e.target.value)} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #cbd5e1' }} />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 6 }}>Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #cbd5e1' }} />
        </div>
        <button type="submit" disabled={isSubmitting} style={{ width: '100%', padding: 10, borderRadius: 8, border: 'none', background: '#0f766e', color: '#fff', cursor: 'pointer' }}>
          {isSubmitting ? 'Logging in...' : 'Login'}
        </button>
        {error && <div style={{ color: 'red', marginTop: 12 }}>{String(error)}</div>}
      </form>
    </div>
  );
};

export default Login;
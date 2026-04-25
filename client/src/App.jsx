import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout/Layout';
import Home from './pages/Home';
import Analyze from './pages/Analyze';
import History from './pages/History';
import Login from './pages/Login';
import Register from './pages/Register';
import MockInterview from './pages/MockInterview';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Toaster
            position="top-right"
            gutter={8}
            toastOptions={{
              duration: 3000,
              style: {
                background: 'var(--bg-surface)',
                color: 'var(--t1)',
                border: '1px solid var(--border-brand)',
                borderRadius: '12px',
                fontSize: '13px',
                fontFamily: 'Inter, sans-serif',
                padding: '10px 14px',
                boxShadow: 'var(--shadow-card)',
              },
              success: { iconTheme: { primary: '#34d399', secondary: 'var(--bg-surface)' } },
              error:   { iconTheme: { primary: '#f87171', secondary: 'var(--bg-surface)' } },
            }}
          />
          <Routes>
            <Route path="/login"    element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Layout />}>
              <Route index           element={<Home />} />
              <Route path="analyze"  element={<Analyze />} />
              <Route path="history"  element={<History />} />
              <Route path="mock"     element={<MockInterview />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

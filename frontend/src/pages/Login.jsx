import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Cpu, Eye, EyeOff, ArrowRight, Sparkles, Shield, Zap
} from 'lucide-react';

const API_BASE = 'http://localhost:8000';

// ── 3D Tilt Card Hook ──
function useTilt() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-150, 150], [8, -8]);
  const rotateY = useTransform(x, [-150, 150], [-8, 8]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  };
  const handleMouseLeave = () => { x.set(0); y.set(0); };

  return { rotateX, rotateY, handleMouseMove, handleMouseLeave };
}

// ── Animated Feature Pill ──
function FeaturePill({ icon: Icon, label, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay, duration: 0.5, type: 'spring', stiffness: 200 }}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.4rem',
        padding: '0.4rem 0.9rem',
        borderRadius: '30px',
        background: 'rgba(79,158,240,0.08)',
        border: '1px solid rgba(79,158,240,0.2)',
        color: '#7ea8cc',
        fontSize: '0.78rem',
        fontWeight: 600,
        letterSpacing: '0.04em',
      }}
    >
      <Icon size={12} />
      {label}
    </motion.div>
  );
}

// ── Floating Particle (CSS) ──
function FloatingParticles() {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    size: Math.random() * 4 + 2,
    left: Math.random() * 100,
    duration: Math.random() * 15 + 10,
    delay: Math.random() * 10,
    color: ['#ffffff', '#aaaaaa', '#666666'][Math.floor(Math.random() * 3)],
  }));

  return (
    <div className="particle-field" aria-hidden>
      {particles.map(p => (
        <div
          key={p.id}
          className="particle"
          style={{
            width: p.size, height: p.size,
            left: `${p.left}%`,
            background: p.color,
            boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

export default function Login() {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { rotateX, rotateY, handleMouseMove, handleMouseLeave } = useTilt();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess(''); setLoading(true);

    try {
      if (mode === 'login') {
        const res = await axios.post(
          `${API_BASE}/auth/login?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`
        );
        if (res.data.access_token) {
          localStorage.setItem('token', res.data.access_token);
          navigate('/dashboard');
        } else {
          setError(res.data.error || 'Login failed. Check credentials.');
        }
      } else {
        const res = await axios.post(
          `${API_BASE}/auth/register?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`
        );
        if (res.data.msg) {
          setSuccess('Account created! Signing you in...');
          setMode('login');
        } else {
          setError('Registration failed. Try again.');
        }
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Connection error. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex-center" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Background layers */}
      <div className="nebula nebula-1" />
      <div className="nebula nebula-2" />
      <div className="nebula nebula-3" />
      <div className="grid-bg" />
      <FloatingParticles />

      {/* Left decorative panel — hidden on mobile */}
      <motion.div
        initial={{ opacity: 0, x: -60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        style={{
          position: 'absolute',
          left: '5%',
          top: '50%',
          transform: 'translateY(-50%)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          zIndex: 1,
        }}
        className="desktop-only"
      >
        {[
          { icon: '🤖', label: 'GPT-4o Powered' },
          { icon: '📄', label: 'PDF + DOCX' },
          { icon: '⚡', label: '<500ms Queries' },
          { icon: '🔒', label: 'JWT Secured' },
        ].map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + i * 0.15 }}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              padding: '0.7rem 1.1rem',
              background: 'rgba(10,15,30,0.6)',
              border: '1px solid rgba(79,158,240,0.12)',
              borderRadius: '12px',
              backdropFilter: 'blur(12px)',
              color: '#7ea8cc',
              fontSize: '0.82rem',
              fontWeight: 500,
            }}
          >
            <span style={{ fontSize: '1.1rem' }}>{item.icon}</span>
            {item.label}
          </motion.div>
        ))}
      </motion.div>

      {/* ── MAIN CARD ── */}
      <motion.div
        style={{
          rotateX, rotateY,
          transformStyle: 'preserve-3d',
          perspective: 1000,
          zIndex: 10,
          width: '100%',
          maxWidth: '430px',
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, type: 'spring', stiffness: 150 }}
      >
        <div className="glass neon-border" style={{ padding: '2.5rem' }}>
          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <motion.div
              animate={{ rotateY: [0, 360] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
              style={{ display: 'inline-block', marginBottom: '1rem' }}
            >
              <div style={{
                width: 60, height: 60,
                background: 'linear-gradient(135deg, #ffffff, #aaaaaa)',
                borderRadius: '16px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto',
                boxShadow: '0 0 30px rgba(255,255,255,0.2), 0 0 60px rgba(255,255,255,0.1)',
              }}>
                <Cpu size={28} color="#000" />
              </div>
            </motion.div>

            <motion.h1
              className="gradient-text"
              style={{ fontSize: '1.9rem', marginBottom: '0.4rem' }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              DocAI
            </motion.h1>
            <p style={{ color: '#7ea8cc', fontSize: '0.88rem', marginBottom: '1.25rem' }}>
              {mode === 'login' ? 'Sign in to your workspace' : 'Create your free account'}
            </p>

            {/* Feature pills */}
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <FeaturePill icon={Sparkles} label="AI-Powered" delay={0.4} />
              <FeaturePill icon={Shield} label="Secure" delay={0.5} />
              <FeaturePill icon={Zap} label="Instant" delay={0.6} />
            </div>
          </div>

          {/* Mode Toggle */}
          <div style={{
            display: 'flex',
            background: 'rgba(5,10,25,0.7)',
            borderRadius: '12px',
            padding: '4px',
            marginBottom: '1.75rem',
            border: '1px solid rgba(79,158,240,0.1)',
          }}>
            {['login', 'register'].map(m => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(''); setSuccess(''); }}
                style={{
                  flex: 1, padding: '0.55rem',
                  borderRadius: '9px',
                  border: 'none',
                  fontFamily: 'var(--font)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  background: mode === m
                    ? '#ffffff'
                    : 'transparent',
                  color: mode === m ? '#000000' : '#a0a0a0',
                  boxShadow: mode === m ? '0 2px 12px rgba(255,255,255,0.2)' : 'none',
                  textTransform: 'capitalize',
                }}
              >
                {m === 'login' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>

          {/* Alerts */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                style={{
                  padding: '0.7rem 1rem',
                  background: 'rgba(255,107,107,0.08)',
                  border: '1px solid rgba(255,107,107,0.25)',
                  borderRadius: '10px',
                  color: '#ff6b6b',
                  fontSize: '0.82rem',
                  marginBottom: '1.25rem',
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                }}
              >
                ⚠ {error}
              </motion.div>
            )}
            {success && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                style={{
                  padding: '0.7rem 1rem',
                  background: 'rgba(6,214,160,0.08)',
                  border: '1px solid rgba(6,214,160,0.25)',
                  borderRadius: '10px',
                  color: '#06d6a0',
                  fontSize: '0.82rem',
                  marginBottom: '1.25rem',
                }}
              >
                ✓ {success}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label className="input-label">Email Address</label>
              <input
                id="email"
                type="email"
                className="input-field"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className="input-group">
              <label className="input-label">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="password"
                  type={showPass ? 'text' : 'password'}
                  className="input-field"
                  placeholder="••••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  style={{ paddingRight: '3rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{
                    position: 'absolute', right: '1rem', top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none', border: 'none',
                    color: '#3a5878', cursor: 'pointer', padding: 0,
                  }}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <motion.button
              type="submit"
              className="btn btn-primary w-full"
              style={{ marginTop: '0.5rem', padding: '0.9rem', fontSize: '1rem' }}
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <svg className="spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 12a9 9 0 11-6.219-8.56" />
                  </svg>
                  {mode === 'login' ? 'Signing in...' : 'Creating account...'}
                </span>
              ) : (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {mode === 'login' ? 'Sign In' : 'Create Account'}
                  <ArrowRight size={18} />
                </span>
              )}
            </motion.button>
          </form>

          {/* Footer */}
          <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.78rem', color: '#3a5878', marginBottom: 0 }}>
            By continuing, you agree to our{' '}
            <span style={{ color: '#4f9ef0', cursor: 'pointer' }}>Terms of Service</span>
            {' & '}
            <span style={{ color: '#4f9ef0', cursor: 'pointer' }}>Privacy Policy</span>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

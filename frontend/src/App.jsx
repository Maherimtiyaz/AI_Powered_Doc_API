import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Landing from './pages/Landing';

// Lazy-load heavy 3D scene
const Scene3D = React.lazy(() => import('./components/Scene3D'));

import './index.css';

function SceneFallback() {
  return <div style={{ position: 'fixed', inset: 0, background: 'var(--bg)', zIndex: 0 }} />;
}

export default function App() {
  return (
    <Router>
      <div className="app-container">
        {/* Global 3D background */}
        <div className="canvas-bg">
          <Suspense fallback={<SceneFallback />}>
            <Scene3D />
          </Suspense>
        </div>

        {/* Page routes */}
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </div>
    </Router>
  );
}

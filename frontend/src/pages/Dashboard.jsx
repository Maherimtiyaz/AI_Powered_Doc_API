import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Upload, LogOut, MessageSquare, FileText, Send,
  Cpu, CheckCircle, AlertCircle, Loader2, Trash2, ChevronRight, Bot, User
} from 'lucide-react';

const API_BASE = 'http://localhost:8000';

function ThinkingDots() {
  return (
    <span className="thinking-dots" style={{ display: 'inline-flex', gap: '3px', alignItems: 'center' }}>
      {[0,1,2].map(i => (
        <span key={i} style={{
          width: 6, height: 6, borderRadius: '50%',
          background: '#ffffff', display: 'inline-block',
          animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`
        }} />
      ))}
    </span>
  );
}

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <motion.div
      className="glass-card"
      style={{ padding: '1.2rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}
      whileHover={{ scale: 1.03 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <div style={{
        width: 44, height: 44, borderRadius: '12px',
        background: `${color}18`, border: `1px solid ${color}30`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
      }}>
        <Icon size={20} color={color} />
      </div>
      <div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>{label}</p>
        <p style={{ color: 'var(--text-primary)', fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>{value}</p>
      </div>
    </motion.div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [fileId, setFileId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [query, setQuery] = useState('');
  const [asking, setAsking] = useState(false);
  const [msgCount, setMsgCount] = useState(0);
  const fileInputRef = useRef(null);
  const chatEndRef = useRef(null);
  const token = localStorage.getItem('token');

  useEffect(() => { if (!token) navigate('/login'); }, [token, navigate]);
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [chatHistory, asking]);

  const handleLogout = () => { localStorage.removeItem('token'); navigate('/login'); };

  const handleDrop = (e) => {
    e.preventDefault(); setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f && f.type === 'application/pdf') setFile(f);
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await axios.post(`${API_BASE}/docs/upload?token=${token}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setFileId(res.data.file_id);
      setChatHistory([{ role: 'system', content: `✓ "${file.name}" processed and ready. Ask anything!` }]);
    } catch (err) {
      alert('Upload failed: ' + (err.response?.data?.detail || err.message));
    } finally { setUploading(false); }
  };

  const handleAsk = async (e) => {
    e.preventDefault();
    if (!query.trim() || !fileId) return;
    const q = query;
    setQuery('');
    setChatHistory(prev => [...prev, { role: 'user', content: q }]);
    setAsking(true);
    setMsgCount(c => c + 1);
    try {
      const res = await axios.post(`${API_BASE}/ai/ask`, { query: q, file_id: fileId });
      setChatHistory(prev => [...prev, { role: 'ai', content: res.data.answer }]);
    } catch {
      setChatHistory(prev => [...prev, { role: 'system', content: '⚠ Could not get a response. Try again.' }]);
    } finally { setAsking(false); }
  };

  if (!token) return null;

  return (
    <div className="page-wrapper" style={{ minHeight: '100vh' }}>
      {/* Background */}
      <div className="nebula nebula-1" /><div className="nebula nebula-2" /><div className="nebula nebula-3" />
      <div className="grid-bg" />

      <div className="container" style={{ paddingTop: '1.5rem', paddingBottom: '2rem', position: 'relative', zIndex: 1 }}>

        {/* ── HEADER ── */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            marginBottom: '1.75rem',
            padding: '1rem 1.5rem',
            background: 'rgba(5,10,25,0.7)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(79,158,240,0.1)',
            borderRadius: '16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: 40, height: 40, borderRadius: '10px',
              background: '#ffffff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 20px rgba(255,255,255,0.2)',
            }}>
              <Cpu size={20} color="#000" />
            </div>
            <div>
              <h1 className="gradient-text" style={{ fontSize: '1.25rem', margin: 0, lineHeight: 1 }}>DocAI</h1>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', margin: 0 }}>AI Document Intelligence</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {fileId && <span className="badge badge-success"><CheckCircle size={10} /> Document Ready</span>}
            <motion.button
              className="btn btn-ghost"
              style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
              onClick={handleLogout}
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
            >
              <LogOut size={15} /> Logout
            </motion.button>
          </div>
        </motion.header>

        {/* ── STAT CARDS ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.75rem' }}
          className="stat-grid"
        >
          <StatCard icon={FileText} label="Document" value={file ? '1 Loaded' : 'None'} color="#ffffff" />
          <StatCard icon={MessageSquare} label="Messages" value={msgCount} color="#cccccc" />
          <StatCard icon={Bot} label="AI Status" value={fileId ? 'Ready' : 'Idle'} color="#aaaaaa" />
        </motion.div>

        {/* ── MAIN GRID ── */}
        <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: '1.5rem', height: 'calc(100vh - 310px)', minHeight: '480px' }}>

          {/* ── UPLOAD PANEL ── */}
          <motion.div
            className="glass-card"
            style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', height: '100%' }}
            initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div>
              <h2 style={{ fontSize: '1rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Upload size={17} color="#ffffff" /> Upload Document
              </h2>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0.35rem 0 0' }}>PDF files supported</p>
            </div>

            <hr className="sep" style={{ margin: 0 }} />

            {/* Drop zone */}
            <div
              className={`upload-zone ${dragOver ? 'drag-over' : ''} ${file ? 'has-file' : ''}`}
              style={{ flex: 1 }}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
            >
              <input ref={fileInputRef} type="file" accept=".pdf" style={{ display: 'none' }} onChange={e => setFile(e.target.files?.[0])} />

              <AnimatePresence mode="wait">
                {file ? (
                  <motion.div key="file" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                    <CheckCircle size={40} color="#ffffff" style={{ marginBottom: '0.75rem', filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.3))' }} />
                    <p style={{ color: '#ffffff', fontWeight: 600, fontSize: '0.9rem', wordBreak: 'break-all', margin: '0 0 0.3rem' }}>{file.name}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>{(file.size / 1024).toFixed(1)} KB</p>
                  </motion.div>
                ) : (
                  <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}>
                      <Upload size={40} color="#aaaaaa" style={{ marginBottom: '0.75rem' }} />
                    </motion.div>
                    <p style={{ color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.9rem', margin: '0 0 0.3rem' }}>
                      {dragOver ? 'Drop it here!' : 'Click or drag PDF'}
                    </p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>PDF only · Max 10MB</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <motion.button
                className="btn btn-primary w-full"
                disabled={!file || uploading || !!fileId}
                onClick={handleUpload}
                whileHover={{ scale: !file || uploading ? 1 : 1.02 }}
                whileTap={{ scale: 0.97 }}
              >
                {uploading ? <><Loader2 size={16} className="spin" /> Processing...</> : fileId ? <><CheckCircle size={16} /> Processed</> : <><ChevronRight size={16} /> Process Document</>}
              </motion.button>
              {file && (
                <motion.button
                  className="btn btn-ghost w-full"
                  style={{ fontSize: '0.82rem', padding: '0.55rem' }}
                  onClick={() => { setFile(null); setFileId(null); setChatHistory([]); }}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                >
                  <Trash2 size={13} /> Clear
                </motion.button>
              )}
            </div>
          </motion.div>

          {/* ── CHAT PANEL ── */}
          <motion.div
            className="glass-card"
            style={{ display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden', height: '100%' }}
            initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 }}
          >
            {/* Chat header */}
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: 36, height: 36, borderRadius: '10px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bot size={18} color="#ffffff" />
              </div>
              <div>
                <h2 style={{ fontSize: '0.95rem', margin: 0 }}>AI Chat</h2>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: 0 }}>
                  {fileId ? 'Document loaded · Ask anything' : 'Upload a document to begin'}
                </p>
              </div>
              {fileId && (
                <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#ffffff', animation: 'pulse 2s infinite' }} />
                  <span style={{ fontSize: '0.72rem', color: '#ffffff', fontWeight: 600 }}>LIVE</span>
                </div>
              )}
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {!fileId && chatHistory.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', color: 'var(--text-muted)', textAlign: 'center' }}
                >
                  <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 3, repeat: Infinity }}>
                    <MessageSquare size={48} color="#333333" />
                  </motion.div>
                  <div>
                    <p style={{ color: 'var(--text-secondary)', fontWeight: 600, margin: '0 0 0.3rem' }}>No document loaded</p>
                    <p style={{ fontSize: '0.82rem', margin: 0 }}>Upload a PDF to start chatting with AI</p>
                  </div>
                </motion.div>
              )}

              <AnimatePresence>
                {chatHistory.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 12, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    style={{ display: 'flex', alignItems: 'flex-end', gap: '0.6rem', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row' }}
                  >
                    {msg.role !== 'system' && (
                      <div style={{
                        width: 28, height: 28, borderRadius: '8px', flexShrink: 0,
                        background: msg.role === 'user' ? '#ffffff' : 'rgba(255,255,255,0.1)',
                        border: msg.role === 'ai' ? '1px solid rgba(255,255,255,0.2)' : 'none',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        {msg.role === 'user' ? <User size={14} color="#000" /> : <Bot size={14} color="#fff" />}
                      </div>
                    )}
                    <div className={
                      msg.role === 'user' ? 'chat-bubble-user' :
                      msg.role === 'ai' ? 'chat-bubble-ai' : 'chat-bubble-system'
                    } style={{ margin: msg.role === 'system' ? '0 auto' : undefined }}>
                      {msg.content}
                    </div>
                  </motion.div>
                ))}

                {asking && (
                  <motion.div
                    key="thinking"
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    style={{ display: 'flex', alignItems: 'flex-end', gap: '0.6rem' }}
                  >
                    <div style={{ width: 28, height: 28, borderRadius: '8px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Bot size={14} color="#fff" />
                    </div>
                    <div className="chat-bubble-ai" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <ThinkingDots />
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Thinking...</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleAsk} style={{ padding: '1.25rem 1.5rem', borderTop: '1px solid var(--border)', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <input
                id="chat-input"
                type="text"
                className="input-field"
                style={{ flex: 1, marginBottom: 0 }}
                placeholder={fileId ? 'Ask anything about your document...' : 'Upload a document first...'}
                value={query}
                onChange={e => setQuery(e.target.value)}
                disabled={!fileId || asking}
              />
              <motion.button
                type="submit"
                className="btn btn-primary"
                style={{ padding: '0.75rem 1.1rem', flexShrink: 0 }}
                disabled={!fileId || asking || !query.trim()}
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              >
                {asking ? <Loader2 size={18} className="spin" /> : <Send size={18} />}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @media(max-width:768px){
          .stat-grid{grid-template-columns:1fr!important}
          .dashboard-grid{grid-template-columns:1fr!important;height:auto!important}
        }
      `}</style>
    </div>
  );
}

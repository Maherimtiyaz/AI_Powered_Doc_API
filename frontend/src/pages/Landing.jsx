import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, FileText, Bot, Zap, Shield } from 'lucide-react';

const Sparkles = ({ size, style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    <path d="M5 3v4" />
    <path d="M19 17v4" />
    <path d="M3 5h4" />
    <path d="M17 19h4" />
  </svg>
);

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen page-wrapper" style={{ position: 'relative', overflow: 'hidden', padding: '0 2rem' }}>
      {/* Navbar */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '2rem 0', maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 700, fontSize: '1.25rem' }}
        >
          <div style={{ width: 36, height: 36, background: '#fff', color: '#000', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FileText size={20} />
          </div>
          DocAI
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          style={{ display: 'flex', gap: '1rem' }}
        >
          <button className="btn btn-ghost" onClick={() => navigate('/login')}>Login</button>
          <button className="btn btn-primary" onClick={() => navigate('/login')}>Get Started</button>
        </motion.div>
      </nav>

      {/* Hero Section */}
      <div style={{ maxWidth: '1200px', margin: '6rem auto 4rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', position: 'relative', zIndex: 10 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ display: 'inline-flex', alignItems: 'center', padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '30px', marginBottom: '2rem', fontSize: '0.85rem', letterSpacing: '0.05em' }}
        >
          <Sparkles size={14} style={{ marginRight: '0.5rem' }} />
          THE FUTURE OF DOCUMENT INTELLIGENCE
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{ fontSize: 'clamp(3rem, 8vw, 5.5rem)', fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.03em', marginBottom: '1.5rem' }}
        >
          Chat with your <br />
          <span style={{ color: '#888' }}>PDF documents.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          style={{ maxWidth: '600px', color: '#a0a0a0', fontSize: '1.15rem', marginBottom: '3rem' }}
        >
          Upload any document and instantly get answers, summaries, and insights. Powered by advanced AI to extract exactly what you need.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}
        >
          <button className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem', borderRadius: '30px' }} onClick={() => navigate('/login')}>
            Start for free <ArrowRight size={20} style={{ marginLeft: '0.5rem' }} />
          </button>
        </motion.div>
      </div>

      {/* Features */}
      <div style={{ maxWidth: '1200px', margin: '4rem auto 8rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', position: 'relative', zIndex: 10 }}>
        {[
          { icon: Bot, title: 'AI-Powered Analysis', desc: 'State-of-the-art language models analyze your documents in seconds.' },
          { icon: Zap, title: 'Instant Answers', desc: 'Ask questions and get exact answers with citations from your text.' },
          { icon: Shield, title: 'Secure & Private', desc: 'Your documents are encrypted and never used to train public models.' }
        ].map((feat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: i * 0.2 }}
            style={{ padding: '2rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', backdropFilter: 'blur(10px)' }}
          >
            <div style={{ width: 48, height: 48, borderRadius: '14px', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
              <feat.icon size={24} color="#fff" />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>{feat.title}</h3>
            <p style={{ color: '#888', margin: 0 }}>{feat.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

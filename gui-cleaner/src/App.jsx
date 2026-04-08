import React, { useState, useEffect } from 'react';
import { 
  Shield, Trash2, Activity, Zap, 
  Home, BarChart3, History, Settings,
  Terminal, XCircle, RefreshCcw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const App = () => {
  const [stats, setStats] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCleaning, setIsCleaning] = useState(false);
  const [logs, setLogs] = useState([]);
  const [activeTab, setActiveTab] = useState('home');
  const [showConsole, setShowConsole] = useState(false);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      if (window.electronAPI) {
        const s = await window.electronAPI.getStats();
        setStats(s);
        const admin = await window.electronAPI.checkAdmin();
        setIsAdmin(admin);
      }
    } catch (e) {
      console.error("Failed to load data", e);
    }
  };

  const handleClean = async () => {
    if (isCleaning) return;
    setIsCleaning(true);
    setShowConsole(true);
    setLogs([{ id: Date.now(), message: 'Iniciando limpeza via Script Python original...', type: 'warning', time: new Date().toLocaleTimeString() }]);

    try {
      if (window.electronAPI) {
        const result = await window.electronAPI.runPythonScript();
        const lines = result.output.split('\n');
        lines.forEach((line, index) => {
          if (line.trim()) {
            let type = 'info';
            if (line.includes('limpos com sucesso')) type = 'success';
            if (line.includes('Erro')) type = 'error';
            setLogs(prev => [{ id: Date.now() + index, message: line.trim(), type: type, time: new Date().toLocaleTimeString() }, ...prev]);
          }
        });
      } else {
        setLogs(prev => [{ id: Date.now(), message: 'Erro: API do Electron não detectada. Use o App Desktop.', type: 'error', time: new Date().toLocaleTimeString() }, ...prev]);
      }
    } catch (e) {
      setLogs(prev => [{ id: Date.now(), message: `Falha: ${e.message}`, type: 'error', time: new Date().toLocaleTimeString() }, ...prev]);
    }
    setIsCleaning(false);
    loadData();
  };

  const totalFiles = stats.reduce((acc, curr) => acc + (curr.count || 0), 0);
  const clutterLevel = Math.min((totalFiles / 500) * 100, 100);

  return (
    <div className="app-container no-drag">
      <div className="drag-region"></div>
      <aside className="sidebar">
        <div className="sidebar-logo">
          <Zap size={28} style={{ color: '#4f46e5' }} />
          <span>GigaClean</span>
        </div>
        <nav className="sidebar-nav">
          <NavItem icon={<Home size={20} />} label="Dashboard" active={activeTab === 'home'} onClick={() => setActiveTab('home')} />
          <NavItem icon={<BarChart3 size={20} />} label="Análise" active={activeTab === 'stats'} onClick={() => setActiveTab('stats')} />
          <NavItem icon={<History size={20} />} label="Log de Arquivos" active={activeTab === 'history'} onClick={() => setActiveTab('history')} />
        </nav>
        <div style={{ marginTop: 'auto' }}>
          <div className="admin-badge">
            <Shield size={14} color={isAdmin ? '#10b981' : '#f59e0b'} />
            <span style={{ fontSize: '11px', fontWeight: 'bold' }}>{isAdmin ? 'MODO ADMIN' : 'MODO COMUM'}</span>
          </div>
          <NavItem icon={<Settings size={20} />} label="Configurações" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
        </div>
      </aside>

      <main className="main-content">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div key="home" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="hero-dashboard">
                <div className="circular-indicator">
                  <svg viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="#1e293b" strokeWidth="8" />
                    <motion.circle cx="50" cy="50" r="45" fill="none" stroke="#4f46e5" strokeWidth="8" strokeDasharray="283" initial={{ strokeDashoffset: 283 }} animate={{ strokeDashoffset: 283 - (283 * (clutterLevel / 100)) }} transition={{ duration: 1.5 }} strokeLinecap="round" />
                  </svg>
                  <div className="gauge-text">
                    <span className="gauge-value">{totalFiles}</span>
                    <span className="gauge-label">Arquivos</span>
                  </div>
                </div>
                <h1>Seu PC está {totalFiles > 100 ? 'Pesado' : 'Limpo'}</h1>
                <button className="btn-main" onClick={handleClean} disabled={isCleaning}>{isCleaning ? 'Limpando...' : 'OTIMIZAR AGORA'}</button>
              </div>
            </motion.div>
          )}

          {activeTab === 'stats' && (
            <motion.div key="stats" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 style={{ marginBottom: '24px' }}>Análise de Localização</h2>
              <div className="stats-grid">
                {stats.map((item, idx) => (
                  <div key={idx} className="stat-card">
                    <h3>{item.name}</h3>
                    <p style={{ color: '#64748b', fontSize: '12px' }}>{item.path}</p>
                    <div style={{ marginTop: '8px', fontSize: '14px' }}>{item.count} arquivos</div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'history' && (
            <motion.div key="history" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 style={{ marginBottom: '24px' }}>Histórico</h2>
              <div className="history-container">
                {logs.map((log, i) => (
                  <div key={i} className={`log-entry ${log.type}`}>
                    <span>[{log.time}]</span> {log.message}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
          {activeTab === 'settings' && (
            <motion.div key="settings" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 style={{ marginBottom: '24px' }}>Configurações</h2>
              <div className="stat-card">
                <h3>GigaClean Versão 1.0</h3>
                <p style={{ color: '#64748b', fontSize: '14px', marginTop: '12px' }}>
                  Seu motor de limpeza Python está integrado e pronto para uso.
                </p>
                <div style={{ marginTop: '24px', padding: '12px', border: '1px solid #1e293b', borderRadius: '8px', background: 'rgba(255,255,255,0.02)', fontSize: '12px', color: '#94a3b8' }}>
                  Licença: Usuário Pessoal (Carlos Dayton)
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button className="console-toggle" onClick={() => setShowConsole(!showConsole)}>
          <Terminal size={16} /> CONSOLE
        </button>
      </main>

      <AnimatePresence>
        {showConsole && (
          <motion.div className="console-drawer" initial={{ y: 240 }} animate={{ y: 0 }} exit={{ y: 240 }}>
            <div className="console-header">
              <span>OPERATIONS LOG</span>
              <XCircle size={16} onClick={() => setShowConsole(false)} style={{ cursor: 'pointer' }} />
            </div>
            <div className="console-content">
              {logs.map(log => (
                <div key={log.id} style={{ color: log.type === 'error' ? '#f43f5e' : log.type === 'success' ? '#10b981' : '#94a3b8' }}>
                  [{log.time}] {log.message}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const NavItem = ({ icon, label, active, onClick }) => (
  <button className={`nav-item ${active ? 'active' : ''}`} onClick={onClick}>
    {icon}
    <span>{label}</span>
  </button>
);

export default App;

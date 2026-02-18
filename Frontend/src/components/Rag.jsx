// 'use client';
// import React, { useState, useEffect, useRef, useCallback } from 'react';
// import AxiosInstance from "@/components/AxiosInstance";

// /* ─────────────────────────────────────────────────────────────
//    INLINE STYLES & KEYFRAMES  (no Tailwind needed for custom bits)
// ───────────────────────────────────────────────────────────────*/
// const STYLES = `
//   @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;700&family=Syne:wght@400;600;700;800&display=swap');

//   :root {
//     --bg:        #070a0f;
//     --surface:   #0d1117;
//     --surface2:  #111820;
//     --border:    #1e2d3d;
//     --amber:     #f59e0b;
//     --amber-dim: #92610a;
//     --amber-glow:#fbbf24;
//     --cyan:      #06b6d4;
//     --green:     #10b981;
//     --red:       #ef4444;
//     --purple:    #a855f7;
//     --text:      #cbd5e1;
//     --text-dim:  #475569;
//     --mono: 'JetBrains Mono', monospace;
//     --sans: 'Syne', sans-serif;
//   }

//   .rag-root * { box-sizing: border-box; margin: 0; padding: 0; }
//   .rag-root { font-family: var(--mono); background: var(--bg); min-height: 100vh; color: var(--text); }

//   @keyframes scanline {
//     0%   { transform: translateY(-100%); }
//     100% { transform: translateY(100vh); }
//   }
//   @keyframes pulse-amber {
//     0%, 100% { box-shadow: 0 0 0 0 rgba(245,158,11,.4); }
//     50%       { box-shadow: 0 0 0 8px rgba(245,158,11,0); }
//   }
//   @keyframes fadeSlideUp {
//     from { opacity:0; transform:translateY(16px); }
//     to   { opacity:1; transform:translateY(0); }
//   }
//   @keyframes blink { 0%,49%{opacity:1} 50%,100%{opacity:0} }
//   @keyframes spin   { to { transform:rotate(360deg); } }
//   @keyframes shimmer{
//     0%   { background-position: -200% 0; }
//     100% { background-position:  200% 0; }
//   }
//   @keyframes tick {
//     from { width:0; }
//     to   { width:100%; }
//   }
//   @keyframes glitch {
//     0%,100%{clip-path:inset(0 0 98% 0)} 5%{clip-path:inset(30% 0 50% 0)}
//     10%{clip-path:inset(80% 0 5% 0)} 15%{clip-path:inset(10% 0 70% 0)}
//     20%{clip-path:inset(0 0 98% 0)}
//   }

//   .scanline-overlay {
//     pointer-events:none; position:fixed; inset:0; z-index:1000;
//     background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,.03) 2px, rgba(0,0,0,.03) 4px);
//   }

//   .cursor::after { content:'█'; animation:blink 1s step-end infinite; color:var(--amber); }

//   .amber-btn {
//     background: transparent;
//     border: 1px solid var(--amber);
//     color: var(--amber);
//     font-family: var(--mono);
//     font-size:.75rem; letter-spacing:.1em; text-transform:uppercase;
//     padding: .5rem 1.25rem; cursor:pointer;
//     transition: background .15s, color .15s, box-shadow .15s;
//     position: relative; overflow: hidden;
//   }
//   .amber-btn::before {
//     content:''; position:absolute; inset:0;
//     background: var(--amber); transform:scaleX(0); transform-origin:left;
//     transition:transform .2s ease;
//   }
//   .amber-btn:hover::before { transform:scaleX(1); }
//   .amber-btn:hover { color:#000; }
//   .amber-btn:disabled { opacity:.35; cursor:not-allowed; }
//   .amber-btn:disabled::before { display:none; }
//   .amber-btn span { position:relative; z-index:1; }

//   .ghost-btn {
//     background:transparent; border:1px solid var(--border);
//     color:var(--text-dim); font-family:var(--mono); font-size:.7rem;
//     letter-spacing:.08em; text-transform:uppercase;
//     padding:.4rem 1rem; cursor:pointer;
//     transition: border-color .15s, color .15s;
//   }
//   .ghost-btn:hover { border-color:var(--amber); color:var(--amber); }
//   .ghost-btn.active { border-color:var(--amber); color:var(--amber); background:rgba(245,158,11,.07); }

//   .red-btn {
//     background:transparent; border:1px solid var(--red);
//     color:var(--red); font-family:var(--mono); font-size:.7rem;
//     letter-spacing:.08em; text-transform:uppercase;
//     padding:.4rem 1rem; cursor:pointer;
//     transition: background .15s, color .15s;
//   }
//   .red-btn:hover { background:var(--red); color:#fff; }

//   .card {
//     background:var(--surface); border:1px solid var(--border);
//     padding:1.5rem; animation: fadeSlideUp .3s ease;
//   }

//   .input-field {
//     width:100%; background:var(--surface2); border:1px solid var(--border);
//     color:var(--text); font-family:var(--mono); font-size:.8rem;
//     padding:.6rem .9rem; outline:none;
//     transition:border-color .15s;
//   }
//   .input-field:focus { border-color:var(--amber); }
//   .input-field::placeholder { color:var(--text-dim); }

//   .select-field {
//     width:100%; background:var(--surface2); border:1px solid var(--border);
//     color:var(--text); font-family:var(--mono); font-size:.8rem;
//     padding:.6rem .9rem; outline:none; cursor:pointer;
//     transition:border-color .15s; appearance:none;
//     background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%23475569' viewBox='0 0 16 16'%3E%3Cpath d='M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/%3E%3C/svg%3E");
//     background-repeat:no-repeat; background-position:calc(100% - .75rem) center;
//     padding-right:2rem;
//   }
//   .select-field:focus { border-color:var(--amber); }

//   .stat-pill {
//     display:flex; flex-direction:column; align-items:center; justify-content:center;
//     background:var(--surface); border:1px solid var(--border);
//     padding:.75rem 1.25rem; min-width:90px;
//     position:relative; overflow:hidden;
//   }
//   .stat-pill::after {
//     content:''; position:absolute; bottom:0; left:0; right:0; height:2px;
//     background:var(--amber);
//   }
//   .stat-number { font-family:var(--sans); font-size:1.6rem; font-weight:700; line-height:1; }
//   .stat-label  { font-size:.6rem; letter-spacing:.12em; text-transform:uppercase; color:var(--text-dim); margin-top:.25rem; }

//   .tag {
//     display:inline-flex; align-items:center; gap:.3rem;
//     font-size:.6rem; letter-spacing:.1em; text-transform:uppercase;
//     padding:.2rem .55rem; border:1px solid; font-family:var(--mono);
//   }
//   .tag-amber  { color:var(--amber);  border-color:var(--amber-dim);  background:rgba(245,158,11,.06); }
//   .tag-cyan   { color:var(--cyan);   border-color:rgba(6,182,212,.3); background:rgba(6,182,212,.06); }
//   .tag-green  { color:var(--green);  border-color:rgba(16,185,129,.3);background:rgba(16,185,129,.06);}
//   .tag-red    { color:var(--red);    border-color:rgba(239,68,68,.3); background:rgba(239,68,68,.06); }
//   .tag-purple { color:var(--purple); border-color:rgba(168,85,247,.3);background:rgba(168,85,247,.06);}

//   .react-step {
//     border-left:2px solid var(--border);
//     padding-left:1rem; margin-left:.5rem;
//     animation:fadeSlideUp .25s ease;
//   }
//   .react-step.thought { border-color:var(--purple); }
//   .react-step.action  { border-color:var(--amber);  }
//   .react-step.observation { border-color:var(--green); }
//   .react-step.error   { border-color:var(--red);    }

//   .progress-bar { height:2px; background:var(--border); position:relative; overflow:hidden; }
//   .progress-fill {
//     height:100%; background:linear-gradient(90deg,var(--amber),var(--amber-glow));
//     transition:width .3s ease;
//   }

//   .spinner {
//     width:16px; height:16px;
//     border:2px solid var(--border); border-top-color:var(--amber);
//     border-radius:50%; animation:spin .6s linear infinite; display:inline-block;
//   }

//   .drop-zone {
//     border:1px dashed var(--border); padding:2.5rem; text-align:center;
//     cursor:pointer; transition:border-color .2s, background .2s;
//     position:relative;
//   }
//   .drop-zone:hover, .drop-zone.dragging {
//     border-color:var(--amber); background:rgba(245,158,11,.03);
//   }

//   .doc-row {
//     display:flex; align-items:center; gap:1rem;
//     padding:.75rem 1rem; border-bottom:1px solid var(--border);
//     transition:background .15s;
//   }
//   .doc-row:last-child { border-bottom:none; }
//   .doc-row:hover { background:var(--surface2); }

//   .history-item {
//     padding:1rem; border-left:2px solid var(--border);
//     margin-bottom:.75rem; transition:border-color .2s;
//     animation:fadeSlideUp .2s ease;
//   }
//   .history-item:hover { border-color:var(--amber); }

//   .section-header {
//     font-family:var(--sans); font-size:.65rem; font-weight:600;
//     letter-spacing:.2em; text-transform:uppercase; color:var(--text-dim);
//     margin-bottom:.75rem; display:flex; align-items:center; gap:.5rem;
//   }
//   .section-header::after { content:''; flex:1; height:1px; background:var(--border); }

//   .answer-box {
//     background:var(--surface2); border:1px solid var(--border);
//     border-left:3px solid var(--amber); padding:1.25rem;
//     font-size:.82rem; line-height:1.7; white-space:pre-wrap;
//     animation:fadeSlideUp .3s ease;
//   }

//   .nav-strip {
//     display:flex; gap:0; border-bottom:1px solid var(--border);
//     overflow-x:auto; scrollbar-width:none;
//   }
//   .nav-strip::-webkit-scrollbar { display:none; }
//   .nav-item {
//     padding:.65rem 1.25rem; font-size:.7rem; letter-spacing:.12em;
//     text-transform:uppercase; cursor:pointer; white-space:nowrap;
//     border-bottom:2px solid transparent; color:var(--text-dim);
//     transition:color .15s, border-color .15s; background:none; border-top:none;
//     border-left:none; border-right:none; font-family:var(--mono);
//   }
//   .nav-item:hover { color:var(--text); }
//   .nav-item.active { color:var(--amber); border-bottom-color:var(--amber); }

//   .health-dot { width:8px; height:8px; border-radius:50%; display:inline-block; }
//   .health-dot.ok   { background:var(--green);  box-shadow:0 0 6px var(--green);  }
//   .health-dot.err  { background:var(--red);    box-shadow:0 0 6px var(--red);    }
//   .health-dot.unk  { background:var(--text-dim); }

//   .grid2 { display:grid; grid-template-columns:1fr 1fr; gap:1.25rem; }
//   .grid3 { display:grid; grid-template-columns:repeat(3,1fr); gap:1rem; }
//   .grid4 { display:grid; grid-template-columns:repeat(4,1fr); gap:1rem; }
//   @media(max-width:768px){
//     .grid2,.grid3,.grid4 { grid-template-columns:1fr; }
//     .stat-strip { flex-wrap:wrap; }
//   }
//   @media(max-width:500px){
//     .grid4 { grid-template-columns:1fr 1fr; }
//   }

//   .mono-label {
//     font-size:.65rem; letter-spacing:.1em; text-transform:uppercase;
//     color:var(--text-dim); margin-bottom:.35rem; display:block;
//   }

//   .toast-container {
//     position:fixed; bottom:1.5rem; right:1.5rem; z-index:9999;
//     display:flex; flex-direction:column; gap:.5rem; pointer-events:none;
//   }
//   .toast {
//     padding:.65rem 1rem; font-size:.75rem; letter-spacing:.05em;
//     min-width:220px; max-width:340px; pointer-events:all;
//     animation:fadeSlideUp .2s ease;
//     display:flex; align-items:center; gap:.5rem;
//   }
//   .toast-success { background:#0a1f14; border:1px solid var(--green); color:var(--green); }
//   .toast-error   { background:#1a0a0a; border:1px solid var(--red);   color:var(--red);   }
//   .toast-warn    { background:#1a140a; border:1px solid var(--amber);  color:var(--amber); }
//   .toast-info    { background:#0a111f; border:1px solid var(--cyan);   color:var(--cyan);  }

//   .glyph { opacity:.18; user-select:none; font-size:.65rem; line-height:1.2; color:var(--amber); }
// `;

// /* ─────────────────────────────────────────────────────────────
//    TINY TOAST SYSTEM
// ───────────────────────────────────────────────────────────────*/
// let _setToasts = null;
// const toast = {
//   _emit(type, msg) {
//     const id = Date.now();
//     _setToasts?.(prev => [...prev, { id, type, msg }]);
//     setTimeout(() => _setToasts?.(prev => prev.filter(t => t.id !== id)), 3500);
//   },
//   success: msg => toast._emit('success', msg),
//   error:   msg => toast._emit('error',   msg),
//   warn:    msg => toast._emit('warn',    msg),
//   info:    msg => toast._emit('info',    msg),
// };

// function ToastSystem() {
//   const [toasts, setToasts] = useState([]);
//   useEffect(() => { _setToasts = setToasts; }, []);
//   const icons = { success:'✓', error:'✗', warn:'!', info:'i' };
//   return (
//     <div className="toast-container">
//       {toasts.map(t => (
//         <div key={t.id} className={`toast toast-${t.type}`}>
//           <span style={{ fontWeight:700 }}>[{icons[t.type]}]</span> {t.msg}
//         </div>
//       ))}
//     </div>
//   );
// }

// /* ─────────────────────────────────────────────────────────────
//    HELPERS
// ───────────────────────────────────────────────────────────────*/
// const fmt = {
//   bytes(b) {
//     if (!b) return '0 B';
//     const k = 1024, s = ['B','KB','MB','GB'];
//     const i = Math.floor(Math.log(b) / Math.log(k));
//     return (b / Math.pow(k, i)).toFixed(1) + ' ' + s[i];
//   },
//   time(s)  { return s ? s.toFixed(2) + 's' : '-'; },
//   pct(v)   { return v ? (v * 100).toFixed(0) + '%' : '-'; },
//   date(d)  { return d ? new Date(d).toLocaleString() : '-'; },
//   short(s, n=60) { return s && s.length > n ? s.slice(0, n) + '…' : (s || ''); },
// };

// const SOURCE_META = {
//   chromadb:          { label:'ChromaDB',    cls:'tag-cyan' },
//   internet:          { label:'Tavily Web',  cls:'tag-green' },
//   general_knowledge: { label:'AI Memory',   cls:'tag-purple' },
//   coordinator_agent: { label:'Agent',       cls:'tag-amber' },
//   error:             { label:'Error',       cls:'tag-red' },
// };
// const srcMeta = s => SOURCE_META[s] || SOURCE_META.coordinator_agent;

// const STEP_STYLE = {
//   THOUGHT:     { cls:'thought',     color:'var(--purple)', prefix:'THINK' },
//   ACTION:      { cls:'action',      color:'var(--amber)',  prefix:'ACT'   },
//   OBSERVATION: { cls:'observation', color:'var(--green)',  prefix:'OBS'   },
//   ERROR:       { cls:'error',       color:'var(--red)',    prefix:'ERR'   },
// };

// /* ─────────────────────────────────────────────────────────────
//    MAIN COMPONENT
// ───────────────────────────────────────────────────────────────*/
// export default function RAGSystem() {
//   const [tab, setTab] = useState('query');
//   const [loading, setLoading] = useState(false);

//   // ── Query state ──
//   const [queryText,        setQueryText]        = useState('');
//   const [strategy,         setStrategy]         = useState('agentic');
//   const [topK,             setTopK]             = useState(15);
//   const [selectedDoc,      setSelectedDoc]      = useState('');
//   const [queryResult,      setQueryResult]      = useState(null);
//   const [agentTrace,       setAgentTrace]       = useState(null);

//   // ── Upload state ──
//   const [file,             setFile]             = useState(null);
//   const [uploadPct,        setUploadPct]        = useState(0);
//   const [dragging,         setDragging]         = useState(false);

//   // ── Data state ──
//   const [documents,        setDocuments]        = useState([]);
//   const [queryHistory,     setQueryHistory]     = useState([]);
//   const [stats,            setStats]            = useState({ total_documents:0, total_queries:0, total_chunks:0, average_processing_time:0, strategy_distribution:{} });
//   const [health,           setHealth]           = useState(null);
//   const [agentStatus,      setAgentStatus]      = useState(null);

//   const fileInputRef = useRef();

//   /* ─── Initial load ─── */
//   useEffect(() => {
//     fetchDocuments();
//     fetchStats();
//     fetchHealth();
//     const saved = localStorage.getItem('rag_history_v2');
//     if (saved) try { setQueryHistory(JSON.parse(saved)); } catch(_) {}
//   }, []);

//   /* ─── API calls ─── */
//   const fetchDocuments = async () => {
//     try {
//       const r = await AxiosInstance.get('/api/rag/v1/documents/');
//       setDocuments(r.data.documents || []);
//     } catch(e) { console.error(e); }
//   };

//   const fetchStats = async () => {
//     try {
//       const r = await AxiosInstance.get('/api/rag/v1/stats/');
//       setStats(r.data);
//     } catch(e) { console.error(e); }
//   };

//   const fetchHealth = async () => {
//     try {
//       const r = await AxiosInstance.get('/api/rag/v1/health/');
//       setHealth(r.data);
//     } catch(e) { setHealth({ status:'error', components:{} }); }
//   };

//   const fetchAgentStatus = async () => {
//     try {
//       const r = await AxiosInstance.get('/api/rag/v1/agents/status/');
//       setAgentStatus(r.data);
//     } catch(e) { console.error(e); }
//   };

//   /* ─── Query submit ─── */
//   const submitQuery = async () => {
//     if (!queryText.trim()) { toast.warn('Enter a query first'); return; }
//     setLoading(true); setQueryResult(null); setAgentTrace(null);
//     try {
//       const r = await AxiosInstance.post('/api/rag/v1/query/', {
//         query: queryText, strategy, top_k: topK,
//         document_id: selectedDoc || null,
//       });
//       const d = r.data;
//       setQueryResult(d);
//       if (d.execution_steps?.length) {
//         setAgentTrace({
//           steps: d.execution_steps,
//           agent_type: d.agent_type || 'react_coordinator',
//           source: d.source || 'unknown',
//           internet_sources: d.internet_sources || [],
//           fallback_used: d.fallback_used || false,
//         });
//       }
//       // save history
//       const entry = {
//         id: Date.now().toString(),
//         query: d.query, answer: d.answer, strategy: d.strategy_used,
//         processing_time: d.processing_time, confidence_score: d.confidence_score,
//         agent_type: d.agent_type, source: d.source,
//         steps: d.execution_steps?.length || 0,
//         timestamp: new Date().toISOString(),
//       };
//       setQueryHistory(prev => {
//         const next = [entry, ...prev.slice(0, 49)];
//         localStorage.setItem('rag_history_v2', JSON.stringify(next));
//         return next;
//       });
//       fetchStats();
//       toast.success('Query completed');
//     } catch(e) {
//       toast.error(e.response?.data?.error || 'Query failed');
//     } finally { setLoading(false); }
//   };

//   /* ─── File upload ─── */
//   const submitUpload = async () => {
//     if (!file) { toast.warn('Select a file first'); return; }
//     const fd = new FormData(); fd.append('file', file);
//     setLoading(true); setUploadPct(0);
//     try {
//       const r = await AxiosInstance.post('/api/rag/v1/upload/', fd, {
//         headers: { 'Content-Type':'multipart/form-data' },
//         onUploadProgress: e => setUploadPct(e.total ? Math.round(e.loaded*100/e.total) : 50),
//       });
//       toast.success(`Ingested ${r.data.chunks_created} chunks`);
//       setFile(null); setUploadPct(0);
//       fetchDocuments(); fetchStats();
//     } catch(e) {
//       toast.error(e.response?.data?.error || 'Upload failed');
//     } finally { setLoading(false); }
//   };

//   /* ─── Delete / clear ─── */
//   const deleteDoc = async (id, name) => {
//     if (!confirm(`Delete "${name}"?`)) return;
//     try {
//       await AxiosInstance.delete(`/api/rag/v1/documents/${id}/delete/`);
//       toast.success('Document removed');
//       fetchDocuments(); fetchStats();
//     } catch(e) { toast.error('Delete failed'); }
//   };

//   const clearAll = async () => {
//     if (!confirm('⚠ Delete ALL documents and vectors?')) return;
//     setLoading(true);
//     try {
//       await AxiosInstance.delete('/api/rag/v1/documents/clear/');
//       toast.success('All data cleared');
//       fetchDocuments(); fetchStats();
//     } catch(e) { toast.error('Clear failed'); }
//     finally { setLoading(false); }
//   };

//   /* ─── Drag-and-drop ─── */
//   const onDrop = useCallback(e => {
//     e.preventDefault(); setDragging(false);
//     const f = e.dataTransfer.files[0];
//     if (f) setFile(f);
//   }, []);

//   /* ─── Keyboard shortcut ─── */
//   useEffect(() => {
//     const h = e => { if ((e.ctrlKey||e.metaKey) && e.key==='Enter') submitQuery(); };
//     window.addEventListener('keydown', h);
//     return () => window.removeEventListener('keydown', h);
//   }, [queryText, strategy, topK, selectedDoc]);

//   /* ─────────────────────────────────────────────────────────
//      RENDER
//   ─────────────────────────────────────────────────────────── */
//   return (
//     <>
//       <style>{STYLES}</style>
//       <div className="scanline-overlay" />
//       <ToastSystem />

//       <div className="rag-root">

//         {/* ── HEADER ── */}
//         <header style={{ borderBottom:'1px solid var(--border)', padding:'1rem 2rem', display:'flex', alignItems:'center', justifyContent:'space-between', position:'sticky', top:0, background:'var(--bg)', zIndex:100 }}>
//           <div style={{ display:'flex', alignItems:'center', gap:'1rem' }}>
//             <div style={{ fontFamily:'var(--sans)', fontSize:'1.1rem', fontWeight:800, letterSpacing:'.05em', color:'var(--amber)' }}>
//               RAGENT<span style={{ color:'var(--text-dim)' }}>/</span>OS
//             </div>
//             <div style={{ width:1, height:18, background:'var(--border)' }} />
//             <span style={{ fontSize:'.65rem', letterSpacing:'.15em', color:'var(--text-dim)', textTransform:'uppercase' }}>
//               Multi-Agent RAG System
//             </span>
//           </div>
//           <div style={{ display:'flex', alignItems:'center', gap:'.75rem' }}>
//             {health && (
//               <span style={{ display:'flex', alignItems:'center', gap:'.4rem', fontSize:'.65rem', letterSpacing:'.08em', textTransform:'uppercase', color:'var(--text-dim)' }}>
//                 <span className={`health-dot ${health.status==='healthy'?'ok':health.status==='degraded'?'warn':'err'}`} />
//                 {health.status}
//               </span>
//             )}
//             <span style={{ fontSize:'.65rem', letterSpacing:'.08em', color:'var(--text-dim)' }}>
//               {new Date().toLocaleTimeString()}
//             </span>
//           </div>
//         </header>

//         {/* ── STATS STRIP ── */}
//         <div style={{ borderBottom:'1px solid var(--border)', padding:'.75rem 2rem', display:'flex', gap:'.75rem', overflowX:'auto' }} className="stat-strip">
//           {[
//             { label:'Documents', val: stats.total_documents, color:'var(--amber)' },
//             { label:'Chunks',    val: stats.total_chunks,    color:'var(--cyan)' },
//             { label:'Queries',   val: stats.total_queries,   color:'var(--green)' },
//             { label:'Avg Time',  val: fmt.time(stats.average_processing_time), color:'var(--purple)' },
//           ].map(s => (
//             <div key={s.label} className="stat-pill">
//               <span className="stat-number" style={{ color: s.color }}>{s.val}</span>
//               <span className="stat-label">{s.label}</span>
//             </div>
//           ))}
//           {stats.strategy_distribution && Object.entries(stats.strategy_distribution).map(([k,v]) => (
//             <div key={k} className="stat-pill">
//               <span className="stat-number" style={{ color:'var(--text)', fontSize:'1.2rem' }}>{v}</span>
//               <span className="stat-label">{k}</span>
//             </div>
//           ))}
//         </div>

//         {/* ── NAV ── */}
//         <div className="nav-strip">
//           {[
//             { id:'query',   label:'Query' },
//             { id:'upload',  label:'Ingest' },
//             { id:'docs',    label:'Documents' },
//             { id:'history', label:'History' },
//             { id:'trace',   label:'Agent Trace' },
//             { id:'health',  label:'Health' },
//           ].map(n => (
//             <button key={n.id} className={`nav-item ${tab===n.id?'active':''}`} onClick={() => {
//               setTab(n.id);
//               if (n.id==='health') { fetchHealth(); fetchAgentStatus(); }
//             }}>
//               {n.label}
//             </button>
//           ))}
//         </div>

//         {/* ── CONTENT ── */}
//         <main style={{ padding:'1.5rem 2rem', maxWidth:1200, margin:'0 auto' }}>

//           {/* ══ QUERY TAB ══ */}
//           {tab === 'query' && (
//             <div className="grid2" style={{ alignItems:'start' }}>
//               {/* Left: inputs */}
//               <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
//                 <div className="card">
//                   <div className="section-header">Query Input</div>

//                   <label className="mono-label">Query<span className="cursor" /></label>
//                   <textarea
//                     className="input-field"
//                     rows={5}
//                     value={queryText}
//                     onChange={e => setQueryText(e.target.value)}
//                     placeholder="e.g. What are the key findings in the uploaded report?"
//                     style={{ resize:'vertical' }}
//                   />

//                   <div className="grid2" style={{ marginTop:'1rem', gap:'.75rem' }}>
//                     <div>
//                       <label className="mono-label">Strategy</label>
//                       <select className="select-field" value={strategy} onChange={e => setStrategy(e.target.value)}>
//                         <option value="simple">Simple</option>
//                         <option value="agentic">Agentic (ReAct)</option>
//                         <option value="multi_agent">Multi-Agent</option>
//                         <option value="auto">Auto</option>
//                       </select>
//                     </div>
//                     <div>
//                       <label className="mono-label">Top-K Chunks</label>
//                       <input className="input-field" type="number" min={1} max={50} value={topK} onChange={e => setTopK(+e.target.value)} />
//                     </div>
//                   </div>

//                   <div style={{ marginTop:'.75rem' }}>
//                     <label className="mono-label">Document Filter (optional)</label>
//                     <select className="select-field" value={selectedDoc} onChange={e => setSelectedDoc(e.target.value)}>
//                       <option value="">All documents</option>
//                       {documents.map(d => (
//                         <option key={d.id} value={d.id}>{d.filename}</option>
//                       ))}
//                     </select>
//                   </div>

//                   <div style={{ marginTop:'1.25rem', display:'flex', gap:'.75rem', alignItems:'center' }}>
//                     <button className="amber-btn" onClick={submitQuery} disabled={loading} style={{ flex:1, padding:'.65rem' }}>
//                       <span>{loading ? <><span className="spinner" style={{ width:12,height:12 }} /> Processing…</> : '▶ Execute Query'}</span>
//                     </button>
//                     <span style={{ fontSize:'.6rem', color:'var(--text-dim)', whiteSpace:'nowrap' }}>Ctrl+↵</span>
//                   </div>
//                 </div>

//                 {/* Strategy info */}
//                 <div className="card" style={{ padding:'1rem' }}>
//                   <div className="section-header">Strategy Guide</div>
//                   <div style={{ display:'flex', flexDirection:'column', gap:'.5rem', fontSize:'.72rem', color:'var(--text-dim)', lineHeight:1.6 }}>
//                     {[
//                       { s:'simple',      c:'var(--cyan)',   d:'Direct vector search. Fast, no reasoning loop.' },
//                       { s:'agentic',     c:'var(--amber)',  d:'ReAct pattern: Thought→Action→Observation cycles.' },
//                       { s:'multi_agent', c:'var(--purple)', d:'Parallel sub-agents with coordinator synthesis.' },
//                       { s:'auto',        c:'var(--green)',  d:'Auto-selects based on query complexity.' },
//                     ].map(r => (
//                       <div key={r.s} style={{ display:'flex', gap:'.5rem', opacity: strategy===r.s ? 1 : .5, transition:'opacity .2s' }}>
//                         <span style={{ color:r.c, fontWeight:700, minWidth:70 }}>{r.s}</span>
//                         <span>{r.d}</span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>

//               {/* Right: result */}
//               <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
//                 {queryResult ? (
//                   <>
//                     <div className="card">
//                       <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'1rem', flexWrap:'wrap', gap:'.5rem' }}>
//                         <div className="section-header" style={{ margin:0 }}>Answer</div>
//                         <div style={{ display:'flex', gap:'.4rem', flexWrap:'wrap' }}>
//                           {queryResult.source && <span className={`tag ${srcMeta(queryResult.source).cls}`}>{srcMeta(queryResult.source).label}</span>}
//                           <span className="tag tag-amber">{fmt.time(queryResult.processing_time)}</span>
//                           {queryResult.confidence_score && <span className="tag tag-green">{fmt.pct(queryResult.confidence_score)}</span>}
//                         </div>
//                       </div>
//                       <div className="answer-box">{queryResult.answer}</div>

//                       <div style={{ marginTop:'1rem', display:'flex', flexWrap:'wrap', gap:'.75rem', fontSize:'.72rem', color:'var(--text-dim)' }}>
//                         <span>Strategy: <strong style={{ color:'var(--text)' }}>{queryResult.strategy_used}</strong></span>
//                         <span>Chunks: <strong style={{ color:'var(--text)' }}>{queryResult.retrieved_chunks?.length || 0}</strong></span>
//                         {queryResult.agent_type && <span>Agent: <strong style={{ color:'var(--text)' }}>{queryResult.agent_type}</strong></span>}
//                         {queryResult.query_type  && <span>Type: <strong style={{ color:'var(--text)' }}>{queryResult.query_type}</strong></span>}
//                         {agentTrace              && <span>Steps: <strong style={{ color:'var(--amber)' }}>{agentTrace.steps.length}</strong></span>}
//                       </div>

//                       {agentTrace && (
//                         <button className="ghost-btn" style={{ marginTop:'.75rem' }} onClick={() => setTab('trace')}>
//                           View Agent Trace →
//                         </button>
//                       )}
//                     </div>

//                     {/* Retrieved chunks preview */}
//                     {queryResult.retrieved_chunks?.length > 0 && (
//                       <div className="card" style={{ padding:'1rem' }}>
//                         <div className="section-header">Retrieved Chunks ({queryResult.retrieved_chunks.length})</div>
//                         <div style={{ maxHeight:220, overflowY:'auto', display:'flex', flexDirection:'column', gap:'.5rem' }}>
//                           {queryResult.retrieved_chunks.slice(0,5).map((c, i) => (
//                             <div key={i} style={{ fontSize:'.72rem', padding:'.5rem .75rem', background:'var(--surface2)', borderLeft:'2px solid var(--border)', color:'var(--text-dim)', lineHeight:1.5 }}>
//                               <span style={{ color:'var(--amber)', marginRight:'.5rem' }}>#{i+1}</span>
//                               {typeof c === 'string' ? fmt.short(c, 120) : fmt.short(c.content || JSON.stringify(c), 120)}
//                             </div>
//                           ))}
//                           {queryResult.retrieved_chunks.length > 5 && <div style={{ fontSize:'.65rem', color:'var(--text-dim)', textAlign:'center' }}>+{queryResult.retrieved_chunks.length - 5} more chunks</div>}
//                         </div>
//                       </div>
//                     )}
//                   </>
//                 ) : (
//                   <div className="card" style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:300, gap:'1.25rem', opacity:.6 }}>
//                     <div className="glyph" style={{ fontSize:'4rem', opacity:.12, lineHeight:1, textAlign:'center' }}>
//                       {`01001001\n01001110\n01000110\n01001111`}
//                     </div>
//                     <div style={{ textAlign:'center', fontSize:'.75rem', color:'var(--text-dim)' }}>
//                       Submit a query to see results
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}

//           {/* ══ INGEST TAB ══ */}
//           {tab === 'upload' && (
//             <div style={{ maxWidth:600, margin:'0 auto', display:'flex', flexDirection:'column', gap:'1.25rem' }}>
//               <div className="card">
//                 <div className="section-header">Document Ingestion</div>

//                 <div
//                   className={`drop-zone ${dragging?'dragging':''}`}
//                   onClick={() => fileInputRef.current?.click()}
//                   onDragOver={e => { e.preventDefault(); setDragging(true); }}
//                   onDragLeave={() => setDragging(false)}
//                   onDrop={onDrop}
//                 >
//                   <input ref={fileInputRef} type="file" accept=".pdf,.txt,.docx" style={{ display:'none' }}
//                     onChange={e => setFile(e.target.files?.[0] || null)} />
//                   <div style={{ fontSize:'2.5rem', marginBottom:'.75rem' }}>⬆</div>
//                   <div style={{ fontSize:'.8rem', color:'var(--text)', marginBottom:'.25rem' }}>
//                     {file ? file.name : 'Drop file or click to browse'}
//                   </div>
//                   <div style={{ fontSize:'.65rem', color:'var(--text-dim)', letterSpacing:'.08em' }}>
//                     PDF · TXT · DOCX · max 50 MB
//                   </div>
//                 </div>

//                 {file && (
//                   <div style={{ marginTop:'.75rem', padding:'.75rem', background:'var(--surface2)', border:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'space-between', gap:'1rem' }}>
//                     <div>
//                       <div style={{ fontSize:'.8rem', color:'var(--text)' }}>{file.name}</div>
//                       <div style={{ fontSize:'.65rem', color:'var(--text-dim)' }}>{fmt.bytes(file.size)}</div>
//                     </div>
//                     <button className="ghost-btn" onClick={() => setFile(null)}>✕</button>
//                   </div>
//                 )}

//                 {uploadPct > 0 && (
//                   <div style={{ marginTop:'.75rem' }}>
//                     <div style={{ display:'flex', justifyContent:'space-between', fontSize:'.65rem', color:'var(--text-dim)', marginBottom:'.25rem' }}>
//                       <span>Uploading…</span><span>{uploadPct}%</span>
//                     </div>
//                     <div className="progress-bar"><div className="progress-fill" style={{ width:`${uploadPct}%` }} /></div>
//                   </div>
//                 )}

//                 <button className="amber-btn" onClick={submitUpload} disabled={!file || loading} style={{ width:'100%', marginTop:'1rem', padding:'.65rem' }}>
//                   <span>{loading ? <><span className="spinner" style={{ width:12,height:12 }} /> Ingesting…</> : '▶ Ingest Document'}</span>
//                 </button>
//               </div>

//               <div className="card" style={{ padding:'1rem' }}>
//                 <div className="section-header">Processing Pipeline</div>
//                 <div style={{ display:'flex', flexDirection:'column', gap:'.4rem' }}>
//                   {['Validate & parse file','Extract raw text','Chunk into semantic segments','Generate embeddings','Store vectors in ChromaDB','Index metadata in PostgreSQL'].map((step,i) => (
//                     <div key={i} style={{ display:'flex', gap:'.75rem', fontSize:'.72rem', color:'var(--text-dim)', alignItems:'center', padding:'.25rem 0' }}>
//                       <span style={{ color:'var(--amber)', minWidth:16, fontWeight:700 }}>{i+1}</span>
//                       {step}
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* ══ DOCUMENTS TAB ══ */}
//           {tab === 'docs' && (
//             <div>
//               <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.25rem' }}>
//                 <span style={{ fontFamily:'var(--sans)', fontSize:'1rem', fontWeight:700 }}>
//                   Document Library <span style={{ color:'var(--text-dim)', fontWeight:400, fontSize:'.8rem' }}>({documents.length})</span>
//                 </span>
//                 <div style={{ display:'flex', gap:'.5rem' }}>
//                   <button className="ghost-btn" onClick={fetchDocuments}>↻ Refresh</button>
//                   {documents.length > 0 && <button className="red-btn" onClick={clearAll}>Clear All</button>}
//                 </div>
//               </div>

//               {documents.length > 0 ? (
//                 <div className="card" style={{ padding:0, overflow:'hidden' }}>
//                   {/* header row */}
//                   <div style={{ display:'grid', gridTemplateColumns:'1fr 80px 80px 90px 100px 40px', gap:'1rem', padding:'.6rem 1rem', borderBottom:'1px solid var(--border)', fontSize:'.6rem', letterSpacing:'.1em', textTransform:'uppercase', color:'var(--text-dim)' }}>
//                     <span>Filename</span><span>Size</span><span>Chunks</span><span>Status</span><span>Uploaded</span><span />
//                   </div>
//                   {documents.map(d => (
//                     <div key={d.id} className="doc-row" style={{ display:'grid', gridTemplateColumns:'1fr 80px 80px 90px 100px 40px', gap:'1rem', alignItems:'center' }}>
//                       <span style={{ fontSize:'.78rem', color:'var(--text)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
//                         {d.filename}
//                       </span>
//                       <span style={{ fontSize:'.72rem', color:'var(--text-dim)' }}>{fmt.bytes(d.size)}</span>
//                       <span style={{ fontSize:'.72rem', color:'var(--cyan)' }}>{d.chunks_count}</span>
//                       <span>
//                         <span className={`tag ${d.status==='completed'?'tag-green':d.status==='failed'?'tag-red':'tag-amber'}`}>
//                           {d.status}
//                         </span>
//                       </span>
//                       <span style={{ fontSize:'.65rem', color:'var(--text-dim)' }}>{new Date(d.uploaded_at).toLocaleDateString()}</span>
//                       <button className="ghost-btn" style={{ padding:'.2rem .5rem', fontSize:'.7rem', color:'var(--red)', borderColor:'rgba(239,68,68,.3)' }} onClick={() => deleteDoc(d.id, d.filename)}>✕</button>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <div className="card" style={{ textAlign:'center', padding:'3rem', opacity:.5 }}>
//                   <div style={{ fontSize:'3rem', marginBottom:'1rem' }}>◫</div>
//                   <div style={{ fontSize:'.8rem' }}>No documents ingested yet</div>
//                   <button className="amber-btn" style={{ marginTop:'1rem' }} onClick={() => setTab('upload')}>
//                     <span>Ingest First Document</span>
//                   </button>
//                 </div>
//               )}
//             </div>
//           )}

//           {/* ══ HISTORY TAB ══ */}
//           {tab === 'history' && (
//             <div>
//               <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.25rem' }}>
//                 <span style={{ fontFamily:'var(--sans)', fontSize:'1rem', fontWeight:700 }}>
//                   Query History <span style={{ color:'var(--text-dim)', fontWeight:400, fontSize:'.8rem' }}>({queryHistory.length})</span>
//                 </span>
//                 {queryHistory.length > 0 && (
//                   <button className="red-btn" onClick={() => {
//                     setQueryHistory([]); localStorage.removeItem('rag_history_v2'); toast.info('History cleared');
//                   }}>Clear History</button>
//                 )}
//               </div>

//               {queryHistory.length > 0 ? (
//                 <div>
//                   {queryHistory.map(h => (
//                     <div key={h.id} className="history-item">
//                       <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'.5rem', flexWrap:'wrap', gap:'.4rem' }}>
//                         <div style={{ display:'flex', gap:'.4rem', flexWrap:'wrap' }}>
//                           {h.source && <span className={`tag ${srcMeta(h.source).cls}`}>{srcMeta(h.source).label}</span>}
//                           <span className="tag tag-amber">{h.strategy}</span>
//                           <span className="tag tag-cyan">{fmt.time(h.processing_time)}</span>
//                           {h.confidence_score && <span className="tag tag-green">{fmt.pct(h.confidence_score)}</span>}
//                           {h.steps > 0 && <span className="tag tag-purple">{h.steps} steps</span>}
//                         </div>
//                         <span style={{ fontSize:'.62rem', color:'var(--text-dim)' }}>{fmt.date(h.timestamp)}</span>
//                       </div>
//                       <div style={{ fontSize:'.78rem', color:'var(--amber)', marginBottom:'.3rem' }}>
//                         Q: {fmt.short(h.query, 100)}
//                       </div>
//                       <div style={{ fontSize:'.75rem', color:'var(--text-dim)', lineHeight:1.5 }}>
//                         A: {fmt.short(h.answer, 180)}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <div className="card" style={{ textAlign:'center', padding:'3rem', opacity:.5 }}>
//                   <div style={{ fontSize:'3rem', marginBottom:'1rem' }}>◌</div>
//                   <div style={{ fontSize:'.8rem' }}>No queries yet</div>
//                 </div>
//               )}
//             </div>
//           )}

//           {/* ══ AGENT TRACE TAB ══ */}
//           {tab === 'trace' && (
//             <div>
//               {agentTrace ? (
//                 <div style={{ display:'flex', flexDirection:'column', gap:'1.25rem' }}>
//                   {/* overview */}
//                   <div className="card">
//                     <div className="section-header">Agent Execution Overview</div>
//                     <div className="grid4">
//                       {[
//                         { label:'Agent Type', val: agentTrace.agent_type, c:'var(--amber)' },
//                         { label:'Source',     val: srcMeta(agentTrace.source).label, c:'var(--cyan)' },
//                         { label:'Total Steps',val: agentTrace.steps.length, c:'var(--green)' },
//                         { label:'Fallback',   val: agentTrace.fallback_used?'Yes':'No', c: agentTrace.fallback_used?'var(--red)':'var(--text-dim)' },
//                       ].map(r => (
//                         <div key={r.label} style={{ background:'var(--surface2)', border:'1px solid var(--border)', padding:'.75rem' }}>
//                           <div className="mono-label">{r.label}</div>
//                           <div style={{ color:r.c, fontWeight:600, fontSize:'.85rem' }}>{r.val}</div>
//                         </div>
//                       ))}
//                     </div>

//                     <div style={{ marginTop:'1rem', display:'flex', gap:'.75rem', flexWrap:'wrap' }}>
//                       {(['THOUGHT','ACTION','OBSERVATION','ERROR']).map(type => {
//                         const count = agentTrace.steps.filter(s => s.type === type).length;
//                         const m = STEP_STYLE[type];
//                         return count > 0 ? (
//                           <div key={type} style={{ padding:'.35rem .75rem', border:`1px solid ${m.color}33`, background:`${m.color}11`, fontSize:'.68rem', color:m.color }}>
//                             {type}: {count}
//                           </div>
//                         ) : null;
//                       })}
//                     </div>
//                   </div>

//                   {/* internet sources */}
//                   {agentTrace.internet_sources?.length > 0 && (
//                     <div className="card">
//                       <div className="section-header">Tavily Web Sources ({agentTrace.internet_sources.length})</div>
//                       <div style={{ display:'flex', flexDirection:'column', gap:'.5rem' }}>
//                         {agentTrace.internet_sources.map((src, i) => (
//                           <div key={i} style={{ padding:'.75rem', background:'var(--surface2)', border:'1px solid var(--border)', borderLeft:`2px solid var(--green)`, fontSize:'.75rem' }}>
//                             <div style={{ color:'var(--text)', marginBottom:'.25rem', fontWeight:600 }}>{src.title || 'Untitled'}</div>
//                             {src.snippet && <div style={{ color:'var(--text-dim)', marginBottom:'.4rem', lineHeight:1.5 }}>{fmt.short(src.snippet, 150)}</div>}
//                             <div style={{ display:'flex', justifyContent:'space-between' }}>
//                               {src.url && <a href={src.url} target="_blank" rel="noreferrer" style={{ color:'var(--cyan)', fontSize:'.65rem' }}>{fmt.short(src.url, 60)}</a>}
//                               {src.score && <span style={{ color:'var(--green)', fontSize:'.65rem' }}>{fmt.pct(src.score)}</span>}
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   )}

//                   {/* ReAct steps */}
//                   <div className="card">
//                     <div className="section-header">ReAct Execution Trace</div>
//                     <div style={{ display:'flex', flexDirection:'column', gap:'.75rem' }}>
//                       {agentTrace.steps.map((step, i) => {
//                         const m = STEP_STYLE[step.type] || STEP_STYLE.OBSERVATION;
//                         return (
//                           <div key={i} className={`react-step ${m.cls}`}>
//                             <div style={{ display:'flex', alignItems:'center', gap:'.5rem', marginBottom:'.4rem' }}>
//                               <span style={{ fontSize:'.6rem', letterSpacing:'.15em', fontWeight:700, color:m.color }}>
//                                 [{String(i+1).padStart(2,'0')}] {m.prefix}
//                               </span>
//                               {step.timestamp && (
//                                 <span style={{ fontSize:'.6rem', color:'var(--text-dim)' }}>
//                                   {new Date(step.timestamp).toLocaleTimeString()}
//                                 </span>
//                               )}
//                             </div>
//                             <div style={{ fontSize:'.75rem', color:'var(--text)', lineHeight:1.65, whiteSpace:'pre-wrap', background:'var(--surface2)', padding:'.75rem', border:'1px solid var(--border)' }}>
//                               {step.content}
//                             </div>
//                           </div>
//                         );
//                       })}
//                     </div>
//                   </div>
//                 </div>
//               ) : (
//                 <div className="card" style={{ textAlign:'center', padding:'3rem', opacity:.5 }}>
//                   <div style={{ fontSize:'3rem', marginBottom:'1rem' }}>⊙</div>
//                   <div style={{ fontSize:'.8rem', marginBottom:'.5rem' }}>No agent trace available</div>
//                   <div style={{ fontSize:'.7rem', color:'var(--text-dim)' }}>Run a query with Agentic strategy to capture execution trace</div>
//                   <button className="amber-btn" style={{ marginTop:'1rem' }} onClick={() => { setStrategy('agentic'); setTab('query'); }}>
//                     <span>Switch to Agentic Mode</span>
//                   </button>
//                 </div>
//               )}
//             </div>
//           )}

//           {/* ══ HEALTH TAB ══ */}
//           {tab === 'health' && (
//             <div style={{ display:'flex', flexDirection:'column', gap:'1.25rem' }}>
//               {/* System health */}
//               <div className="card">
//                 <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'1rem' }}>
//                   <div className="section-header" style={{ margin:0 }}>System Health</div>
//                   <button className="ghost-btn" onClick={() => { fetchHealth(); fetchAgentStatus(); }}>↻ Refresh</button>
//                 </div>
//                 {health ? (
//                   <>
//                     <div style={{ marginBottom:'1rem' }}>
//                       <span className={`tag ${health.status==='healthy'?'tag-green':health.status==='degraded'?'tag-amber':'tag-red'}`} style={{ fontSize:'.75rem', padding:'.3rem .8rem' }}>
//                         {health.status?.toUpperCase()}
//                       </span>
//                     </div>
//                     <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))', gap:'.75rem' }}>
//                       {Object.entries(health.components || {}).map(([k, v]) => (
//                         <div key={k} style={{ padding:'.75rem', background:'var(--surface2)', border:'1px solid var(--border)', display:'flex', alignItems:'center', gap:'.75rem' }}>
//                           <span className={`health-dot ${v==='operational'?'ok':'err'}`} />
//                           <div>
//                             <div style={{ fontSize:'.72rem', color:'var(--text)', fontWeight:600 }}>{k.replace(/_/g,' ')}</div>
//                             <div style={{ fontSize:'.62rem', color: v==='operational'?'var(--green)':'var(--red)' }}>{v}</div>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                     <div style={{ marginTop:'.75rem', fontSize:'.65rem', color:'var(--text-dim)' }}>
//                       Last checked: {fmt.date(health.timestamp)} · Version {health.version || '—'}
//                     </div>
//                   </>
//                 ) : (
//                   <div style={{ fontSize:'.75rem', color:'var(--text-dim)' }}>Loading…</div>
//                 )}
//               </div>

//               {/* Agent status */}
//               <div className="card">
//                 <div className="section-header">Agent Status</div>
//                 {agentStatus ? (
//                   <pre style={{ fontSize:'.72rem', color:'var(--text-dim)', lineHeight:1.6, overflow:'auto', maxHeight:300 }}>
//                     {JSON.stringify(agentStatus, null, 2)}
//                   </pre>
//                 ) : (
//                   <div style={{ fontSize:'.75rem', color:'var(--text-dim)' }}>
//                     No agent status loaded. Click Refresh above.
//                   </div>
//                 )}
//               </div>

//               {/* API reference */}
//               <div className="card">
//                 <div className="section-header">API Endpoints</div>
//                 <div style={{ display:'flex', flexDirection:'column', gap:'.4rem', fontFamily:'var(--mono)', fontSize:'.72rem' }}>
//                   {[
//                     { m:'POST',   c:'var(--green)',  ep:'/api/rag/v1/query/',            desc:'Execute RAG query' },
//                     { m:'POST',   c:'var(--green)',  ep:'/api/rag/v1/upload/',           desc:'Upload document' },
//                     { m:'GET',    c:'var(--cyan)',   ep:'/api/rag/v1/documents/',        desc:'List documents' },
//                     { m:'DELETE', c:'var(--red)',    ep:'/api/rag/v1/documents/clear/',  desc:'Clear all data' },
//                     { m:'GET',    c:'var(--cyan)',   ep:'/api/rag/v1/queries/',          desc:'Query history' },
//                     { m:'GET',    c:'var(--cyan)',   ep:'/api/rag/v1/stats/',            desc:'System stats' },
//                     { m:'GET',    c:'var(--cyan)',   ep:'/api/rag/v1/health/',           desc:'Health check' },
//                     { m:'POST',   c:'var(--green)',  ep:'/api/rag/v1/sessions/',         desc:'Create session' },
//                     { m:'GET',    c:'var(--cyan)',   ep:'/api/rag/v1/agents/status/',    desc:'Agent status' },
//                   ].map(r => (
//                     <div key={r.ep} style={{ display:'flex', gap:'1rem', padding:'.5rem .75rem', background:'var(--surface2)', alignItems:'center' }}>
//                       <span style={{ color:r.c, minWidth:48, fontWeight:700 }}>{r.m}</span>
//                       <span style={{ color:'var(--text)', flex:1 }}>{r.ep}</span>
//                       <span style={{ color:'var(--text-dim)', fontSize:'.65rem' }}>{r.desc}</span>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           )}

//         </main>

//         {/* ── FOOTER ── */}
//         <footer style={{ borderTop:'1px solid var(--border)', padding:'.75rem 2rem', display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:'2rem' }}>
//           <span style={{ fontSize:'.6rem', letterSpacing:'.12em', color:'var(--text-dim)', textTransform:'uppercase' }}>
//             RAGENT/OS · Multi-Agent RAG · v1.0
//           </span>
//           <div className="glyph">◈ ◇ ◈</div>
//         </footer>
//       </div>
//     </>
//   );
// }








'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import AxiosInstance from "@/components/AxiosInstance";

/* ─── Only keyframes & Google Font here — everything visual is Tailwind ─── */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;700&family=Syne:wght@600;700;800&display=swap');
  .font-mono-custom { font-family: 'JetBrains Mono', monospace; }
  .font-display      { font-family: 'Syne', sans-serif; }
  @keyframes fadeUp   { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
  @keyframes blink    { 0%,49%{opacity:1} 50%,100%{opacity:0} }
  @keyframes spin     { to { transform: rotate(360deg); } }
  @keyframes shimmer  { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
  .animate-fade-up    { animation: fadeUp .3s ease forwards; }
  .animate-blink      { animation: blink 1s step-end infinite; }
  .animate-spin-slow  { animation: spin .7s linear infinite; }
  .scanline-bg {
    background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,.04) 2px, rgba(0,0,0,.04) 4px);
    pointer-events: none; position: fixed; inset: 0; z-index: 50;
  }
  .progress-shimmer {
    background: linear-gradient(90deg, #f59e0b 0%, #fbbf24 50%, #f59e0b 100%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
  }
  .react-border-left { border-left-width: 2px; border-left-style: solid; padding-left: 1rem; }
`;

/* ─────────────── Toast System ─────────────── */
let _setToasts = null;
const toast = {
  _push(type, msg) {
    const id = Date.now();
    _setToasts?.(p => [...p, { id, type, msg }]);
    setTimeout(() => _setToasts?.(p => p.filter(t => t.id !== id)), 3800);
  },
  success: m => toast._push('success', m),
  error:   m => toast._push('error',   m),
  warn:    m => toast._push('warn',    m),
  info:    m => toast._push('info',    m),
};

const TOAST_STYLES = {
  success: 'bg-green-950 border border-green-600 text-green-400',
  error:   'bg-red-950   border border-red-600   text-red-400',
  warn:    'bg-amber-950 border border-amber-600 text-amber-400',
  info:    'bg-sky-950   border border-sky-600   text-sky-400',
};
const TOAST_ICONS = { success: '✓', error: '✗', warn: '!', info: 'i' };

function Toasts() {
  const [toasts, setToasts] = useState([]);
  useEffect(() => { _setToasts = setToasts; }, []);
  return (
    <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2 pointer-events-none">
      {toasts.map(t => (
        <div key={t.id} className={`animate-fade-up font-mono-custom text-xs px-4 py-2.5 flex items-center gap-2 min-w-[220px] max-w-xs pointer-events-auto ${TOAST_STYLES[t.type]}`}>
          <span className="font-bold">[{TOAST_ICONS[t.type]}]</span>
          {t.msg}
        </div>
      ))}
    </div>
  );
}

/* ─────────────── Helpers ─────────────── */
const fmt = {
  bytes: b => { if(!b) return '0 B'; const k=1024,s=['B','KB','MB','GB'],i=Math.floor(Math.log(b)/Math.log(k)); return (b/k**i).toFixed(1)+' '+s[i]; },
  secs:  v => v ? v.toFixed(2)+'s' : '—',
  pct:   v => v ? (v*100).toFixed(0)+'%' : '—',
  date:  d => d ? new Date(d).toLocaleString() : '—',
  cut:   (s,n=80) => s && s.length>n ? s.slice(0,n)+'…' : (s||''),
};

const SOURCE_MAP = {
  chromadb:          { label:'ChromaDB',   classes:'bg-sky-900/40 border-sky-700 text-sky-400'           },
  internet:          { label:'Web Search', classes:'bg-green-900/40 border-green-700 text-green-400'     },
  general_knowledge: { label:'AI Memory',  classes:'bg-violet-900/40 border-violet-700 text-violet-400' },
  coordinator_agent: { label:'Agent',      classes:'bg-amber-900/40 border-amber-700 text-amber-400'     },
  error:             { label:'Error',      classes:'bg-red-900/40 border-red-700 text-red-400'           },
};
const srcInfo = s => SOURCE_MAP[s] || SOURCE_MAP.coordinator_agent;

const STEP_MAP = {
  THOUGHT:     { label:'THINK', border:'#a855f7', text:'text-violet-400', bg:'bg-violet-900/20' },
  ACTION:      { label:'ACT',   border:'#f59e0b', text:'text-amber-400',  bg:'bg-amber-900/20'  },
  OBSERVATION: { label:'OBS',   border:'#10b981', text:'text-emerald-400',bg:'bg-emerald-900/20'},
  ERROR:       { label:'ERR',   border:'#ef4444', text:'text-red-400',    bg:'bg-red-900/20'    },
};

/* ─────────────── Reusable UI Pieces ─────────────── */
function Badge({ children, classes }) {
  return (
    <span className={`font-mono-custom text-[10px] tracking-widest uppercase px-2 py-0.5 border ${classes}`}>
      {children}
    </span>
  );
}

function SectionLabel({ children }) {
  return (
    <div className="font-mono-custom text-[10px] tracking-[.18em] uppercase text-gray-500 mb-3 flex items-center gap-2">
      {children}
      <span className="flex-1 h-px bg-gray-800" />
    </div>
  );
}

function InputField({ label, ...props }) {
  return (
    <div>
      {label && <label className="block font-mono-custom text-[10px] tracking-widest uppercase text-gray-500 mb-1.5">{label}</label>}
      <input
        className="w-full bg-gray-900 border border-gray-700 text-gray-200 font-mono-custom text-sm px-3 py-2 outline-none focus:border-amber-500 transition-colors placeholder-gray-600"
        {...props}
      />
    </div>
  );
}

function SelectField({ label, children, ...props }) {
  return (
    <div>
      {label && <label className="block font-mono-custom text-[10px] tracking-widest uppercase text-gray-500 mb-1.5">{label}</label>}
      <select
        className="w-full bg-gray-900 border border-gray-700 text-gray-200 font-mono-custom text-sm px-3 py-2 outline-none focus:border-amber-500 transition-colors cursor-pointer"
        {...props}
      >
        {children}
      </select>
    </div>
  );
}

function TextareaField({ label, ...props }) {
  return (
    <div>
      {label && <label className="block font-mono-custom text-[10px] tracking-widest uppercase text-gray-500 mb-1.5">{label}</label>}
      <textarea
        className="w-full bg-gray-900 border border-gray-700 text-gray-200 font-mono-custom text-sm px-3 py-2 outline-none focus:border-amber-500 transition-colors placeholder-gray-600 resize-y"
        {...props}
      />
    </div>
  );
}

function PrimaryBtn({ children, loading, loadingText = 'Processing…', className = '', ...props }) {
  return (
    <button
      className={`bg-amber-500 hover:bg-amber-400 disabled:bg-gray-800 disabled:text-gray-600 disabled:cursor-not-allowed text-gray-950 font-mono-custom font-bold text-xs tracking-widest uppercase px-4 py-3 transition-colors flex items-center justify-center gap-2 w-full ${className}`}
      {...props}
    >
      {loading ? (
        <>
          <span className="animate-spin-slow w-3.5 h-3.5 border-2 border-gray-950/30 border-t-gray-950 rounded-full inline-block" />
          {loadingText}
        </>
      ) : children}
    </button>
  );
}

function GhostBtn({ children, className = '', ...props }) {
  return (
    <button
      className={`font-mono-custom text-[10px] tracking-widest uppercase px-3 py-1.5 border border-gray-700 text-gray-500 hover:border-amber-500 hover:text-amber-400 transition-colors ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

function DangerBtn({ children, ...props }) {
  return (
    <button
      className="font-mono-custom text-[10px] tracking-widest uppercase px-3 py-1.5 border border-red-900 text-red-500 hover:bg-red-900/30 transition-colors"
      {...props}
    >
      {children}
    </button>
  );
}

function Card({ children, className = '' }) {
  return (
    <div className={`bg-gray-900 border border-gray-800 p-5 animate-fade-up ${className}`}>
      {children}
    </div>
  );
}

function HealthDot({ status }) {
  const cls = status === 'operational'
    ? 'bg-emerald-400 shadow-[0_0_6px_#10b981]'
    : status === 'error' ? 'bg-red-400 shadow-[0_0_6px_#ef4444]'
    : 'bg-gray-600';
  return <span className={`inline-block w-2 h-2 rounded-full ${cls}`} />;
}

/* ─────────────────────────── MAIN COMPONENT ─────────────────────────── */
export default function RAGSystem() {
  const [tab, setTab] = useState('query');
  const [loading, setLoading] = useState(false);

  // Query state
  const [queryText,   setQueryText]   = useState('');
  const [strategy,    setStrategy]    = useState('agentic');
  const [topK,        setTopK]        = useState(15);
  const [selectedDoc, setSelectedDoc] = useState('');
  const [queryResult, setQueryResult] = useState(null);
  const [agentTrace,  setAgentTrace]  = useState(null);

  // Upload state
  const [file,      setFile]      = useState(null);
  const [uploadPct, setUploadPct] = useState(0);
  const [dragging,  setDragging]  = useState(false);
  const fileRef = useRef();

  // Data state
  const [documents,    setDocuments]    = useState([]);
  const [queryHistory, setQueryHistory] = useState([]);
  const [stats,        setStats]        = useState({ total_documents:0, total_queries:0, total_chunks:0, average_processing_time:0, strategy_distribution:{} });
  const [health,       setHealth]       = useState(null);
  const [agentStatus,  setAgentStatus]  = useState(null);

  /* ─ Init ─ */
  useEffect(() => {
    fetchDocuments(); fetchStats(); fetchHealth();
    try { const s = localStorage.getItem('rag_qh'); if(s) setQueryHistory(JSON.parse(s)); } catch(_){}
  }, []);

  // Ctrl+Enter shortcut
  useEffect(() => {
    const h = e => { if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') submitQuery(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [queryText, strategy, topK, selectedDoc]);

  /* ─ API helpers ─ */
  const fetchDocuments  = async () => { try { const r = await AxiosInstance.get('/api/rag/v1/documents/'); setDocuments(r.data.documents || []); } catch(_){} };
  const fetchStats      = async () => { try { const r = await AxiosInstance.get('/api/rag/v1/stats/'); setStats(r.data); } catch(_){} };
  const fetchHealth     = async () => { try { const r = await AxiosInstance.get('/api/rag/v1/health/'); setHealth(r.data); } catch(_){ setHealth({ status:'error', components:{} }); } };
  const fetchAgentStatus= async () => { try { const r = await AxiosInstance.get('/api/rag/v1/agents/status/'); setAgentStatus(r.data); } catch(_){} };

  /* ─ Submit Query ─ */
  const submitQuery = async () => {
    if (!queryText.trim()) { toast.warn('Enter a query first'); return; }
    setLoading(true); setQueryResult(null); setAgentTrace(null);
    try {
      const r = await AxiosInstance.post('/api/rag/v1/query/', {
        query: queryText, strategy, top_k: topK, document_id: selectedDoc || null,
      });
      const d = r.data;
      setQueryResult(d);
      if (d.execution_steps?.length) {
        setAgentTrace({
          steps: d.execution_steps, agent_type: d.agent_type || 'react_coordinator',
          source: d.source || 'unknown', internet_sources: d.internet_sources || [],
          fallback_used: d.fallback_used || false,
        });
      }
      const entry = {
        id: Date.now().toString(), query: d.query, answer: d.answer,
        strategy: d.strategy_used, processing_time: d.processing_time,
        confidence_score: d.confidence_score, agent_type: d.agent_type,
        source: d.source, steps: d.execution_steps?.length || 0,
        timestamp: new Date().toISOString(),
      };
      setQueryHistory(prev => {
        const next = [entry, ...prev.slice(0,49)];
        localStorage.setItem('rag_qh', JSON.stringify(next));
        return next;
      });
      fetchStats();
      toast.success('Query completed');
    } catch(e) { toast.error(e.response?.data?.error || 'Query failed'); }
    finally { setLoading(false); }
  };

  /* ─ Upload ─ */
  const submitUpload = async () => {
    if (!file) { toast.warn('Select a file first'); return; }
    const fd = new FormData(); fd.append('file', file);
    setLoading(true); setUploadPct(0);
    try {
      const r = await AxiosInstance.post('/api/rag/v1/upload/', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: e => setUploadPct(e.total ? Math.round(e.loaded*100/e.total) : 50),
      });
      toast.success(`Ingested ${r.data.chunks_created} chunks`);
      setFile(null); setUploadPct(0); fetchDocuments(); fetchStats();
    } catch(e) { toast.error(e.response?.data?.error || 'Upload failed'); }
    finally { setLoading(false); }
  };

  /* ─ Delete / Clear ─ */
  const deleteDoc = async (id, name) => {
    if (!confirm(`Delete "${name}"?`)) return;
    try { await AxiosInstance.delete(`/api/rag/v1/documents/${id}/delete/`); toast.success('Removed'); fetchDocuments(); fetchStats(); }
    catch(_) { toast.error('Delete failed'); }
  };
  const clearAll = async () => {
    if (!confirm('⚠ Delete ALL documents and vectors?')) return;
    setLoading(true);
    try { await AxiosInstance.delete('/api/rag/v1/documents/clear/'); toast.success('All cleared'); fetchDocuments(); fetchStats(); }
    catch(_) { toast.error('Clear failed'); }
    finally { setLoading(false); }
  };

  /* ─ Drag-drop ─ */
  const onDrop = useCallback(e => {
    e.preventDefault(); setDragging(false);
    const f = e.dataTransfer.files[0]; if(f) setFile(f);
  }, []);

  /* ────────────────────────────────── RENDER ────────────────────────────────── */
  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <div className="scanline-bg" />
      <Toasts />

      <div className="font-mono-custom bg-gray-950 min-h-screen text-gray-300">

        {/* ═══ HEADER ═══ */}
        <header className="sticky top-0 z-40 bg-gray-950/95 backdrop-blur-sm border-b border-gray-800 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="font-display text-lg font-extrabold text-amber-400 tracking-tight">
              RAGENT<span className="text-gray-700">/</span>OS
            </span>
            <span className="hidden sm:block w-px h-5 bg-gray-800" />
            <span className="hidden sm:block text-[10px] tracking-[.18em] uppercase text-gray-600">
              Multi-Agent RAG System
            </span>
          </div>
          <div className="flex items-center gap-4">
            {health && (
              <span className="flex items-center gap-1.5 text-[10px] tracking-widest uppercase text-gray-600">
                <HealthDot status={health.status === 'healthy' ? 'operational' : 'error'} />
                {health.status}
              </span>
            )}
            <span className="text-[10px] text-gray-700 hidden sm:block">
              {new Date().toLocaleTimeString()}
            </span>
          </div>
        </header>

        {/* ═══ STATS STRIP ═══ */}
        <div className="border-b border-gray-800 bg-gray-950 px-6 py-3 flex gap-3 overflow-x-auto">
          {[
            { label:'Documents', val: stats.total_documents,                   color:'text-amber-400',  bar:'bg-amber-400'  },
            { label:'Chunks',    val: stats.total_chunks,                      color:'text-sky-400',    bar:'bg-sky-400'    },
            { label:'Queries',   val: stats.total_queries,                     color:'text-emerald-400',bar:'bg-emerald-400'},
            { label:'Avg Time',  val: fmt.secs(stats.average_processing_time), color:'text-violet-400', bar:'bg-violet-400' },
          ].map(s => (
            <div key={s.label} className="relative flex flex-col items-center justify-center bg-gray-900 border border-gray-800 px-5 py-2 min-w-[90px] shrink-0 overflow-hidden">
              <span className={`font-display text-2xl font-bold leading-none ${s.color}`}>{s.val}</span>
              <span className="text-[9px] tracking-[.15em] uppercase text-gray-600 mt-1">{s.label}</span>
              <span className={`absolute bottom-0 left-0 right-0 h-0.5 ${s.bar}`} />
            </div>
          ))}
          {Object.entries(stats.strategy_distribution || {}).map(([k, v]) => (
            <div key={k} className="flex flex-col items-center justify-center bg-gray-900 border border-gray-800 px-4 py-2 shrink-0">
              <span className="font-display text-xl font-bold text-gray-300 leading-none">{v}</span>
              <span className="text-[9px] tracking-[.15em] uppercase text-gray-600 mt-1">{k}</span>
            </div>
          ))}
        </div>

        {/* ═══ NAV TABS ═══ */}
        <div className="flex border-b border-gray-800 bg-gray-950 overflow-x-auto">
          {[
            { id:'query',   label:'Query'       },
            { id:'upload',  label:'Ingest'      },
            { id:'docs',    label:'Documents'   },
            { id:'history', label:'History'     },
            { id:'trace',   label:'Agent Trace' },
            { id:'health',  label:'Health'      },
          ].map(n => (
            <button
              key={n.id}
              onClick={() => { setTab(n.id); if(n.id==='health'){fetchHealth();fetchAgentStatus();} }}
              className={`shrink-0 px-5 py-3 text-[10px] tracking-[.18em] uppercase transition-colors border-b-2
                ${tab === n.id
                  ? 'text-amber-400 border-amber-500'
                  : 'text-gray-600 border-transparent hover:text-gray-300'}`}
            >
              {n.label}
            </button>
          ))}
        </div>

        {/* ═══ CONTENT ═══ */}
        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6">

          {/* ── QUERY TAB ── */}
          {tab === 'query' && (
            <div className="grid lg:grid-cols-2 gap-5 items-start">

              {/* Left: inputs */}
              <div className="flex flex-col gap-4">
                <Card>
                  <SectionLabel>Query Input</SectionLabel>
                  <TextareaField
                    label="Your Question"
                    rows={5}
                    value={queryText}
                    onChange={e => setQueryText(e.target.value)}
                    placeholder="e.g. What are the main findings in the uploaded report?"
                  />
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <SelectField label="Strategy" value={strategy} onChange={e => setStrategy(e.target.value)}>
                      <option value="simple">Simple</option>
                      <option value="agentic">Agentic (ReAct)</option>
                      <option value="multi_agent">Multi-Agent</option>
                      <option value="auto">Auto</option>
                    </SelectField>
                    <InputField label="Top-K Chunks" type="number" min={1} max={50} value={topK} onChange={e => setTopK(+e.target.value)} />
                  </div>
                  <div className="mt-3">
                    <SelectField label="Document Filter (optional)" value={selectedDoc} onChange={e => setSelectedDoc(e.target.value)}>
                      <option value="">All documents</option>
                      {documents.map(d => <option key={d.id} value={d.id}>{d.filename}</option>)}
                    </SelectField>
                  </div>
                  <div className="mt-5 flex items-center gap-3">
                    <PrimaryBtn loading={loading} loadingText="Processing…" onClick={submitQuery} disabled={loading}>
                      ▶ Execute Query
                    </PrimaryBtn>
                    <span className="text-[9px] text-gray-600 whitespace-nowrap tracking-widest">Ctrl+↵</span>
                  </div>
                </Card>

                {/* Strategy guide */}
                <Card>
                  <SectionLabel>Strategy Guide</SectionLabel>
                  <div className="flex flex-col gap-2.5 text-xs text-gray-500 leading-relaxed">
                    {[
                      { s:'simple',      c:'text-sky-400',     d:'Direct vector search in ChromaDB. Fastest, no reasoning.' },
                      { s:'agentic',     c:'text-amber-400',   d:'ReAct loop: Thought → Action → Observation cycles.'       },
                      { s:'multi_agent', c:'text-violet-400',  d:'Parallel sub-agents synthesised by coordinator.'           },
                      { s:'auto',        c:'text-emerald-400', d:'Auto-selects strategy based on query complexity.'          },
                    ].map(r => (
                      <div key={r.s} className={`flex gap-2.5 transition-opacity duration-200 ${strategy===r.s ? 'opacity-100' : 'opacity-35'}`}>
                        <span className={`${r.c} font-bold w-20 shrink-0`}>{r.s}</span>
                        <span>{r.d}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              {/* Right: results */}
              <div className="flex flex-col gap-4">
                {queryResult ? (
                  <>
                    <Card>
                      <div className="flex items-start justify-between mb-4 gap-3 flex-wrap">
                        <SectionLabel>Answer</SectionLabel>
                        <div className="flex flex-wrap gap-1.5">
                          {queryResult.source && <Badge classes={srcInfo(queryResult.source).classes}>{srcInfo(queryResult.source).label}</Badge>}
                          <Badge classes="bg-amber-900/40 border-amber-700 text-amber-400">{fmt.secs(queryResult.processing_time)}</Badge>
                          {queryResult.confidence_score && <Badge classes="bg-emerald-900/40 border-emerald-700 text-emerald-400">{fmt.pct(queryResult.confidence_score)}</Badge>}
                        </div>
                      </div>

                      {/* Answer text */}
                      <div className="bg-gray-950 border border-gray-800 border-l-2 border-l-amber-500 px-4 py-3 text-sm text-gray-200 leading-relaxed whitespace-pre-wrap">
                        {queryResult.answer}
                      </div>

                      {/* Meta row */}
                      <div className="mt-4 flex flex-wrap gap-4 text-xs text-gray-500">
                        <span>Strategy: <strong className="text-gray-300">{queryResult.strategy_used}</strong></span>
                        <span>Chunks: <strong className="text-gray-300">{queryResult.retrieved_chunks?.length || 0}</strong></span>
                        {queryResult.agent_type && <span>Agent: <strong className="text-gray-300">{queryResult.agent_type}</strong></span>}
                        {agentTrace && <span>Steps: <strong className="text-amber-400">{agentTrace.steps.length}</strong></span>}
                      </div>

                      {agentTrace && (
                        <GhostBtn className="mt-3" onClick={() => setTab('trace')}>
                          View Agent Trace →
                        </GhostBtn>
                      )}
                    </Card>

                    {/* Chunks preview */}
                    {queryResult.retrieved_chunks?.length > 0 && (
                      <Card>
                        <SectionLabel>Retrieved Chunks ({queryResult.retrieved_chunks.length})</SectionLabel>
                        <div className="flex flex-col gap-2 max-h-52 overflow-y-auto">
                          {queryResult.retrieved_chunks.slice(0,5).map((c, i) => (
                            <div key={i} className="bg-gray-950 border-l-2 border-gray-700 pl-3 py-1.5 text-xs text-gray-500 leading-relaxed">
                              <span className="text-amber-500 mr-2 font-bold">#{i+1}</span>
                              {fmt.cut(typeof c === 'string' ? c : (c.content || JSON.stringify(c)), 130)}
                            </div>
                          ))}
                          {queryResult.retrieved_chunks.length > 5 && (
                            <p className="text-[10px] text-gray-600 text-center py-1">
                              +{queryResult.retrieved_chunks.length - 5} more chunks
                            </p>
                          )}
                        </div>
                      </Card>
                    )}
                  </>
                ) : (
                  <Card className="flex flex-col items-center justify-center min-h-[280px] gap-3">
                    <div className="text-6xl text-gray-800 select-none font-display">◈</div>
                    <p className="text-[10px] text-gray-600 tracking-widest uppercase">Awaiting query execution</p>
                  </Card>
                )}
              </div>
            </div>
          )}

          {/* ── INGEST TAB ── */}
          {tab === 'upload' && (
            <div className="max-w-xl mx-auto flex flex-col gap-4">
              <Card>
                <SectionLabel>Document Ingestion</SectionLabel>

                {/* Drop zone */}
                <div
                  onClick={() => fileRef.current?.click()}
                  onDragOver={e => { e.preventDefault(); setDragging(true); }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={onDrop}
                  className={`border-2 border-dashed p-10 text-center cursor-pointer transition-colors
                    ${dragging ? 'border-amber-500 bg-amber-900/10' : 'border-gray-700 hover:border-gray-500'}`}
                >
                  <input ref={fileRef} type="file" accept=".pdf,.txt,.docx" className="hidden"
                    onChange={e => setFile(e.target.files?.[0] || null)} />
                  <div className="text-4xl text-gray-600 mb-3">⬆</div>
                  <p className="text-sm text-gray-300 mb-1">{file ? file.name : 'Drop file or click to browse'}</p>
                  <p className="text-[10px] tracking-widest uppercase text-gray-600">PDF · TXT · DOCX · max 50 MB</p>
                </div>

                {/* Selected file */}
                {file && (
                  <div className="mt-3 bg-gray-950 border border-gray-800 px-4 py-3 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm text-gray-200">{file.name}</p>
                      <p className="text-[10px] text-gray-500 mt-0.5">{fmt.bytes(file.size)}</p>
                    </div>
                    <button onClick={() => setFile(null)} className="text-gray-600 hover:text-red-400 transition-colors">✕</button>
                  </div>
                )}

                {/* Progress */}
                {uploadPct > 0 && (
                  <div className="mt-3">
                    <div className="flex justify-between text-[10px] text-gray-500 mb-1.5">
                      <span>Uploading…</span><span>{uploadPct}%</span>
                    </div>
                    <div className="h-0.5 bg-gray-800 overflow-hidden">
                      <div className="progress-shimmer h-full transition-all" style={{ width:`${uploadPct}%` }} />
                    </div>
                  </div>
                )}

                <div className="mt-5">
                  <PrimaryBtn loading={loading} loadingText="Ingesting…" onClick={submitUpload} disabled={!file || loading}>
                    ▶ Ingest Document
                  </PrimaryBtn>
                </div>
              </Card>

              {/* Pipeline */}
              <Card>
                <SectionLabel>Processing Pipeline</SectionLabel>
                <div className="flex flex-col">
                  {[
                    'Validate & parse uploaded file',
                    'Extract raw text content',
                    'Split into semantic chunks',
                    'Generate vector embeddings',
                    'Store vectors in ChromaDB',
                    'Index metadata in PostgreSQL',
                  ].map((step, i) => (
                    <div key={i} className="flex items-center gap-3 text-xs text-gray-500 py-2 border-b border-gray-800 last:border-0">
                      <span className="text-amber-500 font-bold w-4 shrink-0 text-center">{i+1}</span>
                      {step}
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {/* ── DOCUMENTS TAB ── */}
          {tab === 'docs' && (
            <div>
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-display text-base font-bold text-gray-100">
                  Documents{' '}
                  <span className="text-gray-600 font-normal text-sm">({documents.length})</span>
                </h2>
                <div className="flex gap-2">
                  <GhostBtn onClick={fetchDocuments}>↻ Refresh</GhostBtn>
                  {documents.length > 0 && <DangerBtn onClick={clearAll}>Clear All</DangerBtn>}
                </div>
              </div>

              {documents.length > 0 ? (
                <Card className="p-0 overflow-hidden">
                  {/* Table header */}
                  <div className="hidden sm:grid grid-cols-[1fr_80px_72px_90px_100px_32px] gap-3 px-4 py-2.5 border-b border-gray-800 text-[9px] tracking-[.18em] uppercase text-gray-600">
                    <span>Filename</span>
                    <span>Size</span>
                    <span>Chunks</span>
                    <span>Status</span>
                    <span>Uploaded</span>
                    <span />
                  </div>
                  {documents.map(d => (
                    <div key={d.id} className="flex sm:grid sm:grid-cols-[1fr_80px_72px_90px_100px_32px] flex-col gap-1 sm:gap-3 items-start sm:items-center px-4 py-3 border-b border-gray-800 last:border-0 hover:bg-gray-800/40 transition-colors">
                      <span className="text-sm text-gray-200 truncate w-full">{d.filename}</span>
                      <span className="text-xs text-gray-500">{fmt.bytes(d.size)}</span>
                      <span className="text-xs text-sky-400 font-bold">{d.chunks_count}</span>
                      <span>
                        <Badge classes={
                          d.status==='completed' ? 'bg-emerald-900/30 border-emerald-700 text-emerald-400'
                          : d.status==='failed'  ? 'bg-red-900/30 border-red-700 text-red-400'
                          : 'bg-amber-900/30 border-amber-700 text-amber-400'
                        }>{d.status}</Badge>
                      </span>
                      <span className="text-[10px] text-gray-600">{new Date(d.uploaded_at).toLocaleDateString()}</span>
                      <button onClick={() => deleteDoc(d.id, d.filename)} className="text-gray-700 hover:text-red-400 transition-colors text-xs self-end sm:self-auto">✕</button>
                    </div>
                  ))}
                </Card>
              ) : (
                <Card className="flex flex-col items-center justify-center py-16 gap-4">
                  <span className="text-5xl text-gray-800">◫</span>
                  <p className="text-sm text-gray-600">No documents ingested yet</p>
                  <PrimaryBtn onClick={() => setTab('upload')} className="max-w-[220px]">Ingest First Document</PrimaryBtn>
                </Card>
              )}
            </div>
          )}

          {/* ── HISTORY TAB ── */}
          {tab === 'history' && (
            <div>
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-display text-base font-bold text-gray-100">
                  Query History{' '}
                  <span className="text-gray-600 font-normal text-sm">({queryHistory.length})</span>
                </h2>
                {queryHistory.length > 0 && (
                  <DangerBtn onClick={() => { setQueryHistory([]); localStorage.removeItem('rag_qh'); toast.info('History cleared'); }}>
                    Clear History
                  </DangerBtn>
                )}
              </div>

              {queryHistory.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {queryHistory.map(h => (
                    <div key={h.id} className="animate-fade-up bg-gray-900 border border-gray-800 border-l-2 border-l-gray-700 hover:border-l-amber-500 px-4 py-3.5 transition-colors cursor-default">
                      <div className="flex items-start justify-between gap-3 mb-3 flex-wrap">
                        <div className="flex flex-wrap gap-1.5">
                          {h.source   && <Badge classes={srcInfo(h.source).classes}>{srcInfo(h.source).label}</Badge>}
                          <Badge classes="bg-amber-900/40 border-amber-700 text-amber-400">{h.strategy}</Badge>
                          <Badge classes="bg-sky-900/40 border-sky-700 text-sky-400">{fmt.secs(h.processing_time)}</Badge>
                          {h.confidence_score && <Badge classes="bg-emerald-900/40 border-emerald-700 text-emerald-400">{fmt.pct(h.confidence_score)}</Badge>}
                          {h.steps > 0 && <Badge classes="bg-violet-900/40 border-violet-700 text-violet-400">{h.steps} steps</Badge>}
                        </div>
                        <span className="text-[10px] text-gray-600 shrink-0">{fmt.date(h.timestamp)}</span>
                      </div>
                      <p className="text-sm text-amber-400 mb-1.5 leading-snug">Q: {fmt.cut(h.query, 100)}</p>
                      <p className="text-xs text-gray-500 leading-relaxed">A: {fmt.cut(h.answer, 180)}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <Card className="flex flex-col items-center justify-center py-16 gap-3">
                  <span className="text-5xl text-gray-800">◌</span>
                  <p className="text-sm text-gray-600">No queries yet</p>
                </Card>
              )}
            </div>
          )}

          {/* ── AGENT TRACE TAB ── */}
          {tab === 'trace' && (
            <div>
              {agentTrace ? (
                <div className="flex flex-col gap-5">

                  {/* Overview */}
                  <Card>
                    <SectionLabel>Execution Overview</SectionLabel>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                      {[
                        { label:'Agent Type',  val: agentTrace.agent_type,                    cls:'text-amber-400'  },
                        { label:'Source',      val: srcInfo(agentTrace.source).label,         cls:'text-sky-400'    },
                        { label:'Total Steps', val: agentTrace.steps.length,                  cls:'text-emerald-400'},
                        { label:'Fallback',    val: agentTrace.fallback_used ? 'Yes' : 'No',  cls: agentTrace.fallback_used ? 'text-red-400' : 'text-gray-500' },
                      ].map(r => (
                        <div key={r.label} className="bg-gray-950 border border-gray-800 p-3">
                          <p className="text-[9px] tracking-widest uppercase text-gray-600 mb-1">{r.label}</p>
                          <p className={`text-sm font-bold ${r.cls}`}>{r.val}</p>
                        </div>
                      ))}
                    </div>
                    {/* Step-type counts */}
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(STEP_MAP).map(([type, m]) => {
                        const count = agentTrace.steps.filter(s => s.type === type).length;
                        return count > 0 ? (
                          <span key={type} className={`text-[10px] px-3 py-1 ${m.text}`}
                            style={{ border:`1px solid ${m.border}40`, background:`${m.border}12` }}>
                            {type}: {count}
                          </span>
                        ) : null;
                      })}
                    </div>
                  </Card>

                  {/* Tavily sources */}
                  {agentTrace.internet_sources?.length > 0 && (
                    <Card>
                      <SectionLabel>Web Sources — Tavily ({agentTrace.internet_sources.length})</SectionLabel>
                      <div className="flex flex-col gap-3">
                        {agentTrace.internet_sources.map((src, i) => (
                          <div key={i} className="bg-gray-950 border border-gray-800 border-l-2 border-l-emerald-600 pl-4 pr-3 py-3">
                            <p className="text-sm text-gray-200 font-semibold mb-1">{src.title || 'Untitled'}</p>
                            {src.snippet && <p className="text-xs text-gray-500 leading-relaxed mb-2">{fmt.cut(src.snippet, 160)}</p>}
                            <div className="flex items-center justify-between gap-3">
                              {src.url && <a href={src.url} target="_blank" rel="noreferrer" className="text-[10px] text-sky-500 hover:text-sky-400 transition-colors truncate">{fmt.cut(src.url, 60)}</a>}
                              {src.score && <span className="text-[10px] text-emerald-400 shrink-0">{fmt.pct(src.score)}</span>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>
                  )}

                  {/* ReAct steps */}
                  <Card>
                    <SectionLabel>ReAct Execution Trace</SectionLabel>
                    <div className="flex flex-col gap-4">
                      {agentTrace.steps.map((step, i) => {
                        const m = STEP_MAP[step.type] || STEP_MAP.OBSERVATION;
                        return (
                          <div key={i} className={`react-border-left animate-fade-up ${m.bg}`} style={{ borderColor: m.border }}>
                            <div className="flex items-center gap-2 mb-2">
                              <span className={`text-[10px] tracking-[.18em] font-bold ${m.text}`}>
                                [{String(i+1).padStart(2,'0')}] {m.label}
                              </span>
                              {step.timestamp && (
                                <span className="text-[9px] text-gray-600">
                                  {new Date(step.timestamp).toLocaleTimeString()}
                                </span>
                              )}
                            </div>
                            <div className="bg-gray-950 border border-gray-800 px-4 py-3 text-xs text-gray-300 leading-relaxed whitespace-pre-wrap">
                              {step.content}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </Card>
                </div>
              ) : (
                <Card className="flex flex-col items-center justify-center py-16 gap-4">
                  <span className="text-5xl text-gray-800">⊙</span>
                  <div className="text-center">
                    <p className="text-sm text-gray-500 mb-1">No agent trace available</p>
                    <p className="text-xs text-gray-600 mb-5">Run a query with Agentic strategy to capture the ReAct execution trace</p>
                  </div>
                  <PrimaryBtn onClick={() => { setStrategy('agentic'); setTab('query'); }} className="max-w-xs">
                    Switch to Agentic Mode
                  </PrimaryBtn>
                </Card>
              )}
            </div>
          )}

          {/* ── HEALTH TAB ── */}
          {tab === 'health' && (
            <div className="flex flex-col gap-5">

              {/* Health */}
              <Card>
                <div className="flex items-center justify-between mb-4">
                  <SectionLabel>System Health</SectionLabel>
                  <GhostBtn onClick={() => { fetchHealth(); fetchAgentStatus(); }}>↻ Refresh</GhostBtn>
                </div>
                {health ? (
                  <>
                    <div className="mb-4">
                      <Badge classes={
                        health.status === 'healthy'
                          ? 'bg-emerald-900/30 border-emerald-700 text-emerald-400'
                          : 'bg-red-900/30 border-red-700 text-red-400'
                      }>
                        {health.status?.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {Object.entries(health.components || {}).map(([k, v]) => (
                        <div key={k} className="bg-gray-950 border border-gray-800 px-3 py-2.5 flex items-center gap-3">
                          <HealthDot status={v} />
                          <div>
                            <p className="text-xs text-gray-300 capitalize">{k.replace(/_/g,' ')}</p>
                            <p className={`text-[10px] ${v==='operational' ? 'text-emerald-400' : 'text-red-400'}`}>{v}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="mt-3 text-[10px] text-gray-600">
                      Checked: {fmt.date(health.timestamp)} · Version {health.version || '—'}
                    </p>
                  </>
                ) : (
                  <p className="text-xs text-gray-600">Click Refresh to load health status.</p>
                )}
              </Card>

              {/* Agent status */}
              <Card>
                <SectionLabel>Agent Status</SectionLabel>
                {agentStatus ? (
                  <pre className="text-xs text-gray-500 leading-relaxed overflow-auto max-h-64 bg-gray-950 p-4 border border-gray-800">
                    {JSON.stringify(agentStatus, null, 2)}
                  </pre>
                ) : (
                  <p className="text-xs text-gray-600">Click Refresh above to load agent status.</p>
                )}
              </Card>

              {/* API reference */}
              <Card>
                <SectionLabel>API Endpoints</SectionLabel>
                <div className="flex flex-col gap-1.5">
                  {[
                    { m:'POST',   c:'text-emerald-400', ep:'/api/rag/v1/query/',                  desc:'Execute RAG query'    },
                    { m:'POST',   c:'text-emerald-400', ep:'/api/rag/v1/upload/',                 desc:'Ingest document'      },
                    { m:'GET',    c:'text-sky-400',     ep:'/api/rag/v1/documents/',              desc:'List documents'       },
                    { m:'GET',    c:'text-sky-400',     ep:'/api/rag/v1/documents/<id>/',         desc:'Single document'      },
                    { m:'DELETE', c:'text-red-400',     ep:'/api/rag/v1/documents/<id>/delete/',  desc:'Delete document'      },
                    { m:'DELETE', c:'text-red-400',     ep:'/api/rag/v1/documents/clear/',        desc:'Clear all'            },
                    { m:'GET',    c:'text-sky-400',     ep:'/api/rag/v1/queries/',                desc:'Query history'        },
                    { m:'GET',    c:'text-sky-400',     ep:'/api/rag/v1/queries/<id>/execution/', desc:'Execution trace'      },
                    { m:'POST',   c:'text-emerald-400', ep:'/api/rag/v1/sessions/',               desc:'Create session'       },
                    { m:'GET',    c:'text-sky-400',     ep:'/api/rag/v1/stats/',                  desc:'System stats'         },
                    { m:'GET',    c:'text-sky-400',     ep:'/api/rag/v1/health/',                 desc:'Health check'         },
                    { m:'GET',    c:'text-sky-400',     ep:'/api/rag/v1/agents/status/',          desc:'Agent status'         },
                  ].map(r => (
                    <div key={r.ep} className="flex items-center gap-3 bg-gray-950 border border-gray-800 px-3 py-2 text-xs">
                      <span className={`${r.c} font-bold w-12 shrink-0`}>{r.m}</span>
                      <span className="text-gray-300 flex-1 font-mono-custom text-[11px]">{r.ep}</span>
                      <span className="text-gray-600 text-[10px] hidden sm:block">{r.desc}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

        </main>

        {/* ═══ FOOTER ═══ */}
        <footer className="border-t border-gray-800 px-6 py-3 mt-8 flex items-center justify-between">
          <span className="text-[9px] tracking-[.18em] uppercase text-gray-700">
            RAGENT/OS · Multi-Agent RAG · v1.0
          </span>
          <span className="text-gray-800 text-sm">◈ ◇ ◈</span>
        </footer>

      </div>
    </>
  );
}
import React, { useState, useEffect, useRef, useCallback } from 'react';
import CramDashboard from './components/CramDashboard';
import FlashcardDeck from './components/FlashcardDeck';
import QuizArena from './components/QuizArena';
import StackSubprogramSimulator from './components/StackSubprogramSimulator';
import AssemblyEmulator from './components/AssemblyEmulator';
import VisualSchemas from './components/VisualSchemas';
import StudyDashboard from './components/StudyDashboard';
import WritingArena from './components/WritingArena';
import ExamSimulator from './components/ExamSimulator';
import { flashcards } from './data/materialsData';
import './App.css';

/* ── Pomodoro Timer Logic (lives in App so it persists across tabs) ── */
function usePomodoro() {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const timerRef = useRef(null);

  const totalTime = isBreak ? 5 * 60 : 25 * 60;
  const timeLeft = minutes * 60 + seconds;
  const progress = ((totalTime - timeLeft) / totalTime) * 100;

  const playNotification = useCallback((type) => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const gain = ctx.createGain();
      gain.connect(ctx.destination);
      gain.gain.setValueAtTime(0.25, ctx.currentTime);

      if (type === 'break') {
        // Gentle descending chime → rest time
        [880, 660, 440].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.2);
          osc.connect(gain);
          osc.start(ctx.currentTime + i * 0.2);
          osc.stop(ctx.currentTime + i * 0.2 + 0.18);
        });
      } else {
        // Energetic ascending chime → back to work
        [440, 660, 880, 1100].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.15);
          osc.connect(gain);
          osc.start(ctx.currentTime + i * 0.15);
          osc.stop(ctx.currentTime + i * 0.15 + 0.13);
        });
      }
    } catch (e) { /* no audio context */ }
  }, []);

  useEffect(() => {
    if (!isActive) { clearInterval(timerRef.current); return; }

    timerRef.current = setInterval(() => {
      setSeconds(prev => {
        if (prev === 0) {
          if (minutes === 0) {
            // Timer done
            const goingToBreak = !isBreak;
            playNotification(goingToBreak ? 'break' : 'work');
            setPopupMessage(goingToBreak
              ? '🎉 Czas na 5-minutową przerwę! Odpocznij, napij się wody.'
              : '🚀 Koniec przerwy! Wracamy do nauki na pełnych obrotach.');
            setShowPopup(true);
            setIsBreak(goingToBreak);
            setMinutes(goingToBreak ? 5 : 25);
            setIsActive(false);
            return 0;
          }
          setMinutes(m => m - 1);
          return 59;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [isActive, minutes, isBreak, playNotification]);

  const toggle = () => setIsActive(a => !a);
  const reset = () => { setIsActive(false); setIsBreak(false); setMinutes(25); setSeconds(0); };
  const dismissPopup = () => { setShowPopup(false); setIsActive(true); };
  const fmt = (m, s) => `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;

  return {
    minutes, seconds, isActive, isBreak, progress, timeLeft, totalTime,
    toggle, reset, dismissPopup,
    showPopup, popupMessage,
    display: fmt(minutes, seconds),
  };
}

/* ── Main App ── */
function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [pomoHidden, setPomoHidden] = useState(false);
  const pomo = usePomodoro();

  // Flashcard mastery stats
  const [masteryCount, setMasteryCount] = useState(0);
  const totalFlashcards = flashcards.length;

  useEffect(() => {
    try {
      const saved = localStorage.getItem('microstudy_mastery');
      if (saved) {
        setMasteryCount(Object.values(JSON.parse(saved)).filter(v => v === 'easy').length);
      }
    } catch {}
  }, [activeTab]);

  const handleTabChange = (tabId) => { setActiveTab(tabId); setMobileMenuOpen(false); };
  const progressPct = Math.round((masteryCount / totalFlashcards) * 100) || 0;

  // SVG ring helpers for mini timer
  const R = 14;
  const C = 2 * Math.PI * R;
  const ringOffset = C * (1 - pomo.progress / 100);

  const navItems = [
    { id: 'home',       icon: '🏠', label: 'Panel Główny' },
    { id: 'dashboard',  icon: '📖', label: 'Ściąga / Cram' },
    { id: 'exam',       icon: '📝', label: 'Symulator Egzaminu' },
    { id: 'flashcards', icon: '⚡', label: 'Fiszki' },
    { id: 'writing',    icon: '✍️', label: 'Test Pisemny / Mowa' },
    { id: 'quiz',       icon: '🏆', label: 'Quiz' },
    { id: 'visuals',    icon: '🎨', label: 'Schematy' },
    { id: 'simulators', icon: '🔬', label: 'Symulator Stosu' },
    { id: 'emulator',   icon: '⚙️', label: 'Emulator ASM' },
  ];

  return (
    <div id="app-root">
      {/* ── Pomodoro Notification Popup (overlay) ── */}
      {pomo.showPopup && (
        <div className="pomo-popup-overlay" onClick={pomo.dismissPopup}>
          <div className="pomo-popup animate-fade-in-scale" onClick={e => e.stopPropagation()}>
            <div className="pomo-popup-icon">{pomo.isBreak ? '☕' : '📚'}</div>
            <p className="pomo-popup-msg">{pomo.popupMessage}</p>
            <button className="btn btn-primary btn-lg" onClick={pomo.dismissPopup}>
              {pomo.isBreak ? 'Rozpocznij przerwę' : 'Wracam do nauki!'}
            </button>
          </div>
        </div>
      )}

      {/* ── Mobile Header ── */}
      <div className="mobile-header">
        <span className="logo-main"><span className="logo-text">MicroStudy</span></span>
        <button className="menu-toggle-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>☰</button>
      </div>

      {/* ── Sidebar ── */}
      <aside className={`sidebar ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div className="logo-main">
              <span style={{ fontSize: '22px' }}>💾</span>
              <span className="logo-text">MicroStudy</span>
            </div>
            <span className="sidebar-desc">Nauka Mikrokontrolerów</span>
          </div>
          {pomoHidden && (
            <button 
              className="timer-btn-mini" 
              onClick={() => setPomoHidden(false)} 
              title="Pokaż timer Pomodoro"
              style={{ width: '32px', height: '32px', fontSize: '14px', borderRadius: '50%' }}
            >
              ⏱️
            </button>
          )}
        </div>

        {/* ── Inline mini Pomodoro timer ── */}
        {!pomoHidden ? (
          <div className="sidebar-timer">
            <svg className="timer-ring-mini" viewBox="0 0 36 36">
              <circle className="timer-ring-mini-bg" cx="18" cy="18" r={R} fill="transparent" strokeWidth="3" />
              <circle className="timer-ring-mini-fill"
                cx="18" cy="18" r={R} fill="transparent" strokeWidth="3"
                stroke={pomo.isBreak ? 'var(--accent)' : 'var(--primary)'}
                strokeDasharray={C} strokeDashoffset={ringOffset}
                strokeLinecap="round"
                style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
              />
            </svg>
            <div className="timer-info-mini">
              <span className="timer-time-mini">{pomo.display}</span>
              <span className="timer-label-mini">{pomo.isBreak ? 'Przerwa' : pomo.isActive ? 'Nauka' : 'Pauza'}</span>
            </div>
            <div className="timer-controls-mini">
              <button className="timer-btn-mini" onClick={pomo.toggle} title={pomo.isActive ? 'Pauza' : 'Start'}>
                {pomo.isActive ? '⏸' : '▶'}
              </button>
              <button className="timer-btn-mini" onClick={() => setPomoHidden(true)} title="Schowaj timer">
                👁️‍🗨️
              </button>
            </div>
          </div>
        ) : (
          <div className="sidebar-timer-hidden-bar" onClick={() => setPomoHidden(false)} style={{
            padding: '8px 16px',
            background: 'var(--bg-active)',
            borderBottom: '1px solid var(--border)',
            fontSize: '12px',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            transition: 'background 0.2s'
          }}>
            <span>⏱️ Timer działa w tle: <strong>{pomo.display}</strong></span>
            <span style={{ fontSize: '10px', textTransform: 'uppercase', opacity: 0.7 }}>Kliknij, aby pokazać</span>
          </div>
        )}

        {/* ── Navigation ── */}
        <nav className="sidebar-nav">
          <span className="nav-section-label">Nawigacja</span>
          {navItems.map(item => (
            <button
              key={item.id}
              className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => handleTabChange(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* ── Footer progress ── */}
        <div className="sidebar-footer">
          <div className="progress-widget">
            <span className="widget-title">Postęp nauki</span>
            <div className="widget-row">
              <span>Fiszki opanowane</span>
              <strong>{masteryCount}/{totalFlashcards}</strong>
            </div>
            <div className="stat-bars">
              <div className="stat-bar-fill" style={{ width: `${progressPct}%` }} />
            </div>
            <div className="widget-row" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              <span>Wskaźnik gotowości</span>
              <strong>{progressPct}%</strong>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Overlay for mobile ── */}
      <div className="sidebar-overlay" onClick={() => setMobileMenuOpen(false)} />

      {/* ── Main Area ── */}
      <div className="main-layout">
        <main className="content-panel">
          {activeTab === 'home' && <StudyDashboard onNavigate={handleTabChange} progressPct={progressPct} masteryCount={masteryCount} totalFlashcards={totalFlashcards} />}
          {activeTab === 'dashboard' && <CramDashboard />}
          {activeTab === 'flashcards' && <FlashcardDeck />}
          {activeTab === 'writing' && <WritingArena />}
          {activeTab === 'exam' && <ExamSimulator />}
          {activeTab === 'quiz' && <QuizArena />}
          {activeTab === 'visuals' && <VisualSchemas />}
          {activeTab === 'simulators' && <StackSubprogramSimulator />}
          {activeTab === 'emulator' && <AssemblyEmulator />}
        </main>
      </div>
    </div>
  );
}



export default App;

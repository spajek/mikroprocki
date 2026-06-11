import React from 'react';
import './StudyDashboard.css';

const STUDY_PLAN = [
  {
    phase: 1,
    time: '0:00 – 0:30',
    duration: '30 min',
    title: 'Szybki przegląd całego materiału',
    desc: 'Przejrzyj „Ściągę" od góry do dołu. Nie ucz się na pamięć — chodzi o ogólne zapoznanie się z zakresem. Zwróć uwagę na nazwy trybów adresowania i kluczowe pojęcia (stos, podprogram, wektor przerwań).',
    tab: 'dashboard',
    icon: '📖',
    color: 'var(--primary)',
  },
  {
    phase: 2,
    time: '0:30 – 1:15',
    duration: '45 min',
    title: 'Schematy wizualne + Symulator stosu',
    desc: 'Otwórz „Schematy Wizualne" i przejdź przez każdy tryb adresowania, uruchamiając animacje. Następnie przejdź do „Symulatora Stosu" i wykonaj krok po kroku wszystkie trzy scenariusze: Push/Pop, BSR/RTS, oraz obsługę przerwania IRQ/RTI.',
    tab: 'visuals',
    icon: '🎨',
    color: 'var(--accent)',
  },
  {
    phase: 3,
    time: '1:15 – 2:00',
    duration: '45 min',
    title: 'Fiszki — pierwszy przebieg z oceną',
    desc: 'Przejdź przez WSZYSTKIE fiszki, oceniając swój poziom wiedzy: „Słabo", „Średnio" lub „Super". Bądź brutalnie szczery/a — fiszki z oceną „Słabo" wrócą na początek. Nie pomijaj żadnej.',
    tab: 'flashcards',
    icon: '⚡',
    color: 'var(--warning)',
  },
  {
    phase: 4,
    time: '2:00 – 2:30',
    duration: '30 min',
    title: 'Emulator asemblera — hands-on koding',
    desc: 'Otwórz „Emulator ASM" i krok po kroku wykonaj KAŻDY program z notatek. Śledź zmiany rejestrów i pamięci. To Twoja najlepsza szansa, żeby zrozumieć BCD, konwersję Gray i pętle.',
    tab: 'emulator',
    icon: '⚙️',
    color: 'var(--secondary)',
  },
  {
    phase: 5,
    time: '2:30 – 3:15',
    duration: '45 min',
    title: 'Quiz + powtórzenie słabych fiszek',
    desc: 'Rozwiąż cały Quiz. Po nim wróć do Fiszek i przejdź TYLKO te oznaczone jako „Słabo" i „Średnio". Powtarzaj aż wszystkie będą na „Super". To klucz do sukcesu.',
    tab: 'quiz',
    icon: '🏆',
    color: 'var(--error)',
  },
  {
    phase: 6,
    time: '3:15 – 4:00',
    duration: '45 min',
    title: 'Finałowa powtórka i symulacja egzaminu',
    desc: 'Przejdź do „Symulatora Egzaminu” i wylosuj swój zestaw pytań jawnych. Wpisz odpowiedzi na czas i porównaj je z oficjalnymi rozwiązaniami z klucza, by sprawdzić swoją gotowość.',
    tab: 'exam',
    icon: '🎯',
    color: 'var(--success)',
  },
];

const TOPICS = [
  { name: 'Stos (Stack)', keys: ['stos', 'stack', 'push', 'pop', 'sp'] },
  { name: 'Podprogramy (BSR/JSR/RTS)', keys: ['podprogram', 'bsr', 'jsr', 'rts'] },
  { name: 'Wektory przerwań (IRQ/RTI)', keys: ['wektor', 'przerwań', 'irq', 'rti'] },
  { name: 'Tryby adresowania MC6800', keys: ['mc6800', 'natychmiastowe', 'bezpośrednie', 'indeksowe', 'względne', 'rozszerzone'] },
  { name: 'Tryby adresowania 8051', keys: ['8051', 'pośrednie', 'mov', 'rejestrowe'] },
  { name: 'Kody asemblera (pętle, sortowanie)', keys: ['pętl', 'sort', 'gray', 'bcd', 'mnożenie'] },
];

export default function StudyDashboard({ onNavigate, progressPct, masteryCount, totalFlashcards }) {
  return (
    <div className="study-dashboard animate-fade-in">
      {/* ── Hero welcome ── */}
      <div className="hero-welcome">
        <div className="hero-text">
          <h1>Gotowy, żeby <span className="gradient-text">zdać mikroprocki</span>?</h1>
          <p className="hero-subtitle">
            Masz 4 godziny. Poniżej znajdziesz szczegółowy plan nauki oparty na badaniach kognitywnych. 
            Każdy etap jest zaprojektowany tak, żebyś zapamiętał/a maksymalnie dużo w minimalnym czasie.
          </p>
          <div className="hero-actions">
            <button className="btn btn-primary btn-lg" onClick={() => onNavigate('dashboard')}>
              🚀 Zacznij naukę
            </button>
            <button className="btn btn-secondary btn-lg" onClick={() => onNavigate('flashcards')}>
              ⚡ Od razu do fiszek
            </button>
          </div>
        </div>
        <div className="hero-stats-ring">
          <svg viewBox="0 0 120 120" width="120" height="120">
            <circle cx="60" cy="60" r="52" fill="transparent" stroke="rgba(255,255,255,0.04)" strokeWidth="8" />
            <circle cx="60" cy="60" r="52" fill="transparent"
              stroke="url(#heroGrad)" strokeWidth="8" strokeLinecap="round"
              strokeDasharray={`${2*Math.PI*52}`}
              strokeDashoffset={`${2*Math.PI*52*(1-progressPct/100)}`}
              style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%', transition: 'stroke-dashoffset 0.6s' }}
            />
            <defs>
              <linearGradient id="heroGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="var(--primary)" />
                <stop offset="100%" stopColor="var(--accent)" />
              </linearGradient>
            </defs>
          </svg>
          <div className="hero-ring-label">
            <span className="ring-pct">{progressPct}%</span>
            <span className="ring-desc">gotowości</span>
          </div>
        </div>
      </div>

      {/* ── Quick Stats ── */}
      <div className="quick-stats-row stagger-children">
        <div className="qs-card glass-panel animate-slide-up">
          <span className="qs-icon" style={{ background: 'var(--primary-bg)', color: 'var(--primary)' }}>⚡</span>
          <div>
            <span className="qs-value">{masteryCount}</span>
            <span className="qs-label">Fiszek opanowanych</span>
          </div>
        </div>
        <div className="qs-card glass-panel animate-slide-up">
          <span className="qs-icon" style={{ background: 'var(--warning-bg)', color: 'var(--warning)' }}>📝</span>
          <div>
            <span className="qs-value">{totalFlashcards - masteryCount}</span>
            <span className="qs-label">Do powtórzenia</span>
          </div>
        </div>
        <div className="qs-card glass-panel animate-slide-up">
          <span className="qs-icon" style={{ background: 'var(--accent-bg)', color: 'var(--accent)' }}>📚</span>
          <div>
            <span className="qs-value">6</span>
            <span className="qs-label">Zagadnień do wykucia</span>
          </div>
        </div>
        <div className="qs-card glass-panel animate-slide-up">
          <span className="qs-icon" style={{ background: 'var(--success-bg)', color: 'var(--success)' }}>🎯</span>
          <div>
            <span className="qs-value">7</span>
            <span className="qs-label">Programów ASM</span>
          </div>
        </div>
      </div>

      {/* ── 4-Hour Study Plan ── */}
      <div className="plan-section">
        <div className="section-header">
          <h2>Plan nauki na 4 godziny</h2>
          <p>Wykonuj etapy po kolei. Timer Pomodoro (na pasku bocznym) pomoże Ci utrzymać skupienie.</p>
        </div>

        <div className="plan-timeline stagger-children">
          {STUDY_PLAN.map((step, idx) => (
            <div key={idx} className="plan-step glass-panel animate-slide-up" onClick={() => onNavigate(step.tab)}>
              <div className="step-left">
                <div className="step-phase-badge" style={{ borderColor: step.color, color: step.color }}>
                  {step.phase}
                </div>
                <div className="step-connector" style={{ background: step.color }} />
              </div>
              <div className="step-body">
                <div className="step-top-row">
                  <span className="step-time-badge">{step.time}</span>
                  <span className="step-duration">{step.duration}</span>
                </div>
                <h4 className="step-title">
                  <span className="step-icon">{step.icon}</span> {step.title}
                </h4>
                <p className="step-desc">{step.desc}</p>
                <button className="btn btn-ghost btn-sm step-go-btn">
                  Przejdź do modułu →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Topics Overview ── */}
      <div className="topics-section">
        <div className="section-header">
          <h2>Zakres materiału do wykucia</h2>
          <p>Te 6 bloków tematycznych pokrywa 100% pytań egzaminacyjnych z Twoich notatek.</p>
        </div>

        <div className="topics-grid stagger-children">
          {TOPICS.map((topic, idx) => (
            <div key={idx} className="topic-card glass-panel animate-slide-up">
              <span className="topic-number">{idx + 1}</span>
              <h5>{topic.name}</h5>
            </div>
          ))}
        </div>
      </div>

      {/* ── Science Box ── */}
      <div className="science-box glass-panel animate-fade-in">
        <h3>🧠 Dlaczego ten plan działa?</h3>
        <div className="science-grid">
          <div className="science-item">
            <strong>Active Recall (Roediger & Karpicke, 2006)</strong>
            <p>Testowanie wiedzy (fiszki, quiz) jest 2-3x skuteczniejsze od zwykłego czytania. Mózg utrwala informacje podczas wysiłku odtwarzania.</p>
          </div>
          <div className="science-item">
            <strong>Dual Coding (Paivio, 1971)</strong>
            <p>Łączenie tekstu z animacją wizualną aktywuje dwa kanały pamięci jednocześnie, zwiększając retencję o ~60%.</p>
          </div>
          <div className="science-item">
            <strong>Spaced Repetition (Ebbinghaus)</strong>
            <p>System oceniania fiszek (Słabo/Średnio/Super) priorytetyzuje słabe punkty i zapobiega zapominaniu.</p>
          </div>
          <div className="science-item">
            <strong>Elaborative Encoding</strong>
            <p>Emulator ASM zmusza do aktywnego przetwarzania kodu — śledzenie rejestrów buduje głębokie zrozumienie, nie powierzchowne zapamiętywanie.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

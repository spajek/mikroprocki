import React, { useState } from 'react';
import { theory, addressingModes, codeExercises } from '../data/materialsData';
import './CramDashboard.css';

const QUICK_QA = [
  {
    q: "Wymień 3 obszary wewnętrznej pamięci danych RAM w Intel 8051.",
    a: "1. 00H-1FH: Cztery banki rejestrów roboczych R0-R7 (8 rejestrów na bank).\n2. 20H-2FH: Obszar adresowany bezpośrednio bitowo (16 bajtów, czyli 128 bitów do operacji logicznych).\n3. 30H-7FH: Pamięć ogólnego przeznaczenia (notes na zmienne i stos)."
  },
  {
    q: "Gdzie leży obszar rejestrów specjalnych SFR w 8051 i jak się go adresuje?",
    a: "Rejestry SFR leżą powyżej adresu 7FH (od 80H do FFH). Dostęp do nich jest możliwy wyłącznie poprzez adresowanie bezpośrednie."
  },
  {
    q: "Czym różnią się magistrale danych i adresowa w procesorze MC6800 i 8051?",
    a: "- Magistrala adresowa: jest jednokierunkowa (od CPU do pamięci), ma szerokość 16 bitów (pozwala adresować do 64 KB).\n- Magistrala danych: jest dwukierunkowa (przesył danych i opkodów), ma szerokość 8 bitów."
  },
  {
    q: "Czy mikrokontroler MC68HC05 ma wyprowadzone magistrale na piny zewnętrzne?",
    a: "Nie, MC68HC05 to mikrokontroler jednoukładowy. Wszystkie magistrale (danych, adresowa) są zintegrowane wewnątrz jego struktury i nie są wyprowadzone na piny zewnętrzne."
  },
  {
    q: "Co jest wymagane w minimalnej konfiguracji sterownika z procesorem MC6800?",
    a: "1. Zewnętrzny dwufazowy generator zegara niepokrywającego się (np. MC6875).\n2. Zewnętrzna pamięć programu ROM (zawierająca wektory przerwań i kod).\n3. Zewnętrzna pamięć danych RAM (do obsługi zmiennych i stosu).\n4. Zewnętrzny układ RESET (wymuszający reset linii przy włączeniu)."
  },
  {
    q: "Porównaj rejestry wskaźnika stosu (SP) w MC6800 i Intel 8051.",
    a: "- MC6800: SP jest 16-bitowy, ponieważ stos może leżeć w dowolnym miejscu pełnej pamięci RAM (64KB).\n- Intel 8051: SP jest 8-bitowy, ponieważ stos leży wyłącznie w wewnętrznej pamięci RAM (zakres 00H-7FH)."
  },
  {
    q: "Jaka jest rola rejestru DPTR w Intel 8051?",
    a: "DPTR (Data Pointer) to 16-bitowy wskaźnik danych. Służy do adresowania komórek w pamięci zewnętrznej (RAM) lub pamięci programu (ROM)."
  },
  {
    q: "Co oznaczają skróty piny ALE, PSEN, EA w Intel 8051?",
    a: "- ALE (Address Latch Enable): zatrzask młodszej części adresu.\n- PSEN (Program Store Enable): sygnał zezwolenia na odczyt zewnętrznej pamięci ROM.\n- EA (External Access): wymusza pobieranie instrukcji z zewnętrznej pamięci ROM po podłączeniu do masy."
  },
  {
    q: "Porównaj architekturę von Neumanna (MC6800) z architekturą Harvard (8051).",
    a: "- Architektura von Neumanna (MC6800): wspólna, ciągła przestrzeń adresowa (64KB) dla kodu programu, zmiennych RAM oraz portów wejścia/wyjścia.\n- Architektura Harvard (8051): fizycznie rozdzielone pamięci kodu (ROM) i danych (RAM), do których procesor odwołuje się osobnymi szynami i sygnałami."
  },
  {
    q: "Jakie 3 zdarzenia obsługuje układ czasowo-licznikowy w MC68HC05?",
    a: "1. Przepełnienie licznika (Timer Overflow): przejście licznika $FFFF -> $0000 zapala flagę TOF i może zgłosić przerwanie.\n2. Przechwycenie (Input Capture): zewnętrzne zbocze zatrzaskuje stan licznika w rejestrze i zapala flagę ICF.\n3. Porównanie (Output Compare): zrównanie licznika z zadaną wartością w rejestrze zapala flagę OCF i zmienia stan pinu wyjściowego (np. generowanie PWM)."
  },
  {
    q: "Wyjaśnij Tryb 2 (8-bitowy z autouzupełnianiem) timera w Intel 8051.",
    a: "Młodszy rejestr TL zlicza impulsy od 0 do FFH. Po przepełnieniu (FFH -> 00H) zgłaszana jest flaga TF, a wartość początkowa ze starszego rejestru TH jest automatycznie przepisana do TL. Liczenie natychmiast startuje od nowa bez udziału programu. Idealne do generowania prędkości portu szeregowego."
  }
];

export default function CramDashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('pewniaki'); // 'pewniaki', 'theory', 'quick_qa'
  
  // Speed Trainer state
  const [qaIndex, setQaIndex] = useState(0);
  const [showQaAnswer, setShowQaAnswer] = useState(false);
  const [qaStatus, setQaStatus] = useState({}); // idx -> 'know' / 'repeat'

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  // Filter theory
  const filteredTheory = theory.filter(t => 
    t.title.toLowerCase().includes(searchQuery) ||
    t.desc.toLowerCase().includes(searchQuery) ||
    t.details.some(d => d.label.toLowerCase().includes(searchQuery) || d.text.toLowerCase().includes(searchQuery))
  );

  // Split theory into Pewniaki and others
  const pewniakTheory = filteredTheory.filter(t => ['stos', 'podprogram', 'wektor'].includes(t.id));
  const otherTheory = filteredTheory.filter(t => !['stos', 'podprogram', 'wektor'].includes(t.id));

  const filteredMC6800Modes = addressingModes.mc6800.filter(m =>
    m.name.toLowerCase().includes(searchQuery) || 
    m.desc.toLowerCase().includes(searchQuery) || 
    m.example.toLowerCase().includes(searchQuery)
  );

  const handleQaVote = (status) => {
    setQaStatus(prev => ({ ...prev, [qaIndex]: status }));
    setShowQaAnswer(false);
    if (qaIndex < QUICK_QA.length - 1) {
      setQaIndex(prev => prev + 1);
    }
  };

  const knowCount = Object.values(qaStatus).filter(v => v === 'know').length;

  return (
    <div className="cram-container animate-fade-in">
      <div className="cram-header">
        <h2>Baza Wiedzy (Cram Station) 💾</h2>
        <p>Skondensowane, pełne opracowanie zagadnień na egzamin. Ucz się tego, co najważniejsze.</p>
      </div>

      {/* Control Bar */}
      <div className="cram-controls glass-panel">
        <div className="tab-buttons">
          <button 
            className={`tab-btn ${activeTab === 'pewniaki' ? 'active' : ''}`}
            onClick={() => setActiveTab('pewniaki')}
            style={{ borderLeft: '3px solid var(--error)' }}
          >
            🔥 PEWNIAKI EGZAMINACYJNE
          </button>
          <button 
            className={`tab-btn ${activeTab === 'theory' ? 'active' : ''}`}
            onClick={() => setActiveTab('theory')}
          >
            📖 Pozostała Teoria (Tematy 2-9)
          </button>
          <button 
            className={`tab-btn ${activeTab === 'quick_qa' ? 'active' : ''}`}
            onClick={() => setActiveTab('quick_qa')}
            style={{ borderRight: '3px solid var(--accent)' }}
          >
            ⚡ Szybki Trener Q&A (2 min)
          </button>
        </div>

        {activeTab !== 'quick_qa' && (
          <div className="search-wrapper">
            <span className="search-icon">🔍</span>
            <input 
              type="text" 
              placeholder="Wyszukaj..." 
              value={searchQuery}
              onChange={handleSearchChange}
              className="search-input"
            />
          </div>
        )}
      </div>

      {/* Tab 1: Pewniaki Egzaminacyjne */}
      {activeTab === 'pewniaki' && (
        <div className="cram-content-sections animate-fade-in">
          {/* Tryby adresowania */}
          <div className="cram-section-block glass-panel" style={{ borderLeft: '4px solid var(--purple)' }}>
            <div className="section-title-row">
              <span className="badge badge-purple">PEWNIAK 1</span>
              <h3>Tryby adresowania dla procesora MC6800</h3>
            </div>
            <p className="section-intro-text">
              Na egzaminie wylosujesz dokładnie jeden z poniższych trybów do opisania wraz z przykładem.
            </p>
            
            <div className="modes-grid-cram" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '16px',
              marginTop: '15px'
            }}>
              {filteredMC6800Modes.map((mode, idx) => (
                <div key={idx} className="mode-card glass-panel" style={{ background: 'rgba(255, 255, 255, 0.01)', border: '1px solid var(--border)' }}>
                  <h5>{mode.name}</h5>
                  <p className="mode-desc" style={{ fontSize: '13.5px', margin: '8px 0', lineHeigh: '1.5' }}>{mode.desc}</p>
                  <div className="mode-example" style={{
                    background: '#05070f',
                    padding: '8px 12px',
                    borderRadius: '4px',
                    fontSize: '12.5px',
                    fontFamily: 'var(--font-mono)'
                  }}>
                    <strong style={{ color: 'var(--primary-bright)' }}>{mode.example}</strong>
                    <span style={{ color: 'var(--text-muted)', marginLeft: '10px' }}>; {mode.comment}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Theory Pewniaki: Stos, Podprogram, Wektor */}
          {pewniakTheory.map(item => (
            <div key={item.id} className="theory-card glass-panel" style={{ borderLeft: '4px solid var(--error)' }}>
              <div className="card-header-accent">
                <span className="badge badge-error">
                  {item.id === 'stos' ? 'PEWNIAK 10' : item.id === 'podprogram' ? 'PEWNIAK 11' : 'PEWNIAK 12'}
                </span>
                <h4>{item.title}</h4>
              </div>
              <p className="theory-desc" style={{ whiteSpace: 'pre-wrap' }}>{item.desc}</p>
              <div className="theory-details">
                {item.details.map((detail, idx) => (
                  <div key={idx} className="detail-row">
                    <strong className="detail-label">{detail.label}:</strong>
                    <span className="detail-text">{detail.text}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Asembler Pewniaki */}
          <div className="cram-section-block glass-panel" style={{ borderLeft: '4px solid var(--cyan)' }}>
            <div className="section-title-row">
              <span className="badge badge-cyan">PEWNIAK 13</span>
              <h3>Fragmenty programu w assemblerze MC6800</h3>
            </div>
            <p className="section-intro-text">
              Dostaniesz do napisania jeden z czterech poniższych kodów.
            </p>

            <div className="exercises-grid-cram" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
              gap: '16px',
              marginTop: '15px'
            }}>
              {codeExercises.map((ex, idx) => (
                <div key={idx} className="exercise-card glass-panel" style={{ background: 'rgba(0,0,0,0.2)' }}>
                  <h5 style={{ color: 'var(--primary-bright)', marginBottom: '8px' }}>{ex.title}</h5>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '10px' }}><strong>Zadanie:</strong> {ex.task}</p>
                  
                  <div className="code-block-cram" style={{
                    background: '#05070f',
                    padding: '12px',
                    borderRadius: '6px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '13px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }}>
                    {ex.code.map((line, lIdx) => (
                      <div key={lIdx} style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#f43f5e' }}>{line.label}</span>
                        <span style={{ color: '#10b981', opacity: 0.85 }}>; {line.comment}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Pozostała Teoria (Tematy 2-9) */}
      {activeTab === 'theory' && (
        <div className="theory-deck animate-fade-in">
          {otherTheory.length > 0 ? (
            otherTheory.map(item => (
              <div key={item.id} className="theory-card glass-panel">
                <div className="card-header-accent">
                  <span className="badge badge-indigo">Teoria</span>
                  <h4>{item.title}</h4>
                </div>
                <p className="theory-desc" style={{ whiteSpace: 'pre-wrap' }}>{item.desc}</p>
                <div className="theory-details">
                  {item.details.map((detail, idx) => (
                    <div key={idx} className="detail-row">
                      <strong className="detail-label">{detail.label}:</strong>
                      <span className="detail-text">{detail.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="no-results">Brak wyników wyszukiwania dla "{searchQuery}"</div>
          )}
        </div>
      )}

      {/* Tab 3: Szybki Trener Q&A (Lightning Memory Card Module) */}
      {activeTab === 'quick_qa' && (
        <div className="quick-qa-trainer-container animate-fade-in" style={{
          maxWidth: '650px',
          margin: '20px auto',
          textAlign: 'center'
        }}>
          <div className="qa-trainer-progress-bar" style={{
            background: 'var(--bg-hover)',
            padding: '10px 20px',
            borderRadius: '8px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
            fontSize: '13.5px'
          }}>
            <span>Pytanie: <strong>{qaIndex + 1} z {QUICK_QA.length}</strong></span>
            <span>Utrwalone: <strong>{knowCount} / {QUICK_QA.length} ({(Math.round(knowCount / QUICK_QA.length * 100)) || 0}%)</strong></span>
          </div>

          <div className="qa-flashcard glass-panel animate-fade-in-scale" style={{
            padding: '40px 30px',
            minHeight: '260px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '20px',
            position: 'relative',
            border: '1px solid var(--accent-border)'
          }}>
            <span style={{
              position: 'absolute',
              top: '12px',
              left: '16px',
              fontSize: '11px',
              textTransform: 'uppercase',
              color: 'var(--accent)',
              fontWeight: 'bold',
              letterSpacing: '0.5px'
            }}>
              Szybkie utrwalanie teorii
            </span>

            <h3 style={{
              fontSize: '20px',
              fontWeight: '700',
              color: 'var(--text-primary)',
              lineHeight: '1.5'
            }}>
              {QUICK_QA[qaIndex].q}
            </h3>

            {showQaAnswer ? (
              <div className="qa-answer-block animate-fade-in" style={{
                background: 'rgba(16, 185, 129, 0.03)',
                borderLeft: '4px solid var(--success)',
                padding: '16px',
                borderRadius: '0 6px 6px 0',
                width: '100%',
                textAlign: 'left',
                fontSize: '14.5px',
                lineHeight: '1.6',
                color: 'var(--text-secondary)',
                whiteSpace: 'pre-wrap',
                marginTop: '10px'
              }}>
                <strong>Wyjaśnienie:</strong><br />
                {QUICK_QA[qaIndex].a}
              </div>
            ) : (
              <button className="btn btn-primary" onClick={() => setShowQaAnswer(true)} style={{ marginTop: '20px' }}>
                👁️ Pokaż odpowiedź
              </button>
            )}
          </div>

          <div className="qa-controls-row" style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: '15px',
            marginTop: '25px'
          }}>
            <button 
              className="btn btn-secondary" 
              onClick={() => {
                if (qaIndex > 0) {
                  setQaIndex(prev => prev - 1);
                  setShowQaAnswer(false);
                }
              }}
              disabled={qaIndex === 0}
              style={{ flexGrow: 1 }}
            >
              ⬅️ Poprzednie
            </button>

            {showQaAnswer && (
              <div style={{ display: 'flex', gap: '8px', flexGrow: 2 }}>
                <button className="btn btn-secondary" onClick={() => handleQaVote('repeat')} style={{ flexGrow: 1, borderColor: 'var(--error-border)', color: 'var(--error)' }}>
                  ❌ Powtórzę
                </button>
                <button className="btn btn-primary" onClick={() => handleQaVote('know')} style={{ flexGrow: 1, background: 'var(--success)', color: '#000' }}>
                  ✅ Znam to!
                </button>
              </div>
            )}

            {qaIndex === QUICK_QA.length - 1 && showQaAnswer && (
              <button 
                className="btn btn-secondary" 
                onClick={() => {
                  setQaIndex(0);
                  setQaStatus({});
                  setShowQaAnswer(false);
                }}
                style={{ flexGrow: 1 }}
              >
                🔄 Resetuj moduł
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

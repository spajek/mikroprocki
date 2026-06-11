import React, { useState, useEffect } from 'react';
import './VisualSchemas.css';

export default function VisualSchemas() {
  const [activeSchema, setActiveSchema] = useState('addressing'); // 'addressing', 'interrupt'
  const [selectedMode, setSelectedMode] = useState('imm'); // 'imm', 'dir', 'idx', 'ind', 'rel'
  const [animationPlay, setAnimationPlay] = useState(false);
  const [step, setStep] = useState(0);

  // Restart animation when mode changes
  useEffect(() => {
    setAnimationPlay(false);
    setStep(0);
  }, [selectedMode]);

  const handleSimulate = () => {
    setAnimationPlay(false);
    setTimeout(() => {
      setAnimationPlay(true);
    }, 50);
  };

  const nextStep = () => {
    setStep(prev => (prev + 1) % 5);
  };

  return (
    <div className="visuals-container animate-fade-in">
      <div className="visuals-header">
        <h2>Wizualne Schematy i Dual Coding</h2>
        <p>Wykorzystaj Teorię Podwójnego Kodowania (Paivio, 1971). Połączenie tekstu z dynamicznym obrazem i ruchem zwiększa zapamiętywanie do 60%.</p>
      </div>

      {/* Selector */}
      <div className="schema-selector glass-panel">
        <button 
          className={`schema-tab-btn ${activeSchema === 'addressing' ? 'active' : ''}`}
          onClick={() => setActiveSchema('addressing')}
        >
          🔍 Wizualne Tryby Adresowania
        </button>
        <button 
          className={`schema-tab-btn ${activeSchema === 'interrupt' ? 'active' : ''}`}
          onClick={() => setActiveSchema('interrupt')}
        >
          ⚡ Ścieżka Przepływu Przerwania
        </button>
      </div>

      <div className="schema-body">
        {/* SCHEMA 1: VISUAL ADDRESSING MODES */}
        {activeSchema === 'addressing' && (
          <div className="addressing-schema-layout">
            <div className="sidebar-modes glass-panel">
              <h4>Wybierz Tryb Adresowania:</h4>
              <div className="modes-selector-list">
                <button className={`mode-sel-btn ${selectedMode === 'imm' ? 'active' : ''}`} onClick={() => setSelectedMode('imm')}>
                  <strong>#Natychmiastowe</strong> <span>LDAA #$55</span>
                </button>
                <button className={`mode-sel-btn ${selectedMode === 'dir' ? 'active' : ''}`} onClick={() => setSelectedMode('dir')}>
                  <strong>Bezpośrednie</strong> <span>LDAA $25</span>
                </button>
                <button className={`mode-sel-btn ${selectedMode === 'idx' ? 'active' : ''}`} onClick={() => setSelectedMode('idx')}>
                  <strong>Indeksowe</strong> <span>LDAA 5,X</span>
                </button>
                <button className={`mode-sel-btn ${selectedMode === 'ind' ? 'active' : ''}`} onClick={() => setSelectedMode('ind')}>
                  <strong>@Pośrednie (8051)</strong> <span>MOV A, @R0</span>
                </button>
                <button className={`mode-sel-btn ${selectedMode === 'rel' ? 'active' : ''}`} onClick={() => setSelectedMode('rel')}>
                  <strong>Względne (Skoki)</strong> <span>BRA $02</span>
                </button>
              </div>

              <div className="visual-explanation-box">
                {selectedMode === 'imm' && (
                  <>
                    <h5>Natychmiastowe (Immediate)</h5>
                    <p>Dana <strong>$55</strong> znajduje się wewnątrz samej instrukcji (w pamięci programu ROM, zaraz za kodem operacji). CPU nie musi odpytywać pamięci RAM po adresie.</p>
                    <span className="badge badge-indigo">Szybkie</span>
                  </>
                )}
                {selectedMode === 'dir' && (
                  <>
                    <h5>Bezpośrednie (Direct / Page Zero)</h5>
                    <p>Instrukcja zawiera 8-bitowy adres <strong>$25</strong>. CPU udaje się pod fizyczny adres <strong>$0025</strong> w RAM-ie i pobiera stamtąd daną do rejestru.</p>
                    <span className="badge badge-purple">Strona Zerowa</span>
                  </>
                )}
                {selectedMode === 'idx' && (
                  <>
                    <h5>Indeksowe (Indexed)</h5>
                    <p>Adres efektywny to suma wartości rejestru <strong>X</strong> (baza) oraz offsetu <strong>5</strong>. Jeśli X = $2000, CPU pobiera dane z adresu <strong>$2005</strong>.</p>
                    <span className="badge badge-cyan">Baza + Offset</span>
                  </>
                )}
                {selectedMode === 'ind' && (
                  <>
                    <h5>Pośrednie (Indirect - 8051)</h5>
                    <p>Rejestr <strong>R0</strong> przechowuje adres (np. <strong>30H</strong>). CPU odczytuje R0, udaje się pod adres <strong>30H</strong> w RAM, i stamtąd pobiera ostateczną wartość.</p>
                    <span className="badge badge-success">Podwójny Krok</span>
                  </>
                )}
                {selectedMode === 'rel' && (
                  <>
                    <h5>Względne (Relative)</h5>
                    <p>Używane tylko do skoków. Adres docelowy = <strong>PC (adres kolejnego rozkazu) + offset</strong>. Umożliwia pisanie kodu niezależnego od pozycji w pamięci.</p>
                    <span className="badge badge-warning">Przesunięcie U2</span>
                  </>
                )}
              </div>

              <button className="btn btn-primary btn-block animate-pulse" onClick={handleSimulate}>
                🎬 Uruchom Animację Przepływu
              </button>
            </div>

            {/* Animation Canvas */}
            <div className="canvas-panel-visual glass-panel">
              <h4>Szyna Danych i Blok CPU (Wizualizacja)</h4>
              
              <div className="interactive-diagram-area">
                {/* SVG Visualizer */}
                <svg className="svg-canvas" viewBox="0 0 600 400" width="100%" height="100%">
                  {/* CPU boundary */}
                  <rect x="20" y="40" width="220" height="320" rx="15" fill="rgba(30,41,59,0.5)" stroke="var(--border)" strokeWidth="2" />
                  <text x="35" y="70" fill="var(--text-secondary)" fontSize="12" fontWeight="700" letterSpacing="1">CPU (PROCESOR)</text>
                  
                  {/* Rejestr A (Accumulator) */}
                  <rect x="50" y="100" width="160" height="50" rx="8" fill="rgba(99,102,241,0.1)" stroke="var(--primary)" strokeWidth="1.5" />
                  <text x="65" y="130" fill="white" fontSize="14" fontWeight="600">Rejestr A (ACC)</text>
                  <rect x="160" y="110" width="40" height="30" rx="4" fill="rgba(0,0,0,0.3)" stroke="rgba(255,255,255,0.1)" />
                  <text x="170" y="130" fill="#fb7185" fontSize="13" className="code-font" id="svg-reg-a">
                    {animationPlay ? (selectedMode === 'imm' ? '$55' : selectedMode === 'dir' ? '$99' : selectedMode === 'idx' ? '$88' : selectedMode === 'ind' ? '$77' : 'PC') : '??'}
                  </text>

                  {/* Rejestr indeksowy X / R0 */}
                  {selectedMode === 'idx' && (
                    <>
                      <rect x="50" y="180" width="160" height="50" rx="8" fill="rgba(168,85,247,0.1)" stroke="var(--secondary)" strokeWidth="1.5" />
                      <text x="65" y="210" fill="white" fontSize="14" fontWeight="600">Rejestr X</text>
                      <text x="165" y="210" fill="#c084fc" fontSize="13" className="code-font">$2000</text>
                    </>
                  )}
                  {selectedMode === 'ind' && (
                    <>
                      <rect x="50" y="180" width="160" height="50" rx="8" fill="rgba(16,185,129,0.1)" stroke="var(--success)" strokeWidth="1.5" />
                      <text x="65" y="210" fill="white" fontSize="14" fontWeight="600">Rejestr R0</text>
                      <text x="165" y="210" fill="#34d399" fontSize="13" className="code-font">$0030</text>
                    </>
                  )}
                  {selectedMode === 'rel' && (
                    <>
                      <rect x="50" y="180" width="160" height="50" rx="8" fill="rgba(245,158,11,0.1)" stroke="var(--warning)" strokeWidth="1.5" />
                      <text x="65" y="210" fill="white" fontSize="14" fontWeight="600">Rejestr PC</text>
                      <text x="165" y="210" fill="#f59e0b" fontSize="13" className="code-font">$1002</text>
                    </>
                  )}

                  {/* ROM / Program Memory */}
                  <rect x="360" y="40" width="220" height="130" rx="15" fill="rgba(15,23,42,0.6)" stroke="var(--border)" strokeWidth="2" />
                  <text x="375" y="65" fill="var(--text-secondary)" fontSize="12" fontWeight="700" letterSpacing="1">ROM (PAMIĘĆ KODU)</text>
                  
                  {/* ROM instruction byte */}
                  <rect x="380" y="85" width="180" height="40" rx="6" fill="#0f172a" stroke="rgba(255,255,255,0.05)" />
                  <text x="390" y="110" fill="#9ca3af" fontSize="12">
                    {selectedMode === 'imm' && 'LDAA #$55'}
                    {selectedMode === 'dir' && 'LDAA $25'}
                    {selectedMode === 'idx' && 'LDAA 5,X'}
                    {selectedMode === 'ind' && 'MOV A, @R0'}
                    {selectedMode === 'rel' && 'BRA $02'}
                  </text>

                  {/* RAM Memory */}
                  {selectedMode !== 'imm' && (
                    <>
                      <rect x="360" y="190" width="220" height="170" rx="15" fill="rgba(15,23,42,0.6)" stroke="var(--border)" strokeWidth="2" />
                      <text x="375" y="215" fill="var(--text-secondary)" fontSize="12" fontWeight="700" letterSpacing="1">RAM (PAMIĘĆ OPERACYJNA)</text>
                      
                      {selectedMode === 'dir' && (
                        <g>
                          <rect x="380" y="240" width="180" height="35" rx="4" fill="rgba(168,85,247,0.15)" stroke="var(--secondary)" />
                          <text x="390" y="262" fill="white" fontSize="11">$0025:</text>
                          <text x="440" y="262" fill="#c084fc" fontSize="12" fontWeight="bold">$99 (Wartość)</text>
                        </g>
                      )}
                      
                      {selectedMode === 'idx' && (
                        <g>
                          <rect x="380" y="240" width="180" height="35" rx="4" fill="rgba(6,182,212,0.15)" stroke="var(--accent)" />
                          <text x="390" y="262" fill="white" fontSize="11">$2005:</text>
                          <text x="440" y="262" fill="#22d3ee" fontSize="12" fontWeight="bold">$88 (Baza+5)</text>
                        </g>
                      )}

                      {selectedMode === 'ind' && (
                        <g>
                          <rect x="380" y="240" width="180" height="35" rx="4" fill="rgba(16,185,129,0.15)" stroke="var(--success)" />
                          <text x="390" y="262" fill="white" fontSize="11">$0030:</text>
                          <text x="440" y="262" fill="#34d399" fontSize="12" fontWeight="bold">$77 (Pośredni)</text>
                        </g>
                      )}

                      {selectedMode === 'rel' && (
                        <g>
                          <rect x="380" y="240" width="180" height="35" rx="4" fill="rgba(245,158,11,0.15)" stroke="var(--warning)" />
                          <text x="390" y="262" fill="white" fontSize="11">$1006:</text>
                          <text x="440" y="262" fill="#f59e0b" fontSize="12" fontWeight="bold">Cel skoku</text>
                        </g>
                      )}
                    </>
                  )}

                  {/* CONNECTIONS & LINES */}
                  {/* Flow 1: Immediate. From ROM directly to ACC A */}
                  {selectedMode === 'imm' && (
                    <g>
                      {/* Connection path */}
                      <path d="M 400 125 L 400 240 L 130 240 L 130 150" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4" />
                      {animationPlay && (
                        <>
                          <path d="M 400 125 L 400 240 L 130 240 L 130 150" fill="none" stroke="var(--primary)" strokeWidth="4" className="dash-animation" />
                          <circle cx="0" cy="0" r="6" fill="var(--primary)">
                            <animateMotion dur="2s" repeatCount="1" path="M 400 125 L 400 240 L 130 240 L 130 150" />
                          </circle>
                          <g className="fade-in-text">
                            <rect x="200" y="208" width="160" height="22" rx="4" fill="rgba(0, 0, 0, 0.85)" stroke="var(--primary)" strokeWidth="1" />
                            <text x="210" y="224" fill="#ffffff" fontSize="11" fontWeight="600">Ładowanie stałej $55</text>
                          </g>
                        </>
                      )}
                    </g>
                  )}

                  {/* Flow 2: Direct. Address from ROM -> RAM Address -> Data to ACC */}
                  {selectedMode === 'dir' && (
                    <g>
                      {/* Address bus (ROM to RAM) */}
                      <path d="M 470 125 L 470 240" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4" />
                      {/* Data bus (RAM to CPU ACC) */}
                      <path d="M 380 258 L 130 258 L 130 150" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4" />
                      
                      {animationPlay && (
                        <>
                          {/* Address phase */}
                          <path d="M 470 125 L 470 240" fill="none" stroke="var(--secondary)" strokeWidth="4" className="dash-animation" />
                          <circle cx="0" cy="0" r="6" fill="var(--secondary)">
                            <animateMotion dur="1s" repeatCount="1" fill="freeze" path="M 470 125 L 470 240" />
                          </circle>
                          
                          {/* Data phase */}
                          <path d="M 380 258 L 130 258 L 130 150" fill="none" stroke="var(--primary)" strokeWidth="4" className="dash-animation-delayed" />
                          <circle cx="0" cy="0" r="6" fill="var(--primary)">
                            <animateMotion begin="1s" dur="1.2s" repeatCount="1" path="M 380 258 L 130 258 L 130 150" />
                          </circle>
                          <g>
                            <rect x="190" y="263" width="180" height="22" rx="4" fill="rgba(0, 0, 0, 0.85)" stroke="var(--secondary)" strokeWidth="1" />
                            <text x="200" y="278" fill="#ffffff" fontSize="11" fontWeight="600">Krok 1: Wskaż adres $25</text>
                            
                            <rect x="190" y="293" width="180" height="22" rx="4" fill="rgba(0, 0, 0, 0.85)" stroke="var(--primary)" strokeWidth="1" />
                            <text x="200" y="308" fill="#ffffff" fontSize="11" fontWeight="600">Krok 2: Pobierz wartość $99</text>
                          </g>
                        </>
                      )}
                    </g>
                  )}

                  {/* Flow 3: Indexed. ROM Offset + X register -> SUM -> RAM Address -> Data to ACC */}
                  {selectedMode === 'idx' && (
                    <g>
                      {/* X to Adder */}
                      <path d="M 130 230 L 130 280 L 300 280" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3" />
                      {/* ROM Offset to Adder */}
                      <path d="M 470 125 L 470 160 L 300 160 L 300 280" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3" />
                      {/* Adder output to RAM */}
                      <path d="M 300 280 L 380 260" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4" />
                      {/* Data from RAM to ACC */}
                      <path d="M 380 260 L 280 260 L 280 125 L 210 125" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4" />

                      {animationPlay && (
                        <>
                          {/* Signal from X and ROM */}
                          <circle cx="0" cy="0" r="5" fill="var(--secondary)">
                            <animateMotion dur="1s" repeatCount="1" fill="freeze" path="M 130 230 L 130 280 L 300 280" />
                          </circle>
                          <circle cx="0" cy="0" r="5" fill="var(--accent)">
                            <animateMotion dur="1s" repeatCount="1" fill="freeze" path="M 470 125 L 470 160 L 300 160 L 300 280" />
                          </circle>
                          
                          {/* Adder to RAM */}
                          <path d="M 300 280 L 380 260" fill="none" stroke="var(--accent)" strokeWidth="4" className="dash-animation-delayed" />
                          <circle cx="0" cy="0" r="6" fill="var(--accent)">
                            <animateMotion begin="1s" dur="0.8s" repeatCount="1" fill="freeze" path="M 300 280 L 380 260" />
                          </circle>

                          {/* Data from RAM to ACC */}
                          <path d="M 380 260 L 280 260 L 280 125 L 210 125" fill="none" stroke="var(--primary)" strokeWidth="4" className="dash-animation-delayed-long" />
                          <circle cx="0" cy="0" r="6" fill="var(--primary)">
                            <animateMotion begin="1.8s" dur="1.2s" repeatCount="1" path="M 380 260 L 280 260 L 280 125 L 210 125" />
                          </circle>

                          <g>
                            <rect x="220" y="300" width="190" height="25" rx="4" fill="rgba(0, 0, 0, 0.85)" stroke="var(--accent)" strokeWidth="1" />
                            <text x="230" y="317" fill="#ffffff" fontSize="11" fontWeight="600">Obliczanie: $2000 + 5 = $2005</text>
                          </g>
                        </>
                      )}
                    </g>
                  )}

                  {/* Flow 4: Indirect. R0 -> RAM ($0030) -> Data is address -> Fetch final value to ACC */}
                  {selectedMode === 'ind' && (
                    <g>
                      {/* R0 to RAM pointer */}
                      <path d="M 210 205 L 380 258" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3" />
                      {/* Final data from RAM back to Acc */}
                      <path d="M 380 258 L 280 258 L 280 125 L 210 125" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4" />

                      {animationPlay && (
                        <>
                          <path d="M 210 205 L 380 258" fill="none" stroke="var(--success)" strokeWidth="3" className="dash-animation" />
                          <circle cx="0" cy="0" r="5" fill="var(--success)">
                            <animateMotion dur="1s" repeatCount="1" fill="freeze" path="M 210 205 L 380 258" />
                          </circle>

                          <path d="M 380 258 L 280 258 L 280 125 L 210 125" fill="none" stroke="var(--primary)" strokeWidth="4" className="dash-animation-delayed" />
                          <circle cx="0" cy="0" r="6" fill="var(--primary)">
                            <animateMotion begin="1s" dur="1.2s" repeatCount="1" path="M 380 258 L 280 258 L 280 125 L 210 125" />
                          </circle>
                          
                          <g>
                            <rect x="200" y="153" width="200" height="22" rx="4" fill="rgba(0, 0, 0, 0.85)" stroke="var(--success)" strokeWidth="1" />
                            <text x="210" y="168" fill="#ffffff" fontSize="11" fontWeight="600">1. R0 wskazuje adres $0030</text>

                            <rect x="200" y="218" width="200" height="22" rx="4" fill="rgba(0, 0, 0, 0.85)" stroke="var(--primary)" strokeWidth="1" />
                            <text x="210" y="233" fill="#ffffff" fontSize="11" fontWeight="600">2. Pobierz zawartość z $0030</text>
                          </g>
                        </>
                      )}
                    </g>
                  )}

                  {/* Flow 5: Relative. PC + Offset -> JUMP to target */}
                  {selectedMode === 'rel' && (
                    <g>
                      {/* PC to offset addition, then jump to RAM/ROM target */}
                      <path d="M 210 205 L 380 258" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4" />

                      {animationPlay && (
                        <>
                          <path d="M 210 205 L 380 258" fill="none" stroke="var(--warning)" strokeWidth="4" className="dash-animation" />
                          <circle cx="0" cy="0" r="6" fill="var(--warning)">
                            <animateMotion dur="1.5s" repeatCount="1" fill="freeze" path="M 210 205 L 380 258" />
                          </circle>

                          <g>
                            <rect x="210" y="153" width="240" height="22" rx="4" fill="rgba(0, 0, 0, 0.85)" stroke="var(--warning)" strokeWidth="1" />
                            <text x="220" y="168" fill="#ffffff" fontSize="11" fontWeight="600">Obliczanie: PC ($1002) + 2 + 2 = $1006</text>

                            <rect x="210" y="218" width="200" height="22" rx="4" fill="rgba(0, 0, 0, 0.85)" stroke="var(--warning)" strokeWidth="1" />
                            <text x="220" y="233" fill="#ffffff" fontSize="11" fontWeight="600">Skok do instrukcji $1006</text>
                          </g>
                        </>
                      )}
                    </g>
                  )}
                </svg>
              </div>

              <div className="simulation-tips glass-panel">
                <span className="tip-icon">💡</span>
                <p>Kliknij przycisk <strong>„Uruchom Animację Przepływu”</strong>, aby wysłać sygnały elektryczne na schemat szyny danych i zobaczyć, skąd i dokąd procesor pobiera bity danych.</p>
              </div>
            </div>
          </div>
        )}

        {/* SCHEMA 2: VISUAL INTERRUPT FLOWCHART */}
        {activeSchema === 'interrupt' && (
          <div className="interrupt-flow-layout">
            <div className="flowchart-stepper glass-panel">
              <h4>Krokowa Analiza Sekwencji Przerwania:</h4>
              <p className="card-desc">Klikaj na kolejne bloki schematu blokowego po prawej, lub użyj przycisku poniżej, aby przechodzić krok po kroku przez sekwencję sprzętową.</p>
              
              <div className="step-display-card">
                <h5>Etap {step + 1}: {
                  step === 0 ? "Sygnał IRQ" :
                  step === 1 ? "Zabezpieczenie Stanu" :
                  step === 2 ? "Wektor Przerwania" :
                  step === 3 ? "Obsługa (ISR)" :
                  "Powrót (RTI)"
                }</h5>
                
                <p className="step-explanation-detailed">
                  {step === 0 && "Urządzenie peryferyjne (np. timer lub czujnik) wysyła sygnał przerwania. CPU natychmiast kończy wykonywanie aktualnego rozkazu w programie głównym. Sygnał ten jest asynchroniczny."}
                  {step === 1 && "Zanim procesor przejdzie do obsługi, automatycznie odkłada na stos cały swój kontekst (np. rejestry PC, X, A, B i flagi w MC6800). Zapobiega to utracie danych programu głównego."}
                  {step === 2 && "CPU odczytuje adres podprogramu obsługi ze z góry określonej lokalizacji w pamięci (Wektora Przerwań). Każde przerwanie ma przypisany stały adres wektora."}
                  {step === 3 && "CPU ładuje adres pobrany z wektora do licznika PC i rozpoczyna wykonywanie podprogramu obsługi przerwania (ISR). Programista wykonuje tu reakcję na zdarzenie."}
                  {step === 4 && "Na końcu ISR procesor napotyka instrukcję RTI / RETI. Pobiera wtedy ze stosu wcześniej zapisany stan rejestrów (w tym adres powrotu PC) i wznawia program główny."}
                </p>

                <div className="flowchart-buttons">
                  <button className="btn btn-secondary btn-sm" onClick={() => setStep(prev => (prev - 1 + 5) % 5)}>Wstecz</button>
                  <button className="btn btn-primary btn-sm" onClick={nextStep}>Dalej ➡️</button>
                </div>
              </div>
            </div>

            {/* Visual Interactive Flowchart */}
            <div className="flowchart-canvas glass-panel">
              <h4>Interaktywna Ścieżka Przepływu (Zdarzenia)</h4>
              
              <div className="flowchart-grid-vertical">
                <div className={`flow-node ${step === 0 ? 'active' : ''}`} onClick={() => setStep(0)}>
                  <span className="node-number">1</span>
                  <div className="node-content">
                    <h6>Zgłoszenie Przerwania (IRQ)</h6>
                    <p>Sygnał sprzętowy wstrzymuje program</p>
                  </div>
                </div>

                <div className="flow-arrow">👇</div>

                <div className={`flow-node ${step === 1 ? 'active' : ''}`} onClick={() => setStep(1)}>
                  <span className="node-number">2</span>
                  <div className="node-content">
                    <h6>Zrzut Rejestrów na Stos (SP)</h6>
                    <p>PC, X, A, B, CC automatycznie na stos</p>
                  </div>
                </div>

                <div className="flow-arrow">👇</div>

                <div className={`flow-node ${step === 2 ? 'active' : ''}`} onClick={() => setStep(2)}>
                  <span className="node-number">3</span>
                  <div className="node-content">
                    <h6>Odczyt Wektora z RAM</h6>
                    <p>CPU pobiera adres docelowy ISR</p>
                  </div>
                </div>

                <div className="flow-arrow">👇</div>

                <div className={`flow-node ${step === 3 ? 'active' : ''}`} onClick={() => setStep(3)}>
                  <span className="node-number">4</span>
                  <div className="node-content">
                    <h6>Wykonanie Podprogramu (ISR)</h6>
                    <p>Skok PC i obsługa przerwania</p>
                  </div>
                </div>

                <div className="flow-arrow">👇</div>

                <div className={`flow-node ${step === 4 ? 'active' : ''}`} onClick={() => setStep(4)}>
                  <span className="node-number">5</span>
                  <div className="node-content">
                    <h6>Instrukcja RTI (Powrót)</h6>
                    <p>Zdjęcie stanu ze stosu i wznowienie programu</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

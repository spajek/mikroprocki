import React, { useState } from 'react';
import './StackSubprogramSimulator.css';

export default function StackSubprogramSimulator() {
  const [simulatorMode, setSimulatorMode] = useState('stack'); // 'stack', 'subroutine', 'interrupt'
  
  // 1. Stack Push/Pop Simulator State
  const [regA, setRegA] = useState(0x55);
  const [regB, setRegB] = useState(0xAA);
  const [sp, setSp] = useState(0xFFF7);
  const [stackMem, setStackMem] = useState({
    0xFFF0: null, 0xFFF1: null, 0xFFF2: null, 0xFFF3: null, 
    0xFFF4: null, 0xFFF5: null, 0xFFF6: null, 0xFFF7: null,
    0xFFF8: 0x10, 0xFFF9: 0x0D, // Interrupt vector defaults (points to $100D)
    0xFFFA: null, 0xFFFB: null, 0xFFFC: null, 0xFFFD: null,
    0xFFFE: null, 0xFFFF: null
  });
  const [log, setLog] = useState(['Symulator zainicjalizowany. SP = $FFF7.']);

  const addLog = (msg) => {
    setLog(prev => [msg, ...prev.slice(0, 9)]);
  };

  const handlePush = (reg, value) => {
    const hexVal = value.toString(16).toUpperCase().padStart(2, '0');
    const spHex = sp.toString(16).toUpperCase();
    
    // MC6800 write to [SP], then decrement SP
    setStackMem(prev => ({ ...prev, [sp]: value }));
    setSp(prev => prev - 1);
    addLog(`[PUSH ${reg}] Zapisano $${hexVal} pod adres [SP] ($${spHex}), dekrementacja SP do $${(sp - 1).toString(16).toUpperCase()}`);
  };

  const handlePop = (reg, setRegFunc) => {
    // Increment SP first, then read from [SP]
    const nextSp = sp + 1;
    if (nextSp > 0xFFFF) {
      addLog('Błąd: Przepełnienie stosu (Stack Underflow)!');
      return;
    }
    const nextSpHex = nextSp.toString(16).toUpperCase();
    const value = stackMem[nextSp];
    
    if (value === null || value === undefined) {
      addLog(`[POP ${reg}] Ostrzeżenie: Odczyt pustej komórki pod adresem $${nextSpHex}`);
      setRegFunc(0x00);
    } else {
      const hexVal = value.toString(16).toUpperCase().padStart(2, '0');
      setRegFunc(value);
      addLog(`[POP ${reg}] Inkrementacja SP do $${nextSpHex}, pobrano wartość $${hexVal} do rejestru ${reg}`);
    }
    setSp(nextSp);
  };

  // 2. Subroutine Simulator State
  const [subStep, setSubStep] = useState(0);
  const [subSp, setSubSp] = useState(0xFFF7);
  const [subPc, setSubPc] = useState(0x1003);
  const [subStack, setSubStack] = useState({ 0xFFF6: null, 0xFFF7: null });
  const [subLogs, setSubLogs] = useState(['Klikaj "Krok Dalej", aby prześledzić wywołanie BSR $08 i powrót RTS.']);

  const subroutineSteps = [
    {
      title: "1. Przed wywołaniem podprogramu",
      desc: "Procesor ma zaraz wykonać instrukcję BSR $08 (skok względny o 8 bajtów do przodu). Instrukcja ta znajduje się pod adresem PC = $1003. Kolejną instrukcją programu głównego jest adres $1005 (jest to nasz adres powrotu!).",
      setup: () => {
        setSubSp(0xFFF7);
        setSubPc(0x1003);
        setSubStack({ 0xFFF6: null, 0xFFF7: null });
        setSubLogs(['Przygotowanie do BSR $08. PC = $1003, SP = $FFF7. Adres powrotu to $1005.']);
      }
    },
    {
      title: "2. Wykonanie BSR $08: Zapis starszego bajtu adresu powrotu",
      desc: "BSR odkłada 16-bitowy adres powrotu ($1005) na stos. Najpierw zapisywany jest starszy bajt adresu powrotu ($10) pod bieżący adres SP ($FFF7). Następnie SP jest dekrementowany.",
      setup: () => {
        setSubStack({ 0xFFF7: 0x10, 0xFFF6: null });
        setSubSp(0xFFF6);
        setSubPc(0x1003);
        setSubLogs(['[BSR] Zapisano starszy bajt adresu powrotu ($10) na stos pod $FFF7. SP zmniejszony do $FFF6.']);
      }
    },
    {
      title: "3. Wykonanie BSR $08: Zapis młodszego bajtu adresu powrotu",
      desc: "Młodszy bajt adresu powrotu ($05) jest zapisywany pod nowy adres SP ($FFF6). SP jest ponownie dekrementowany (do $FFF5).",
      setup: () => {
        setSubStack({ 0xFFF7: 0x10, 0xFFF6: 0x05 });
        setSubSp(0xFFF5);
        setSubPc(0x1003);
        setSubLogs(['[BSR] Zapisano młodszy bajt adresu powrotu ($05) na stos pod $FFF6. SP zmniejszony do $FFF5.']);
      }
    },
    {
      title: "4. Wykonanie BSR $08: Skok do podprogramu (PC = $100D)",
      desc: "Po zabezpieczeniu adresu powrotu na stosie, procesor dodaje offset ($08) do adresu następnej instrukcji ($1005) i ładuje wynik ($100D) do rejestru PC. Rozpoczyna się wykonywanie podprogramu.",
      setup: () => {
        setSubStack({ 0xFFF7: 0x10, 0xFFF6: 0x05 });
        setSubSp(0xFFF5);
        setSubPc(0x100D);
        setSubLogs(['[BSR] Obliczenie adresu docelowego: $1005 + 8 = $100D. Skok! PC = $100D. Stos zabezpieczony.']);
      }
    },
    {
      title: "5. Wykonanie kodu podprogramu (PC = $100D -> $1010)",
      desc: "Wykonywane są instrukcje podprogramu (np. STAA $1000, TBA, LDAB $1000). PC rośnie do adresu $1010, pod którym znajduje się instrukcja powrotu RTS.",
      setup: () => {
        setSubStack({ 0xFFF7: 0x10, 0xFFF6: 0x05 });
        setSubSp(0xFFF5);
        setSubPc(0x1010);
        setSubLogs(['[Podprogram] Wykonano zadanie. PC dotarł do $1010, napotykając instrukcję RTS (Return from Subroutine).']);
      }
    },
    {
      title: "6. Instrukcja RTS: Pobranie młodszego bajtu adresu powrotu",
      desc: "RTS pobiera adres powrotu ze stosu w odwrotnej kolejności. Najpierw SP jest inkrementowany z $FFF5 do $FFF6, po czym procesor odczytuje stamtąd młodszy bajt ($05).",
      setup: () => {
        setSubStack({ 0xFFF7: 0x10, 0xFFF6: 0x05 });
        setSubSp(0xFFF6);
        setSubPc(0x1010);
        setSubLogs(['[RTS] Inkrementacja SP do $FFF6. Odczytano młodszy bajt adresu powrotu: $05.']);
      }
    },
    {
      title: "7. Instrukcja RTS: Pobranie starszego bajtu adresu powrotu",
      desc: "Następnie SP jest ponownie inkrementowany z $FFF6 do $FFF7, a procesor odczytuje starszy bajt ($10). Stos wraca do stanu wyjściowego (SP = $FFF7).",
      setup: () => {
        setSubStack({ 0xFFF7: 0x10, 0xFFF6: 0x05 });
        setSubSp(0xFFF7);
        setSubPc(0x1010);
        setSubLogs(['[RTS] Inkrementacja SP do $FFF7. Odczytano starszy bajt adresu powrotu: $10.']);
      }
    },
    {
      title: "8. RTS: Rekonstrukcja PC i powrót do programu głównego (PC = $1005)",
      desc: "Procesor składa pobrane bajty ($10 oraz $05) w pełny adres $1005 i ładuje go do rejestru PC. Program główny jest wznawiany od kolejnej instrukcji za BSR.",
      setup: () => {
        setSubStack({ 0xFFF7: null, 0xFFF6: null }); // RAM is marked as inactive/free now
        setSubSp(0xFFF7);
        setSubPc(0x1005);
        setSubLogs(['[RTS Complete] Przywrócenie PC = $1005. Powrót do programu głównego udany! Stos jest czysty.']);
      }
    }
  ];

  const handleSubStepNext = () => {
    const nextStep = (subStep + 1) % subroutineSteps.length;
    setSubStep(nextStep);
    subroutineSteps[nextStep].setup();
  };

  const handleSubStepPrev = () => {
    const prevStep = (subStep - 1 + subroutineSteps.length) % subroutineSteps.length;
    setSubStep(prevStep);
    subroutineSteps[prevStep].setup();
  };

  // 3. Interrupt Simulator State
  const [intStep, setIntStep] = useState(0);
  const [intSp, setIntSp] = useState(0xFFF7);
  const [intPc, setIntPc] = useState(0x1003);
  const [intStack, setIntStack] = useState({});
  const [intLogs, setIntLogs] = useState(['Klikaj "Następny Krok", aby zobaczyć automatyczną reakcję sprzętu na Przerwanie.']);

  const interruptSteps = [
    {
      title: "1. Pojawia się żądanie przerwania (IRQ)",
      desc: "W trakcie wykonywania programu głównego pod adresem PC = $1003, zewnętrzny układ zgłasza sygnał przerwania. Procesor kończy bieżącą instrukcję i zatwierdza obsługę przerwania. Adres powrotu to $1005.",
      setup: () => {
        setIntSp(0xFFF7);
        setIntPc(0x1003);
        setIntStack({});
        setIntLogs(['[IRQ Request] Zgłoszono przerwanie sprzętowe. Zatrzymanie programu głównego.']);
      }
    },
    {
      title: "2. Automatyczny zapis stanu procesora (Rejestry na stos)",
      desc: "Przed skokiem do procedury obsługi, procesor MC6800 automatycznie odkłada na stos cały swój kontekst (7 bajtów!), aby móc go potem przywrócić. Na stos trafiają: PC (2 bajty), X (2 bajty), A (1 bajt), B (1 bajt) oraz rejestr flag CC (1 bajt).",
      setup: () => {
        setIntStack({
          0xFFF7: 0x10, // PC High
          0xFFF6: 0x05, // PC Low
          0xFFF5: 0x02, // X High
          0xFFF4: 0x3E, // X Low
          0xFFF3: 0x55, // Reg A
          0xFFF2: 0xAA, // Reg B
          0xFFF1: 0xC0  // Flags CC
        });
        setIntSp(0xFFF0);
        setIntPc(0x1003);
        setIntLogs(['[Stack Save] Zapisano: PC ($1005), X ($023E), A ($55), B ($AA) i CC ($C0) na stosie. SP zmalało o 7 do $FFF0.']);
      }
    },
    {
      title: "3. Odczyt Wektora Przerwania",
      desc: "Procesor odczytuje adres podprogramu obsługi ze z góry określonej komórki pamięci (Wektora Przerwań). W tym symulatorze wektor pod adresem $FFF8-$FFF9 zawiera wartość $100D.",
      setup: () => {
        setIntSp(0xFFF0);
        setIntPc(0x1003);
        setIntLogs(['[Vector Read] Odczytanie wektora spod $FFF8-$FFF9. Adres procedury obsługi = $100D.']);
      }
    },
    {
      title: "4. Skok do procedury obsługi (ISR)",
      desc: "Procesor ładuje odczytany adres $100D do rejestru PC. Następuje wykonanie podprogramu obsługi przerwania (ISR). Na końcu ISR programista umieszcza rozkaz RTI (Return from Interrupt).",
      setup: () => {
        setIntSp(0xFFF0);
        setIntPc(0x100D);
        setIntLogs(['[Jump to ISR] Skok! Rozpoczęcie procedury obsługi pod adresem PC = $100D.']);
      }
    },
    {
      title: "5. Instrukcja RTI: Przywrócenie stanu rejestrów i powrót",
      desc: "Gdy procesor napotyka RTI, automatycznie pobiera ze stosu 7 bajtów w odwrotnej kolejności: zdejmuje CC, B, A, X oraz PC, przywracając je do rejestrów. Wskaźnik SP wraca do $FFF7.",
      setup: () => {
        setIntStack({});
        setIntSp(0xFFF7);
        setIntPc(0x1005);
        setIntLogs(['[RTI Complete] Wykonano RTI. Zdjęto 7 bajtów ze stosu. Przywrócono rejestry. Powrót do PC = $1005. SP = $FFF7.']);
      }
    }
  ];

  const handleIntStepNext = () => {
    const nextStep = (intStep + 1) % interruptSteps.length;
    setIntStep(nextStep);
    interruptSteps[nextStep].setup();
  };

  const handleIntStepPrev = () => {
    const prevStep = (intStep - 1 + interruptSteps.length) % interruptSteps.length;
    setIntStep(prevStep);
    interruptSteps[prevStep].setup();
  };

  return (
    <div className="sim-container animate-fade-in">
      <div className="sim-header">
        <h2>Interaktywny Symulator Mechanizmów CPU</h2>
        <p>Zrozum wizualnie działanie stosu, podprogramów oraz wektorów przerwań (architektura MC6800).</p>
      </div>

      {/* Simulator Mode Selector */}
      <div className="sim-selector glass-panel">
        <button 
          className={`sim-mode-btn ${simulatorMode === 'stack' ? 'active' : ''}`}
          onClick={() => setSimulatorMode('stack')}
        >
          🥞 Zapis/Odczyt na Stosie (Push & Pop)
        </button>
        <button 
          className={`sim-mode-btn ${simulatorMode === 'subroutine' ? 'active' : ''}`}
          onClick={() => setSimulatorMode('subroutine')}
        >
          📞 Wywołanie Podprogramu (BSR & RTS)
        </button>
        <button 
          className={`sim-mode-btn ${simulatorMode === 'interrupt' ? 'active' : ''}`}
          onClick={() => setSimulatorMode('interrupt')}
        >
          ⚡ Wektor i Obsługa Przerwań (IRQ & RTI)
        </button>
      </div>

      <div className="sim-workspace">
        {/* Left column: Controls & Visualizations */}
        <div className="sim-left-panel">
          {/* Mode 1: Pure Stack Push/Pop */}
          {simulatorMode === 'stack' && (
            <div className="sim-controls-card glass-panel animate-fade-in">
              <h4>Sterowanie Rejestrami i Stosem</h4>
              <p className="card-desc">Operuj na rejestrach A i B, a następnie odkładaj je na stos. Obserwuj jak wskaźnik SP automatycznie dekrementuje przy PUSH i inkrementuje przy POP.</p>
              
              <div className="registers-input-grid">
                <div className="reg-input-box">
                  <label>Akumulator A (Hex):</label>
                  <input 
                    type="text" 
                    value={regA.toString(16).toUpperCase()} 
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 16);
                      if (!isNaN(val)) setRegA(val & 0xFF);
                    }}
                  />
                  <div className="quick-action-row">
                    <button onClick={() => handlePush('A', regA)} className="btn btn-primary btn-sm">PUSH A</button>
                    <button onClick={() => handlePop('A', setRegA)} className="btn btn-secondary btn-sm">POP A</button>
                  </div>
                </div>

                <div className="reg-input-box">
                  <label>Akumulator B (Hex):</label>
                  <input 
                    type="text" 
                    value={regB.toString(16).toUpperCase()} 
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 16);
                      if (!isNaN(val)) setRegB(val & 0xFF);
                    }}
                  />
                  <div className="quick-action-row">
                    <button onClick={() => handlePush('B', regB)} className="btn btn-primary btn-sm">PUSH B</button>
                    <button onClick={() => handlePop('B', setRegB)} className="btn btn-secondary btn-sm">POP B</button>
                  </div>
                </div>
              </div>

              <div className="sim-reset-row">
                <button onClick={() => {
                  setSp(0xFFF7);
                  setStackMem(prev => ({
                    0xFFF0: null, 0xFFF1: null, 0xFFF2: null, 0xFFF3: null, 
                    0xFFF4: null, 0xFFF5: null, 0xFFF6: null, 0xFFF7: null,
                    0xFFF8: 0x10, 0xFFF9: 0x0D,
                    0xFFFA: null, 0xFFFB: null, 0xFFFC: null, 0xFFFD: null,
                    0xFFFE: null, 0xFFFF: null
                  }));
                  setLog(['Zresetowano symulator. SP = $FFF7.']);
                }} className="btn btn-accent">Restart Stosu</button>
              </div>
            </div>
          )}

          {/* Mode 2: Subroutine Execution Walkthrough */}
          {simulatorMode === 'subroutine' && (
            <div className="sim-controls-card glass-panel animate-fade-in">
              <h4>Krokowy Przewodnik po BSR i RTS</h4>
              <div className="walkthrough-step-box">
                <h5>Krok {subStep + 1} z {subroutineSteps.length}: {subroutineSteps[subStep].title}</h5>
                <p className="step-desc-text">{subroutineSteps[subStep].desc}</p>
                
                <div className="step-controls">
                  <button onClick={handleSubStepPrev} className="btn btn-secondary btn-sm" disabled={subStep === 0}>Poprzedni</button>
                  <button onClick={handleSubStepNext} className="btn btn-success btn-sm">Krok Dalej ➡️</button>
                </div>
              </div>

              <div className="active-registers-display">
                <div className="reg-val">PC: <span className="code-text">${subPc.toString(16).toUpperCase()}</span></div>
                <div className="reg-val">SP: <span className="code-text">${subSp.toString(16).toUpperCase()}</span></div>
              </div>
            </div>
          )}

          {/* Mode 3: Interrupt Vector Walkthrough */}
          {simulatorMode === 'interrupt' && (
            <div className="sim-controls-card glass-panel animate-fade-in">
              <h4>Krokowy Przewodnik po Obsłudze Przerwań</h4>
              <div className="walkthrough-step-box">
                <h5>Krok {intStep + 1} z {interruptSteps.length}: {interruptSteps[intStep].title}</h5>
                <p className="step-desc-text">{interruptSteps[intStep].desc}</p>
                
                <div className="step-controls">
                  <button onClick={handleIntStepPrev} className="btn btn-secondary btn-sm" disabled={intStep === 0}>Poprzedni</button>
                  <button onClick={handleIntStepNext} className="btn btn-success btn-sm">Następny Krok ➡️</button>
                </div>
              </div>

              <div className="active-registers-display">
                <div className="reg-val">PC: <span className="code-text">${intPc.toString(16).toUpperCase()}</span></div>
                <div className="reg-val">SP: <span className="code-text">${intSp.toString(16).toUpperCase()}</span></div>
              </div>
            </div>
          )}

          {/* Real-time Logs Console */}
          <div className="sim-logs-card glass-panel">
            <h5>Logi Systemowe Rejestrów i Szyny Danych</h5>
            <div className="logs-console">
              {simulatorMode === 'stack' && log.map((item, idx) => (
                <div key={idx} className="log-line">{item}</div>
              ))}
              {simulatorMode === 'subroutine' && subLogs.map((item, idx) => (
                <div key={idx} className="log-line">{item}</div>
              ))}
              {simulatorMode === 'interrupt' && intLogs.map((item, idx) => (
                <div key={idx} className="log-line">{item}</div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column: RAM Visual Representation */}
        <div className="sim-right-panel glass-panel">
          <div className="ram-header-title">
            <h4>Pamięć RAM (Stos i Wektory)</h4>
            <span className="badge badge-cyan">LIFO</span>
          </div>
          <p className="ram-desc">Obszar pamięci $FFF0 - $FFFF (Strona Wektorów i Wierzchołek Stosu)</p>

          <div className="ram-memory-list">
            {Object.keys(stackMem).sort().map((addrStr) => {
              const addr = parseInt(addrStr);
              let addrHex = addr.toString(16).toUpperCase();
              
              // Decide active value based on mode
              let val = stackMem[addr];
              let isSpTarget = sp === addr;
              let isSpecialVector = addr === 0xFFF8 || addr === 0xFFF9;
              
              if (simulatorMode === 'subroutine') {
                val = subStack[addr] !== undefined ? subStack[addr] : null;
                isSpTarget = subSp === addr;
              } else if (simulatorMode === 'interrupt') {
                val = intStack[addr] !== undefined ? intStack[addr] : null;
                isSpTarget = intSp === addr;
              }

              let cellClass = "ram-cell";
              if (isSpTarget) cellClass += " sp-active";
              if (val !== null) cellClass += " has-data";
              if (isSpecialVector) cellClass += " vector-cell";

              return (
                <div key={addr} className={cellClass}>
                  <span className="cell-address">${addrHex}</span>
                  <span className="cell-value">
                    {val !== null 
                      ? `$${val.toString(16).toUpperCase().padStart(2, '0')}` 
                      : '—'}
                  </span>
                  <span className="cell-marker">
                    {isSpTarget && '👈 SP (Wskaźnik)'}
                    {isSpecialVector && '🎯 WEKTOR'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

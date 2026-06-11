import React, { useState, useEffect } from 'react';
import { codeExercises } from '../data/materialsData';
import './AssemblyEmulator.css';

export default function AssemblyEmulator() {
  const [selectedExId, setSelectedExId] = useState(codeExercises[0].id);
  const [exercise, setExercise] = useState(codeExercises[0]);
  const [stepIndex, setStepIndex] = useState(-1); // -1 means loaded, not started
  const [registers, setRegisters] = useState(codeExercises[0].initialState.registers);
  const [memory, setMemory] = useState(codeExercises[0].initialState.memory);
  const [running, setRunning] = useState(false);
  const [history, setHistory] = useState([]); // Array of steps taken
  const [changeFlags, setChangeFlags] = useState({}); // track what registers/mem changed this step

  useEffect(() => {
    const ex = codeExercises.find(e => e.id === selectedExId);
    setExercise(ex);
    resetEmulator(ex);
  }, [selectedExId]);

  const resetEmulator = (ex = exercise) => {
    setStepIndex(-1);
    setRegisters({ ...ex.initialState.registers });
    setMemory({ ...ex.initialState.memory });
    setHistory([]);
    setRunning(false);
    setChangeFlags({});
  };

  const executeStep = () => {
    const nextIdx = stepIndex + 1;
    if (nextIdx >= exercise.steps.length) {
      setRunning(false);
      return;
    }

    const stepData = exercise.steps[nextIdx];
    
    // Find what changed
    const changed = {};
    
    // Check register changes
    if (stepData.regs) {
      Object.keys(stepData.regs).forEach(r => {
        if (typeof stepData.regs[r] === 'object') {
          // Flags check
          Object.keys(stepData.regs[r]).forEach(f => {
            if (registers.Flags?.[f] !== stepData.regs[r][f]) {
              changed[`flag_${f}`] = true;
            }
          });
        } else if (registers[r] !== stepData.regs[r]) {
          changed[r] = true;
        }
      });
      
      setRegisters(prev => {
        const nextRegs = { ...prev, ...stepData.regs };
        if (stepData.regs.Flags) {
          nextRegs.Flags = { ...prev.Flags, ...stepData.regs.Flags };
        }
        return nextRegs;
      });
    }

    // Check memory changes
    if (stepData.mem) {
      Object.keys(stepData.mem).forEach(m => {
        if (memory[m] !== stepData.mem[m]) {
          changed[`mem_${m}`] = true;
        }
      });
      setMemory(prev => ({ ...prev, ...stepData.mem }));
    }

    setChangeFlags(changed);
    setStepIndex(nextIdx);
    setHistory(prev => [...prev, stepData.desc]);
    
    // Clear change animations after 1s
    setTimeout(() => {
      setChangeFlags({});
    }, 1000);

    if (nextIdx === exercise.steps.length - 1) {
      setRunning(false);
    }
  };

  const runAll = () => {
    if (stepIndex >= exercise.steps.length - 1) return;
    setRunning(true);
  };

  useEffect(() => {
    let interval;
    if (running) {
      interval = setInterval(() => {
        if (stepIndex < exercise.steps.length - 1) {
          executeStep();
        } else {
          setRunning(false);
        }
      }, 1200);
    }
    return () => clearInterval(interval);
  }, [running, stepIndex, exercise]);

  return (
    <div className="emulator-container animate-fade-in">
      <div className="emulator-header">
        <h2>Emulator Kodu Asemblera (Hands-on Practice)</h2>
        <p>Wybierz jeden z programów z notatek, uruchamiaj go krok po kroku i zobacz jak zmieniają się rejestry oraz pamięć.</p>
      </div>

      {/* Select Box */}
      <div className="emulator-selector glass-panel">
        <label>Program: </label>
        <select 
          value={selectedExId} 
          onChange={(e) => setSelectedExId(e.target.value)}
          className="ex-select-input"
          disabled={running}
        >
          {codeExercises.map(ex => (
            <option key={ex.id} value={ex.id}>
              [{ex.processor}] {ex.title}
            </option>
          ))}
        </select>
        <span className="badge badge-purple">{exercise.processor}</span>
      </div>

      <div className="emulator-workspace">
        {/* Left Column - Source Code */}
        <div className="code-view-panel glass-panel">
          <div className="code-panel-header">
            <h4>Kod Źródłowy ({exercise.processor})</h4>
            <div className="controls-row">
              <button 
                onClick={executeStep} 
                disabled={running || stepIndex >= exercise.steps.length - 1} 
                className="btn btn-primary btn-sm"
              >
                👣 Krok po kroku
              </button>
              <button 
                onClick={runAll} 
                disabled={running || stepIndex >= exercise.steps.length - 1} 
                className="btn btn-success btn-sm"
              >
                ▶️ Uruchom automatycznie
              </button>
              <button 
                onClick={() => resetEmulator()} 
                className="btn btn-secondary btn-sm"
              >
                🔄 Reset
              </button>
            </div>
          </div>
          
          <p className="exercise-task-desc"><strong>Zadanie:</strong> {exercise.task}</p>

          <div className="code-listing">
            {exercise.code.map((line, idx) => {
              // Highlight the line if it matches the current PC step
              const isCurrent = stepIndex >= 0 && 
                                stepIndex < exercise.steps.length && 
                                exercise.steps[stepIndex].op.startsWith(line.label.split(' ')[0]) &&
                                (idx === stepIndex % exercise.code.length || (exercise.id === 'ex4_swap' && idx === [0,1,2,3,4,5,6][stepIndex])); 
                                // Simple mapping for simulation visualization highlighting
              
              // Custom map for highlighting line numbers
              let activeLine = false;
              if (stepIndex >= 0 && stepIndex < exercise.steps.length) {
                const currentOp = exercise.steps[stepIndex].op;
                if (line.label.startsWith(currentOp.split(' ')[0]) || (line.label === "..." && stepIndex === 2)) {
                  activeLine = true;
                }
              }

              return (
                <div key={idx} className={`code-line ${activeLine ? 'active' : ''}`}>
                  <span className="line-num">{idx + 1}</span>
                  <span className="line-code">{line.label}</span>
                  <span className="line-comment">; {line.comment}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column - CPU Context & Memory */}
        <div className="cpu-context-panel">
          {/* Registers */}
          <div className="registers-card glass-panel">
            <h4>Rejestry Procesora</h4>
            <div className="regs-grid">
              {Object.keys(registers).map(r => {
                if (r === 'Flags') return null;
                const val = registers[r];
                const hexVal = val.toString(16).toUpperCase();
                const isChanged = changeFlags[r];
                
                return (
                  <div key={r} className={`reg-box ${isChanged ? 'highlight-change' : ''}`}>
                    <span className="reg-name">{r}</span>
                    <span className="reg-val-hex">${hexVal.padStart(r === 'X' ? 4 : 2, '0')}</span>
                    <span className="reg-val-dec">({val})</span>
                  </div>
                );
              })}
            </div>

            {/* Flags */}
            {registers.Flags && (
              <div className="flags-box">
                <span className="flags-title">Flagi stanu (CCR / PSW):</span>
                <div className="flags-row">
                  {Object.keys(registers.Flags).map(f => {
                    const active = registers.Flags[f] === 1;
                    const isChanged = changeFlags[`flag_${f}`];
                    return (
                      <span 
                        key={f} 
                        className={`flag-badge ${active ? 'active' : ''} ${isChanged ? 'highlight-change' : ''}`}
                      >
                        {f}: {registers.Flags[f]}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Memory */}
          {Object.keys(memory).length > 0 && (
            <div className="mem-card glass-panel">
              <h4>Podgląd komórek pamięci RAM</h4>
              <div className="mem-grid">
                {Object.keys(memory).map(addr => {
                  const val = memory[addr];
                  const hexAddr = parseInt(addr).toString(16).toUpperCase();
                  const hexVal = val !== null ? val.toString(16).toUpperCase().padStart(2, '0') : '—';
                  const isChanged = changeFlags[`mem_${addr}`];
                  
                  return (
                    <div key={addr} className={`mem-cell-box ${isChanged ? 'highlight-change' : ''}`}>
                      <span className="mem-addr">${hexAddr.padStart(4, '0')}</span>
                      <span className="mem-val">${hexVal}</span>
                      <span className="mem-val-dec">({val})</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Explanation Terminal */}
          <div className="terminal-card glass-panel">
            <h4>Komentarz Wykonania (Terminal)</h4>
            <div className="terminal-console">
              {history.length > 0 ? (
                history.map((log, idx) => (
                  <div key={idx} className="terminal-line">
                    <span className="term-prompt">&gt;</span> {log}
                  </div>
                ))
              ) : (
                <div className="terminal-placeholder">Uruchom krok, aby rozpocząć symulację...</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { theory, addressingModes, codeExercises } from '../data/materialsData';
import './ExamSimulator.css';

// Keyword database for grading exam tasks
const EXAM_KEYWORDS = {
  // Theory topics
  stos: ['sp', 'lifo', 'ram', 'dół', 'dekrement', 'psh', 'pul', 'pop', 'push', 'rejestr'],
  podprogram: ['bsr', 'jsr', 'rts', 'stos', 'adres', 'powrot', 'modułow', 'zagnieżdż'],
  wektor: ['adres', 'podprogram', 'obsług', 'irq', 'rti', 'ram', 'przerw', 'isr', 'rejestr'],

  // Code exercises
  ex1_loop: ['ldx', 'inx', 'cpx', 'bne', '$1000', '$fa', '#$0001'],
  ex2_mul3: ['ldx', '#$0000', 'aba', 'inx', 'cpx', '#$0003', 'bne', '$f9'],
  ex3_comp: ['cba', 'bge', '$08', 'stab', '$1212', 'bra', '$0b', 'staa'],
  ex4_swap: ['lds', '#$fff7', 'bsr', 'staa', '$1000', 'tba', 'ldab', 'rts'],
  ex5_sort: ['ldaa', 'ldab', 'cba', 'bmi', 'staa', 'stab', '$2020', '$2021', '$2022'],
  ex6_gray: ['ldaa', '$10', 'lsra', 'eora', 'staa', '$11'],
  ex7_bcd_sub: ['mov', 'r0', '#028h', 'r1', '#014h', 'subb', 'inc', 'add', 'da a']
};

export default function ExamSimulator() {
  const [currentSet, setCurrentSet] = useState(null);
  const [userAnswers, setUserAnswers] = useState({ q1: '', q2: '', q3: '' });
  const [showSolutions, setShowSolutions] = useState(false);
  const [checkedStatus, setCheckedStatus] = useState({ q1: false, q2: false, q3: false });
  const [grades, setGrades] = useState({ q1: null, q2: null, q3: null });

  // Generate a random exam set
  const generateNewSet = () => {
    // 1. Random Addressing Mode
    const processors = ['mc6800', 'intel8051'];
    const randomProc = processors[Math.floor(Math.random() * processors.length)];
    const modesList = addressingModes[randomProc];
    const randomMode = modesList[Math.floor(Math.random() * modesList.length)];

    // 2. Random Hardware Theory (Stos/Podprogram/Wektor)
    const randomTheory = theory[Math.floor(Math.random() * theory.length)];

    // 3. Random Assembly Exercise
    const randomCode = codeExercises[Math.floor(Math.random() * codeExercises.length)];

    setCurrentSet({
      q1: {
        type: 'addressing',
        proc: randomProc === 'mc6800' ? 'MC6800 / M68HC05' : 'Intel 8051',
        name: randomMode.name,
        officialDesc: randomMode.desc,
        officialExample: randomMode.example,
        officialComment: randomMode.comment
      },
      q2: {
        type: 'theory',
        id: randomTheory.id,
        title: randomTheory.title,
        officialDesc: randomTheory.desc,
        details: randomTheory.details
      },
      q3: {
        type: 'code',
        id: randomCode.id,
        title: randomCode.title,
        task: randomCode.task,
        codeLines: randomCode.code
      }
    });

    setUserAnswers({ q1: '', q2: '', q3: '' });
    setShowSolutions(false);
    setCheckedStatus({ q1: false, q2: false, q3: false });
    setGrades({ q1: null, q2: null, q3: null });
  };

  const checkTask = (taskKey) => {
    if (!currentSet) return;
    const answer = userAnswers[taskKey].toLowerCase();
    if (!answer.trim()) {
      alert("Wpisz odpowiedź przed sprawdzeniem!");
      return;
    }

    let keywords = [];
    if (taskKey === 'q1') {
      // Find keywords from the name of the addressing mode
      const nameWords = currentSet.q1.name.toLowerCase().split(' ');
      const descWords = currentSet.q1.officialDesc.toLowerCase().split(' ');
      const exampleWords = currentSet.q1.officialExample.toLowerCase().split(' ');
      keywords = [...new Set([...nameWords, ...descWords, ...exampleWords])].filter(w => w.length > 3);
    } else if (taskKey === 'q2') {
      keywords = EXAM_KEYWORDS[currentSet.q2.id] || [];
    } else {
      keywords = EXAM_KEYWORDS[currentSet.q3.id] || [];
    }

    const matched = keywords.filter(kw => answer.includes(kw.replace('#', '').replace('$', '')));
    const score = keywords.length > 0 ? Math.round((matched.length / keywords.length) * 100) : 0;

    let textGrade = 'Niezaliczone (wymaga powtórki) ❌';
    if (score >= 70) textGrade = 'Zaliczone na 5! 🌟';
    else if (score >= 45) textGrade = 'Zaliczone na 3/4 ⚠️';

    setGrades(prev => ({ ...prev, [taskKey]: { score, textGrade } }));
    setCheckedStatus(prev => ({ ...prev, [taskKey]: true }));
  };

  const revealAllSolutions = () => {
    setShowSolutions(true);
  };

  return (
    <div className="exam-simulator-container animate-fade-in">
      <div className="exam-header">
        <h2>Symulator Zestawów Egzaminacyjnych</h2>
        <p>Wygeneruj losowy zestaw złożony z 3 pytań jawnych, które dostaniesz na prawdziwym egzaminie. Odpowiedz pisemnie i sprawdź się przed wejściem na salę.</p>
      </div>

      {!currentSet ? (
        <div className="exam-welcome-card glass-panel text-center">
          <div className="welcome-icon">📝</div>
          <h3>Gotowy na symulację egzaminu?</h3>
          <p>System wylosuje 1 tryb adresowania, 1 pytanie teoretyczne o stos/podprogram/wektor oraz 1 kod w asemblerze.</p>
          <button className="btn btn-primary btn-lg" onClick={generateNewSet}>
            🎲 Generuj losowy zestaw
          </button>
        </div>
      ) : (
        <div className="exam-workspace-layout">
          {/* Main tasks list */}
          <div className="tasks-column">
            {/* Task 1: Addressing Mode */}
            <div className="exam-task-card glass-panel">
              <div className="task-header">
                <span className="task-num">Zadanie 1</span>
                <span className="badge badge-purple">Tryby adresowania ({currentSet.q1.proc})</span>
              </div>
              <h4 className="task-question">
                Omów tryb: <strong>{currentSet.q1.name}</strong>. Podaj krótki opis teoretyczny oraz przykład instrukcji w asemblerze.
              </h4>
              <textarea
                placeholder="Wpisz definicję trybu oraz kod przykładu..."
                value={userAnswers.q1}
                onChange={e => setUserAnswers(e.target.value)}
                disabled={checkedStatus.q1}
              />
              <div className="task-actions">
                <button className="btn btn-secondary btn-sm" onClick={() => checkTask('q1')} disabled={checkedStatus.q1}>
                  🔍 Sprawdź Zadanie 1
                </button>
                {checkedStatus.q1 && (
                  <span className="grade-pill">{grades.q1.textGrade} (Zgodność: {grades.q1.score}%)</span>
                )}
              </div>
              {showSolutions && (
                <div className="official-solution-box animate-fade-in">
                  <h5>Oficjalny klucz odpowiedzi:</h5>
                  <p><strong>Teoria:</strong> {currentSet.q1.officialDesc}</p>
                  <p><strong>Przykład kodu:</strong> <code className="code-text">{currentSet.q1.officialExample}</code> ; {currentSet.q1.officialComment}</p>
                </div>
              )}
            </div>

            {/* Task 2: Hardware Theory */}
            <div className="exam-task-card glass-panel">
              <div className="task-header">
                <span className="task-num">Zadanie 2</span>
                <span className="badge badge-indigo">Budowa i przeznaczenie</span>
              </div>
              <h4 className="task-question">
                Jak jest zbudowany i do czego służy: <strong>{currentSet.q2.title}</strong>? Opisz szczegółowo budowę i mechanizm działania.
              </h4>
              <textarea
                placeholder="Opisz budowę, wskaźniki, operacje oraz główne przeznaczenie..."
                value={userAnswers.q2}
                onChange={e => setUserAnswers(e.target.value)}
                disabled={checkedStatus.q2}
              />
              <div className="task-actions">
                <button className="btn btn-secondary btn-sm" onClick={() => checkTask('q2')} disabled={checkedStatus.q2}>
                  🔍 Sprawdź Zadanie 2
                </button>
                {checkedStatus.q2 && (
                  <span className="grade-pill">{grades.q2.textGrade} (Zgodność: {grades.q2.score}%)</span>
                )}
              </div>
              {showSolutions && (
                <div className="official-solution-box animate-fade-in">
                  <h5>Oficjalny klucz odpowiedzi:</h5>
                  <p>{currentSet.q2.officialDesc}</p>
                  <ul style={{ paddingLeft: '20px', marginTop: '10px' }}>
                    {currentSet.q2.details.map((d, i) => (
                      <li key={i} style={{ marginBottom: '6px' }}>
                        <strong>{d.label}:</strong> {d.text}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Task 3: Assembly code */}
            <div className="exam-task-card glass-panel">
              <div className="task-header">
                <span className="task-num">Zadanie 3</span>
                <span className="badge badge-cyan">Kod w asemblerze</span>
              </div>
              <h4 className="task-question">
                Napisz program: <strong>{currentSet.q3.title}</strong>. 
                <br />
                <span style={{ fontSize: '14px', fontWeight: 'normal', color: 'var(--text-secondary)' }}>
                  Zadanie: {currentSet.q3.task}
                </span>
              </h4>
              <textarea
                placeholder="Napisz instrukcje w asemblerze, linia po linii..."
                value={userAnswers.q3}
                onChange={e => setUserAnswers(e.target.value)}
                disabled={checkedStatus.q3}
                style={{ fontFamily: 'var(--font-mono)' }}
              />
              <div className="task-actions">
                <button className="btn btn-secondary btn-sm" onClick={() => checkTask('q3')} disabled={checkedStatus.q3}>
                  🔍 Sprawdź Zadanie 3
                </button>
                {checkedStatus.q3 && (
                  <span className="grade-pill">{grades.q3.textGrade} (Zgodność: {grades.q3.score}%)</span>
                )}
              </div>
              {showSolutions && (
                <div className="official-solution-box animate-fade-in">
                  <h5>Oficjalny klucz odpowiedzi:</h5>
                  <div className="code-block-exam" style={{
                    background: '#05070f',
                    padding: '12px',
                    borderRadius: '6px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '13px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }}>
                    {currentSet.q3.codeLines.map((line, i) => (
                      <div key={i}>
                        <span style={{ color: '#f43f5e', marginRight: '20px' }}>{line.label}</span>
                        <span style={{ color: '#10b981' }}>; {line.comment}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Global controls */}
            <div className="exam-controls-bottom">
              <button className="btn btn-secondary btn-lg" onClick={revealAllSolutions}>
                🔓 Pokaż klucz odpowiedzi dla zestawu
              </button>
              <button className="btn btn-primary btn-lg" onClick={generateNewSet}>
                🎲 Losuj kolejny zestaw
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

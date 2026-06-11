import React, { useState, useEffect } from 'react';
import { flashcards } from '../data/materialsData';
import './WritingArena.css';

export default function WritingArena() {
  const [activeMode, setActiveMode] = useState('cloze'); // 'cloze' (Luki), 'checklist' (Słowa kluczowe), 'dictation' (Dyktando)
  const [filterCategory, setFilterCategory] = useState('pewniaki'); // Default to Pewniaki!
  const [currentIndex, setCurrentIndex] = useState(0);
  const [difficulty, setDifficulty] = useState('medium'); // 'easy', 'medium', 'hard', 'hardcore'
  const [gapAnswers, setGapAnswers] = useState({});
  const [userAnswerText, setUserAnswerText] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [showReveal, setShowReveal] = useState(false);
  const [voicesLoaded, setVoicesLoaded] = useState(false);

  // Filter flashcards based on category
  const deck = filterCategory === 'pewniaki'
    ? flashcards.filter(c => ['fc1', 'fc2', 'fc3', 'fc4', 'fc5', 'fc6', 'fc11', 'fc12', 'fc13'].includes(c.id))
    : filterCategory === 'others'
      ? flashcards.filter(c => !['fc1', 'fc2', 'fc3', 'fc4', 'fc5', 'fc6', 'fc11', 'fc12', 'fc13'].includes(c.id))
      : flashcards;

  // Active flashcard
  const activeCard = deck[currentIndex] || deck[0];

  // Reset index when filter category changes
  useEffect(() => {
    setCurrentIndex(0);
    setIsChecked(false);
    setShowReveal(false);
    setGapAnswers({});
    setUserAnswerText('');
  }, [filterCategory]);

  // Tokenize text for Cloze (Gap-Fill) mode
  const [clozeData, setClozeData] = useState({ tokens: [], gapMap: {} });

  useEffect(() => {
    if (!activeCard) return;
    
    // Tokenize text by keeping words and punctuation/spaces separate
    const tokens = activeCard.back.split(/([a-zA-Z0-9żźćńółęąśŻŹĆŃÓŁĘĄŚ#$]+)/);
    const isWord = (tok) => /^[a-zA-Z0-9żźćńółęąśŻŹĆŃÓŁĘĄŚ#$]+$/.test(tok) && tok.length >= 2;
    
    let wordCount = 0;
    const gapMap = {};
    
    // Decide gap frequency based on difficulty
    // Easy: every 5th word
    // Medium: every 3rd word
    // Hard: every 2nd word
    // Hardcore: every word is a gap!
    const step = difficulty === 'easy' ? 5 : difficulty === 'medium' ? 3 : difficulty === 'hard' ? 2 : 1;
    
    tokens.forEach((tok, idx) => {
      if (isWord(tok)) {
        wordCount++;
        if (wordCount % step === 0) {
          gapMap[idx] = tok;
        }
      }
    });
    
    setClozeData({ tokens, gapMap });
    setGapAnswers({});
    setUserAnswerText('');
    setIsChecked(false);
    setShowReveal(false);
  }, [currentIndex, difficulty, activeMode, activeCard]);

  // Load voices for synthesis
  useEffect(() => {
    const loadVoices = () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.getVoices();
        setVoicesLoaded(true);
      }
    };
    loadVoices();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  // Speak function
  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pl-PL';
      utterance.rate = 0.9;
      
      const voices = window.speechSynthesis.getVoices();
      const plVoice = voices.find(v => v.lang.startsWith('pl-PL') || v.lang.startsWith('pl'));
      if (plVoice) {
        utterance.voice = plVoice;
      }
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Twoja przeglądarka nie obsługuje syntezy mowy.");
    }
  };

  const handleGapChange = (idx, value) => {
    setGapAnswers(prev => ({ ...prev, [idx]: value }));
  };

  const cleanString = (str) => {
    return str.toLowerCase().trim().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "");
  };

  // Evaluate cloze test score
  const evaluateCloze = () => {
    let total = Object.keys(clozeData.gapMap).length;
    let correct = 0;
    Object.keys(clozeData.gapMap).forEach(idx => {
      const userVal = cleanString(gapAnswers[idx] || '');
      const correctVal = cleanString(clozeData.gapMap[idx]);
      if (userVal === correctVal) {
        correct++;
      }
    });
    return { total, correct, score: total > 0 ? Math.round((correct / total) * 100) : 0 };
  };

  // Live checklist evaluation for keywords
  const keywordsStatus = () => {
    if (!activeCard) return [];
    const textLower = userAnswerText.toLowerCase();
    return (activeCard.keywords || []).map(kw => {
      const cleanKw = kw.toLowerCase().trim();
      const isMatched = textLower.includes(cleanKw);
      return { word: kw, isMatched };
    });
  };

  const matchedKeywordsCount = () => {
    return keywordsStatus().filter(k => k.isMatched).length;
  };

  const totalKeywordsCount = () => {
    return (activeCard.keywords || []).length;
  };

  const keywordPercentage = () => {
    const total = totalKeywordsCount();
    if (total === 0) return 0;
    return Math.round((matchedKeywordsCount() / total) * 100);
  };

  // Dictation evaluator
  const evaluateDictation = () => {
    const cleanWords = (txt) => txt.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "").split(/\s+/).filter(Boolean);
    const correctWords = cleanWords(activeCard.back);
    const userWords = cleanWords(userAnswerText);
    
    let matched = 0;
    correctWords.forEach(w => {
      if (userWords.includes(w)) {
        matched++;
      }
    });
    
    const score = correctWords.length > 0 ? Math.round((matched / correctWords.length) * 100) : 0;
    return { score, correctCount: correctWords.length, matchedCount: matched };
  };

  const handleCheck = () => {
    if (activeMode === 'checklist' || activeMode === 'dictation') {
      if (!userAnswerText.trim()) {
        alert("Wpisz swoją odpowiedź przed sprawdzeniem!");
        return;
      }
    }
    setIsChecked(true);
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % deck.length);
  };

  const handlePrev = () => {
    setCurrentIndex(prev => (prev - 1 + deck.length) % deck.length);
  };

  const handlePlayAudio = () => {
    speakText(activeCard.back);
  };

  // Calculate results for current state
  const clozeResult = evaluateCloze();
  const dictationResult = evaluateDictation();
  const listStatus = keywordsStatus();

  return (
    <div className="writing-arena-container animate-fade-in">
      <div className="writing-header">
        <h2>Super-Wkuwacz Egzaminacyjny 🧠</h2>
        <p>
          Przygotowane opracowanie zawiera kluczowe definicje i kody. Ten moduł powstał po to, abyś wbił je sobie do głowy 
          <strong> od deski do deski</strong> za pomocą aktywnego przywoływania (Active Recall) i luk w tekście.
        </p>
      </div>

      {/* Category selector */}
      <div className="category-filter-row" style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '10px',
        justifyContent: 'center'
      }}>
        <button
          className={`btn btn-sm ${filterCategory === 'pewniaki' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setFilterCategory('pewniaki')}
          style={{ 
            borderColor: 'var(--error-border)', 
            color: filterCategory === 'pewniaki' ? '#000' : 'var(--error)',
            fontWeight: 'bold'
          }}
        >
          🔥 TYLKO PEWNIAKI ({flashcards.filter(c => ['fc1', 'fc2', 'fc3', 'fc4', 'fc5', 'fc6', 'fc11', 'fc12', 'fc13'].includes(c.id)).length})
        </button>
        <button
          className={`btn btn-sm ${filterCategory === 'others' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setFilterCategory('others')}
        >
          📖 Pozostała Teoria ({flashcards.filter(c => !['fc1', 'fc2', 'fc3', 'fc4', 'fc5', 'fc6', 'fc11', 'fc12', 'fc13'].includes(c.id)).length})
        </button>
        <button
          className={`btn btn-sm ${filterCategory === 'all' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setFilterCategory('all')}
        >
          Wszystkie ({flashcards.length})
        </button>
      </div>

      {/* Mode selection */}
      <div className="writing-modes-bar glass-panel">
        <button 
          className={`mode-btn ${activeMode === 'cloze' ? 'active' : ''}`}
          onClick={() => setActiveMode('cloze')}
        >
          🔤 Wkuwanie "Słowo w Słowo" (Luki)
        </button>
        <button 
          className={`mode-btn ${activeMode === 'checklist' ? 'active' : ''}`}
          onClick={() => setActiveMode('checklist')}
        >
          ✍️ Pisanie od Zera + Checklist
        </button>
        <button 
          className={`mode-btn ${activeMode === 'dictation' ? 'active' : ''}`}
          onClick={() => setActiveMode('dictation')}
        >
          🔊 Dyktando ze Słuchu
        </button>
      </div>

      <div className="writing-layout">
        {/* Workspace column */}
        <div className="test-workspace glass-panel">
          <div className="card-top-info">
            <span className="badge badge-purple">{activeCard.category}</span>
            <span className="card-counter-label">Zagadnienie {currentIndex + 1} z {deck.length}</span>
          </div>

          <div className="question-display-area">
            <h4 className="question-title">Pytanie egzaminacyjne:</h4>
            <p className="question-text-content">{activeCard.front}</p>

            {activeCard.association && activeMode !== 'dictation' && (
              <p className="question-association" style={{
                fontSize: '13.5px',
                color: 'var(--text-muted)',
                background: 'rgba(255, 255, 255, 0.02)',
                padding: '8px 12px',
                borderRadius: '6px',
                borderLeft: '3px solid var(--accent)',
                marginTop: '5px'
              }}>
                💡 <strong>Skojarzenie:</strong> {activeCard.association}
              </p>
            )}
          </div>

          {/* Mode 1: Cloze (Luki) */}
          {activeMode === 'cloze' && (
            <div className="cloze-workout-area">
              <div className="difficulty-row" style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '15px',
                paddingBottom: '10px',
                borderBottom: '1px solid var(--border-subtle)'
              }}>
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Wybierz poziom ukrycia słów:</span>
                <div className="difficulty-buttons" style={{ display: 'flex', gap: '6px' }}>
                  {['easy', 'medium', 'hard', 'hardcore'].map((lvl) => (
                    <button
                      key={lvl}
                      className={`btn btn-xs ${difficulty === lvl ? 'btn-primary' : 'btn-secondary'}`}
                      onClick={() => setDifficulty(lvl)}
                      style={{ fontSize: '11px', padding: '4px 8px', textTransform: 'capitalize' }}
                      disabled={isChecked}
                    >
                      {lvl === 'easy' ? 'Łatwy (20%)' : lvl === 'medium' ? 'Średni (33%)' : lvl === 'hard' ? 'Trudny (50%)' : 'Hardcore (100%)'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="cloze-text-block" style={{
                background: 'rgba(0,0,0,0.2)',
                padding: '24px',
                borderRadius: '8px',
                border: '1px solid var(--border)',
                fontSize: '15px',
                lineHeight: '2.5',
                color: 'var(--text-primary)',
                whiteSpace: 'pre-wrap'
              }}>
                {clozeData.tokens.map((token, idx) => {
                  const isGap = clozeData.gapMap[idx] !== undefined;
                  if (isGap) {
                    const correctWord = clozeData.gapMap[idx];
                    const userTyped = gapAnswers[idx] || '';
                    const isWordCorrect = cleanString(userTyped) === cleanString(correctWord);

                    return (
                      <span key={idx} style={{ display: 'inline-block', position: 'relative', margin: '0 4px' }}>
                        <input
                          type="text"
                          className={`gap-input ${isChecked ? (isWordCorrect ? 'correct' : 'incorrect') : ''}`}
                          value={userTyped}
                          onChange={(e) => handleGapChange(idx, e.target.value)}
                          disabled={isChecked}
                          placeholder="..."
                          style={{
                            width: `${Math.max(correctWord.length * 11, 40)}px`,
                            background: isChecked 
                              ? (isWordCorrect ? 'var(--success-bg)' : 'var(--error-bg)') 
                              : 'var(--bg-input)',
                            border: '1px solid',
                            borderColor: isChecked
                              ? (isWordCorrect ? 'var(--success-border)' : 'var(--error-border)')
                              : 'var(--border)',
                            color: isChecked
                              ? (isWordCorrect ? 'var(--success)' : 'var(--error)')
                              : 'var(--text-primary)',
                            borderRadius: '4px',
                            padding: '2px 8px',
                            textAlign: 'center',
                            fontSize: '14px',
                            fontWeight: '600',
                            outline: 'none',
                            transition: 'all 0.2s'
                          }}
                        />
                        {isChecked && !isWordCorrect && (
                          <span className="gap-reveal-pop" style={{
                            position: 'absolute',
                            bottom: '100%',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            background: 'var(--success)',
                            color: '#000',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            fontSize: '11px',
                            fontWeight: '700',
                            zIndex: 10,
                            whiteSpace: 'nowrap',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
                            lineHeight: '1.2'
                          }}>
                            {correctWord}
                          </span>
                        )}
                      </span>
                    );
                  } else {
                    return <span key={idx}>{token}</span>;
                  }
                })}
              </div>
            </div>
          )}

          {/* Mode 2: Checklist (Pisanie od zera) */}
          {activeMode === 'checklist' && (
            <div className="checklist-workout-area">
              <div className="user-input-area">
                <label htmlFor="w-textarea" style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                  Wpisz pełne wyjaśnienie własnymi słowami ( checklist po prawej zaznaczy słowa kluczowe w locie):
                </label>
                <textarea
                  id="w-textarea"
                  placeholder="Zacznij pisać definicję ze szczegółami..."
                  value={userAnswerText}
                  onChange={(e) => setUserAnswerText(e.target.value)}
                  disabled={isChecked}
                  style={{ minHeight: '180px' }}
                />
              </div>
            </div>
          )}

          {/* Mode 3: Dictation (Dyktando) */}
          {activeMode === 'dictation' && (
            <div className="dictation-workout-area">
              <div style={{
                background: 'rgba(0,0,0,0.15)',
                padding: '16px',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)',
                marginBottom: '15px',
                display: 'flex',
                alignItems: 'center',
                gap: '15px'
              }}>
                <button className="btn btn-secondary" onClick={handlePlayAudio} style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  🔊 Odtwórz definicję lektorem
                </button>
                <span style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
                  Wysłuchaj tekstu, a następnie wpisz go ze słuchu poniżej. Staraj się pisać jak najdokładniej.
                </span>
              </div>

              <div className="user-input-area">
                <textarea
                  placeholder="Wpisz dyktowany tekst ze słuchu..."
                  value={userAnswerText}
                  onChange={(e) => setUserAnswerText(e.target.value)}
                  disabled={isChecked}
                  style={{ minHeight: '180px' }}
                />
              </div>
            </div>
          )}

          {/* Bottom actions */}
          <div className="action-buttons-row" style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '20px',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="btn btn-secondary" onClick={handlePrev} style={{ padding: '10px 16px' }}>
                ⬅️ Poprzednie
              </button>
              <button className="btn btn-secondary" onClick={handleNext} style={{ padding: '10px 16px' }}>
                Następne ➡️
              </button>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              {activeMode !== 'cloze' && (
                <button 
                  className={`btn ${showReveal ? 'btn-warning' : 'btn-secondary'}`}
                  onClick={() => setShowReveal(!showReveal)}
                >
                  {showReveal ? '🔒 Ukryj wzorzec' : '👁️ Pokaż ściągawkę'}
                </button>
              )}
              {isChecked ? (
                <button className="btn btn-primary" onClick={() => {
                  setIsChecked(false);
                  setUserAnswerText('');
                  setGapAnswers({});
                }}>
                  🔄 Spróbuj ponownie
                </button>
              ) : (
                <button className="btn btn-primary" onClick={handleCheck} style={{ padding: '10px 24px' }}>
                  🔍 Sprawdź Odpowiedź
                </button>
              )}
            </div>
          </div>

          {/* Live reveal cheat sheet */}
          {showReveal && activeMode !== 'cloze' && (
            <div className="official-solution-box animate-fade-in" style={{ marginTop: '20px' }}>
              <h5>Oficjalne opracowanie (Wzór):</h5>
              <p style={{ whiteSpace: 'pre-wrap', color: 'var(--success)' }}>{activeCard.back}</p>
            </div>
          )}
        </div>

        {/* Sidebar evaluation column */}
        <div className="verification-sidebar glass-panel">
          <h4>Weryfikacja Wiedzy</h4>

          {/* Sidebar Cloze Test Mode */}
          {activeMode === 'cloze' && (
            <div className="mode-feedback-sidebar">
              {!isChecked ? (
                <div className="verification-placeholder">
                  <span className="placeholder-icon">🔤</span>
                  <h5>Tryb luk w tekście</h5>
                  <p>Wpisz brakujące wyrazy w luki. Gdy skończysz, kliknij <strong>Sprawdź Odpowiedź</strong>, aby zobaczyć ocenę poprawności i brakujące hasła.</p>
                </div>
              ) : (
                <div className="verification-results-content animate-fade-in">
                  <div className="score-radial">
                    <span className="score-val">{clozeResult.score}%</span>
                    <span className="score-desc">Poprawnych luk</span>
                  </div>
                  <div className="grade-badge-display">
                    <span>Wynik:</span>
                    <strong>{clozeResult.correct} / {clozeResult.total}</strong>
                  </div>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', textAlign: 'center' }}>
                    {clozeResult.score >= 80 
                      ? 'Wspaniale! Masz to w głowie opanowane perfekcyjnie! 🌟' 
                      : 'Wymaga powtórki. Sprawdź czerwone luki i ich poprawne odpowiedzi (najeżdżając myszką/klikając). ⚠️'}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Sidebar Checklist Mode */}
          {activeMode === 'checklist' && (
            <div className="mode-feedback-sidebar">
              <div className="score-radial">
                <span className="score-val">{keywordPercentage()}%</span>
                <span className="score-desc">Kluczowych faktów</span>
              </div>
              <div className="grade-badge-display" style={{ marginBottom: '15px' }}>
                <span>Odnaleziono:</span>
                <strong>{matchedKeywordsCount()} / {totalKeywordsCount()} haseł</strong>
              </div>

              <h6 style={{ fontSize: '12px', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px' }}>
                Kluczowe fakty do zaliczenia:
              </h6>
              <div className="keyword-checklist-scroll" style={{
                maxHeight: '300px',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                {listStatus.map((item, idx) => (
                  <div key={idx} className="checklist-item" style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    background: item.isMatched ? 'var(--success-bg)' : 'rgba(255,255,255,0.02)',
                    border: '1px solid',
                    borderColor: item.isMatched ? 'var(--success-border)' : 'var(--border)',
                    borderRadius: '6px',
                    fontSize: '13.5px',
                    transition: 'all 0.2s'
                  }}>
                    <span style={{
                      color: item.isMatched ? 'var(--success)' : 'var(--text-secondary)',
                      fontWeight: item.isMatched ? '600' : 'normal'
                    }}>
                      {item.word}
                    </span>
                    <span>{item.isMatched ? '✅' : '❌'}</span>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '12px', lineHeight: '1.4' }}>
                💡 Pisz własnymi słowami. System automatycznie wykryje obecność najważniejszych fraz i definicji na egzamin.
              </p>
            </div>
          )}

          {/* Sidebar Dictation Mode */}
          {activeMode === 'dictation' && (
            <div className="mode-feedback-sidebar">
              {!isChecked ? (
                <div className="verification-placeholder">
                  <span className="placeholder-icon">🔊</span>
                  <h5>Pisanie ze słuchu</h5>
                  <p>Odtwórz tekst lektorem, wpisz go do pola tekstowego i kliknij <strong>Sprawdź Odpowiedź</strong>, aby porównać swój tekst ze słuchu z oryginałem.</p>
                </div>
              ) : (
                <div className="verification-results-content animate-fade-in">
                  <div className="score-radial">
                    <span className="score-val">{dictationResult.score}%</span>
                    <span className="score-desc">Dokładność słów</span>
                  </div>
                  <div className="grade-badge-display">
                    <span>Status:</span>
                    <strong style={{ color: dictationResult.score >= 80 ? 'var(--success)' : 'var(--error)' }}>
                      {dictationResult.score >= 80 ? 'Znakomicie! 🌟' : 'Połowicznie ⚠️'}
                    </strong>
                  </div>

                  <div className="comparison-cards" style={{ marginTop: '10px' }}>
                    <div className="comp-card user-card">
                      <h6>Twój zapis:</h6>
                      <p style={{ fontSize: '13px' }}>{userAnswerText}</p>
                    </div>
                    <div className="comp-card correct-card">
                      <h6>Wzór z opracowania:</h6>
                      <p style={{ fontSize: '13px', color: 'var(--success)' }}>{activeCard.back}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

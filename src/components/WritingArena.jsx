import React, { useState, useEffect } from 'react';
import { flashcards } from '../data/materialsData';
import './WritingArena.css';

// Simple Polish keyword lists for validation of each flashcard to check semantic correctness
const KEYWORDS_DB = {
  fc1: ['autonomiczn', 'kod', 'wywoł', 'oszczędn', 'pamięć', 'bsr', 'jsr', 'rts'],
  fc2: ['obszar', 'ram', 'tymczas', 'przechowyw', 'lifo', 'sp', 'wskaz'],
  fc3: ['przerwa', 'rejestr', 'podprogram', 'powrot', 'tymczas'],
  fc4: ['dół', 'ram', 'dekrement', 'psh', 'inkrement', 'pul', 'sp'],
  fc5: ['komórk', 'adres', 'podprogram', 'obsług', 'przerw', 'isr'],
  fc6: ['#', 'stała', 'kod', 'operac', 'bezpośred', 'adres', 'pamięć'],
  fc7: ['8-bit', 'strona', 'zerowa', '16-bit', 'rozszerz', 'pełny', '3 bajty', '2 bajty'],
  fc8: ['r0', 'r1', 'rejestr', 'robocze', 'banku', 'wskaźnik'],
  fc9: ['bit', 'pojedyncz', 'logiczne', 'ram', 'sfr', 'acc.7'],
  fc10: ['not equal', 'flaga z', 'przesunięcie', 'u2', 'wstecz', '-6', 'bajt'],
  fc11: ['bcd', 'dodawa', 'korekc', 'da a', 'daa', 'półbajt', '9'],
  fc12: ['dopełnienie', '10', '9', '99h', 'dodanie', 'da a']
};

export default function WritingArena() {
  const [testMode, setTestMode] = useState('written'); // 'written' (Test pisemny), 'dictation' (Pisanie ze słuchu)
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [feedback, setFeedback] = useState({ score: 0, matched: [], missing: [], grade: '' });
  const [voicesLoaded, setVoicesLoaded] = useState(false);

  // Initialize SpeechSynthesis voices
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

  const activeCard = flashcards[currentIndex];

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pl-PL';
      utterance.rate = 0.9; // Slightly slower for better dictation check
      
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

  const handlePlayDictation = () => {
    if (testMode === 'dictation') {
      // In dictation mode, we speak the correct back text (the definition) and user has to type it
      speak(activeCard.back);
    } else {
      // In written mode, we can read the question out loud
      speak(activeCard.front);
    }
  };

  // Autoplay dictation when card index changes
  useEffect(() => {
    setIsChecked(false);
    setUserAnswer('');
    setFeedback({ score: 0, matched: [], missing: [], grade: '' });
  }, [currentIndex, testMode]);

  const checkAnswer = () => {
    const correctText = activeCard.back.toLowerCase();
    const userText = userAnswer.toLowerCase();
    const keywords = KEYWORDS_DB[activeCard.id] || [];

    if (!userText.trim()) {
      alert("Wpisz swoją odpowiedź przed sprawdzeniem!");
      return;
    }

    const matched = [];
    const missing = [];

    keywords.forEach(kw => {
      if (userText.includes(kw)) {
        matched.push(kw);
      } else {
        missing.push(kw);
      }
    });

    const score = keywords.length > 0 
      ? Math.round((matched.length / keywords.length) * 100) 
      : 0;

    let grade = 'Słabo ❌';
    if (score >= 80) grade = 'Świetnie! Rekomendowane zdanie 🌟';
    else if (score >= 50) grade = 'Dobrze, ale powtórz ⚠️';

    setFeedback({ score, matched, missing, grade });
    setIsChecked(true);
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % flashcards.length);
  };

  return (
    <div className="writing-arena-container animate-fade-in">
      <div className="writing-header">
        <h2>Pisemny Trening Aktywnego Przywoływania</h2>
        <p>Badania wykazują, że pisanie definicji własnymi słowami stymuluje głęboką pamięć roboczą i daje gwarancję trwałego zapamiętania.</p>
      </div>

      {/* Mode selectors */}
      <div className="writing-modes-bar glass-panel">
        <button 
          className={`mode-btn ${testMode === 'written' ? 'active' : ''}`}
          onClick={() => setTestMode('written')}
        >
          📝 Test Pisemny "Na Sucho"
        </button>
        <button 
          className={`mode-btn ${testMode === 'dictation' ? 'active' : ''}`}
          onClick={() => setTestMode('dictation')}
        >
          🔊 Dyktando (Ze Słuchu)
        </button>
      </div>

      <div className="writing-layout">
        {/* Left pane: Test card */}
        <div className="test-workspace glass-panel">
          <div className="card-top-info">
            <span className="badge badge-indigo">{activeCard.category}</span>
            <span className="card-counter-label">Zagadnienie {currentIndex + 1} / {flashcards.length}</span>
          </div>

          <div className="question-display-area">
            {testMode === 'written' ? (
              <>
                <h4 className="question-title">Opisz pojęcie / Odpowiedz na pytanie:</h4>
                <p className="question-text-content">{activeCard.front}</p>
              </>
            ) : (
              <>
                <h4 className="question-title">Dyktando ze słuchu:</h4>
                <p className="question-text-content" style={{ fontSize: '15px', color: 'var(--text-secondary)' }}>
                  Kliknij przycisk głośnika, wysłuchaj definicji i spróbuj zapisać ją słowo w słowo ze słuchu.
                </p>
                <button className="btn btn-secondary dictation-play-btn" onClick={handlePlayDictation}>
                  🔊 Odtwórz audio
                </button>
              </>
            )}
          </div>

          <div className="user-input-area">
            <label htmlFor="user-textarea">Twoja odpowiedź pisemna:</label>
            <textarea
              id="user-textarea"
              placeholder={testMode === 'written' 
                ? "Wpisz swoją definicję pojęcia (pamiętaj o kluczowych słowach, np. rejestrach, trybach)..." 
                : "Wpisz to, co usłyszałeś w dyktandzie..."}
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              disabled={isChecked}
            />
          </div>

          <div className="action-buttons-row">
            {isChecked ? (
              <button className="btn btn-primary btn-lg" onClick={handleNext}>
                Następne zagadnienie ➡️
              </button>
            ) : (
              <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
                {testMode === 'written' && (
                  <button className="btn btn-secondary btn-lg" onClick={handlePlayDictation}>
                    🔊 Przeczytaj pytanie
                  </button>
                )}
                <button className="btn btn-primary btn-lg" style={{ flexGrow: 1 }} onClick={checkAnswer}>
                  🔍 Sprawdź odpowiedź
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right pane: Verification & Diff */}
        <div className="verification-sidebar glass-panel">
          <h4>Weryfikacja Poprawności</h4>
          
          {!isChecked ? (
            <div className="verification-placeholder">
              <span className="placeholder-icon">🤔</span>
              <p>Wpisz odpowiedź po lewej stronie i kliknij <strong>Sprawdź odpowiedź</strong>, aby zobaczyć analizę semantyczną słów kluczowych i ocenę gotowości.</p>
            </div>
          ) : (
            <div className="verification-results-content animate-fade-in">
              <div className="score-radial">
                <span className="score-val">{feedback.score}%</span>
                <span className="score-desc">Zgodności kluczowej</span>
              </div>

              <div className="grade-badge-display">
                <span>Ocena:</span>
                <strong>{feedback.grade}</strong>
              </div>

              {/* Side-by-side comparison */}
              <div className="comparison-cards">
                <div className="comp-card user-card">
                  <h6>Twoja odpowiedź:</h6>
                  <p>{userAnswer}</p>
                </div>
                <div className="comp-card correct-card">
                  <h6>Prawidłowy materiał:</h6>
                  <p>{activeCard.back}</p>
                </div>
              </div>

              {/* Keyword tags matches */}
              {testMode === 'written' && (
                <div className="keyword-feedback-box">
                  <h6>Weryfikacja słów kluczowych:</h6>
                  <div className="keyword-tags">
                    {feedback.matched.map((kw, i) => (
                      <span key={i} className="kw-tag matched">✓ {kw}</span>
                    ))}
                    {feedback.missing.map((kw, i) => (
                      <span key={i} className="kw-tag missing">✗ {kw}</span>
                    ))}
                  </div>
                  <p className="kw-tip">
                    Zadbaj o to, aby w Twojej definicji znalazły się wszystkie kluczowe terminy (oznaczone krzyżykiem).
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { flashcards } from '../data/materialsData';
import './FlashcardDeck.css';

export default function FlashcardDeck() {
  const [deck, setDeck] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [filterCategory, setFilterCategory] = useState('all');
  const [masteryState, setMasteryState] = useState(() => {
    try {
      const saved = localStorage.getItem('microstudy_mastery');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  // Sync mastery state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('microstudy_mastery', JSON.stringify(masteryState));
    } catch (e) {
      console.log('Error saving mastery', e);
    }
  }, [masteryState]);

  // Categories list
  const categories = ['all', ...new Set(flashcards.map(c => c.category))];

  // Initialize deck based on filter
  useEffect(() => {
    let filtered = flashcards;
    if (filterCategory === 'pewniaki') {
      filtered = flashcards.filter(c => ['fc1', 'fc2', 'fc3', 'fc4', 'fc5', 'fc6', 'fc11', 'fc12', 'fc13'].includes(c.id));
    } else if (filterCategory === 'others') {
      filtered = flashcards.filter(c => !['fc1', 'fc2', 'fc3', 'fc4', 'fc5', 'fc6', 'fc11', 'fc12', 'fc13'].includes(c.id));
    }
    setDeck(filtered);
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [filterCategory]);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % deck.length);
    }, 150);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + deck.length) % deck.length);
    }, 150);
  };

  const handleShuffle = () => {
    setIsFlipped(false);
    setTimeout(() => {
      const shuffled = [...deck].sort(() => Math.random() - 0.5);
      setDeck(shuffled);
      setCurrentIndex(0);
    }, 150);
  };

  const rateCard = (rating) => {
    const currentCard = deck[currentIndex];
    setMasteryState(prev => ({
      ...prev,
      [currentCard.id]: rating
    }));
    // Auto-advance on rating
    setTimeout(() => {
      handleNext();
    }, 300);
  };

  const currentCard = deck[currentIndex];

  // Calculate stats
  const totalCards = flashcards.length;
  const masteredCount = Object.values(masteryState).filter(r => r === 'easy').length;
  const inProgressCount = Object.values(masteryState).filter(r => r === 'medium').length;
  const hardCount = Object.values(masteryState).filter(r => r === 'hard').length;
  const masteryPercentage = Math.round((masteredCount / totalCards) * 100) || 0;

  return (
    <div className="flashcards-container animate-fade-in">
      <div className="flashcards-header">
        <h2>Fiszki do Wykucia (Active Recall)</h2>
        <p>Kliknij na fiszkę, aby ją odwrócić, a następnie oceń swój poziom wiedzy, by zoptymalizować naukę.</p>
      </div>

      {/* Stats and Progress */}
      <div className="flashcard-stats-panel glass-panel">
        <div className="stat-item">
          <span className="stat-val">{masteryPercentage}%</span>
          <span className="stat-label">Opanowanie materiału</span>
        </div>
        <div className="stat-bars">
          <div className="stat-bar-fill" style={{ width: `${masteryPercentage}%` }}></div>
        </div>
        <div className="stat-legend">
          <span className="legend-item"><span className="dot dot-success"></span> Umiem: {masteredCount}</span>
          <span className="legend-item"><span className="dot dot-warning"></span> Średnio: {inProgressCount}</span>
          <span className="legend-item"><span className="dot dot-danger"></span> Słabo: {hardCount}</span>
          <span className="legend-item">Razem: {totalCards}</span>
        </div>
      </div>

      {/* Filters */}
      <div className="flashcard-filters glass-panel">
        <span className="filter-label">Filtruj zestaw:</span>
        <div className="category-chips">
          <button
            className={`chip-btn ${filterCategory === 'all' ? 'active' : ''}`}
            onClick={() => setFilterCategory('all')}
          >
            Wszystkie ({flashcards.length})
          </button>
          <button
            className={`chip-btn ${filterCategory === 'pewniaki' ? 'active' : ''}`}
            onClick={() => setFilterCategory('pewniaki')}
            style={{ color: 'var(--error)' }}
          >
            🔥 TYLKO PEWNIAKI ({flashcards.filter(c => ['fc1', 'fc2', 'fc3', 'fc4', 'fc5', 'fc6', 'fc11', 'fc12', 'fc13'].includes(c.id)).length})
          </button>
          <button
            className={`chip-btn ${filterCategory === 'others' ? 'active' : ''}`}
            onClick={() => setFilterCategory('others')}
          >
            📖 Pozostała Teoria ({flashcards.filter(c => !['fc1', 'fc2', 'fc3', 'fc4', 'fc5', 'fc6', 'fc11', 'fc12', 'fc13'].includes(c.id)).length})
          </button>
        </div>
      </div>

      {/* The Flashcard itself */}
      {deck.length > 0 ? (
        <div className="deck-area">
          <div className="card-counter">
            Fiszka {currentIndex + 1} z {deck.length} 
            {masteryState[currentCard.id] && (
              <span className={`mastery-badge badge-${masteryState[currentCard.id] === 'easy' ? 'success' : masteryState[currentCard.id] === 'medium' ? 'warning' : 'danger'}`}>
                {masteryState[currentCard.id] === 'easy' ? 'Opanowane' : masteryState[currentCard.id] === 'medium' ? 'W trakcie' : 'Słabo'}
              </span>
            )}
          </div>

          <div className={`flashcard ${isFlipped ? 'flipped' : ''}`} onClick={handleFlip}>
            <div className="card-inner">
              {/* Front side */}
              <div className="card-side card-front">
                <span className="card-category-tag">{currentCard.category}</span>
                <div className="card-body">
                  <h4>{currentCard.front}</h4>
                </div>
                <div className="click-prompt">Kliknij, aby zobaczyć odpowiedź</div>
              </div>

              {/* Back side */}
              <div className="card-side card-back">
                <span className="card-category-tag">{currentCard.category}</span>
                <div className="card-body">
                  <p className="answer-text">{currentCard.back}</p>
                </div>
                <div className="click-prompt">Kliknij, aby zobaczyć pytanie</div>
              </div>
            </div>
          </div>

          {/* Grading Area (Visible when flipped) */}
          <div className={`grading-controls ${isFlipped ? 'visible' : ''}`}>
            <p className="grading-title">Jak dobrze to pamiętasz?</p>
            <div className="grading-buttons">
              <button onClick={(e) => { e.stopPropagation(); rateCard('hard'); }} className="btn btn-danger">
                🔴 Słabo ($FA)
              </button>
              <button onClick={(e) => { e.stopPropagation(); rateCard('medium'); }} className="btn btn-warning">
                🟡 Średnio
              </button>
              <button onClick={(e) => { e.stopPropagation(); rateCard('easy'); }} className="btn btn-success">
                🟢 Super!
              </button>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="deck-nav">
            <button onClick={handlePrev} className="btn btn-secondary">
              ⬅️ Poprzednia
            </button>
            <button onClick={handleShuffle} className="btn btn-accent">
              🔀 Losuj kolejność
            </button>
            <button onClick={handleNext} className="btn btn-secondary">
              Następna ➡️
            </button>
          </div>
        </div>
      ) : (
        <div className="no-cards">Brak fiszek w tej kategorii</div>
      )}
    </div>
  );
}

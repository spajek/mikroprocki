import React, { useState } from 'react';
import { quizQuestions } from '../data/materialsData';
import './QuizArena.css';

export default function QuizArena() {
  const [questions, setQuestions] = useState(quizQuestions);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null); // index of option selected
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [userAnswers, setUserAnswers] = useState({}); // idx -> selectedOption

  const handleOptionSelect = (optionIdx) => {
    if (isSubmitted) return;
    setSelectedOption(optionIdx);
  };

  const handleSubmit = () => {
    if (selectedOption === null || isSubmitted) return;
    setIsSubmitted(true);
    
    const isCorrect = selectedOption === questions[currentIndex].answer;
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
    
    setUserAnswers(prev => ({
      ...prev,
      [currentIndex]: selectedOption
    }));
  };

  const handleNext = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
    } else {
      setShowResults(true);
    }
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setScore(0);
    setShowResults(false);
    setUserAnswers({});
    // Optionally shuffle questions
    const shuffled = [...quizQuestions].sort(() => Math.random() - 0.5);
    setQuestions(shuffled);
  };

  const currentQ = questions[currentIndex];

  const getRating = (score, total) => {
    const percent = (score / total) * 100;
    if (percent === 100) return "👑 Geniusz Mikrokontrolerów! Zdasz na 100%!";
    if (percent >= 80) return "🚀 Świetny wynik! Prawie perfekcyjnie.";
    if (percent >= 50) return "📚 Dobry początek, ale warto jeszcze powtórzyć fiszki.";
    return "⚠️ Wymaga nauki. Przejrzyj 'Ściągę' i spróbuj ponownie.";
  };

  return (
    <div className="quiz-container animate-fade-in">
      <div className="quiz-header">
        <h2>Arena Testowa (Testing Effect)</h2>
        <p>Badania wykazują, że sprawdzanie wiedzy uczy 2-3 razy szybciej niż zwykłe czytanie. Rozwiąż quiz!</p>
      </div>

      {!showResults ? (
        <div className="quiz-arena-layout">
          {/* Question Card */}
          <div className="quiz-card glass-panel">
            <div className="card-top">
              <span className="badge badge-purple">Pytanie {currentIndex + 1} z {questions.length}</span>
              <div className="score-badge">Aktualny wynik: {score}</div>
            </div>

            <h3 className="question-text">{currentQ.question}</h3>

            <div className="options-list">
              {currentQ.options.map((opt, idx) => {
                let optionClass = "option-item";
                if (selectedOption === idx) {
                  optionClass += " selected";
                }
                if (isSubmitted) {
                  if (idx === currentQ.answer) {
                    optionClass += " correct";
                  } else if (selectedOption === idx) {
                    optionClass += " incorrect";
                  } else {
                    optionClass += " disabled";
                  }
                }
                
                return (
                  <div 
                    key={idx} 
                    className={optionClass}
                    onClick={() => handleOptionSelect(idx)}
                  >
                    <span className="option-letter">{String.fromCharCode(65 + idx)}</span>
                    <span className="option-content">{opt}</span>
                    {isSubmitted && idx === currentQ.answer && (
                      <span className="feedback-icon">✓</span>
                    )}
                    {isSubmitted && selectedOption === idx && idx !== currentQ.answer && (
                      <span className="feedback-icon">✗</span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Explanation box */}
            {isSubmitted && (
              <div className={`explanation-panel animate-fade-in ${selectedOption === currentQ.answer ? 'exp-correct' : 'exp-incorrect'}`}>
                <h5>{selectedOption === currentQ.answer ? '🎉 Dobrze!' : '❌ Błędna odpowiedź'}</h5>
                <p>{currentQ.explanation}</p>
              </div>
            )}

            {/* Controls */}
            <div className="quiz-controls">
              {!isSubmitted ? (
                <button 
                  onClick={handleSubmit} 
                  disabled={selectedOption === null}
                  className="btn btn-primary submit-btn"
                >
                  Zatwierdź odpowiedź
                </button>
              ) : (
                <button 
                  onClick={handleNext} 
                  className="btn btn-success next-btn"
                >
                  {currentIndex + 1 < questions.length ? 'Następne pytanie ➡️' : 'Zobacz wyniki 🏆'}
                </button>
              )}
            </div>
          </div>

          {/* Quick Info Box on the side */}
          <div className="quiz-sidebar-info glass-panel">
            <h4>💡 Szybka Wskazówka</h4>
            <p>Zwróć uwagę na to, czy pytanie dotyczy rodziny <strong>MC6800</strong> (gdzie stos rośnie w dół, a wskaźnik SP zmniejsza się po PUSH) czy <strong>8051</strong> (gdzie stos obsługuje banki rejestrów i wskaźnik SP jest 8-bitowy).</p>
            <div className="mini-progress-dots">
              {questions.map((_, idx) => (
                <span 
                  key={idx} 
                  className={`dot-indicator ${
                    idx === currentIndex 
                      ? 'current' 
                      : userAnswers[idx] !== undefined 
                        ? userAnswers[idx] === questions[idx].answer 
                          ? 'correct' 
                          : 'incorrect' 
                        : 'empty'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Results Screen */
        <div className="results-panel glass-panel animate-fade-in">
          <div className="trophy-icon">🏆</div>
          <h3>Koniec Quizu!</h3>
          <p className="results-score">Twój wynik: <strong>{score}</strong> na <strong>{questions.length}</strong> punktów</p>
          <div className="results-percentage">{Math.round((score / questions.length) * 100)}%</div>
          
          <p className="results-rating">{getRating(score, questions.length)}</p>

          <div className="results-buttons">
            <button onClick={handleReset} className="btn btn-primary btn-lg">
              🔄 Rozpocznij od nowa
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

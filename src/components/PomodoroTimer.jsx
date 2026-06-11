import React, { useState, useEffect, useRef } from 'react';
import './PomodoroTimer.css';

export default function PomodoroTimer() {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const timerRef = useRef(null);

  const totalTime = isBreak ? 5 * 60 : 25 * 60;
  const timeRemaining = minutes * 60 + seconds;
  const progress = ((totalTime - timeRemaining) / totalTime) * 100;

  // Web Audio Api Beep to notify the user
  const playBeep = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); // A5 note
      gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
      
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.4); // beep for 0.4s
    } catch (e) {
      console.log("Audio contexts not supported or blocked by browser policy");
    }
  };

  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            // Timer finished
            playBeep();
            setIsBreak(!isBreak);
            setMinutes(!isBreak ? 5 : 25);
            setSeconds(0);
            setIsActive(false);
            alert(!isBreak ? "Czas minął! Pora na zasłużoną 5-minutową przerwę." : "Koniec przerwy! Wracamy do nauki.");
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        } else {
          setSeconds(seconds - 1);
        }
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isActive, minutes, seconds, isBreak]);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setIsBreak(false);
    setMinutes(25);
    setSeconds(0);
  };

  const setManualTime = (mins, isBrk) => {
    setIsActive(false);
    setIsBreak(isBrk);
    setMinutes(mins);
    setSeconds(0);
  };

  // Format display
  const formatTime = (m, s) => {
    const minStr = m < 10 ? `0${m}` : m;
    const secStr = s < 10 ? `0${s}` : s;
    return `${minStr}:${secStr}`;
  };

  const getTip = () => {
    if (isBreak) {
      return "Wstań, rozciągnij się, napij wody. Daj mózgowi odpocząć!";
    }
    return "Skup się w 100%. Wyłącz telefon. Za parę godzin będziesz ekspertem!";
  };

  return (
    <div className="pomodoro-container glass-panel animate-fade-in">
      <div className="pomodoro-header">
        <span className={`badge ${isBreak ? 'badge-cyan' : 'badge-indigo'}`}>
          {isBreak ? 'PRZERWA' : 'SESJA SKUPIENIA'}
        </span>
        <h3>Timer Pomodoro</h3>
      </div>

      <div className="timer-visual-wrapper">
        <svg className="progress-ring" width="160" height="160">
          <circle
            className="progress-ring-bg"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="8"
            fill="transparent"
            r="70"
            cx="80"
            cy="80"
          />
          <circle
            className="progress-ring-circle"
            stroke={isBreak ? '#06b6d4' : '#6366f1'}
            strokeWidth="8"
            fill="transparent"
            r="70"
            cx="80"
            cy="80"
            style={{
              strokeDasharray: `${2 * Math.PI * 70}`,
              strokeDashoffset: `${2 * Math.PI * 70 * (1 - progress / 100)}`
            }}
          />
        </svg>
        <div className="timer-time">
          {formatTime(minutes, seconds)}
        </div>
      </div>

      <div className="timer-status">
        <p className="status-text">{isBreak ? 'Relaks...' : 'Nauka...'}</p>
        <p className="tip-text">{getTip()}</p>
      </div>

      <div className="timer-controls">
        <button onClick={toggleTimer} className={`btn ${isActive ? 'btn-warning' : 'btn-primary'}`}>
          {isActive ? 'Pauza' : 'Start'}
        </button>
        <button onClick={resetTimer} className="btn btn-secondary">
          Reset
        </button>
      </div>

      <div className="quick-presets">
        <button onClick={() => setManualTime(25, false)} className="preset-btn">
          Nauka (25m)
        </button>
        <button onClick={() => setManualTime(5, true)} className="preset-btn">
          Przerwa (5m)
        </button>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { theory, addressingModes } from '../data/materialsData';
import './CramDashboard.css';

export default function CramDashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('theory'); // 'theory', 'modes'
  const [processorFilter, setProcessorFilter] = useState('all'); // 'all', 'mc6800', 'intel8051'

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const filteredTheory = theory.filter(t => 
    t.title.toLowerCase().includes(searchQuery) ||
    t.desc.toLowerCase().includes(searchQuery) ||
    t.details.some(d => d.label.toLowerCase().includes(searchQuery) || d.text.toLowerCase().includes(searchQuery))
  );

  const filterModes = (modesList) => {
    return modesList.filter(m => 
      m.name.toLowerCase().includes(searchQuery) || 
      m.desc.toLowerCase().includes(searchQuery) || 
      m.example.toLowerCase().includes(searchQuery)
    );
  };

  const filteredMC6800 = filterModes(addressingModes.mc6800);
  const filtered8051 = filterModes(addressingModes.intel8051);

  return (
    <div className="cram-container animate-fade-in">
      <div className="cram-header">
        <h2>Tablica Szybkiej Nauki (Cram Station)</h2>
        <p>Skondensowana wiedza z notatek i zagadnień egzaminacyjnych w jednym miejscu.</p>
      </div>

      {/* Control Bar */}
      <div className="cram-controls glass-panel">
        <div className="tab-buttons">
          <button 
            className={`tab-btn ${activeTab === 'theory' ? 'active' : ''}`}
            onClick={() => setActiveTab('theory')}
          >
            📋 Podstawowa Teoria
          </button>
          <button 
            className={`tab-btn ${activeTab === 'modes' ? 'active' : ''}`}
            onClick={() => setActiveTab('modes')}
          >
            ⚙️ Tryby Adresowania
          </button>
        </div>

        <div className="search-wrapper">
          <span className="search-icon">🔍</span>
          <input 
            type="text" 
            placeholder="Szukaj terminu, np. stos, względne, MOV..." 
            value={searchQuery}
            onChange={handleSearchChange}
            className="search-input"
          />
        </div>
      </div>

      {/* Theory View */}
      {activeTab === 'theory' && (
        <div className="theory-deck">
          {filteredTheory.length > 0 ? (
            filteredTheory.map(item => (
              <div key={item.id} className="theory-card glass-panel">
                <div className="card-header-accent">
                  <span className="badge badge-indigo">Teoria</span>
                  <h4>{item.title}</h4>
                </div>
                <p className="theory-desc">{item.desc}</p>
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

      {/* Addressing Modes View */}
      {activeTab === 'modes' && (
        <div className="modes-view">
          <div className="processor-selector">
            <button 
              className={`filter-btn ${processorFilter === 'all' ? 'active' : ''}`}
              onClick={() => setProcessorFilter('all')}
            >
              Wszystkie Procesory
            </button>
            <button 
              className={`filter-btn ${processorFilter === 'mc6800' ? 'active' : ''}`}
              onClick={() => setProcessorFilter('mc6800')}
            >
              Motorola MC6800 / M68HC05
            </button>
            <button 
              className={`filter-btn ${processorFilter === 'intel8051' ? 'active' : ''}`}
              onClick={() => setProcessorFilter('intel8051')}
            >
              Intel 8051
            </button>
          </div>

          <div className="modes-grids">
            {/* Motorola Section */}
            {(processorFilter === 'all' || processorFilter === 'mc6800') && (
              <div className="processor-column">
                <div className="column-title">
                  <span className="badge badge-purple">MC6800 / M68HC05</span>
                  <h3>Tryby Adresowania</h3>
                </div>

                <div className="modes-list">
                  {filteredMC6800.length > 0 ? (
                    filteredMC6800.map((mode, idx) => (
                      <div key={idx} className="mode-card glass-panel">
                        <div className="mode-header">
                          <h5>{mode.name}</h5>
                        </div>
                        <p className="mode-desc">{mode.desc}</p>
                        <div className="mode-example">
                          <span className="example-label">Przykład:</span>
                          <span className="example-code code-text">{mode.example}</span>
                          <span className="example-comment">; {mode.comment}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="no-results">Brak wyników dla MC6800</div>
                  )}
                </div>
              </div>
            )}

            {/* Intel Section */}
            {(processorFilter === 'all' || processorFilter === 'intel8051') && (
              <div className="processor-column">
                <div className="column-title">
                  <span className="badge badge-cyan">Intel 8051</span>
                  <h3>Tryby Adresowania</h3>
                </div>

                <div className="modes-list">
                  {filtered8051.length > 0 ? (
                    filtered8051.map((mode, idx) => (
                      <div key={idx} className="mode-card glass-panel">
                        <div className="mode-header">
                          <h5>{mode.name}</h5>
                        </div>
                        <p className="mode-desc">{mode.desc}</p>
                        <div className="mode-example">
                          <span className="example-label">Przykład:</span>
                          <span className="example-code code-text">{mode.example}</span>
                          <span className="example-comment">; {mode.comment}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="no-results">Brak wyników dla Intel 8051</div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

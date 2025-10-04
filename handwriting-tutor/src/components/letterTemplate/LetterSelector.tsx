import React from 'react';

interface LetterSelectorProps {
  selectedLetter: string;
  onLetterSelect: (letter: string) => void;
}

const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

const LetterSelector: React.FC<LetterSelectorProps> = ({
  selectedLetter,
  onLetterSelect,
}) => {
  return (
    <div style={{ marginBottom: '20px' }}>
      <h3 style={{ marginBottom: '10px', color: '#333' }}>Select a Letter:</h3>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(40px, 1fr))',
          gap: '8px',
          maxWidth: '500px',
        }}
      >
        {letters.map((letter) => (
          <button
            key={letter}
            onClick={() => onLetterSelect(letter)}
            style={{
              padding: '10px',
              border: selectedLetter === letter ? '2px solid #007bff' : '1px solid #ccc',
              borderRadius: '6px',
              backgroundColor: selectedLetter === letter ? '#e3f2fd' : 'white',
              cursor: 'pointer',
              fontWeight: selectedLetter === letter ? 'bold' : 'normal',
              fontSize: '16px',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              if (selectedLetter !== letter) {
                e.currentTarget.style.backgroundColor = '#f5f5f5';
              }
            }}
            onMouseLeave={(e) => {
              if (selectedLetter !== letter) {
                e.currentTarget.style.backgroundColor = 'white';
              }
            }}
          >
            {letter}
          </button>
        ))}
      </div>
    </div>
  );
};

export default LetterSelector;
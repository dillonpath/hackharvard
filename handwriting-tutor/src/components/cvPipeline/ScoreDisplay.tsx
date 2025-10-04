import React from 'react';
import { LetterScore } from '../../types';

interface ScoreDisplayProps {
  score: LetterScore | null;
  isAnalyzing?: boolean;
}

const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ score, isAnalyzing = false }) => {
  const getScoreColor = (scoreValue: number) => {
    if (scoreValue >= 70) return '#4caf50';
    if (scoreValue >= 50) return '#ff9800';
    return '#f44336';
  };

  const ScoreBar: React.FC<{ label: string; value: number }> = ({ label, value }) => (
    <div style={{ marginBottom: '15px' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '5px'
      }}>
        <span style={{ fontWeight: 'bold', color: '#333' }}>{label}</span>
        <span style={{ 
          fontWeight: 'bold', 
          color: getScoreColor(value),
          fontSize: '18px'
        }}>
          {value}%
        </span>
      </div>
      <div style={{
        width: '100%',
        height: '12px',
        backgroundColor: '#e0e0e0',
        borderRadius: '6px',
        overflow: 'hidden'
      }}>
        <div
          style={{
            width: `${value}%`,
            height: '100%',
            backgroundColor: getScoreColor(value),
            transition: 'width 0.5s ease',
            borderRadius: '6px'
          }}
        />
      </div>
    </div>
  );

  if (isAnalyzing) {
    return (
      <div style={{
        padding: '20px',
        backgroundColor: 'white',
        borderRadius: '8px',
        border: '2px solid #e0e0e0',
        textAlign: 'center'
      }}>
        <div style={{ 
          fontSize: '16px', 
          color: '#666',
          marginBottom: '15px'
        }}>
          Analyzing handwriting...
        </div>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid #e0e0e0',
          borderTop: '4px solid #007bff',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto'
        }} />
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    );
  }

  if (!score) {
    return (
      <div style={{
        padding: '20px',
        backgroundColor: 'white',
        borderRadius: '8px',
        border: '2px solid #e0e0e0',
        textAlign: 'center',
        color: '#666'
      }}>
        Capture a handwriting sample to see your score
      </div>
    );
  }

  const isPassing = score.overall >= 70;

  return (
    <div style={{
      padding: '20px',
      backgroundColor: 'white',
      borderRadius: '8px',
      border: `2px solid ${getScoreColor(score.overall)}`,
    }}>
      <h3 style={{ 
        marginBottom: '20px', 
        color: '#333',
        textAlign: 'center'
      }}>
        Handwriting Analysis
      </h3>
      
      <ScoreBar label="Overall Score" value={score.overall} />
      <ScoreBar label="Alignment" value={score.alignment} />
      <ScoreBar label="Form" value={score.form} />
      
      <div style={{
        marginTop: '20px',
        padding: '15px',
        backgroundColor: isPassing ? '#e8f5e8' : '#ffeaa7',
        borderRadius: '6px',
        textAlign: 'center',
        border: `1px solid ${isPassing ? '#4caf50' : '#ff9800'}`
      }}>
        <div style={{
          fontWeight: 'bold',
          fontSize: '16px',
          color: isPassing ? '#2e7d32' : '#e65100',
          marginBottom: '5px'
        }}>
          {isPassing ? '🎉 Great job!' : '💪 Keep practicing!'}
        </div>
        <div style={{
          fontSize: '14px',
          color: isPassing ? '#2e7d32' : '#e65100'
        }}>
          {isPassing 
            ? 'Your handwriting meets the target quality!' 
            : 'Try to improve alignment and letter formation.'
          }
        </div>
      </div>
    </div>
  );
};

export default ScoreDisplay;
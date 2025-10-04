import React, { useState, useCallback } from 'react';
import LetterTemplate from '../letterTemplate/LetterTemplate';
import LetterSelector from '../letterTemplate/LetterSelector';
import WebcamCapture from '../webcam/WebcamCapture';
import ScoreDisplay from '../cvPipeline/ScoreDisplay';
import { ImageProcessor } from '../cvPipeline/ImageProcessor';
import { LetterScore, PracticeAttempt } from '../../types';

const PracticeInterface: React.FC = () => {
  const [selectedLetter, setSelectedLetter] = useState('A');
  const [currentScore, setCurrentScore] = useState<LetterScore | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [attempts, setAttempts] = useState<PracticeAttempt[]>([]);
  const [imageProcessor] = useState(() => new ImageProcessor());
  const [feedbackImage, setFeedbackImage] = useState<string | null>(null);

  const handleCapture = useCallback(async (imageSrc: string) => {
    setIsAnalyzing(true);
    setFeedbackImage(null);

    try {
      const score = await imageProcessor.processImage(imageSrc, selectedLetter);
      const overlayImage = await imageProcessor.createFeedbackOverlay(imageSrc, score);
      
      setCurrentScore(score);
      setFeedbackImage(overlayImage);

      const attempt: PracticeAttempt = {
        letter: selectedLetter,
        alignment: score.alignment,
        form: score.form,
        overall: score.overall,
        timestamp: new Date().toISOString(),
      };

      setAttempts(prev => [attempt, ...prev].slice(0, 10));
    } catch (error) {
      console.error('Error processing image:', error);
    } finally {
      setIsAnalyzing(false);
    }
  }, [imageProcessor, selectedLetter]);

  const handleLetterSelect = useCallback((letter: string) => {
    setSelectedLetter(letter);
    setCurrentScore(null);
    setFeedbackImage(null);
  }, []);

  const handleRetry = useCallback(() => {
    setCurrentScore(null);
    setFeedbackImage(null);
  }, []);

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      backgroundColor: '#f5f5f5',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        flex: 1,
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ 
            marginBottom: '20px', 
            color: '#333',
            textAlign: 'center' 
          }}>
            Handwriting Tutor
          </h2>
          <LetterSelector
            selectedLetter={selectedLetter}
            onLetterSelect={handleLetterSelect}
          />
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px'
        }}>
          <h3 style={{ color: '#333', margin: 0 }}>
            Practice Letter: {selectedLetter}
          </h3>
          <LetterTemplate
            letter={selectedLetter}
            size={200}
            showBaseline={true}
            showArrows={false}
          />
          <div style={{
            fontSize: '14px',
            color: '#666',
            textAlign: 'center',
            maxWidth: '300px'
          }}>
            Trace this letter on paper and hold it up to the camera to get feedback on your handwriting.
          </div>
        </div>

        {attempts.length > 0 && (
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ marginBottom: '15px', color: '#333' }}>Recent Attempts</h3>
            <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
              {attempts.map((attempt, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '8px 0',
                    borderBottom: index < attempts.length - 1 ? '1px solid #e0e0e0' : 'none'
                  }}
                >
                  <span style={{ fontWeight: 'bold' }}>{attempt.letter}</span>
                  <span style={{ 
                    color: attempt.overall >= 70 ? '#4caf50' : '#ff9800',
                    fontWeight: 'bold'
                  }}>
                    {attempt.overall}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div style={{
        flex: 1,
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '15px'
        }}>
          <h3 style={{ color: '#333', margin: 0 }}>Camera View</h3>
          {feedbackImage ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
              <img
                src={feedbackImage}
                alt="Feedback overlay"
                style={{
                  maxWidth: '400px',
                  maxHeight: '300px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '8px'
                }}
              />
              <button
                onClick={handleRetry}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}
              >
                Try Again
              </button>
            </div>
          ) : (
            <WebcamCapture
              onCapture={handleCapture}
              width={400}
              height={300}
            />
          )}
        </div>

        <ScoreDisplay score={currentScore} isAnalyzing={isAnalyzing} />
      </div>
    </div>
  );
};

export default PracticeInterface;
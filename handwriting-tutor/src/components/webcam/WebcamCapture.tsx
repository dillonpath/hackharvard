import React, { useRef, useCallback, useState } from 'react';
import Webcam from 'react-webcam';

interface WebcamCaptureProps {
  onCapture: (imageSrc: string) => void;
  width?: number;
  height?: number;
}

const WebcamCapture: React.FC<WebcamCaptureProps> = ({
  onCapture,
  width = 640,
  height = 480,
}) => {
  const webcamRef = useRef<Webcam>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setIsCapturing(true);
      onCapture(imageSrc);
      setTimeout(() => setIsCapturing(false), 200);
    }
  }, [onCapture]);

  return (
    <div style={{ position: 'relative' }}>
      <Webcam
        ref={webcamRef}
        audio={false}
        width={width}
        height={height}
        screenshotFormat="image/jpeg"
        videoConstraints={{
          width,
          height,
          facingMode: 'environment',
        }}
        style={{
          border: '2px solid #e0e0e0',
          borderRadius: '8px',
          opacity: isCapturing ? 0.8 : 1,
          transition: 'opacity 0.2s ease',
        }}
      />
      
      <div
        style={{
          position: 'absolute',
          bottom: '10px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '10px',
        }}
      >
        <button
          onClick={capture}
          disabled={isCapturing}
          style={{
            padding: '10px 20px',
            backgroundColor: isCapturing ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: isCapturing ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            fontWeight: 'bold',
            transition: 'background-color 0.2s ease',
          }}
        >
          {isCapturing ? 'Capturing...' : 'Capture'}
        </button>
      </div>

      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '200px',
          height: '2px',
          backgroundColor: '#007bff',
          opacity: 0.7,
          pointerEvents: 'none',
        }}
      />
      
      <div
        style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          color: '#007bff',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          padding: '5px 10px',
          borderRadius: '4px',
          fontSize: '12px',
          fontWeight: 'bold',
        }}
      >
        Baseline Guide
      </div>
    </div>
  );
};

export default WebcamCapture;
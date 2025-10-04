import React, { useEffect, useRef } from 'react';
import { LetterTemplate as LetterTemplateType } from '../../types';

interface LetterTemplateProps {
  letter: string;
  size?: number;
  showBaseline?: boolean;
  showArrows?: boolean;
}

const letterPaths: Record<string, string[]> = {
  A: [
    'M 40 80 L 20 20 L 60 20 L 40 80 Z',
    'M 30 50 L 50 50'
  ],
  B: [
    'M 20 20 L 20 80 L 50 80 L 55 75 L 55 55 L 50 50 L 55 45 L 55 25 L 50 20 L 20 20 Z',
    'M 20 50 L 50 50'
  ],
  C: [
    'M 60 30 Q 50 20 40 20 Q 20 20 20 50 Q 20 80 40 80 Q 50 80 60 70'
  ],
};

const LetterTemplate: React.FC<LetterTemplateProps> = ({
  letter,
  size = 200,
  showBaseline = true,
  showArrows = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const scale = size / 100;
    ctx.scale(scale, scale);

    if (showBaseline) {
      ctx.strokeStyle = '#ccc';
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(10, 80);
      ctx.lineTo(90, 80);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    const paths = letterPaths[letter.toUpperCase()] || [];
    
    ctx.strokeStyle = '#007bff';
    ctx.fillStyle = 'transparent';
    ctx.lineWidth = 3;

    paths.forEach((pathString) => {
      const path = new Path2D(pathString);
      ctx.stroke(path);
    });

    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }, [letter, size, showBaseline, showArrows]);

  return (
    <div className="letter-template">
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        style={{
          border: '2px solid #e0e0e0',
          borderRadius: '8px',
          backgroundColor: 'white',
        }}
      />
    </div>
  );
};

export default LetterTemplate;
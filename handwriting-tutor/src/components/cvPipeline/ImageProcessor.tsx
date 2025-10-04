import * as tf from '@tensorflow/tfjs';
import { LetterScore } from '../../types';

export class ImageProcessor {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d')!;
  }

  async processImage(imageSrc: string, templateLetter: string): Promise<LetterScore> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        this.canvas.width = img.width;
        this.canvas.height = img.height;
        this.ctx.drawImage(img, 0, 0);

        const processedScore = this.analyzeHandwriting(templateLetter);
        resolve(processedScore);
      };
      img.src = imageSrc;
    });
  }

  private analyzeHandwriting(templateLetter: string): LetterScore {
    const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    const binaryImage = this.binaryThreshold(imageData);
    
    const alignmentScore = this.calculateAlignmentScore(binaryImage);
    const formScore = this.calculateFormScore(binaryImage, templateLetter);
    const overall = (alignmentScore * 0.4) + (formScore * 0.6);

    return {
      alignment: Math.round(alignmentScore),
      form: Math.round(formScore),
      overall: Math.round(overall),
    };
  }

  private binaryThreshold(imageData: ImageData): ImageData {
    const data = imageData.data;
    const threshold = 128;

    for (let i = 0; i < data.length; i += 4) {
      const gray = (data[i] + data[i + 1] + data[i + 2]) / 3;
      const binary = gray < threshold ? 0 : 255;
      
      data[i] = binary;
      data[i + 1] = binary;
      data[i + 2] = binary;
    }

    return imageData;
  }

  private calculateAlignmentScore(imageData: ImageData): number {
    const { width, height } = imageData;
    const data = imageData.data;
    
    let bottomEdge = 0;
    
    for (let y = height - 1; y >= 0; y--) {
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * 4;
        if (data[idx] === 0) {
          bottomEdge = y;
          break;
        }
      }
      if (bottomEdge > 0) break;
    }

    const expectedBaseline = height * 0.8;
    const deviation = Math.abs(bottomEdge - expectedBaseline);
    const maxDeviation = height * 0.2;
    
    const score = Math.max(0, 100 - (deviation / maxDeviation) * 100);
    return score;
  }

  private calculateFormScore(imageData: ImageData, templateLetter: string): number {
    const features = this.extractFeatures(imageData);
    const templateFeatures = this.getTemplateFeatures(templateLetter);
    
    const similarity = this.calculateSimilarity(features, templateFeatures);
    return similarity * 100;
  }

  private extractFeatures(imageData: ImageData): number[] {
    const { width, height } = imageData;
    const data = imageData.data;
    
    const features: number[] = [];
    const gridSize = 8;
    const cellWidth = width / gridSize;
    const cellHeight = height / gridSize;

    for (let gy = 0; gy < gridSize; gy++) {
      for (let gx = 0; gx < gridSize; gx++) {
        let blackPixels = 0;
        let totalPixels = 0;

        for (let y = Math.floor(gy * cellHeight); y < Math.floor((gy + 1) * cellHeight); y++) {
          for (let x = Math.floor(gx * cellWidth); x < Math.floor((gx + 1) * cellWidth); x++) {
            if (y < height && x < width) {
              const idx = (y * width + x) * 4;
              if (data[idx] === 0) blackPixels++;
              totalPixels++;
            }
          }
        }

        features.push(totalPixels > 0 ? blackPixels / totalPixels : 0);
      }
    }

    return features;
  }

  private getTemplateFeatures(letter: string): number[] {
    const templates: Record<string, number[]> = {
      A: [0, 0.2, 0.2, 0, 0, 0.8, 0.8, 0, 0.2, 0.8, 0.8, 0.2, 0.8, 0.5, 0.5, 0.8, 0.8, 0.2, 0.2, 0.8, 0.8, 0, 0, 0.8, 0.5, 0, 0, 0.5, 0, 0, 0, 0],
      B: [0.8, 0.8, 0.8, 0, 0.8, 0, 0, 0.8, 0.8, 0.8, 0.8, 0, 0.8, 0, 0, 0.8, 0.8, 0, 0, 0.8, 0.8, 0.8, 0.8, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      C: [0, 0.8, 0.8, 0, 0.8, 0, 0, 0, 0.8, 0, 0, 0, 0.8, 0, 0, 0, 0.8, 0, 0, 0, 0, 0.8, 0.8, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    };

    return templates[letter.toUpperCase()] || new Array(64).fill(0.5);
  }

  private calculateSimilarity(features1: number[], features2: number[]): number {
    if (features1.length !== features2.length) return 0;

    let sumSquaredDiff = 0;
    for (let i = 0; i < features1.length; i++) {
      const diff = features1[i] - features2[i];
      sumSquaredDiff += diff * diff;
    }

    const mse = sumSquaredDiff / features1.length;
    const similarity = Math.exp(-mse * 10);
    
    return Math.max(0, Math.min(1, similarity));
  }

  createFeedbackOverlay(imageSrc: string, score: LetterScore): Promise<string> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        this.canvas.width = img.width;
        this.canvas.height = img.height;
        this.ctx.drawImage(img, 0, 0);

        this.ctx.globalAlpha = 0.3;
        if (score.overall >= 70) {
          this.ctx.fillStyle = '#4caf50';
        } else if (score.overall >= 50) {
          this.ctx.fillStyle = '#ff9800';
        } else {
          this.ctx.fillStyle = '#f44336';
        }
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.globalAlpha = 1.0;

        this.ctx.fillStyle = 'white';
        this.ctx.font = '24px Arial';
        this.ctx.fillText(`Score: ${score.overall}%`, 20, 40);
        this.ctx.fillText(`Alignment: ${score.alignment}%`, 20, 70);
        this.ctx.fillText(`Form: ${score.form}%`, 20, 100);

        resolve(this.canvas.toDataURL());
      };
      img.src = imageSrc;
    });
  }
}
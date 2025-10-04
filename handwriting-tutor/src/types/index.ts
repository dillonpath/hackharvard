export interface LetterScore {
  alignment: number;
  form: number;
  overall: number;
}

export interface PracticeAttempt {
  letter: string;
  alignment: number;
  form: number;
  overall: number;
  timestamp: string;
}

export interface SessionData {
  sessionId: string;
  attempts: PracticeAttempt[];
}

export interface LetterTemplate {
  letter: string;
  paths: string[];
  baseline: number;
}

export interface CalibrationPoint {
  screen: { x: number; y: number };
  camera: { x: number; y: number };
}
export type Chapter =
  | 'Units & Dimensions'
  | 'Motion in a Straight Line'
  | 'Simple Derivatives'
  | 'Simple Integration';

export interface Question {
  id: number;
  chapter: Chapter;
  topic: string;
  difficulty: 'Easy' | 'Medium-Easy';
  question: string;
  options: {
    label: 'A' | 'B' | 'C' | 'D';
    text: string;
  }[];
  correctOption: 'A' | 'B' | 'C' | 'D';
  finalAnswer: string;
  formulaUsed: string;
  solutionSteps: string[];
  tips?: string;
}

export type ViewMode = 'question' | 'solution';

export interface UserAnswer {
  questionId: number;
  selectedOption?: 'A' | 'B' | 'C' | 'D';
  isCorrect?: boolean;
  timeSpentSeconds: number;
  viewedSolution: boolean;
}

export interface ExamSettings {
  questionDurationSec: number; // default 120 (2 mins)
  solutionDurationSec: number; // default 30 (30 secs)
  autoAdvance: boolean; // default true
  soundEnabled: boolean; // default true
  instantFeedback: boolean; // show if answer is correct immediately on pick
}

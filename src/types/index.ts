export interface Highlight {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  description: string;
}

export interface Step {
  id: string;
  title: string;
  description: string;
  why?: string; // Explanation of why this step is important
  task?: string; // Description of what the user needs to do
  expectedCode?: string; // The code the user should type/match to complete the step
  highlights: Highlight[];
  duration?: number; // Duration in milliseconds for the animation
  visualElements?: Array<{
    id: string;
    type: string;
    x: number;
    y: number;
    width: number;
    height: number;
    content: string;
    style?: Record<string, string>;
  }>; // Visual elements to show after this step is completed
  code?: string; // Code to show after this step is completed
}

export interface ExerciseState {
  code?: string;
  visualElements?: Array<{
    id: string;
    type: string;
    x: number;
    y: number;
    width: number;
    height: number;
    content: string;
    style?: Record<string, string>;
  }>;
}

export interface Exercise {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  beforeState: ExerciseState;
  afterState: ExerciseState;
  steps: Step[];
}

export interface ClassRoom {
  id: string;
  name: string;
  description: string;
  exercises: Exercise[];
}

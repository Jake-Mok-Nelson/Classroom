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
  highlights: Highlight[];
  duration?: number; // Duration in milliseconds for the animation
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

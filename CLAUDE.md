# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Start development server**: `npm run dev`
- **Build for production**: `npm run build` (runs TypeScript compilation first, then Vite build)
- **Lint code**: `npm run lint`
- **Preview production build**: `npm run preview`

## High-Level Architecture

### Core Application Structure
This is a React-based digital classroom application with step-by-step interactive learning experiences. The architecture follows a single-page application pattern with client-side routing.

**Main Application Flow:**
1. `ClassroomListView` → Shows available classrooms
2. `ClassroomView` → Shows exercises within a classroom  
3. `ExerciseView` → Interactive step-by-step learning experience

### Key Architectural Patterns

**State Management:**
- Uses local component state with React hooks
- No global state management library (Redux/Zustand) - everything is managed through props and local state
- Exercise progress is managed in `ExerciseView` component with step-by-step state transitions

**Data Flow:**
- Static data stored in `src/data/sampleData.ts`
- Type definitions in `src/types/index.ts` define the core data models
- Components receive data through props passed down from route components

**Animation System:**
- Uses Framer Motion for all animations and transitions
- `VisualCanvas` component handles animated highlights that guide users through steps
- Step progression includes animation states (`isAnimating` flag) to prevent rapid navigation

### Core Components

**ExerciseView** (`src/components/ExerciseView.tsx`):
- Most complex component managing step-by-step learning experience
- Handles cumulative state calculation (visual elements and code changes build up across steps)
- Supports interactive steps where users must type expected code to proceed
- Manages validation of user input against expected code

**VisualCanvas** (`src/components/VisualCanvas.tsx`):
- Renders visual elements with absolute positioning
- Handles animated highlights that guide users through each step
- Manages mouse interactions and highlight animations

**Data Structure:**
- Exercises contain `beforeState`, `afterState`, and `steps[]`
- Each step can define visual elements and code changes that are cumulatively applied
- Highlights define clickable areas with animations to guide user attention

### TypeScript Configuration
- Uses TypeScript 5.9 with strict configuration
- Project references with separate configs for app (`tsconfig.app.json`) and Node (`tsconfig.node.json`)
- Vite handles TypeScript compilation in development

### Styling
- Uses vanilla CSS with CSS custom properties for theming
- Dark mode support via `DarkModeToggle` component
- Gradient backgrounds and smooth animations are key design elements

### Router Structure
```
/ → ClassroomListView
/classroom/:classroomId → ClassroomView  
/classroom/:classroomId/exercise/:exerciseId → ExerciseView
```
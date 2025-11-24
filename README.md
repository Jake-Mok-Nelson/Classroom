# Digital Classroom

An interactive digital classroom application built with React, TypeScript, and Vite. This application provides a beautiful, animated learning experience that guides students through programming concepts step-by-step.

## Features

- 🎨 **Beautiful UI**: Modern gradient backgrounds and smooth animations using Framer Motion
- 📚 **Interactive Exercises**: Step-by-step guided learning with visual feedback
- 🎯 **Highlighting System**: Animated highlights that guide users through each step
- 📊 **Before/After Visualization**: Side-by-side comparison of starting and completed states
- 🔄 **Progress Tracking**: Visual progress indicators and step navigation
- 🌟 **Multiple Difficulty Levels**: Exercises categorized by difficulty (beginner, intermediate, advanced)
- 📱 **Responsive Design**: Works seamlessly across different screen sizes

## Technologies Used

- **React 19** - UI library
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server
- **Framer Motion** - Smooth animations and transitions
- **React Router** - Client-side routing

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Jake-Mok-Nelson/Classroom.git
cd Classroom
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

### Linting

```bash
npm run lint
```

## Project Structure

```
src/
├── components/          # React components
│   ├── ClassroomView.tsx    # Main classroom listing
│   ├── ExerciseView.tsx     # Exercise detail with step-by-step guide
│   └── VisualCanvas.tsx     # Visual element renderer with highlights
├── data/               # Static data and configuration
│   └── sampleData.ts        # Sample exercises and classroom data
├── types/              # TypeScript type definitions
│   └── index.ts             # Core data types
├── App.tsx             # Main app with routing
├── main.tsx            # Application entry point
└── index.css           # Global styles
```

## Adding New Exercises

Exercises are defined in `src/data/sampleData.ts`. Each exercise includes:

- Title, description, and difficulty level
- Before and after states (code and visual elements)
- Step-by-step instructions with highlights
- Visual elements with positioning and styling

Example exercise structure:

```typescript
{
  id: 'exercise-1',
  title: 'Creating a Button',
  description: 'Learn how to create and style a simple button element',
  category: 'HTML & CSS',
  difficulty: 'beginner',
  beforeState: { /* initial state */ },
  afterState: { /* final state */ },
  steps: [ /* step-by-step instructions */ ]
}
```

## License

This project is licensed under the MIT License.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

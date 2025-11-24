import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom';
import ClassroomView from './components/ClassroomView';
import ExerciseView from './components/ExerciseView';
import { sampleClassroom } from './data/sampleData';

function ExerciseRoute() {
  const { exerciseId } = useParams<{ exerciseId: string }>();
  const exercise = sampleClassroom.exercises.find(ex => ex.id === exerciseId);
  
  if (!exercise) {
    return <div>Exercise not found</div>;
  }
  
  return <ExerciseView exercise={exercise} />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ClassroomView classroom={sampleClassroom} />} />
        <Route path="/exercise/:exerciseId" element={<ExerciseRoute />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

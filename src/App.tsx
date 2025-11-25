import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom';
import ClassroomListView from './components/ClassroomListView';
import ClassroomView from './components/ClassroomView';
import ExerciseView from './components/ExerciseView';
import DarkModeToggle from './components/DarkModeToggle';
import { sampleClassrooms } from './data/sampleData';

function ClassroomRoute() {
  const { classroomId } = useParams<{ classroomId: string }>();
  const classroom = sampleClassrooms.find(c => c.id === classroomId);
  
  if (!classroom) {
    return <div>Classroom not found</div>;
  }
  
  return <ClassroomView classroom={classroom} />;
}

function ExerciseRoute() {
  const { classroomId, exerciseId } = useParams<{ classroomId: string; exerciseId: string }>();
  const classroom = sampleClassrooms.find(c => c.id === classroomId);
  
  if (!classroom) {
    return <div>Classroom not found</div>;
  }
  
  const exercise = classroom.exercises.find(ex => ex.id === exerciseId);
  
  if (!exercise) {
    return <div>Exercise not found</div>;
  }
  
  return <ExerciseView exercise={exercise} classroomId={classroomId!} />;
}

function App() {
  return (
    <BrowserRouter>
      <DarkModeToggle />
      <Routes>
        <Route path="/" element={<ClassroomListView classrooms={sampleClassrooms} />} />
        <Route path="/classroom/:classroomId" element={<ClassroomRoute />} />
        <Route path="/classroom/:classroomId/exercise/:exerciseId" element={<ExerciseRoute />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

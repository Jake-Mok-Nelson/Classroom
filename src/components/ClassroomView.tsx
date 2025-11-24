import { motion } from 'framer-motion';
import type { ClassRoom } from '../types';
import { useNavigate } from 'react-router-dom';

interface ClassroomViewProps {
  classroom: ClassRoom;
}

export default function ClassroomView({ classroom }: ClassroomViewProps) {
  const navigate = useNavigate();

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return '#4CAF50';
      case 'intermediate':
        return '#FF9800';
      case 'advanced':
        return '#f44336';
      default:
        return '#9e9e9e';
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '2rem',
    }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        <motion.button
          onClick={() => navigate('/')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            color: 'white',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '8px',
            padding: '0.75rem 1.5rem',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          ← Back to Classrooms
        </motion.button>

        <h1 style={{
          color: 'white',
          fontSize: '3rem',
          marginBottom: '1rem',
          textAlign: 'center',
        }}>
          {classroom.name}
        </h1>
        <p style={{
          color: 'rgba(255, 255, 255, 0.9)',
          fontSize: '1.2rem',
          marginBottom: '3rem',
          textAlign: 'center',
        }}>
          {classroom.description}
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '2rem',
        }}>
          {classroom.exercises.map((exercise, index) => (
            <motion.div
              key={exercise.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
              onClick={() => navigate(`/classroom/${classroom.id}/exercise/${exercise.id}`)}
              style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '1.5rem',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                backgroundColor: getDifficultyColor(exercise.difficulty),
              }} />
              
              <div style={{
                display: 'inline-block',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                color: '#667eea',
                padding: '0.5rem 1rem',
                borderRadius: '20px',
                fontSize: '0.85rem',
                marginBottom: '1rem',
                fontWeight: '600',
              }}>
                {exercise.category}
              </div>

              <h3 style={{
                fontSize: '1.5rem',
                marginBottom: '0.5rem',
                color: '#333',
              }}>
                {exercise.title}
              </h3>

              <p style={{
                color: '#666',
                marginBottom: '1rem',
                lineHeight: '1.6',
              }}>
                {exercise.description}
              </p>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}>
                  <div style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    backgroundColor: getDifficultyColor(exercise.difficulty),
                  }} />
                  <span style={{
                    fontSize: '0.9rem',
                    color: '#666',
                    textTransform: 'capitalize',
                  }}>
                    {exercise.difficulty}
                  </span>
                </div>

                <span style={{
                  fontSize: '0.9rem',
                  color: '#667eea',
                  fontWeight: '600',
                }}>
                  {exercise.steps.length} Steps →
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

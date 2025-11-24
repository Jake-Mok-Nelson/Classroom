import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Exercise } from '../types';
import { useNavigate } from 'react-router-dom';
import VisualCanvas from './VisualCanvas';

interface ExerciseViewProps {
  exercise: Exercise;
  classroomId: string;
}

export default function ExerciseView({ exercise, classroomId }: ExerciseViewProps) {
  const navigate = useNavigate();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const currentStep = exercise.steps[currentStepIndex];
  const totalSteps = exercise.steps.length;
  const showComplete = currentStepIndex >= totalSteps;

  const handleNextStep = () => {
    if (currentStepIndex < totalSteps) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStepIndex((prev) => prev + 1);
        setIsAnimating(false);
      }, 500);
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStepIndex((prev) => prev - 1);
        setIsAnimating(false);
      }, 500);
    }
  };

  const handleReset = () => {
    setCurrentStepIndex(0);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '2rem',
    }}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
        }}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(`/classroom/${classroomId}`)}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              fontSize: '1rem',
              cursor: 'pointer',
              backdropFilter: 'blur(10px)',
            }}
          >
            ← Back to Classroom
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleReset}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              fontSize: '1rem',
              cursor: 'pointer',
              backdropFilter: 'blur(10px)',
            }}
          >
            🔄 Reset
          </motion.button>
        </div>

        {/* Title Section */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '2rem',
            marginBottom: '2rem',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
          }}
        >
          <h1 style={{ margin: 0, marginBottom: '0.5rem', color: '#333' }}>
            {exercise.title}
          </h1>
          <p style={{ margin: 0, color: '#666', fontSize: '1.1rem' }}>
            {exercise.description}
          </p>
        </motion.div>

        {/* Main Content Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '2rem',
          marginBottom: '2rem',
        }}>
          {/* Visual Canvas - Before State */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '1.5rem',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
            }}
          >
            <h2 style={{ 
              margin: 0, 
              marginBottom: '1rem', 
              color: '#333',
              fontSize: '1.3rem',
            }}>
              Before
            </h2>
            <VisualCanvas
              elements={exercise.beforeState.visualElements || []}
              highlights={!showComplete ? currentStep?.highlights || [] : []}
              isAnimating={isAnimating}
            />
            {exercise.beforeState.code && (
              <pre style={{
                backgroundColor: '#f5f5f5',
                padding: '1rem',
                borderRadius: '8px',
                overflow: 'auto',
                fontSize: '0.9rem',
                marginTop: '1rem',
                color: '#333',
              }}>
                {exercise.beforeState.code}
              </pre>
            )}
          </motion.div>

          {/* Visual Canvas - After State */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '1.5rem',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
            }}
          >
            <h2 style={{ 
              margin: 0, 
              marginBottom: '1rem', 
              color: '#333',
              fontSize: '1.3rem',
            }}>
              After {showComplete && '✓'}
            </h2>
            <VisualCanvas
              elements={exercise.afterState.visualElements || []}
              highlights={[]}
              isAnimating={false}
              showComplete={showComplete}
            />
            {exercise.afterState.code && (
              <pre style={{
                backgroundColor: '#f5f5f5',
                padding: '1rem',
                borderRadius: '8px',
                overflow: 'auto',
                fontSize: '0.9rem',
                marginTop: '1rem',
                color: '#333',
              }}>
                {exercise.afterState.code}
              </pre>
            )}
          </motion.div>
        </div>

        {/* Steps Panel */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '2rem',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
          }}
        >
          {!showComplete ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStepIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '1rem',
                }}>
                  <h3 style={{ margin: 0, color: '#333', fontSize: '1.5rem' }}>
                    Step {currentStepIndex + 1} of {totalSteps}
                  </h3>
                  <div style={{
                    backgroundColor: '#667eea',
                    color: 'white',
                    padding: '0.5rem 1rem',
                    borderRadius: '20px',
                    fontSize: '0.9rem',
                  }}>
                    {Math.round(((currentStepIndex + 1) / totalSteps) * 100)}% Complete
                  </div>
                </div>

                <h4 style={{ 
                  margin: '1rem 0 0.5rem', 
                  color: '#667eea',
                  fontSize: '1.3rem',
                }}>
                  {currentStep.title}
                </h4>
                <p style={{ color: '#666', fontSize: '1.1rem', lineHeight: '1.6' }}>
                  {currentStep.description}
                </p>
              </motion.div>
            </AnimatePresence>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{ textAlign: 'center' }}
            >
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
              <h3 style={{ color: '#4CAF50', fontSize: '1.8rem', marginBottom: '0.5rem' }}>
                Exercise Complete!
              </h3>
              <p style={{ color: '#666', fontSize: '1.1rem' }}>
                Great job! You've completed all the steps.
              </p>
            </motion.div>
          )}

          {/* Progress Bar */}
          <div style={{
            width: '100%',
            height: '8px',
            backgroundColor: '#e0e0e0',
            borderRadius: '4px',
            overflow: 'hidden',
            margin: '1.5rem 0',
          }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${((currentStepIndex + 1) / totalSteps) * 100}%` }}
              transition={{ duration: 0.5 }}
              style={{
                height: '100%',
                backgroundColor: '#667eea',
              }}
            />
          </div>

          {/* Navigation Buttons */}
          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
          }}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePrevStep}
              disabled={currentStepIndex === 0}
              style={{
                backgroundColor: currentStepIndex === 0 ? '#e0e0e0' : '#667eea',
                color: 'white',
                border: 'none',
                padding: '1rem 2rem',
                borderRadius: '8px',
                fontSize: '1.1rem',
                cursor: currentStepIndex === 0 ? 'not-allowed' : 'pointer',
                fontWeight: '600',
              }}
            >
              ← Previous
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNextStep}
              disabled={currentStepIndex >= totalSteps}
              style={{
                backgroundColor: currentStepIndex >= totalSteps ? '#e0e0e0' : '#667eea',
                color: 'white',
                border: 'none',
                padding: '1rem 2rem',
                borderRadius: '8px',
                fontSize: '1.1rem',
                cursor: currentStepIndex >= totalSteps ? 'not-allowed' : 'pointer',
                fontWeight: '600',
              }}
            >
              Next →
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

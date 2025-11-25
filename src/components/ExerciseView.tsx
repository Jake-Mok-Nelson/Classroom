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

  // Compute cumulative visual elements and code based on completed steps
  const getCurrentVisualElements = () => {
    // Use a Map for O(1) lookups when merging elements
    const elementMap = new Map<string, typeof exercise.beforeState.visualElements extends (infer T)[] | undefined ? T : never>();
    
    // Start with the before state elements
    (exercise.beforeState.visualElements || []).forEach(el => {
      elementMap.set(el.id, el);
    });
    
    // Add visual elements from each completed step
    for (let i = 0; i < currentStepIndex; i++) {
      const step = exercise.steps[i];
      if (step.visualElements) {
        // Merge elements: update existing ones by id, add new ones
        step.visualElements.forEach(newElement => {
          elementMap.set(newElement.id, newElement);
        });
      }
    }
    
    return Array.from(elementMap.values());
  };

  const getCurrentCode = () => {
    // Start with the before state code
    let code = exercise.beforeState.code;
    
    // Use the most recent step's code if available
    for (let i = currentStepIndex - 1; i >= 0; i--) {
      const step = exercise.steps[i];
      if (step.code) {
        code = step.code;
        break;
      }
    }
    return code;
  };

  const currentVisualElements = getCurrentVisualElements();
  const currentCode = getCurrentCode();

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
      backgroundColor: 'var(--color-bg-primary)',
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
              backgroundColor: 'var(--color-bg-tertiary)',
              color: 'var(--color-text-primary)',
              border: '1px solid var(--color-border-default)',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              fontSize: '1rem',
              cursor: 'pointer',
            }}
          >
            ← Back to Classroom
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleReset}
            style={{
              backgroundColor: 'var(--color-bg-tertiary)',
              color: 'var(--color-text-primary)',
              border: '1px solid var(--color-border-default)',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              fontSize: '1rem',
              cursor: 'pointer',
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
            backgroundColor: 'var(--color-bg-secondary)',
            borderRadius: '12px',
            padding: '2rem',
            marginBottom: '2rem',
            border: '1px solid var(--color-border-default)',
          }}
        >
          <h1 style={{ margin: 0, marginBottom: '0.5rem', color: 'var(--color-text-primary)' }}>
            {exercise.title}
          </h1>
          <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: '1.1rem' }}>
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
          {/* Visual Canvas - Current Progress State */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            style={{
              backgroundColor: 'var(--color-bg-secondary)',
              borderRadius: '12px',
              padding: '1.5rem',
              border: '1px solid var(--color-border-default)',
            }}
          >
            <h2 style={{ 
              margin: 0, 
              marginBottom: '1rem', 
              color: 'var(--color-text-primary)',
              fontSize: '1.3rem',
            }}>
              Current Progress
            </h2>
            <VisualCanvas
              elements={currentVisualElements}
              highlights={!showComplete ? currentStep?.highlights || [] : []}
              isAnimating={isAnimating}
            />
            {currentCode && (
              <pre style={{
                backgroundColor: 'var(--color-code-bg)',
                padding: '1rem',
                borderRadius: '8px',
                overflow: 'auto',
                fontSize: '0.9rem',
                marginTop: '1rem',
                color: 'var(--color-text-primary)',
                border: '1px solid var(--color-border-default)',
              }}>
                {currentCode}
              </pre>
            )}
          </motion.div>

          {/* Visual Canvas - After State */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            style={{
              backgroundColor: 'var(--color-bg-secondary)',
              borderRadius: '12px',
              padding: '1.5rem',
              border: '1px solid var(--color-border-default)',
            }}
          >
            <h2 style={{ 
              margin: 0, 
              marginBottom: '1rem', 
              color: 'var(--color-text-primary)',
              fontSize: '1.3rem',
            }}>
              Goal {showComplete && '✓'}
            </h2>
            <VisualCanvas
              elements={exercise.afterState.visualElements || []}
              highlights={[]}
              isAnimating={false}
              showComplete={showComplete}
            />
            {exercise.afterState.code && (
              <pre style={{
                backgroundColor: 'var(--color-code-bg)',
                padding: '1rem',
                borderRadius: '8px',
                overflow: 'auto',
                fontSize: '0.9rem',
                marginTop: '1rem',
                color: 'var(--color-text-primary)',
                border: '1px solid var(--color-border-default)',
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
            backgroundColor: 'var(--color-bg-secondary)',
            borderRadius: '12px',
            padding: '2rem',
            border: '1px solid var(--color-border-default)',
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
                  <h3 style={{ margin: 0, color: 'var(--color-text-primary)', fontSize: '1.5rem' }}>
                    Step {currentStepIndex + 1} of {totalSteps}
                  </h3>
                  <div style={{
                    backgroundColor: 'var(--color-accent-emphasis)',
                    color: 'var(--color-text-primary)',
                    padding: '0.5rem 1rem',
                    borderRadius: '20px',
                    fontSize: '0.9rem',
                  }}>
                    {Math.round(((currentStepIndex + 1) / totalSteps) * 100)}% Complete
                  </div>
                </div>

                <h4 style={{ 
                  margin: '1rem 0 0.5rem', 
                  color: 'var(--color-accent-primary)',
                  fontSize: '1.3rem',
                }}>
                  {currentStep.title}
                </h4>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.1rem', lineHeight: '1.6' }}>
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
              <h3 style={{ color: 'var(--color-success)', fontSize: '1.8rem', marginBottom: '0.5rem' }}>
                Exercise Complete!
              </h3>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.1rem' }}>
                Great job! You've completed all the steps.
              </p>
            </motion.div>
          )}

          {/* Progress Bar */}
          <div style={{
            width: '100%',
            height: '8px',
            backgroundColor: 'var(--color-bg-tertiary)',
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
                backgroundColor: 'var(--color-accent-primary)',
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
                backgroundColor: currentStepIndex === 0 ? 'var(--color-bg-tertiary)' : 'var(--color-accent-emphasis)',
                color: currentStepIndex === 0 ? 'var(--color-text-muted)' : 'var(--color-text-primary)',
                border: currentStepIndex === 0 ? '1px solid var(--color-border-default)' : 'none',
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
                backgroundColor: currentStepIndex >= totalSteps ? 'var(--color-bg-tertiary)' : 'var(--color-accent-emphasis)',
                color: currentStepIndex >= totalSteps ? 'var(--color-text-muted)' : 'var(--color-text-primary)',
                border: currentStepIndex >= totalSteps ? '1px solid var(--color-border-default)' : 'none',
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

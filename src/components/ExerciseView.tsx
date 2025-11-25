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
  const [showGoalPreview, setShowGoalPreview] = useState(false);
  const [showWhy, setShowWhy] = useState(false);
  const [editorCode, setEditorCode] = useState(exercise.beforeState.code || '');
  const [validationState, setValidationState] = useState<'idle' | 'correct' | 'incorrect'>('idle');

  const currentStep = exercise.steps[currentStepIndex];
  const totalSteps = exercise.steps.length;
  const showComplete = currentStepIndex >= totalSteps;
  
  // Check if current step requires interactive input
  const isInteractiveStep = currentStep?.task && currentStep?.expectedCode;

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

  // Get the preview of what the workspace will look like after completing the current step
  const getNextStepPreview = () => {
    if (currentStepIndex >= totalSteps) {
      return { elements: exercise.afterState.visualElements || [], code: exercise.afterState.code };
    }
    
    const step = exercise.steps[currentStepIndex];
    
    // If the current step has visual elements, show them as the "after" state
    if (step.visualElements) {
      return { elements: step.visualElements, code: step.code };
    }
    
    // If no visual elements defined for this step, compute cumulative state including this step
    // by looking ahead to what the next step would show
    const elementMap = new Map<string, typeof exercise.beforeState.visualElements extends (infer T)[] | undefined ? T : never>();
    
    // Start with the before state elements
    (exercise.beforeState.visualElements || []).forEach(el => {
      elementMap.set(el.id, el);
    });
    
    // Add visual elements from each step up to and including current
    for (let i = 0; i <= currentStepIndex; i++) {
      const s = exercise.steps[i];
      if (s.visualElements) {
        s.visualElements.forEach(newElement => {
          elementMap.set(newElement.id, newElement);
        });
      }
    }
    
    // Get the code that would be shown after this step
    let code = exercise.beforeState.code;
    for (let i = currentStepIndex; i >= 0; i--) {
      const s = exercise.steps[i];
      if (s.code) {
        code = s.code;
        break;
      }
    }
    
    return { elements: Array.from(elementMap.values()), code };
  };

  const currentVisualElements = getCurrentVisualElements();
  const currentCode = getCurrentCode();
  const nextPreview = getNextStepPreview();

  // Delay before auto-advancing after correct answer (in milliseconds)
  const CORRECT_ANSWER_DELAY = 800;

  // Validate user's edited code against expected code
  const validateCode = () => {
    if (!currentStep?.expectedCode) return true;
    const normalizedCode = editorCode.trim().toLowerCase();
    const normalizedExpected = currentStep.expectedCode.trim().toLowerCase();
    // Check if the edited code contains the expected code (case-insensitive)
    return normalizedCode.includes(normalizedExpected);
  };

  const handleSubmitStep = () => {
    if (isInteractiveStep) {
      const isCorrect = validateCode();
      setValidationState(isCorrect ? 'correct' : 'incorrect');
      
      if (isCorrect) {
        setTimeout(() => {
          handleNextStep();
        }, CORRECT_ANSWER_DELAY);
      }
    } else {
      handleNextStep();
    }
  };

  const handleNextStep = () => {
    if (currentStepIndex < totalSteps) {
      setIsAnimating(true);
      setValidationState('idle');
      setShowWhy(false);
      
      // Get the code for the next step - use current step's expected result
      const nextStepCode = currentStep?.code || editorCode;
      
      setTimeout(() => {
        setCurrentStepIndex((prev) => prev + 1);
        // Update editor with the current step's resulting code
        setEditorCode(nextStepCode);
        setIsAnimating(false);
      }, 500);
    }
  };

  // Helper to get code state for a given step index
  const getCodeForStep = (stepIndex: number): string => {
    let code = exercise.beforeState.code || '';
    // Apply code from each completed step up to stepIndex
    for (let i = 0; i < stepIndex; i++) {
      const step = exercise.steps[i];
      if (step.code) {
        code = step.code;
      }
    }
    return code;
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setIsAnimating(true);
      setValidationState('idle');
      setShowWhy(false);
      
      const prevIndex = currentStepIndex - 1;
      const prevCode = getCodeForStep(prevIndex);
      
      setTimeout(() => {
        setCurrentStepIndex((prev) => prev - 1);
        setEditorCode(prevCode);
        setIsAnimating(false);
      }, 500);
    }
  };

  const handleReset = () => {
    setCurrentStepIndex(0);
    setShowGoalPreview(false);
    setEditorCode(exercise.beforeState.code || '');
    setValidationState('idle');
    setShowWhy(false);
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
          maxWidth: '1000px',
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
            padding: '1.5rem 2rem',
            marginBottom: '1.5rem',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h1 style={{ margin: 0, marginBottom: '0.5rem', color: '#333', fontSize: '1.8rem' }}>
                {exercise.title}
              </h1>
              <p style={{ margin: 0, color: '#666', fontSize: '1rem' }}>
                {exercise.description}
              </p>
            </div>
            {/* Step Progress Indicator */}
            <div style={{
              display: 'flex',
              gap: '0.5rem',
              alignItems: 'center',
            }}>
              {exercise.steps.map((_, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: index < currentStepIndex 
                      ? '#4CAF50' 
                      : index === currentStepIndex 
                        ? '#667eea' 
                        : '#e0e0e0',
                    border: index === currentStepIndex ? '2px solid #667eea' : 'none',
                    boxShadow: index === currentStepIndex ? '0 0 0 3px rgba(102, 126, 234, 0.3)' : 'none',
                  }}
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Current Step Card - Focus on one step at a time */}
        {!showComplete ? (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              marginBottom: '1.5rem',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
              overflow: 'hidden',
            }}
          >
            {/* Step Header */}
            <div style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              padding: '1rem 1.5rem',
              color: 'white',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.9rem', opacity: 0.9 }}>
                  Step {currentStepIndex + 1} of {totalSteps}
                </span>
                <span style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '12px',
                  fontSize: '0.85rem',
                }}>
                  {Math.round(((currentStepIndex) / totalSteps) * 100)}% Complete
                </span>
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentStepIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                style={{ padding: '1.5rem' }}
              >
                {/* Step Title & Description */}
                <h3 style={{ 
                  margin: '0 0 0.5rem 0', 
                  color: '#667eea',
                  fontSize: '1.4rem',
                }}>
                  {currentStep.title}
                </h3>
                <p style={{ 
                  color: '#666', 
                  fontSize: '1.05rem', 
                  lineHeight: '1.6',
                  margin: '0 0 1rem 0',
                }}>
                  {currentStep.description}
                </p>

                {/* Why Toggle - Explanation section */}
                {currentStep.why && (
                  <div style={{ marginBottom: '1rem' }}>
                    <motion.button
                      whileHover={{ backgroundColor: '#f0f4ff' }}
                      onClick={() => setShowWhy(!showWhy)}
                      style={{
                        backgroundColor: showWhy ? '#e8f0fe' : 'transparent',
                        border: '1px solid #667eea',
                        borderRadius: '6px',
                        padding: '0.5rem 1rem',
                        color: '#667eea',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        fontWeight: '500',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                      }}
                    >
                      <span>💡</span>
                      {showWhy ? 'Hide' : 'Show'} why this matters
                      <motion.span
                        animate={{ rotate: showWhy ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                        style={{ fontSize: '0.8rem' }}
                      >
                        ▼
                      </motion.span>
                    </motion.button>
                    
                    <AnimatePresence>
                      {showWhy && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          style={{ overflow: 'hidden' }}
                        >
                          <div style={{
                            backgroundColor: '#f8f9ff',
                            border: '1px solid #e0e6ff',
                            borderRadius: '8px',
                            padding: '1rem',
                            marginTop: '0.75rem',
                            color: '#4a5568',
                            fontSize: '0.95rem',
                            lineHeight: '1.6',
                          }}>
                            <strong style={{ color: '#667eea' }}>Why:</strong> {currentStep.why}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {/* Code Editor Section - Full editable code */}
                {isInteractiveStep ? (
                  <div style={{
                    backgroundColor: validationState === 'correct' ? '#e8f5e9' : validationState === 'incorrect' ? '#ffebee' : '#f8f9fa',
                    border: `2px solid ${validationState === 'correct' ? '#4CAF50' : validationState === 'incorrect' ? '#f44336' : '#e0e0e0'}`,
                    borderRadius: '8px',
                    padding: '1rem',
                    marginBottom: '1rem',
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '0.75rem',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '1.2rem' }}>
                          {validationState === 'correct' ? '✅' : validationState === 'incorrect' ? '❌' : '💻'}
                        </span>
                        <span style={{
                          fontWeight: '600',
                          color: validationState === 'correct' ? '#2e7d32' : validationState === 'incorrect' ? '#c62828' : '#333',
                          fontSize: '0.9rem',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                        }}>
                          {validationState === 'correct' ? 'Correct!' : validationState === 'incorrect' ? 'Try Again' : 'Code Editor'}
                        </span>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleSubmitStep}
                        style={{
                          backgroundColor: '#667eea',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '0.5rem 1rem',
                          fontSize: '0.9rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                        }}
                      >
                        ✓ Check Code
                      </motion.button>
                    </div>
                    
                    {/* Task description */}
                    <div style={{
                      backgroundColor: '#fff8e1',
                      border: '1px solid #ffe082',
                      borderRadius: '6px',
                      padding: '0.75rem 1rem',
                      marginBottom: '0.75rem',
                    }}>
                      <span style={{ fontWeight: '600', color: '#f57c00', marginRight: '0.5rem' }}>📝 Task:</span>
                      <span style={{ color: '#555' }}>{currentStep.task}</span>
                    </div>
                    
                    {/* Full Code Editor */}
                    <textarea
                      value={editorCode}
                      onChange={(e) => {
                        setEditorCode(e.target.value);
                        setValidationState('idle');
                      }}
                      spellCheck={false}
                      aria-label="Code editor - edit the code to complete the task"
                      aria-multiline="true"
                      style={{
                        width: '100%',
                        minHeight: '200px',
                        padding: '1rem',
                        fontSize: '0.9rem',
                        fontFamily: '"Fira Code", "Consolas", "Monaco", monospace',
                        backgroundColor: '#1e1e1e',
                        color: '#d4d4d4',
                        border: 'none',
                        borderRadius: '8px',
                        resize: 'vertical',
                        outline: 'none',
                        lineHeight: '1.5',
                        tabSize: 2,
                      }}
                    />
                    
                    {validationState === 'incorrect' && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{
                          color: '#c62828',
                          fontSize: '0.85rem',
                          marginTop: '0.75rem',
                          marginBottom: 0,
                          backgroundColor: '#ffebee',
                          padding: '0.5rem 0.75rem',
                          borderRadius: '4px',
                        }}
                      >
                        💡 Hint: Your code should include: <code style={{ backgroundColor: '#fff', padding: '0.1rem 0.3rem', borderRadius: '3px' }}>{currentStep.expectedCode}</code>
                      </motion.p>
                    )}
                  </div>
                ) : (
                  /* Non-interactive: Show read-only code display */
                  <div style={{
                    backgroundColor: '#f8f9fa',
                    borderRadius: '8px',
                    padding: '1rem',
                    marginBottom: '1rem',
                  }}>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      marginBottom: '0.75rem',
                    }}>
                      <span style={{ 
                        fontSize: '0.85rem', 
                        color: '#666',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}>
                        📍 Your Workspace
                      </span>
                    </div>
                    <VisualCanvas
                      elements={currentVisualElements}
                      highlights={currentStep?.highlights || []}
                      isAnimating={isAnimating}
                    />
                    {currentCode && (
                      <pre style={{
                        backgroundColor: '#1e1e1e',
                        color: '#d4d4d4',
                        padding: '1rem',
                        borderRadius: '8px',
                        overflow: 'auto',
                        fontSize: '0.85rem',
                        marginTop: '0.75rem',
                        fontFamily: '"Fira Code", "Consolas", monospace',
                      }}>
                        {currentCode}
                      </pre>
                    )}
                  </div>
                )}

                {/* Visual Preview for interactive steps */}
                {isInteractiveStep && (
                  <div style={{
                    backgroundColor: '#f8f9fa',
                    borderRadius: '8px',
                    padding: '1rem',
                    marginBottom: '1rem',
                  }}>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      marginBottom: '0.75rem',
                    }}>
                      <span style={{ 
                        fontSize: '0.85rem', 
                        color: '#666',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}>
                        👁️ Visual Preview
                      </span>
                    </div>
                    <VisualCanvas
                      elements={currentVisualElements}
                      highlights={currentStep?.highlights || []}
                      isAnimating={isAnimating}
                    />
                  </div>
                )}

                {/* What you'll create - Preview of next step result */}
                <div style={{
                  backgroundColor: '#e8f5e9',
                  borderRadius: '8px',
                  padding: '1rem',
                  border: '1px solid #c8e6c9',
                }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginBottom: '0.75rem',
                  }}>
                    <span style={{ 
                      fontSize: '0.85rem', 
                      color: '#2e7d32',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}>
                      ✨ After this step
                    </span>
                  </div>
                  <VisualCanvas
                    elements={nextPreview.elements}
                    highlights={[]}
                    isAnimating={false}
                  />
                  {nextPreview.code && (
                    <pre style={{
                      backgroundColor: '#1e1e1e',
                      color: '#d4d4d4',
                      padding: '1rem',
                      borderRadius: '8px',
                      overflow: 'auto',
                      fontSize: '0.85rem',
                      marginTop: '0.75rem',
                      fontFamily: '"Fira Code", "Consolas", monospace',
                    }}>
                      {nextPreview.code}
                    </pre>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        ) : (
          /* Completion State */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '3rem 2rem',
              marginBottom: '1.5rem',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
              textAlign: 'center',
            }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              style={{ fontSize: '4rem', marginBottom: '1rem' }}
            >
              🎉
            </motion.div>
            <h2 style={{ color: '#4CAF50', fontSize: '2rem', marginBottom: '0.5rem' }}>
              Exercise Complete!
            </h2>
            <p style={{ color: '#666', fontSize: '1.1rem', marginBottom: '2rem' }}>
              Great job! You've successfully completed all {totalSteps} steps.
            </p>
            
            {/* Final Result */}
            <div style={{
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              padding: '1.5rem',
              textAlign: 'left',
            }}>
              <h3 style={{ 
                margin: '0 0 1rem 0', 
                color: '#333',
                fontSize: '1.1rem',
              }}>
                🏆 Final Result
              </h3>
              <VisualCanvas
                elements={exercise.afterState.visualElements || []}
                highlights={[]}
                isAnimating={false}
                showComplete={true}
              />
              {exercise.afterState.code && (
                <pre style={{
                  backgroundColor: '#1e1e1e',
                  color: '#d4d4d4',
                  padding: '1rem',
                  borderRadius: '8px',
                  overflow: 'auto',
                  fontSize: '0.85rem',
                  marginTop: '0.75rem',
                  fontFamily: '"Fira Code", "Consolas", monospace',
                }}>
                  {exercise.afterState.code}
                </pre>
              )}
            </div>
          </motion.div>
        )}

        {/* Peek Goal Toggle - Optional preview */}
        {!showComplete && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              marginBottom: '1.5rem',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
              overflow: 'hidden',
            }}
          >
            <motion.button
              whileHover={{ backgroundColor: '#f8f9fa' }}
              onClick={() => setShowGoalPreview(!showGoalPreview)}
              style={{
                width: '100%',
                padding: '1rem 1.5rem',
                backgroundColor: 'white',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '1rem',
                color: '#666',
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                🎯 {showGoalPreview ? 'Hide' : 'Peek at'} Final Goal
              </span>
              <motion.span
                animate={{ rotate: showGoalPreview ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                ▼
              </motion.span>
            </motion.button>
            
            <AnimatePresence>
              {showGoalPreview && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{ overflow: 'hidden' }}
                >
                  <div style={{ 
                    padding: '0 1.5rem 1.5rem',
                    borderTop: '1px solid #eee',
                  }}>
                    <p style={{ 
                      color: '#888', 
                      fontSize: '0.9rem', 
                      margin: '1rem 0',
                      fontStyle: 'italic',
                    }}>
                      This is what you'll build by the end of this exercise:
                    </p>
                    <VisualCanvas
                      elements={exercise.afterState.visualElements || []}
                      highlights={[]}
                      isAnimating={false}
                    />
                    {exercise.afterState.code && (
                      <pre style={{
                        backgroundColor: '#1e1e1e',
                        color: '#d4d4d4',
                        padding: '1rem',
                        borderRadius: '8px',
                        overflow: 'auto',
                        fontSize: '0.85rem',
                        marginTop: '0.75rem',
                        fontFamily: '"Fira Code", "Consolas", monospace',
                      }}>
                        {exercise.afterState.code}
                      </pre>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Navigation Controls */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '1.5rem',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
          }}
        >
          {/* Progress Bar */}
          <div style={{
            width: '100%',
            height: '6px',
            backgroundColor: '#e0e0e0',
            borderRadius: '3px',
            overflow: 'hidden',
            marginBottom: '1.5rem',
          }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(currentStepIndex / totalSteps) * 100}%` }}
              transition={{ duration: 0.5 }}
              style={{
                height: '100%',
                backgroundColor: currentStepIndex >= totalSteps ? '#4CAF50' : '#667eea',
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
              whileHover={{ scale: currentStepIndex === 0 ? 1 : 1.05 }}
              whileTap={{ scale: currentStepIndex === 0 ? 1 : 0.95 }}
              onClick={handlePrevStep}
              disabled={currentStepIndex === 0}
              style={{
                backgroundColor: currentStepIndex === 0 ? '#e0e0e0' : 'transparent',
                color: currentStepIndex === 0 ? '#999' : '#667eea',
                border: currentStepIndex === 0 ? 'none' : '2px solid #667eea',
                padding: '0.875rem 2rem',
                borderRadius: '8px',
                fontSize: '1rem',
                cursor: currentStepIndex === 0 ? 'not-allowed' : 'pointer',
                fontWeight: '600',
              }}
            >
              ← Previous
            </motion.button>

            {/* Show different button based on whether step is interactive */}
            {isInteractiveStep ? (
              <motion.button
                whileHover={{ scale: validationState === 'correct' ? 1.05 : 1 }}
                whileTap={{ scale: validationState === 'correct' ? 0.95 : 1 }}
                onClick={handleNextStep}
                disabled={validationState !== 'correct'}
                style={{
                  backgroundColor: validationState === 'correct' ? '#4CAF50' : '#e0e0e0',
                  color: validationState === 'correct' ? 'white' : '#999',
                  border: 'none',
                  padding: '0.875rem 2rem',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  cursor: validationState === 'correct' ? 'pointer' : 'not-allowed',
                  fontWeight: '600',
                  minWidth: '160px',
                }}
              >
                {validationState === 'correct' 
                  ? (currentStepIndex >= totalSteps - 1 ? 'Complete ✓' : 'Continue →')
                  : 'Complete the task above ↑'}
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: currentStepIndex >= totalSteps ? 1 : 1.05 }}
                whileTap={{ scale: currentStepIndex >= totalSteps ? 1 : 0.95 }}
                onClick={handleNextStep}
                disabled={currentStepIndex >= totalSteps}
                style={{
                  backgroundColor: currentStepIndex >= totalSteps ? '#e0e0e0' : '#667eea',
                  color: 'white',
                  border: 'none',
                  padding: '0.875rem 2rem',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  cursor: currentStepIndex >= totalSteps ? 'not-allowed' : 'pointer',
                  fontWeight: '600',
                  minWidth: '160px',
                }}
              >
                {currentStepIndex >= totalSteps - 1 ? 'Complete ✓' : 'Next Step →'}
              </motion.button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

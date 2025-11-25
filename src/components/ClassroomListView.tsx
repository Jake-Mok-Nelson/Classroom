import { motion } from 'framer-motion';
import type { ClassRoom } from '../types';
import { useNavigate } from 'react-router-dom';

interface ClassroomListViewProps {
  classrooms: ClassRoom[];
}

export default function ClassroomListView({ classrooms }: ClassroomListViewProps) {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh',
      background: `linear-gradient(135deg, var(--color-accent-emphasis) 0%, #764ba2 100%)`,
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
        <h1 style={{
          color: 'white',
          fontSize: '3rem',
          marginBottom: '1rem',
          textAlign: 'center',
        }}>
          Digital Classrooms
        </h1>
        <p style={{
          color: 'rgba(255, 255, 255, 0.9)',
          fontSize: '1.2rem',
          marginBottom: '3rem',
          textAlign: 'center',
        }}>
          Choose a classroom to start learning
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '2rem',
        }}>
          {classrooms.map((classroom, index) => (
            <motion.div
              key={classroom.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
              onClick={() => navigate(`/classroom/${classroom.id}`)}
              style={{
                backgroundColor: 'var(--color-canvas-default)',
                borderRadius: '12px',
                padding: '2rem',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
                border: '1px solid var(--color-border-default)',
              }}
            >
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: `linear-gradient(90deg, var(--color-accent-emphasis) 0%, #764ba2 100%)`,
              }} />

              <h3 style={{
                fontSize: '1.8rem',
                marginBottom: '0.75rem',
                color: 'var(--color-fg-default)',
              }}>
                {classroom.name}
              </h3>

              <p style={{
                color: 'var(--color-fg-muted)',
                marginBottom: '1.5rem',
                lineHeight: '1.6',
                fontSize: '1rem',
              }}>
                {classroom.description}
              </p>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: '1rem',
                borderTop: '1px solid var(--color-border-muted)',
              }}>
                <span style={{
                  fontSize: '0.95rem',
                  color: 'var(--color-fg-muted)',
                }}>
                  {classroom.exercises.length} {classroom.exercises.length === 1 ? 'Exercise' : 'Exercises'}
                </span>

                <span style={{
                  fontSize: '0.95rem',
                  color: 'var(--color-accent-emphasis)',
                  fontWeight: '600',
                }}>
                  Start Learning →
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

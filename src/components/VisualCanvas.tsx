import { motion } from 'framer-motion';
import type { Highlight } from '../types';

interface VisualElement {
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  content: string;
  style?: Record<string, string>;
}

interface VisualCanvasProps {
  elements: VisualElement[];
  highlights: Highlight[];
  isAnimating: boolean;
  showComplete?: boolean;
}

export default function VisualCanvas({ 
  elements, 
  highlights, 
  isAnimating,
  showComplete = false,
}: VisualCanvasProps) {
  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '400px',
      backgroundColor: '#fafafa',
      borderRadius: '8px',
      border: '2px solid #e0e0e0',
      overflow: 'hidden',
    }}>
      {/* Visual Elements */}
      {elements.map((element, index) => (
        <motion.div
          key={element.id}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1, duration: 0.4 }}
          style={{
            position: 'absolute',
            left: `${element.x}px`,
            top: `${element.y}px`,
            width: `${element.width}px`,
            height: `${element.height}px`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: element.type === 'button' ? '14px' : '24px',
            fontWeight: '600',
            cursor: element.type === 'button' ? 'pointer' : 'default',
            ...element.style,
          }}
        >
          {element.content}
        </motion.div>
      ))}

      {/* Highlights */}
      {!isAnimating && highlights.map((highlight) => (
        <motion.div
          key={highlight.id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ 
            opacity: [0, 0.3, 0.3, 0],
            scale: [0.95, 1, 1, 1.05],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 0.5,
          }}
          style={{
            position: 'absolute',
            left: `${highlight.x}px`,
            top: `${highlight.y}px`,
            width: `${highlight.width}px`,
            height: `${highlight.height}px`,
            border: '3px solid #667eea',
            borderRadius: '8px',
            pointerEvents: 'none',
            boxShadow: '0 0 20px rgba(102, 126, 234, 0.5)',
          }}
        >
          {/* Tooltip */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{
              position: 'absolute',
              bottom: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              marginBottom: '10px',
              backgroundColor: '#667eea',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              fontSize: '0.85rem',
              whiteSpace: 'nowrap',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            }}
          >
            {highlight.description}
            {/* Arrow */}
            <div style={{
              position: 'absolute',
              top: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 0,
              height: 0,
              borderLeft: '6px solid transparent',
              borderRight: '6px solid transparent',
              borderTop: '6px solid #667eea',
            }} />
          </motion.div>
        </motion.div>
      ))}

      {/* Completion Overlay */}
      {showComplete && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            backgroundColor: 'rgba(76, 175, 80, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '8px',
          }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: 'spring',
              stiffness: 200,
              damping: 15,
              delay: 0.2,
            }}
            style={{
              backgroundColor: '#4CAF50',
              color: 'white',
              padding: '1rem 2rem',
              borderRadius: '12px',
              fontSize: '1.5rem',
              fontWeight: '600',
              boxShadow: '0 8px 24px rgba(76, 175, 80, 0.4)',
            }}
          >
            ✓ Complete
          </motion.div>
        </motion.div>
      )}

      {/* Empty State */}
      {elements.length === 0 && (
        <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#999',
          fontSize: '1.1rem',
        }}>
          Visual preview will appear here
        </div>
      )}
    </div>
  );
}

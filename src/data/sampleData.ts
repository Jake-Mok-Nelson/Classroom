import type { ClassRoom } from '../types';

export const sampleClassrooms: ClassRoom[] = [
  {
    id: 'classroom-1',
    name: 'Introduction to Web Development',
    description: 'Learn the fundamentals of HTML, CSS, and JavaScript through interactive exercises',
    exercises: [
    {
      id: 'exercise-1',
      title: 'Creating a Button',
      description: 'Learn how to create and style a simple button element',
      category: 'HTML & CSS',
      difficulty: 'beginner',
      beforeState: {
        code: '<div class="container">\n  <!-- Add button here -->\n</div>',
        visualElements: [
          {
            id: 'container-1',
            type: 'div',
            x: 50,
            y: 50,
            width: 300,
            height: 200,
            content: 'Empty Container',
            style: {
              backgroundColor: '#f0f0f0',
              border: '2px dashed #ccc',
            },
          },
        ],
      },
      afterState: {
        code: '<div class="container">\n  <button class="primary-btn">Click Me</button>\n</div>',
        visualElements: [
          {
            id: 'container-1',
            type: 'div',
            x: 50,
            y: 50,
            width: 300,
            height: 200,
            content: '',
            style: {
              backgroundColor: '#f0f0f0',
              border: '2px solid #4CAF50',
            },
          },
          {
            id: 'button-1',
            type: 'button',
            x: 125,
            y: 115,
            width: 100,
            height: 40,
            content: 'Click Me',
            style: {
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '16px',
            },
          },
        ],
      },
      steps: [
        {
          id: 'step-1',
          title: 'Open the button tag',
          description: 'First, we need to create a button element using the <button> tag',
          highlights: [
            {
              id: 'highlight-1',
              x: 85,
              y: 100,
              width: 200,
              height: 30,
              description: 'Add <button> tag here',
            },
          ],
          duration: 1000,
        },
        {
          id: 'step-2',
          title: 'Add button text',
          description: 'Add the text that will appear on the button',
          highlights: [
            {
              id: 'highlight-2',
              x: 125,
              y: 115,
              width: 100,
              height: 40,
              description: 'Button text: "Click Me"',
            },
          ],
          duration: 1000,
        },
        {
          id: 'step-3',
          title: 'Add styling class',
          description: 'Apply the "primary-btn" class for styling',
          highlights: [
            {
              id: 'highlight-3',
              x: 85,
              y: 100,
              width: 200,
              height: 30,
              description: 'class="primary-btn"',
            },
          ],
          duration: 1000,
        },
      ],
    },
    {
      id: 'exercise-2',
      title: 'Flexbox Layout',
      description: 'Learn how to use CSS Flexbox to create responsive layouts',
      category: 'CSS',
      difficulty: 'intermediate',
      beforeState: {
        visualElements: [
          {
            id: 'box-1',
            type: 'div',
            x: 50,
            y: 50,
            width: 100,
            height: 100,
            content: '1',
            style: {
              backgroundColor: '#e74c3c',
              color: 'white',
            },
          },
          {
            id: 'box-2',
            type: 'div',
            x: 50,
            y: 160,
            width: 100,
            height: 100,
            content: '2',
            style: {
              backgroundColor: '#3498db',
              color: 'white',
            },
          },
          {
            id: 'box-3',
            type: 'div',
            x: 50,
            y: 270,
            width: 100,
            height: 100,
            content: '3',
            style: {
              backgroundColor: '#2ecc71',
              color: 'white',
            },
          },
        ],
      },
      afterState: {
        visualElements: [
          {
            id: 'box-1',
            type: 'div',
            x: 50,
            y: 150,
            width: 100,
            height: 100,
            content: '1',
            style: {
              backgroundColor: '#e74c3c',
              color: 'white',
            },
          },
          {
            id: 'box-2',
            type: 'div',
            x: 170,
            y: 150,
            width: 100,
            height: 100,
            content: '2',
            style: {
              backgroundColor: '#3498db',
              color: 'white',
            },
          },
          {
            id: 'box-3',
            type: 'div',
            x: 290,
            y: 150,
            width: 100,
            height: 100,
            content: '3',
            style: {
              backgroundColor: '#2ecc71',
              color: 'white',
            },
          },
        ],
      },
      steps: [
        {
          id: 'step-1',
          title: 'Add display: flex',
          description: 'Set the container to use flexbox layout',
          highlights: [
            {
              id: 'highlight-1',
              x: 40,
              y: 40,
              width: 360,
              height: 220,
              description: 'display: flex',
            },
          ],
          duration: 1500,
        },
        {
          id: 'step-2',
          title: 'Set flex-direction',
          description: 'Change the direction from column (default) to row',
          highlights: [
            {
              id: 'highlight-2',
              x: 40,
              y: 140,
              width: 360,
              height: 120,
              description: 'flex-direction: row',
            },
          ],
          duration: 1500,
        },
      ],
    },
    {
      id: 'exercise-3',
      title: 'JavaScript Event Handling',
      description: 'Learn how to handle user interactions with JavaScript',
      category: 'JavaScript',
      difficulty: 'intermediate',
      beforeState: {
        code: 'const button = document.querySelector("button");\n// Add event listener here',
        visualElements: [
          {
            id: 'button-1',
            type: 'button',
            x: 150,
            y: 100,
            width: 120,
            height: 40,
            content: 'Click Me',
            style: {
              backgroundColor: '#9e9e9e',
              color: 'white',
            },
          },
        ],
      },
      afterState: {
        code: 'const button = document.querySelector("button");\nbutton.addEventListener("click", () => {\n  alert("Button clicked!");\n});',
        visualElements: [
          {
            id: 'button-1',
            type: 'button',
            x: 150,
            y: 100,
            width: 120,
            height: 40,
            content: 'Click Me',
            style: {
              backgroundColor: '#4CAF50',
              color: 'white',
            },
          },
        ],
      },
      steps: [
        {
          id: 'step-1',
          title: 'Add event listener',
          description: 'Use addEventListener to listen for click events',
          highlights: [
            {
              id: 'highlight-1',
              x: 150,
              y: 100,
              width: 120,
              height: 40,
              description: 'addEventListener("click", ...)',
            },
          ],
          duration: 1500,
        },
        {
          id: 'step-2',
          title: 'Add callback function',
          description: 'Define what happens when the button is clicked',
          highlights: [
            {
              id: 'highlight-2',
              x: 150,
              y: 100,
              width: 120,
              height: 40,
              description: 'Callback: () => { alert(...) }',
            },
          ],
          duration: 1500,
        },
      ],
    },
  ],
  },
  {
    id: 'classroom-2',
    name: 'Advanced CSS Techniques',
    description: 'Master CSS Grid, Animations, and Modern Layout Techniques',
    exercises: [
      {
        id: 'exercise-4',
        title: 'CSS Grid Layout',
        description: 'Learn how to create complex layouts with CSS Grid',
        category: 'CSS',
        difficulty: 'advanced',
        beforeState: {
          code: '.container {\n  /* Add grid styles here */\n}',
          visualElements: [
            {
              id: 'box-1',
              type: 'div',
              x: 50,
              y: 50,
              width: 80,
              height: 80,
              content: '1',
              style: {
                backgroundColor: '#e74c3c',
                color: 'white',
              },
            },
            {
              id: 'box-2',
              type: 'div',
              x: 150,
              y: 50,
              width: 80,
              height: 80,
              content: '2',
              style: {
                backgroundColor: '#3498db',
                color: 'white',
              },
            },
          ],
        },
        afterState: {
          code: '.container {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 20px;\n}',
          visualElements: [
            {
              id: 'box-1',
              type: 'div',
              x: 50,
              y: 100,
              width: 80,
              height: 80,
              content: '1',
              style: {
                backgroundColor: '#e74c3c',
                color: 'white',
              },
            },
            {
              id: 'box-2',
              type: 'div',
              x: 150,
              y: 100,
              width: 80,
              height: 80,
              content: '2',
              style: {
                backgroundColor: '#3498db',
                color: 'white',
              },
            },
            {
              id: 'box-3',
              type: 'div',
              x: 250,
              y: 100,
              width: 80,
              height: 80,
              content: '3',
              style: {
                backgroundColor: '#2ecc71',
                color: 'white',
              },
            },
          ],
        },
        steps: [
          {
            id: 'step-1',
            title: 'Add display: grid',
            description: 'Set the container to use CSS Grid',
            highlights: [
              {
                id: 'highlight-1',
                x: 40,
                y: 40,
                width: 300,
                height: 200,
                description: 'display: grid',
              },
            ],
            duration: 1500,
          },
        ],
      },
    ],
  },
  {
    id: 'classroom-3',
    name: 'React Fundamentals',
    description: 'Build modern web applications with React and component-based architecture',
    exercises: [
      {
        id: 'exercise-5',
        title: 'React Components',
        description: 'Learn how to create reusable React components',
        category: 'React',
        difficulty: 'intermediate',
        beforeState: {
          code: 'function App() {\n  // Create component here\n}',
          visualElements: [
            {
              id: 'placeholder',
              type: 'div',
              x: 100,
              y: 100,
              width: 200,
              height: 100,
              content: 'Empty',
              style: {
                backgroundColor: '#f0f0f0',
                border: '2px dashed #ccc',
              },
            },
          ],
        },
        afterState: {
          code: 'function App() {\n  return <h1>Hello React!</h1>;\n}',
          visualElements: [
            {
              id: 'component',
              type: 'div',
              x: 100,
              y: 100,
              width: 200,
              height: 100,
              content: 'Hello React!',
              style: {
                backgroundColor: '#61dafb',
                color: 'white',
                fontSize: '24px',
              },
            },
          ],
        },
        steps: [
          {
            id: 'step-1',
            title: 'Add JSX return',
            description: 'Return JSX from the component function',
            highlights: [
              {
                id: 'highlight-1',
                x: 100,
                y: 100,
                width: 200,
                height: 100,
                description: 'return <h1>Hello React!</h1>',
              },
            ],
            duration: 1500,
          },
        ],
      },
    ],
  },
];

// Export the first classroom for backward compatibility
export const sampleClassroom = sampleClassrooms[0];

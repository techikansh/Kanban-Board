// This is not a strict schema but a reference structure
const TodoSchema = {
  text: String,         // Title of the todo
  description: String,  // Description of the todo
  status: String,      // 'Backlog', 'Doing', or 'Done'
  userId: String,      // ID of the user who owns this todo
  projectId: String,   // ID of the project this todo belongs to
  createdAt: Date,     // Creation timestamp
  updatedAt: Date      // Last update timestamp
};

// Helper function to create a new todo
export function createTodo(data) {
  return {
    text: data.text || '',
    description: data.description || '',
    status: data.status || 'Backlog',
    userId: data.userId,
    projectId: data.projectId,
    createdAt: new Date(),
    updatedAt: new Date()
  };
}

// Helper function to validate todo
export function validateTodo(todo) {
  return (
    todo.text && 
    typeof todo.text === 'string' &&
    ['Backlog', 'Doing', 'Done'].includes(todo.status) &&
    todo.userId &&
    todo.projectId
  );
} 
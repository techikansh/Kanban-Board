const ProjectSchema = {
  title: String,
  description: String,
  dueDate: Date,
  clientPayment: Number,
  storyPoints: Number,
  userId: String,
  members: [{
    userId: String,
    email: String,
    role: String,
    addedAt: Date
  }],
  createdAt: Date,
  updatedAt: Date
};

export function createProject(data) {
  return {
    title: data.title || '',
    description: data.description || '',
    dueDate: data.dueDate ? new Date(data.dueDate) : null,
    clientPayment: data.clientPayment || 0,
    storyPoints: data.storyPoints || 0,
    userId: data.userId,
    members: [],
    createdAt: new Date(),
    updatedAt: new Date()
  };
}

export function validateProject(project) {
  return (
    project.title &&
    typeof project.title === 'string' &&
    project.userId &&
    (!project.dueDate || project.dueDate instanceof Date) &&
    (!project.clientPayment || typeof project.clientPayment === 'number') &&
    Array.isArray(project.members)
  );
} 
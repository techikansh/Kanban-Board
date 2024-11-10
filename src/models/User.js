const UserSchema = {
  email: String,
  password: String,
  createdAt: Date,
  updatedAt: Date
};

export function createUser(data) {
  return {
    email: data.email,
    password: data.password,
    createdAt: new Date(),
    updatedAt: new Date()
  };
} 
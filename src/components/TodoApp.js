"use client";
import React, { useState } from 'react';
import { PlusCircle, GripVertical, X, Edit2, Check, Trash2 } from 'lucide-react';
import EditModal from './EditModal';

const COLUMNS = {
  BACKLOG: 'Backlog',
  DOING: 'Doing',
  DONE: 'Done'
};

const TodoApp = () => {
  const [todos, setTodos] = useState([
    { 
      id: 1, 
      text: "Complete project presentation", 
      description: "Prepare slides and demo for the quarterly review",
      status: COLUMNS.BACKLOG 
    },
    { 
      id: 2, 
      text: "Review pull requests", 
      description: "Review and merge pending PRs from the team",
      status: COLUMNS.DOING 
    },
    { 
      id: 3, 
      text: "Update documentation", 
      description: "Update API documentation with new endpoints",
      status: COLUMNS.DONE 
    }
  ]);
  const [newTodo, setNewTodo] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [draggedItem, setDraggedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [newDescription, setNewDescription] = useState("");

  const addTodo = (e) => {
    e.preventDefault();
    if (newTodo.trim()) {
      const newTask = {
        id: Date.now(),
        text: newTodo.trim(),
        description: newDescription.trim(),
        status: COLUMNS.BACKLOG
      };
      setTodos(prevTodos => [...prevTodos, newTask]);
      setNewTodo("");
      setNewDescription("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      addTodo(e);
    }
  };

  const openEditModal = (todo) => {
    setEditingTodo(todo);
    setIsModalOpen(true);
  };

  const handleSaveEdit = (editedTodo) => {
    setTodos(todos.map(todo => 
      todo.id === editedTodo.id ? editedTodo : todo
    ));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const handleDragStart = (todo) => {
    setDraggedItem(todo);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (status) => {
    if (draggedItem) {
      setTodos(todos.map(todo =>
        todo.id === draggedItem.id ? { ...todo, status } : todo
      ));
      setDraggedItem(null);
    }
  };

  const TodoColumn = ({ status }) => (
    <div 
      className="flex-1 min-w-[320px] bg-background rounded-lg border border-border"
      onDragOver={handleDragOver}
      onDrop={() => handleDrop(status)}
    >
      <div className="p-3 border-b border-border">
        <div className="flex justify-between items-center">
          <h2 className="text-sm font-medium text-foreground">{status}</h2>
          <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary/10 text-primary hover:bg-primary/20">
            {todos.filter(todo => todo.status === status).length}
          </span>
        </div>
      </div>
      <div className="p-3 space-y-3">
        {todos.filter(todo => todo.status === status).map(todo => (
          <div
            key={todo.id}
            draggable
            onDragStart={() => handleDragStart(todo)}
            className="group rounded-lg border border-border bg-card p-3 text-card-foreground shadow-sm transition-all hover:shadow-md"
          >
            <div className="flex items-start gap-2">
              <GripVertical className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-col">
                    <span className="text-sm text-foreground">{todo.text}</span>
                    {todo.description && (
                      <span className="text-xs text-muted-foreground mt-1">{todo.description}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => openEditModal(todo)}
                      className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 w-8"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => deleteTodo(todo.id)}
                      className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-destructive hover:text-destructive-foreground h-8 w-8"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 rounded-lg border bg-card text-card-foreground shadow">
          <div className="flex flex-col space-y-1.5 p-6">
            <h1 className="text-2xl font-semibold text-foreground">Kanban Board</h1>
            <p className="text-sm text-muted-foreground">Organize your tasks efficiently</p>
          </div>
          <div className="p-6 border-t border-border">
            <div className="flex flex-col gap-4 max-w-md mx-auto">
              <input
                type="text"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Task title..."
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              />
              <textarea
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Task description (optional)..."
                className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring min-h-[80px]"
              />
              <button
                onClick={addTodo}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4"
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                Add Task
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-4">
          {Object.values(COLUMNS).map(status => (
            <TodoColumn key={status} status={status} />
          ))}
        </div>
      </div>
      <EditModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        todo={editingTodo}
        onSave={handleSaveEdit}
      />
    </div>
  );
};

export default TodoApp;
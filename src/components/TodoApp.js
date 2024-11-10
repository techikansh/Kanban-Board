"use client";
import React, { useState, useEffect } from "react";
import {
  PlusCircle,
  GripVertical,
  X,
  Edit2,
  Check,
  Trash2,
} from "lucide-react";
import EditModal from "./EditModal";
import CustomPieChart from "./CustomPieChart";
import { useAuth } from "@/contexts/AuthContext";

const COLUMNS = {
  BACKLOG: "Backlog",
  DOING: "Doing",
  DONE: "Done",
};

const TodoApp = ({ projectId, projectName }) => {
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [draggedItem, setDraggedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [newDescription, setNewDescription] = useState("");
  const [showChart, setShowChart] = useState(false);

  const isOwner = project?.userId === user?.id;
  const userRole = project?.members?.find(m => m.userId === user?.id)?.role;
  const canEdit = isOwner || userRole === 'editor';

  useEffect(() => {
    const fetchProjectAndTodos = async () => {
      try {
        // Fetch project details
        const projectResponse = await fetch(`/api/projects/${projectId}`);
        if (!projectResponse.ok) {
          throw new Error('Failed to fetch project');
        }
        const projectData = await projectResponse.json();
        setProject(projectData);

        // Fetch todos for this project
        const todosResponse = await fetch(`/api/todos?projectId=${projectId}`);
        const todosData = await todosResponse.json();
        
        if (!todosResponse.ok) {
          throw new Error(todosData.error || 'Failed to fetch todos');
        }
        
        setTodos(Array.isArray(todosData) ? todosData : []);
      } catch (error) {
        console.error("Error fetching data:", error);
        setTodos([]);
      }
    };

    if (projectId && user) {
      fetchProjectAndTodos();
    }
  }, [projectId, user]);

  const addTodo = async (e) => {
    e.preventDefault();
    if (newTodo.trim()) {
      const newTask = {
        text: newTodo.trim(),
        description: newDescription.trim(),
        status: COLUMNS.BACKLOG,
        projectId: projectId
      };

      const response = await fetch("/api/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTask),
      });

      const savedTodo = await response.json();
      setTodos((prevTodos) => [...prevTodos, savedTodo]);
      setNewTodo("");
      setNewDescription("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      addTodo(e);
    }
  };

  const openEditModal = (todo) => {
    setEditingTodo(todo);
    setIsModalOpen(true);
  };

  const handleSaveEdit = async (editedTodo) => {
    try {
      const response = await fetch(`/api/todos/${editedTodo._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedTodo),
      });

      if (!response.ok) {
        throw new Error('Failed to update todo');
      }

      const updatedTodo = await response.json();
      setTodos(prevTodos => 
        prevTodos.map((todo) => 
          todo._id === updatedTodo._id ? updatedTodo : todo
        )
      );
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const deleteTodo = async (id) => {
    await fetch(`/api/todos/${id}`, {
      method: "DELETE",
    });
    setTodos(todos.filter((todo) => todo._id !== id));
  };

  const handleDragStart = (todo) => {
    setDraggedItem(todo);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (status) => {
    if (draggedItem) {
      // First update local state for immediate UI feedback
      setTodos(
        todos.map((todo) =>
          todo._id === draggedItem._id ? { ...todo, status } : todo
        )
      );

      // Then persist the change to the database
      try {
        const response = await fetch(`/api/todos/${draggedItem._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...draggedItem,
            status
          }),
        });

        if (!response.ok) {
          // If the server update fails, revert the local state
          setTodos(todos);
          console.error('Failed to update todo status');
        }
      } catch (error) {
        // If there's an error, revert the local state
        setTodos(todos);
        console.error('Error updating todo status:', error);
      }

      setDraggedItem(null);
    }
  };

  const handleEdit = (todo) => {
    setEditingTodo(todo);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      await deleteTodo(id);
    }
  };

  const TodoColumn = ({ status }) => (
    <div
      className="flex-1 min-w-[300px] bg-card rounded-lg shadow-sm"
      onDragOver={(e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = canEdit ? "move" : "none";
      }}
      onDrop={(e) => {
        if (!canEdit) return;
        e.preventDefault();
        handleDrop(status);
      }}
    >
      <div className="p-4 border-b border-border">
        <h2 className="font-semibold">{status}</h2>
      </div>
      <div className="p-4 space-y-4">
        {todos
          .filter((todo) => todo.status === status)
          .map((todo) => (
            <div
              key={todo._id}
              draggable={canEdit}
              onDragStart={() => handleDragStart(todo)}
              className="bg-background rounded-lg shadow-sm p-4 cursor-move"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <p className="font-medium">{todo.text}</p>
                  {todo.description && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {todo.description}
                    </p>
                  )}
                </div>
                {canEdit && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(todo)}
                      className="p-1 hover:bg-accent rounded"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(todo._id)}
                      className="p-1 hover:bg-destructive/10 rounded text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );

  const taskDistribution = [
    {
      id: "Backlog",
      value: Array.isArray(todos)
        ? todos.filter((todo) => todo.status === COLUMNS.BACKLOG).length
        : 0,
    },
    {
      id: "Doing",
      value: Array.isArray(todos)
        ? todos.filter((todo) => todo.status === COLUMNS.DOING).length
        : 0,
    },
    {
      id: "Done",
      value: Array.isArray(todos)
        ? todos.filter((todo) => todo.status === COLUMNS.DONE).length
        : 0,
    },
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted py-8 px-4">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">
            Welcome to Kanban Board
          </h1>
          <p className="text-muted-foreground mb-4">
            Please login to manage your tasks
          </p>
          <a
            href="/auth"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none bg-primary text-primary-foreground h-9 px-4 hover:bg-primary/90"
          >
            Login to Continue
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {canEdit && (
          <div className="mb-8 rounded-lg border bg-card text-card-foreground shadow">
            <div className="flex flex-col space-y-1.5 p-6">
              <h1 className="text-2xl font-semibold text-foreground">
                Kanban Board
              </h1>
              <p className="text-sm text-muted-foreground">
                Organize your tasks efficiently
              </p>
            </div>
            <div className="p-6 border-t border-border">
              <div className="flex flex-col gap-4 max-w-md mx-auto">
                <input
                  type="text"
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addTodo(e)}
                  placeholder="Task title..."
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
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
        )}
        
        <div className="flex gap-4 overflow-x-auto pb-4">
          {Object.values(COLUMNS).map((status) => (
            <TodoColumn key={status} status={status} />
          ))}
        </div>
        
        <div className="flex items-center justify-center mt-4">
          <label className="flex items-center cursor-pointer">
            <div className="relative">
              <input
                type="checkbox"
                className="hidden"
                checked={showChart}
                onChange={() => setShowChart(!showChart)}
              />
              <div className="block bg-gray-300 w-12 h-7 rounded-full"></div>
              <div
                className={`dot absolute left-1 top-1 bg-white w-5 h-5 rounded-full transition ${
                  showChart ? "transform translate-x-full bg-blue-500" : ""
                }`}
              ></div>
            </div>
            <span className="ml-3 text-sm font-medium text-gray-700">
              {showChart ? "Hide Graph" : "Show Graph"}
            </span>
          </label>
        </div>
        {showChart && (
          <CustomPieChart data={taskDistribution} className="mt-4" />
        )}
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

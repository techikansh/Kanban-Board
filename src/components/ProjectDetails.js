"use client";
import React, { useState } from 'react';
import { Calendar, DollarSign, Hash, User, Edit2, Check, X, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function ProjectDetails({ project, onUpdate }) {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedProject, setEditedProject] = useState(project);

  const handleSave = async () => {
    try {
      const projectToUpdate = {
        ...editedProject,
        storyPoints: Number(editedProject.storyPoints),
      };

      const response = await fetch(`/api/projects/${project._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectToUpdate),
      });

      if (!response.ok) throw new Error('Failed to update project');
      
      const updatedProject = await response.json();
      onUpdate(updatedProject);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 rounded-lg border bg-card/50 backdrop-blur-sm p-6 shadow-lg">
          {isEditing ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <input
                  type="text"
                  value={editedProject.title}
                  onChange={(e) => setEditedProject({...editedProject, title: e.target.value})}
                  className="text-2xl font-bold bg-transparent border-b border-primary/20 focus:border-primary outline-none px-2 py-1 w-full"
                />
                <div className="flex gap-2">
                  <button onClick={handleSave} className="p-2 hover:bg-primary/10 rounded-full text-primary">
                    <Check className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setEditedProject(project);
                    }}
                    className="p-2 hover:bg-destructive/10 rounded-full text-destructive"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Due Date</label>
                  <input
                    type="date"
                    value={editedProject.dueDate?.split('T')[0] || ''}
                    onChange={(e) => setEditedProject({...editedProject, dueDate: e.target.value})}
                    className="w-full rounded-md border p-2"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Product Owner</label>
                  <input
                    type="text"
                    value={user?.email || ''}
                    disabled
                    className="w-full rounded-md border p-2 bg-muted"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Story Points</label>
                  <input
                    type="number"
                    value={editedProject.storyPoints}
                    onChange={(e) => setEditedProject({...editedProject, storyPoints: e.target.value})}
                    className="w-full rounded-md border p-2"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Client Payment ($)</label>
                  <input
                    type="number"
                    value={editedProject.clientPayment}
                    onChange={(e) => setEditedProject({...editedProject, clientPayment: e.target.value})}
                    className="w-full rounded-md border p-2"
                  />
                </div>
              </div>

              <textarea
                value={editedProject.description}
                onChange={(e) => setEditedProject({...editedProject, description: e.target.value})}
                className="w-full bg-transparent border rounded-md p-2 min-h-[100px]"
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <h1 className="text-2xl font-bold">{project.title}</h1>
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-2 hover:bg-primary/10 rounded-full text-primary"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <Calendar className="w-5 h-5" />
                  <span>{project.dueDate ? new Date(project.dueDate).toLocaleDateString() : 'No due date'}</span>
                </div>
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <User className="w-5 h-5" />
                  <span>{user?.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <Hash className="w-5 h-5" />
                  <span>{project.storyPoints || 0} Story Points</span>
                </div>
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <DollarSign className="w-5 h-5" />
                  <span>${project.clientPayment || 0}</span>
                </div>
              </div>

              <p className="text-muted-foreground">{project.description}</p>
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-center">
          <Link
            href={`/projects/${project._id}/board`}
            className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground py-2 px-4 text-sm font-medium transition-colors hover:bg-primary/90"
          >
            Open Board
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </div>
    </div>
  );
} 
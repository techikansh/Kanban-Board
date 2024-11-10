"use client";
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import ProjectDetails from '@/components/ProjectDetails';

export default function ProjectPage() {
  const params = useParams();
  const [project, setProject] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`/api/projects/${params.id}`);
        if (!response.ok) throw new Error('Failed to fetch project');
        const data = await response.json();
        setProject(data);
      } catch (error) {
        console.error('Error fetching project:', error);
      }
    };

    if (params.id) {
      fetchProject();
    }
  }, [params.id]);

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <ProjectDetails project={project} onUpdate={setProject} />;
} 
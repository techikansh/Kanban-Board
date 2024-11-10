"use client";
import { useParams } from 'next/navigation';
import TodoApp from '@/components/TodoApp';

export default function ProjectPage() {
  const params = useParams();
  const projectId = params.id;

  return <TodoApp projectId={projectId} />;
} 
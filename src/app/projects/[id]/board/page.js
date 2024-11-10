"use client";
import { useParams } from 'next/navigation';
import TodoApp from '@/components/TodoApp';

export default function BoardPage() {
  const params = useParams();

  return <TodoApp projectId={params.id} />;
} 
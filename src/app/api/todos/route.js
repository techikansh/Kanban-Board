import { connectToDatabase } from '@/lib/mongodb';
import { createTodo, validateTodo } from '@/models/Todo';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');

    const db = await connectToDatabase();

    // First check if user has access to the project
    const project = await db.collection('projects').findOne({
      _id: new ObjectId(projectId),
      $or: [
        { userId: session.user.id },
        { 'members.userId': session.user.id }
      ]
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found or unauthorized' }, { status: 404 });
    }

    // If user has access, fetch the todos
    const todos = await db.collection('todos')
      .find({ projectId })
      .toArray();

    return NextResponse.json(todos);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = await connectToDatabase();
    const data = await request.json();
    
    const newTodo = createTodo({ 
      ...data, 
      userId: session.user.id,
      projectId: data.projectId
    });

    if (!validateTodo(newTodo)) {
      return NextResponse.json({ error: 'Invalid todo data' }, { status: 400 });
    }

    const result = await db.collection('todos').insertOne(newTodo);
    const savedTodo = await db.collection('todos').findOne({ _id: result.insertedId });
    
    return NextResponse.json(savedTodo);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 
import { connectToDatabase } from '@/lib/mongodb';
import { createTodo, validateTodo } from '@/models/Todo';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = await connectToDatabase();
    const todos = await db.collection('todos')
      .find({ userId: session.user.id })
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
    const newTodo = createTodo({ ...data, userId: session.user.id });
    
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
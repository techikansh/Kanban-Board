import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';

export async function DELETE(request, { params }) {
  const id = params.id;
  try {
    const db = await connectToDatabase();
    await db.collection('todos').deleteOne({ _id: new ObjectId(id) });
    return NextResponse.json({ message: 'Todo deleted' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const id = params.id;
  try {
    const db = await connectToDatabase();
    const todo = await request.json();
    const { _id, ...updateData } = todo;
    
    await db.collection('todos').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
    
    const updatedTodo = await db.collection('todos').findOne({ _id: new ObjectId(id) });
    return NextResponse.json(updatedTodo);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 
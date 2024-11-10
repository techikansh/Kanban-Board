import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function DELETE(request, { params }) {
  const { id } = await params;
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = await connectToDatabase();

    // Delete the project
    await db.collection('projects').deleteOne({
      _id: new ObjectId(id),
      userId: session.user.id
    });

    // Delete associated todos
    await db.collection('todos').deleteMany({
      projectId: id
    });

    return NextResponse.json({ message: 'Project deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 
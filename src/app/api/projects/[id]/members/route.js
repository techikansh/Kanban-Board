import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../auth/[...nextauth]/route';

// Add member to project
export async function POST(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const { email, role = 'viewer' } = await request.json();

    const db = await connectToDatabase();

    // Check if project exists and user is owner
    const project = await db.collection('projects').findOne({
      _id: new ObjectId(id),
      userId: session.user.id
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found or unauthorized' }, { status: 404 });
    }

    // Find user by email
    const userToAdd = await db.collection('users').findOne({ email });
    if (!userToAdd) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if user is already a member
    if (project.members?.some(member => member.userId === userToAdd._id.toString())) {
      return NextResponse.json({ error: 'User is already a member' }, { status: 400 });
    }

    // Add member to project and return updated project
    await db.collection('projects').updateOne(
      { _id: new ObjectId(id) },
      {
        $push: {
          members: {
            userId: userToAdd._id.toString(),
            email: userToAdd.email,
            role,
            addedAt: new Date()
          }
        }
      }
    );

    // Fetch and return the updated project
    const updatedProject = await db.collection('projects').findOne({ _id: new ObjectId(id) });
    return NextResponse.json(updatedProject);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Remove member from project
export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const { searchParams } = new URL(request.url);
    const memberUserId = searchParams.get('userId');

    const db = await connectToDatabase();

    const result = await db.collection('projects').updateOne(
      { _id: new ObjectId(id), userId: session.user.id },
      { $pull: { members: { userId: memberUserId } } }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json({ error: 'Project not found or unauthorized' }, { status: 404 });
    }

    // Fetch and return the updated project
    const updatedProject = await db.collection('projects').findOne({ _id: new ObjectId(id) });
    if (!updatedProject) {
      return NextResponse.json({ error: 'Project not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json(updatedProject);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 
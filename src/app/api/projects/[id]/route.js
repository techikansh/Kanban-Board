import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function GET(request, { params }) {
  const { id } = params;
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = await connectToDatabase();
    const project = await db.collection('projects')
      .aggregate([
        {
          $match: {
            _id: new ObjectId(id),
            $or: [
              { userId: session.user.id },
              { 'members.userId': session.user.id }
            ]
          }
        },
        {
          $lookup: {
            from: 'users',
            let: { userId: '$userId' },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ['$_id', { $toObjectId: '$$userId' }] }
                }
              },
              {
                $project: { email: 1 }
              }
            ],
            as: 'owner'
          }
        },
        {
          $addFields: {
            ownerEmail: { $arrayElemAt: ['$owner.email', 0] }
          }
        },
        {
          $project: {
            owner: 0
          }
        }
      ]).next();

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

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

export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const db = await connectToDatabase();
    const updatedData = await request.json();

    // Remove _id from the update data if it exists
    const { _id, ...updateFields } = updatedData;

    const result = await db.collection('projects').findOneAndUpdate(
      { 
        _id: new ObjectId(id),
        userId: session.user.id 
      },
      { 
        $set: {
          ...updateFields,
          updatedAt: new Date()
        } 
      },
      { returnDocument: 'after' }
    );

    if (!result) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 
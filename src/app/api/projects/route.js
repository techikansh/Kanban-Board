import { connectToDatabase } from '@/lib/mongodb';
import { createProject, validateProject } from '@/models/Project';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const searchQuery = searchParams.get('search');
    const endDate = searchParams.get('endDate');

    // Build the query
    const query = {
      $or: [
        { userId: session.user.id },
        { 'members.userId': session.user.id }
      ]
    };

    // Add search filter if provided
    if (searchQuery) {
      query.$and = [{
        $or: [
          { title: { $regex: searchQuery, $options: 'i' } },
          { description: { $regex: searchQuery, $options: 'i' } }
        ]
      }];
    }

    // Add end date filter if provided
    if (endDate) {
      if (!query.$and) query.$and = [];
      const endDateTime = new Date(endDate);
      endDateTime.setHours(23, 59, 59, 999); // Set to end of day
      query.$and.push({
        dueDate: { 
          $lte: endDateTime.toISOString()
        }
      });
    }

    const db = await connectToDatabase();
    const projects = await db.collection('projects')
      .find(query)
      .toArray();

    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error in GET /api/projects:', error);
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
    console.log('Creating project with data:', data); // Debug log
    
    const newProject = createProject({ 
      ...data, 
      userId: session.user.id,
      clientPayment: Number(data.clientPayment) || 0 // Ensure clientPayment is a number
    });
    
    if (!validateProject(newProject)) {
      console.error('Project validation failed:', newProject); // Debug log
      return NextResponse.json({ error: 'Invalid project data' }, { status: 400 });
    }

    const result = await db.collection('projects').insertOne(newProject);
    console.log('Project created with ID:', result.insertedId); // Debug log
    
    const savedProject = await db.collection('projects').findOne({ _id: result.insertedId });
    return NextResponse.json(savedProject);
  } catch (error) {
    console.error('Error in POST /api/projects:', error); // Debug log
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 
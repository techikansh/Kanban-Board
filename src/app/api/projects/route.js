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

    const db = await connectToDatabase();
    console.log('Fetching projects for user:', session.user.id); // Debug log
    const projects = await db.collection('projects')
      .find({ userId: session.user.id })
      .toArray();
    console.log('Found projects:', projects); // Debug log
    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error in GET /api/projects:', error); // Debug log
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
import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/db';

export async function GET() {
  try {
    const servicesCol = await getCollection('services');
    const clientsCol = await getCollection('clients');
    const careersCol = await getCollection('careers');
    const applicantsCol = await getCollection('applicants');
    const leadsCol = await getCollection('leads');
    const blogsCol = await getCollection('blogs');

    const stats = {
      totalServices: await servicesCol.countDocuments(),
      totalClients: await clientsCol.countDocuments(),
      openPositions: await careersCol.countDocuments({ status: 'Open' }),
      totalApplicants: await applicantsCol.countDocuments(),
      newApplicants: await applicantsCol.countDocuments({ status: 'New' }),
      totalLeads: await leadsCol.countDocuments(),
      newLeads: await leadsCol.countDocuments({ status: 'New' }),
      totalBlogs: await blogsCol.countDocuments(),
      publishedBlogs: await blogsCol.countDocuments({ status: 'Published' })
    };
    return NextResponse.json(stats);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

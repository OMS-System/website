import { NextRequest, NextResponse } from 'next/server';
import { getAllObservations, createObservation } from '@/lib/db';
import { CategoryCode, SeverityLevel } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || undefined;
    const status = searchParams.get('status') || undefined;
    const severity = searchParams.get('severity') || undefined;
    const asset = searchParams.get('asset') || undefined;
    const station = searchParams.get('station') || undefined;
    const search = searchParams.get('q') || searchParams.get('search') || undefined;
    const sort = searchParams.get('sort') || 'date_desc';
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!, 10) : undefined;
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!, 10) : undefined;

    const result = getAllObservations({
      category,
      status,
      severity,
      asset,
      station,
      search,
      sort,
      limit,
      offset,
    });

    return NextResponse.json({
      success: true,
      data: result.observations,
      total: result.total,
    });
  } catch (error: any) {
    console.error('Error fetching observations:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch observations' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.category || !body.severity || !body.site || !body.description || !body.observedBy) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: category, severity, site, description, observedBy',
        },
        { status: 400 }
      );
    }

    const observation = createObservation({
      category: body.category as CategoryCode,
      severity: body.severity as SeverityLevel,
      site: body.site,
      station: body.station,
      asset: body.asset,
      description: body.description,
      observedBy: body.observedBy,
      observerEmail: body.observerEmail,
      dueDate: body.dueDate,
      locationChainage: body.locationChainage,
      photos: body.photos,
      customId: body.customId,
    });

    return NextResponse.json({
      success: true,
      data: observation,
      message: `Observation ${observation.id} logged successfully`,
    });
  } catch (error: any) {
    console.error('Error creating observation:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create observation' },
      { status: 500 }
    );
  }
}

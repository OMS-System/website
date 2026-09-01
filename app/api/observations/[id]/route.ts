import { NextRequest, NextResponse } from 'next/server';
import { getObservationById, updateObservationStatus, deleteObservation } from '@/lib/db';
import { ObservationStatus } from '@/lib/types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const observation = getObservationById(id);

    if (!observation) {
      return NextResponse.json(
        { success: false, error: `Observation with ID ${id} not found` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: observation,
    });
  } catch (error: any) {
    console.error('Error fetching observation:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch observation' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    if (!body.status || !body.byName || !body.remarks) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required update fields: status, byName, remarks',
        },
        { status: 400 }
      );
    }

    const updated = updateObservationStatus(id, {
      status: body.status as ObservationStatus,
      byName: body.byName,
      remarks: body.remarks,
      photos: body.photos,
      dueDate: body.dueDate,
    });

    if (!updated) {
      return NextResponse.json(
        { success: false, error: `Observation with ID ${id} not found` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updated,
      message: `Status updated to ${body.status}`,
    });
  } catch (error: any) {
    console.error('Error updating observation:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update observation' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deleted = deleteObservation(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: `Observation with ID ${id} not found` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Observation ${id} deleted successfully`,
    });
  } catch (error: any) {
    console.error('Error deleting observation:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete observation' },
      { status: 500 }
    );
  }
}

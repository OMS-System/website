import { NextResponse } from 'next/server';
import { resetAndSeedDatabase } from '@/lib/db';

export async function POST() {
  try {
    resetAndSeedDatabase();
    return NextResponse.json({
      success: true,
      message: 'Database successfully re-seeded with demo data',
    });
  } catch (error: any) {
    console.error('Error seeding database:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to seed database' },
      { status: 500 }
    );
  }
}

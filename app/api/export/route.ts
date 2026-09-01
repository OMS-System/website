import { NextRequest, NextResponse } from 'next/server';
import { getAllObservations } from '@/lib/db';
import { CATEGORIES, formatDate } from '@/lib/constants';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'csv';
    const category = searchParams.get('category') || undefined;
    const status = searchParams.get('status') || undefined;
    const severity = searchParams.get('severity') || undefined;
    const asset = searchParams.get('asset') || undefined;

    const result = getAllObservations({
      category,
      status,
      severity,
      asset,
      sort: 'date_desc',
    });

    if (format === 'json') {
      return new NextResponse(JSON.stringify(result.observations, null, 2), {
        headers: {
          'Content-Type': 'application/json',
          'Content-Disposition': `attachment; filename="site-observations-${new Date().toISOString().slice(0, 10)}.json"`,
        },
      });
    }

    // CSV format
    const headers = [
      'Observation ID',
      'Category Code',
      'Category Name',
      'Severity',
      'Status',
      'Site / Station',
      'Asset Subsystem',
      'Observed By',
      'Target Closure Date',
      'Created Date',
      'Latest Remarks',
    ];

    const lines = [headers.join(',')];

    for (const obs of result.observations) {
      const catLabel = CATEGORIES[obs.category]?.label || obs.category;
      const row = [
        obs.id,
        obs.category,
        catLabel,
        obs.severity,
        obs.status,
        obs.site,
        obs.asset || '',
        obs.observedBy,
        obs.dueDate || '',
        formatDate(obs.createdAt),
        obs.latestRemarks || '',
      ];

      lines.push(
        row
          .map((cell) => {
            const str = String(cell ?? '');
            return `"${str.replace(/"/g, '""')}"`;
          })
          .join(',')
      );
    }

    const csvContent = lines.join('\r\n');

    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="soms-observations-${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  } catch (error: any) {
    console.error('Error exporting observations:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to export observations' },
      { status: 500 }
    );
  }
}

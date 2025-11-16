import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma/client';

// GET /api/month?year=2025&month=11
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const yearStr = searchParams.get('year');
    const monthStr = searchParams.get('month');

    if (!yearStr || !monthStr) {
      return NextResponse.json({ error: 'Year and month parameters are required' }, { status: 400 });
    }

    const year = parseInt(yearStr);
    const month = parseInt(monthStr);

    // Get first and last day of the month
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0, 23, 59, 59);

    const days = await prisma.dayMeta.findMany({
      where: {
        date: {
          gte: firstDay,
          lte: lastDay,
        },
      },
      include: {
        struct: true,
      },
      orderBy: {
        date: 'asc',
      },
    });

    return NextResponse.json({ days });
  } catch (error) {
    console.error('Error fetching month data:', error);
    return NextResponse.json({ error: 'Failed to fetch month data' }, { status: 500 });
  }
}

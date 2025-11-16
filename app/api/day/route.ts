import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma/client';

// GET /api/day?date=2025-11-16
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const dateStr = searchParams.get('date');

    if (!dateStr) {
      return NextResponse.json({ error: 'Date parameter is required' }, { status: 400 });
    }

    const date = new Date(dateStr);

    const dayMeta = await prisma.dayMeta.findUnique({
      where: { date },
      include: { struct: true },
    });

    return NextResponse.json({ dayMeta });
  } catch (error) {
    console.error('Error fetching day data:', error);
    return NextResponse.json({ error: 'Failed to fetch day data' }, { status: 500 });
  }
}

// POST /api/day
export async function POST(request: NextRequest) {
  try {
    const { date, markdown } = await request.json();

    if (!date || !markdown) {
      return NextResponse.json({ error: 'Date and markdown are required' }, { status: 400 });
    }

    const dateObj = new Date(date);

    const dayMeta = await prisma.dayMeta.upsert({
      where: { date: dateObj },
      update: { markdown },
      create: { date: dateObj, markdown },
    });

    return NextResponse.json({ dayMeta });
  } catch (error) {
    console.error('Error saving day data:', error);
    return NextResponse.json({ error: 'Failed to save day data' }, { status: 500 });
  }
}

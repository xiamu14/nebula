import { prisma } from "@/prisma/client";
import { getDateRangeStart, getDateRangeEnd } from "@/app/utils/dateUtils";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const daysParam = searchParams.get("days") || "7";
  const days = parseInt(daysParam, 10);

  try {
    const endDate = new Date();
    const startDate = getDateRangeStart(endDate, days);
    const endDateAdjusted = getDateRangeEnd(endDate);

    const weights = await prisma.weight.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDateAdjusted,
        },
      },
      orderBy: {
        date: "asc",
      },
    });

    return Response.json(weights);
  } catch (error) {
    console.error("Failed to fetch weights:", error);
    return Response.json({ error: "Failed to fetch weights" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { date, value } = body;

    if (!date || value === undefined) {
      return Response.json(
        { error: "Missing required fields: date and value" },
        { status: 400 },
      );
    }

    const parsedDate = new Date(date);
    parsedDate.setHours(0, 0, 0, 0);

    const weight = await prisma.weight.upsert({
      where: {
        date: parsedDate,
      },
      update: {
        value: parseFloat(value),
      },
      create: {
        date: parsedDate,
        value: parseFloat(value),
      },
    });

    return Response.json(weight, { status: 201 });
  } catch (error) {
    console.error("Failed to save weight:", error);
    return Response.json({ error: "Failed to save weight" }, { status: 500 });
  }
}

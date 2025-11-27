import { prisma } from "@/prisma/client";
import { getDateRangeStart, getDateRangeEnd } from "@/app/utils/dateUtils";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const dateParam = searchParams.get("date");

  try {
    // 获取所有运动类型
    const exercises = await prisma.exercise.findMany({
      orderBy: {
        name: "asc",
      },
    });

    let exerciseRecords: any[] = [];

    // 如果指定了日期，获取该日期的运动记录
    if (dateParam) {
      const requestedDate = new Date(dateParam);
      requestedDate.setHours(0, 0, 0, 0);

      exerciseRecords = await prisma.exerciseRecord.findMany({
        where: {
          date: requestedDate,
        },
      });
    }

    return Response.json({
      exercises,
      records: exerciseRecords,
    });
  } catch (error) {
    console.error("Failed to fetch exercises:", error);
    return Response.json({ error: "Failed to fetch exercises" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { exerciseId, date, duration } = body;

    if (!exerciseId || !date || duration === undefined) {
      return Response.json(
        { error: "Missing required fields: exerciseId, date, and duration" },
        { status: 400 },
      );
    }

    const parsedDate = new Date(date);
    parsedDate.setHours(0, 0, 0, 0);

    const exerciseRecord = await prisma.exerciseRecord.upsert({
      where: {
        exerciseId_date: {
          exerciseId: exerciseId,
          date: parsedDate,
        },
      },
      update: {
        duration: parseInt(String(duration), 10),
      },
      create: {
        exerciseId: exerciseId,
        date: parsedDate,
        duration: parseInt(String(duration), 10),
      },
      include: {
        exercise: true,
      },
    });

    return Response.json(exerciseRecord, { status: 201 });
  } catch (error) {
    console.error("Failed to save exercise record:", error);
    return Response.json({ error: "Failed to save exercise record" }, { status: 500 });
  }
}

import { prisma } from "@/prisma/client";
import { normalizeDate, isValidDate } from "@/app/utils/dateUtils";
import { 
  createSuccessResponse, 
  createErrorResponse, 
  handleApiError, 
  validateRequired,
  parseIntParam
} from "@/app/utils/apiUtils";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get("date");

    // 优化：使用一次查询获取所有数据
    if (dateParam) {
      if (!isValidDate(dateParam)) {
        return createErrorResponse("Invalid date format");
      }

      const requestedDate = normalizeDate(dateParam);

      // 使用 JOIN 查询，一次获取所有数据
      const exerciseRecords = await prisma.exerciseRecord.findMany({
        where: {
          date: requestedDate,
        },
        include: {
          exercise: true,
        },
        orderBy: {
          exercise: {
            name: "asc",
          },
        },
      });

      // 获取所有运动类型（可能有些运动当天没有记录）
      const allExercises = await prisma.exercise.findMany({
        orderBy: {
          name: "asc",
        },
      });

      return createSuccessResponse({
        exercises: allExercises,
        records: exerciseRecords,
      });
    }

    // 如果没有日期参数，只返回所有运动类型
    const exercises = await prisma.exercise.findMany({
      orderBy: {
        name: "asc",
      },
    });

    return createSuccessResponse({
      exercises,
      records: [],
    });
  } catch (error) {
    return handleApiError(error, "Failed to fetch exercises");
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { exerciseId, date, duration } = body;

    validateRequired(body, ["exerciseId", "date", "duration"]);

    if (!isValidDate(date)) {
      return createErrorResponse("Invalid date format");
    }

    const parsedExerciseId = parseIntParam(String(exerciseId));
    if (!parsedExerciseId) {
      return createErrorResponse("Invalid exercise ID");
    }

    const parsedDuration = parseInt(String(duration), 10);
    if (isNaN(parsedDuration) || parsedDuration < 0) {
      return createErrorResponse("Invalid duration value");
    }

    const parsedDate = normalizeDate(date);

    // 验证运动类型是否存在
    const exerciseExists = await prisma.exercise.findUnique({
      where: { id: parsedExerciseId },
    });

    if (!exerciseExists) {
      return createErrorResponse("Exercise not found", 404);
    }

    const exerciseRecord = await prisma.exerciseRecord.upsert({
      where: {
        exerciseId_date: {
          exerciseId: parsedExerciseId,
          date: parsedDate,
        },
      },
      update: {
        duration: parsedDuration,
      },
      create: {
        exerciseId: parsedExerciseId,
        date: parsedDate,
        duration: parsedDuration,
      },
      include: {
        exercise: true,
      },
    });

    return createSuccessResponse(exerciseRecord, 201);
  } catch (error) {
    return handleApiError(error, "Failed to save exercise record");
  }
}

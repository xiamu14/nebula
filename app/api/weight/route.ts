import { prisma } from "@/prisma/client";
import { getDateRangeStart, getDateRangeEnd, normalizeDate, isValidDate } from "@/app/utils/dateUtils";
import { 
  createSuccessResponse, 
  createErrorResponse, 
  handleApiError, 
  validateRequired,
  parseIntParam,
  parseFloatParam
} from "@/app/utils/apiUtils";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const days = parseIntParam(searchParams.get("days"), 7);

    const endDate = new Date();
    const startDate = getDateRangeStart(endDate, days!);
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

    return createSuccessResponse(weights);
  } catch (error) {
    return handleApiError(error, "Failed to fetch weights");
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { date, value } = body;

    validateRequired(body, ["date", "value"]);

    if (!isValidDate(date)) {
      return createErrorResponse("Invalid date format");
    }

    const parsedValue = parseFloat(value);
    if (isNaN(parsedValue) || parsedValue <= 0) {
      return createErrorResponse("Invalid weight value");
    }

    const parsedDate = normalizeDate(date);

    const weight = await prisma.weight.upsert({
      where: {
        date: parsedDate,
      },
      update: {
        value: parsedValue,
      },
      create: {
        date: parsedDate,
        value: parsedValue,
      },
    });

    return createSuccessResponse(weight, 201);
  } catch (error) {
    return handleApiError(error, "Failed to save weight");
  }
}
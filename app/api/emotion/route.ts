import { prisma } from "@/prisma/client";
import { normalizeDate, isValidDate } from "@/app/utils/dateUtils";
import { 
  createSuccessResponse, 
  createErrorResponse, 
  handleApiError, 
  validateRequired
} from "@/app/utils/apiUtils";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get("date");

    if (!dateParam) {
      return createSuccessResponse(null);
    }

    if (!isValidDate(dateParam)) {
      return createErrorResponse("Invalid date format");
    }

    const date = normalizeDate(dateParam);

    const emotion = await prisma.emotion.findUnique({
      where: {
        date,
      },
    });

    return createSuccessResponse(emotion);
  } catch (error) {
    return handleApiError(error, "Failed to fetch emotion");
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { date, tags } = body;

    validateRequired(body, ["date", "tags"]);

    if (!isValidDate(date)) {
      return createErrorResponse("Invalid date format");
    }

    if (!Array.isArray(tags)) {
      return createErrorResponse("Tags must be an array");
    }

    const parsedDate = normalizeDate(date);

    const emotion = await prisma.emotion.upsert({
      where: {
        date: parsedDate,
      },
      update: {
        tags: tags,
      },
      create: {
        date: parsedDate,
        tags: tags,
      },
    });

    return createSuccessResponse(emotion, 201);
  } catch (error) {
    return handleApiError(error, "Failed to save emotion");
  }
}
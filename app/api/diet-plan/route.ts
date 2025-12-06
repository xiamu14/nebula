import { prisma } from "@/prisma/client";
import { normalizeDate, isValidDate } from "@/app/utils/dateUtils";
import { 
  createSuccessResponse, 
  createErrorResponse, 
  handleApiError, 
  validateRequired,
  parseIntParam,
  parseFloatParam
} from "@/app/utils/apiUtils";
import { DietCategory, DietStatus } from "@/prisma/generated/enums";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get("date");
    const category = searchParams.get("category") as DietCategory | null;

    if (!dateParam) {
      return createErrorResponse("Missing required parameter: date");
    }

    if (!isValidDate(dateParam)) {
      return createErrorResponse("Invalid date format");
    }

    const date = normalizeDate(dateParam);

    const whereClause: { date: Date; category?: DietCategory } = { date };

    if (category && Object.values(DietCategory).includes(category)) {
      whereClause.category = category;
    }

    const dietPlans = await prisma.dietPlan.findMany({
      where: whereClause,
      orderBy: {
        createdAt: "asc",
      },
    });

    return createSuccessResponse(dietPlans);
  } catch (error) {
    return handleApiError(error, "Failed to fetch diet plans");
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, amount, unit, category, date } = body;

    validateRequired(body, ["name", "amount", "unit", "category", "date"]);

    if (!isValidDate(date)) {
      return createErrorResponse("Invalid date format");
    }

    if (!Object.values(DietCategory).includes(category)) {
      return createErrorResponse("Invalid diet category");
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return createErrorResponse("Invalid amount value");
    }

    const parsedDate = normalizeDate(date);

    const dietPlan = await prisma.dietPlan.create({
      data: {
        name: String(name),
        amount: parsedAmount,
        unit: String(unit),
        category,
        date: parsedDate,
        status: DietStatus.PENDING,
      },
    });

    return createSuccessResponse(dietPlan, 201);
  } catch (error) {
    return handleApiError(error, "Failed to create diet plan");
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status } = body;

    validateRequired(body, ["id", "status"]);

    if (!Object.values(DietStatus).includes(status)) {
      return createErrorResponse("Invalid status value");
    }

    const parsedId = parseIntParam(String(id));
    if (!parsedId) {
      return createErrorResponse("Invalid ID");
    }

    const dietPlan = await prisma.dietPlan.update({
      where: {
        id: parsedId,
      },
      data: {
        status,
      },
    });

    return createSuccessResponse(dietPlan);
  } catch (error) {
    return handleApiError(error, "Failed to update diet plan");
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const idParam = searchParams.get("id");

    if (!idParam) {
      return createErrorResponse("Missing required parameter: id");
    }

    const id = parseIntParam(idParam);
    if (!id) {
      return createErrorResponse("Invalid ID");
    }

    await prisma.dietPlan.delete({
      where: {
        id,
      },
    });

    return createSuccessResponse({ deleted: true });
  } catch (error) {
    return handleApiError(error, "Failed to delete diet plan");
  }
}
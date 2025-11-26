import { prisma } from "@/prisma/client";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const dateParam = searchParams.get("date");
  const category = searchParams.get("category");

  if (!dateParam) {
    return Response.json(
      { error: "Missing required parameter: date" },
      { status: 400 },
    );
  }

  try {
    const date = new Date(dateParam);
    date.setHours(0, 0, 0, 0);

    const whereClause = {
      date: date,
    };

    if (category) {
      whereClause.category = category;
    }

    const dietPlans = await prisma.dietPlan.findMany({
      where: whereClause,
      orderBy: {
        createdAt: "asc",
      },
    });

    return Response.json(dietPlans);
  } catch (error) {
    console.error("Failed to fetch diet plans:", error);
    return Response.json(
      { error: "Failed to fetch diet plans" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, amount, unit, category, date } = body;

    if (!name || amount === undefined || !unit || !category || !date) {
      return Response.json(
        {
          error:
            "Missing required fields: name, amount, unit, category, date",
        },
        { status: 400 },
      );
    }

    const parsedDate = new Date(date);
    parsedDate.setHours(0, 0, 0, 0);

    const dietPlan = await prisma.dietPlan.create({
      data: {
        name,
        amount: parseFloat(amount),
        unit,
        category,
        date: parsedDate,
        status: "PENDING",
      },
    });

    return Response.json(dietPlan, { status: 201 });
  } catch (error) {
    console.error("Failed to create diet plan:", error);
    return Response.json(
      { error: "Failed to create diet plan" },
      { status: 500 },
    );
  }
}

export async function PATCH(request) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return Response.json(
        { error: "Missing required fields: id, status" },
        { status: 400 },
      );
    }

    if (!["PENDING", "DONE"].includes(status)) {
      return Response.json(
        { error: "Invalid status value" },
        { status: 400 },
      );
    }

    const dietPlan = await prisma.dietPlan.update({
      where: {
        id: parseInt(id, 10),
      },
      data: {
        status,
      },
    });

    return Response.json(dietPlan);
  } catch (error) {
    console.error("Failed to update diet plan:", error);
    return Response.json(
      { error: "Failed to update diet plan" },
      { status: 500 },
    );
  }
}

export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return Response.json(
      { error: "Missing required parameter: id" },
      { status: 400 },
    );
  }

  try {
    await prisma.dietPlan.delete({
      where: {
        id: parseInt(id, 10),
      },
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error("Failed to delete diet plan:", error);
    return Response.json(
      { error: "Failed to delete diet plan" },
      { status: 500 },
    );
  }
}

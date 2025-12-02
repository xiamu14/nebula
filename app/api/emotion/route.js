import { prisma } from "@/prisma/client";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const dateParam = searchParams.get("date");

  try {
    let emotion;

    if (dateParam) {
      // 获取特定日期的 emotion
      const date = new Date(dateParam);
      date.setHours(0, 0, 0, 0);

      emotion = await prisma.emotion.findUnique({
        where: {
          date: date,
        },
      });
    } else {
      // 如果没有提供日期，返回空
      emotion = null;
    }

    return Response.json(emotion);
  } catch (error) {
    console.error("Failed to fetch emotion:", error);
    return Response.json({ error: "Failed to fetch emotion" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { date, tags } = body;

    if (!date || !Array.isArray(tags)) {
      return Response.json(
        { error: "Missing required fields: date and tags (array)" },
        { status: 400 },
      );
    }

    const parsedDate = new Date(date);
    parsedDate.setHours(0, 0, 0, 0);

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

    return Response.json(emotion, { status: 201 });
  } catch (error) {
    console.error("Failed to save emotion:", error);
    return Response.json({ error: "Failed to save emotion" }, { status: 500 });
  }
}

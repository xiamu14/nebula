import { prisma } from "@/prisma/client";

export async function DELETE(request, { params }) {
  try {
    const { searchParams } = new URL(request.url);
    const tag = searchParams.get("tag");

    if (!tag) {
      return Response.json(
        { error: "Missing required parameter: tag" },
        { status: 400 },
      );
    }

    // 在 Next.js 14+ 中，params 是一个 Promise
    const { date: dateParam } = await params;
    const date = new Date(dateParam);
    date.setHours(0, 0, 0, 0);

    // 获取当前的 emotion 记录
    const emotion = await prisma.emotion.findUnique({
      where: {
        date: date,
      },
    });

    if (!emotion) {
      return Response.json({ error: "Emotion record not found" }, { status: 404 });
    }

    // 从 tags 数组中移除指定的 tag
    const currentTags = Array.isArray(emotion.tags) ? emotion.tags : [];
    const updatedTags = currentTags.filter((t) => t.name !== tag);

    // 如果移除后没有 tags，删除整个记录
    if (updatedTags.length === 0) {
      await prisma.emotion.delete({
        where: {
          date: date,
        },
      });
      return Response.json({ success: true });
    }

    // 更新记录
    const updatedEmotion = await prisma.emotion.update({
      where: {
        date: date,
      },
      data: {
        tags: updatedTags,
      },
    });

    return Response.json(updatedEmotion);
  } catch (error) {
    console.error("Failed to delete emotion tag:", error);
    return Response.json({ error: "Failed to delete emotion tag" }, { status: 500 });
  }
}

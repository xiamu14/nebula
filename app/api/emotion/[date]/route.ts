import { prisma } from "@/prisma/client";
import { normalizeDate, isValidDate } from "@/app/utils/dateUtils";
import {
  createSuccessResponse,
  createErrorResponse,
  handleApiError
} from "@/app/utils/apiUtils";
import type { Prisma } from "@prisma/client";
import type { InputJsonValue } from "@prisma/client/runtime/library";

type EmotionTag = {
  name: string;
  [key: string]: unknown;
};

export async function DELETE(
  request: Request, 
  { params }: { params: Promise<{ date: string }> }
) {
  try {
    const { searchParams } = new URL(request.url);
    const tag = searchParams.get("tag");

    if (!tag) {
      return createErrorResponse("Missing required parameter: tag");
    }

    const { date: dateParam } = await params;
    
    if (!isValidDate(dateParam)) {
      return createErrorResponse("Invalid date format");
    }

    const date = normalizeDate(dateParam);

    // 获取当前的 emotion 记录
    const emotion = await prisma.emotion.findUnique({
      where: {
        date,
      },
    });

    if (!emotion) {
      return createErrorResponse("Emotion record not found", 404);
    }

    // 从 tags 数组中移除指定的 tag
    const currentTags = Array.isArray(emotion.tags) ? emotion.tags as EmotionTag[] : [];
    const updatedTags = currentTags.filter((t: EmotionTag) => t.name !== tag);

    // 如果移除后没有 tags，删除整个记录
    if (updatedTags.length === 0) {
      await prisma.emotion.delete({
        where: {
          date,
        },
      });
      return createSuccessResponse({ deleted: true });
    }

    // 更新记录
    const updatedEmotion = await prisma.emotion.update({
      where: {
        date,
      },
      data: {
        tags: updatedTags as unknown as InputJsonValue,
      },
    });

    return createSuccessResponse(updatedEmotion);
  } catch (error) {
    return handleApiError(error, "Failed to delete emotion tag");
  }
}
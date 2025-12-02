"use client";
import { useState } from "react";
import { useSnapshot } from "valtio";
import { Button, Card, Chip, Popover } from "@heroui/react";
import { Icon } from "@iconify/react";
import { currentDateState } from "@/app/store/global.state";
import {
  useEmotionData,
  DEFAULT_EMOTIONS,
  EmotionTag,
  addEmotionTag,
  deleteEmotionTag,
} from "@/app/hooks/useEmotionData";

// 根据颜色值映射到 HeroUI 的 Chip color 属性
function getChipColor(color: EmotionTag["color"]) {
  const colorMap = {
    default: "default",
    success: "success",
    warning: "warning",
    danger: "danger",
  } as const;
  return colorMap[color];
}

export default function EmotionCard() {
  const currentDate = useSnapshot(currentDateState);
  const { data, setData } = useEmotionData();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 处理删除情绪标签
  const handleDeleteTag = async (tagName: string) => {
    try {
      setIsSubmitting(true);
      await deleteEmotionTag(currentDate.day.toDate(), tagName);

      // 乐观更新本地数据
      if (data) {
        const updatedTags = data.tags.filter((tag) => tag.name !== tagName);
        if (updatedTags.length === 0) {
          setData(null);
        } else {
          setData({
            ...data,
            tags: updatedTags,
          });
        }
      }
    } catch (error) {
      console.error("Failed to delete emotion tag:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 处理添加新情绪
  const handleAddEmotion = async (tag: EmotionTag) => {
    try {
      setIsSubmitting(true);
      const updatedRecord = await addEmotionTag(currentDate.day.toDate(), tag);

      // 乐观更新本地数据
      if (data) {
        setData({
          ...data,
          tags: [...data.tags, tag],
        });
      } else {
        setData({
          id: updatedRecord.id,
          date: updatedRecord.date,
          tags: [tag],
        });
      }
    } catch (error) {
      console.error("Failed to add emotion tag:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentTags = data?.tags || [];

  return (
    <Card className="h-full w-full">
      <Card.Header>
        <Card.Title>Emotion</Card.Title>
      </Card.Header>
      <Card.Content className="flex flex-row flex-wrap items-start justify-start gap-2">
        {currentTags.map((tag) => (
          <Chip
            key={tag.name}
            color={getChipColor(tag.color)}
            variant="primary"
          >
            <Icon icon="gravity-ui:circle-fill" width={6} />
            {tag.name}
            <Icon
              icon="gravity-ui:circle-minus"
              width={12}
              className="cursor-pointer"
              onClick={() => handleDeleteTag(tag.name)}
            />
          </Chip>
        ))}

        <Popover>
          <Popover.Trigger>
            <Chip className="cursor-pointer">
              <Icon icon="gravity-ui:circle-dashed" width={12} />
              New
            </Chip>
          </Popover.Trigger>
          <Popover.Content className="max-w-200">
            <Popover.Dialog>
              <Popover.Heading>Update Emotion</Popover.Heading>
              <div className="flex flex-col items-start justify-start gap-4 py-4">
                <div className="flex flex-wrap gap-2">
                  {DEFAULT_EMOTIONS.map((emotion) => (
                    <Chip
                      key={emotion.name}
                      className="cursor-pointer"
                      color={getChipColor(emotion.color)}
                      variant={
                        currentTags.some((t) => t.name === emotion.name)
                          ? "primary"
                          : "soft"
                      }
                      onClick={() => handleAddEmotion(emotion)}
                    >
                      {emotion.name}
                    </Chip>
                  ))}
                </div>
              </div>
            </Popover.Dialog>
          </Popover.Content>
        </Popover>
      </Card.Content>
    </Card>
  );
}

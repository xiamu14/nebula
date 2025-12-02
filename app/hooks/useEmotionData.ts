import { useEffect, useState } from "react";
import { currentDateState } from "../store/global.state";
import dayjs from "dayjs";
import { useSnapshot } from "valtio";

export interface EmotionTag {
  name: string;
  color: "default" | "success" | "warning" | "danger";
}

export interface EmotionRecord {
  id: number;
  date: string;
  tags: EmotionTag[];
}

// 默认情绪配置
export const DEFAULT_EMOTIONS: EmotionTag[] = [
  { name: "Calm", color: "default" },
  { name: "Joyful", color: "success" },
  { name: "Sad", color: "danger" },
  { name: "Positive", color: "warning" },
];

// 获取情绪数据的 API 调用
async function fetchEmotionData(date: Date) {
  const dateStr = dayjs(date).format("YYYY-MM-DD");
  const response = await fetch(`/api/emotion?date=${dateStr}`);
  if (!response.ok) {
    throw new Error("Failed to fetch emotion data");
  }
  return response.json();
}

// 使用 hook 加载情绪数据
export function useEmotionData() {
  const currentDate = useSnapshot(currentDateState);
  const [data, setData] = useState<EmotionRecord | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const emotion = await fetchEmotionData(currentDate.day.toDate());

        if (emotion) {
          setData(emotion);
        } else {
          setData(null);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
        console.error("Error loading emotion data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [currentDate.day]);

  return { data, isLoading, error, setData };
}

// 添加情绪标签
export async function addEmotionTag(date: Date, tag: EmotionTag) {
  const dateStr = dayjs(date).format("YYYY-MM-DD");

  // 先获取当前记录
  const currentResponse = await fetch(`/api/emotion?date=${dateStr}`);
  const currentEmotion = currentResponse.ok ? await currentResponse.json() : null;

  let currentTags: EmotionTag[] = [];
  if (currentEmotion && currentEmotion.tags) {
    currentTags = Array.isArray(currentEmotion.tags) ? currentEmotion.tags : [];
  }

  // 检查 tag 是否已存在
  if (currentTags.some((t) => t.name === tag.name)) {
    throw new Error("Tag already exists");
  }

  const updatedTags = [...currentTags, tag];

  const response = await fetch("/api/emotion", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      date: dateStr,
      tags: updatedTags,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to save emotion tag");
  }

  return response.json();
}

// 删除情绪标签
export async function deleteEmotionTag(date: Date, tagName: string) {
  const dateStr = dayjs(date).format("YYYY-MM-DD");

  const response = await fetch(`/api/emotion/${dateStr}?tag=${encodeURIComponent(tagName)}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete emotion tag");
  }

  return response.json();
}

import { useEffect, useState } from "react";
import { currentDateState } from "../store/global.state";

export interface Exercise {
  id: number;
  name: string;
}

export interface ExerciseRecord {
  id: number;
  exerciseId: number;
  date: string;
  duration: number;
  exercise?: Exercise;
}

export interface ExerciseData {
  exercises: Exercise[];
  records: ExerciseRecord[];
  durations: { [exerciseId: number]: number };
}

// 获取运动数据的 API 调用
async function fetchExerciseData(date?: string) {
  const url = date ? `/api/exercise?date=${date}` : "/api/exercise";
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch exercise data");
  }
  return response.json();
}

// 使用 hook 加载运动数据
export function useExerciseData(date: string) {
  const [data, setData] = useState<ExerciseData>({
    exercises: [],
    records: [],
    durations: {},
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const rawData = await fetchExerciseData(date);

        // 创建运动时长映射
        const durations: { [exerciseId: number]: number } = {};
        rawData.records.forEach((record: ExerciseRecord) => {
          durations[record.exerciseId] = record.duration;
        });

        setData({
          exercises: rawData.exercises,
          records: rawData.records,
          durations,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
        console.error("Error loading exercise data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [date]);

  return { data, isLoading, error, setData };
}

// 保存单个运动记录
export async function saveExerciseRecord(
  exerciseId: number,
  date: Date,
  duration: number,
) {
  const response = await fetch("/api/exercise", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      exerciseId,
      date: date.toISOString(),
      duration,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to save exercise record");
  }

  return response.json();
}

// 根据日期获取运动时长
export function getDurationForDate(
  durations: { [exerciseId: number]: number },
  exerciseId: number,
): number {
  return durations[exerciseId] || 0;
}

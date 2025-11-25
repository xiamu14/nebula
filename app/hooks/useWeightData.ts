import { useEffect, useState } from "react";
import { transformWeightDataForChart } from "@/app/utils/weightUtils";

// 获取权重数据的 API 调用
async function fetchWeightData(days = 7) {
  const response = await fetch(`/api/weight?days=${days}`);
  if (!response.ok) {
    throw new Error("Failed to fetch weight data");
  }
  return response.json();
}

// 使用 hook 加载图表数据 (本地状态)
export function useWeightChartData(days = 7) {
  const [data, setData] = useState<{ date: string; weight: number }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const rawData = await fetchWeightData(days);
        const chartData = transformWeightDataForChart(rawData);

        setData(chartData);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
        console.error("Error loading weight data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [days]);

  return { data, isLoading, error, setData };
}

// 保存单个权重记录
export async function saveWeight(date: Date, value: number) {
  const response = await fetch("/api/weight", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      date: date.toISOString(),
      value: value,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to save weight");
  }

  return response.json();
}

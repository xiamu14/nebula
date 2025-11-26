import { useEffect, useState } from "react";
import {
  DietPlan,
  DietPlanFormData,
  formatDateForAPI,
  DietCategory,
} from "@/app/utils/dietPlanUtils";

// 获取饮食计划数据的 API 调用
async function fetchDietPlanData(date: Date, category?: DietCategory) {
  const dateStr = formatDateForAPI(date);
  const params = new URLSearchParams({ date: dateStr });

  if (category) {
    params.append("category", category);
  }

  const response = await fetch(`/api/diet-plan?${params.toString()}`);
  if (!response.ok) {
    throw new Error("Failed to fetch diet plan data");
  }
  return response.json();
}

// 使用 hook 加载指定日期的饮食计划数据
export function useDietPlanData(date: Date, category?: DietCategory) {
  const [data, setData] = useState<DietPlan[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const dietPlans = await fetchDietPlanData(date, category);
      setData(dietPlans);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      console.error("Error loading diet plan data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [date, category]);

  return { data, isLoading, error, refetch: loadData };
}

// 创建新的饮食计划项
export async function createDietPlan(
  formData: DietPlanFormData,
  date: Date,
): Promise<DietPlan> {
  const response = await fetch("/api/diet-plan", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...formData,
      date: date.toISOString(),
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to create diet plan");
  }

  return response.json();
}

// 更新饮食计划状态
export async function updateDietPlanStatus(
  id: number,
  status: "PENDING" | "DONE",
): Promise<DietPlan> {
  const response = await fetch("/api/diet-plan", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id,
      status,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to update diet plan status");
  }

  return response.json();
}

// 删除饮食计划项
export async function deleteDietPlan(id: number): Promise<void> {
  const response = await fetch(`/api/diet-plan?id=${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete diet plan");
  }
}

import dayjs from "dayjs";

export type DietCategory = "BREAKFAST" | "LUNCH" | "DINNER" | "FRUIT";
export type DietStatus = "PENDING" | "DONE";

export interface DietPlan {
  id: number;
  name: string;
  amount: number;
  unit: string;
  category: DietCategory;
  status: DietStatus;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface DietPlanFormData {
  name: string;
  amount: number;
  unit: string;
  category: DietCategory;
}

// 验证饮食计划表单数据
export function validateDietPlanForm(data: DietPlanFormData): string[] {
  const errors: string[] = [];

  if (!data.name || data.name.trim().length === 0) {
    errors.push("Food name is required");
  }

  if (data.amount === undefined || data.amount < 0) {
    errors.push("Amount must be a positive number");
  }

  if (data.amount > 9999.99) {
    errors.push("Amount must not exceed 9999.99");
  }

  if (!data.unit || !["g", "ml"].includes(data.unit)) {
    errors.push("Unit must be either 'g' or 'ml'");
  }

  if (
    !data.category ||
    !["BREAKFAST", "LUNCH", "DINNER", "FRUIT"].includes(data.category)
  ) {
    errors.push("Category must be one of: BREAKFAST, LUNCH, DINNER, FRUIT");
  }

  return errors;
}

// 获取分类显示文本
export function getCategoryLabel(category: DietCategory): string {
  const labels = {
    BREAKFAST: "Breakfast",
    LUNCH: "Lunch",
    DINNER: "Dinner",
    FRUIT: "Fruit",
  };
  return labels[category];
}

// 获取分类对应的 Tab ID
export function getCategoryTabId(category: DietCategory): string {
  const tabIds = {
    BREAKFAST: "overview",
    LUNCH: "analytics",
    DINNER: "reports",
    FRUIT: "fruit",
  };
  return tabIds[category];
}

// 从 Tab ID 获取分类
export const categories = {
  breakfastPlans: "BREAKFAST" as DietCategory,
  lunchPlans: "LUNCH" as DietCategory,
  dinnerPlans: "DINNER" as DietCategory,
  fruitPlans: "FRUIT" as DietCategory,
};

export type TabKey = keyof typeof categories;

export function getCategoryFromTabId(tabId: TabKey): DietCategory | null {
  return categories[tabId] || null;
}

// 格式化日期为 YYYY-MM-DD
export function formatDateForAPI(date: Date): string {
  return dayjs(date).format("YYYY-MM-DD");
}

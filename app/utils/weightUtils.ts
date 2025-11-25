import { formatDate } from "./dateUtils";

// 将权重数据转换为 LineChart 可用的格式
export function transformWeightDataForChart(
  weights: { date: string; value: number }[],
) {
  return weights.map((weight) => ({
    weight: Number(weight.value),
    date: formatDate(new Date(weight.date)),
  }));
}

// 验证权重值是否有效
export function isValidWeight(value: string) {
  const num = parseFloat(value);
  return !isNaN(num) && num > 0 && num < 300;
}

import dayjs from "dayjs";

// 排序数据点 (使用 dayjs 解析 MM.DD 格式)
export function sortChartData(data: { date: string; weight: number }[]) {
  const currentYear = dayjs().year();

  return data.sort((a, b) => {
    const dateA = dayjs(`${currentYear}-${a.date}`, "YYYY-MM.DD");
    const dateB = dayjs(`${currentYear}-${b.date}`, "YYYY-MM.DD");
    return dateA.valueOf() - dateB.valueOf();
  });
}

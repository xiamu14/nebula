import dayjs from "dayjs";

// 格式化日期为 MM.DD 格式 (使用 dayjs)
export function formatDate(date: Date) {
  return dayjs(date).format("MM.DD");
}

// 获取指定日期范围的开始时间 (使用 dayjs)
export function getDateRangeStart(endDate: string, days: number) {
  return dayjs(endDate)
    .subtract(days - 1, "day")
    .startOf("day")
    .toDate();
}

// 获取指定日期范围的结束时间 (使用 dayjs)
export function getDateRangeEnd(endDate: string) {
  return dayjs(endDate).endOf("day").toDate();
}

import dayjs from "dayjs";

/**
 * 格式化日期为 MM.DD 格式 (使用 dayjs)
 */
export function formatDate(date: Date | string): string {
  return dayjs(date).format("MM.DD");
}

/**
 * 获取指定日期范围的开始时间 (使用 dayjs)
 */
export function getDateRangeStart(endDate: Date | string, days: number): Date {
  return dayjs(endDate)
    .subtract(days - 1, "day")
    .startOf("day")
    .toDate();
}

/**
 * 获取指定日期范围的结束时间 (使用 dayjs)
 */
export function getDateRangeEnd(endDate: Date | string): Date {
  return dayjs(endDate).endOf("day").toDate();
}

/**
 * 规范化日期 - 设置为当天的 00:00:00
 * 统一的日期处理函数，避免在 API 中重复代码
 */
export function normalizeDate(dateInput: Date | string): Date {
  const date = new Date(dateInput);
  date.setHours(0, 0, 0, 0);
  return date;
}

/**
 * 验证日期是否有效
 */
export function isValidDate(date: Date | string): boolean {
  const d = new Date(date);
  return d instanceof Date && !isNaN(d.getTime());
}

// 验证运动时长
export function isValidDuration(value: string): boolean {
  const num = parseInt(value, 10);
  return !isNaN(num) && num >= 0 && num <= 1440; // 最大 24 小时
}

// 格式化运动时长显示
export function formatDuration(minutes: number): string {
  if (minutes === 0) return "0 mins";
  if (minutes < 60) return `${minutes} mins`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

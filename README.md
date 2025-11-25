这个项目是记录每天饮食计划，体重变化，运动量，情绪标签，日志的网站。
当前任务：

1. 建立 weight 表，按照日期保存，单位 kg
2. 更新 app/components 里 WeightCard.tsx 里 LineChart data 数据，按照currentDateState 往前7天，包含 currentDateState 。
3. 更新 app/components/WeightCard.tsx form 表单更新 currentDateState 的 weight 值。同时乐观刷新 LineChart。

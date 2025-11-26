这个项目是记录每天饮食计划，体重变化，运动量，情绪标签，日志的网站。

### 当前任务：

1. 建立 diet plan 表，一个 TODO list, 有 status 状态, pending, done 等，默认pending。 包含食物 name、 份量，单位 k 或 ml、分类 category 只有 breakfast, lunch，dinner, fruit。日期 date。 实现增删改查 api ，用于 app/components/CateringPlanCard.tsx 中。

2. 完成 CateringPlanCard.tsx 里根据currentDateState 查询日期对应所有的Diet plan ，按照 category ，显示到不同 Tab 中。

3. check 更新 status 状态为 done。

4. 删除的 UI 在 tab launch 里有实现。

5. new 按钮实现增加 currentDateState 日期时，active tab 对应的 category 下的 diet 项。

### 已完成任务

WeightCard.tsx 已完成，不要变动，可以参考代码。

### 代码实现规范：

1. 使用 typescript ，不可以使用 any
2. 日期相关处理使用 dayjs 库
3. 使用已安装的库，不要造轮子
4. 将唯一且独立的代码封装到函数，尽量抽象代码到唯一且独立
5. 如无必要，不增实体
6. 不是全局的 state， 不使用 valtio 同步
7. react 里禁止使用 context，尽量避免不必要的 re-render

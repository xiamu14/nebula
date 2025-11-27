这个项目是记录每天饮食计划，体重变化，运动量，情绪标签，日志的网站。

### 当前任务：

1. 为 ExerciseCard 组件增加 exercise 表，数据结构是每日运动项目的运动量，默认运动（可能调整，数据库里要动态， 只包含 name）包含 Rope Skipping , warm up , hiit ，运动量单位是运动的时长。
2. 完成 ExerciseCard 组件里 展示 currentDateState 日期对应的运动项目和运动时长，当没有更新运动时长，默认为 0 。
3. 点击 ExerciseCard 里的 Update ， 弹出更新运动量的 Modal 组件，可以分别更新默认运动时长。

### 已完成任务

WeightCard.tsx 已完成，不要变动。
CateringPlanCard.tsx 已完成，不要变动

### 代码实现规范：

1. 使用 typescript ，不可以使用 any
2. 日期相关处理使用 dayjs 库
3. 使用已安装的库，不要造轮子
4. 将唯一且独立的代码封装到函数，尽量抽象代码到唯一且独立
5. 如无必要，不增实体
6. 不是全局的 state， 不使用 valtio 同步
7. react 里禁止使用 context，尽量避免不必要的 re-render

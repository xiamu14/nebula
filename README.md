这个项目是记录每天饮食计划，体重变化，运动量，情绪标签，日志的网站。

### 当前任务：

1. 为 EmotionCard 组件增加 emotions 表，数据结构是每日的情绪 tags, 每日一个记录，tags 保存数组即可。
2. 完成 EmotionCard 组件里 展示 currentDateState 时所有的 tag，点击 emotion tag 后的 gravity-ui:circle-minus 按钮删除 。
3. 点击 EmotionCard 里的 Clip 内容为 new 的添加， 默认 4 中情绪： 平静 ，喜悦, 沮丧， 积极， 分别对应 clip 的 default , success, danger, warning.
4. 完成 EmotionCard 里的 todo 任务

### 已完成任务

WeightCard.tsx 已完成，不要变动。
CateringPlanCard.tsx 已完成，不要变动。
ExerciseCard.tsx 已完成，不要变动。

### 代码实现规范：

1. 使用 typescript ，不可以使用 any
2. 日期相关处理使用 dayjs 库
3. 使用已安装的库，不要造轮子
4. 将唯一且独立的代码封装到函数，尽量抽象代码到唯一且独立
5. 如无必要，不增实体
6. 不是全局的 state， 不使用 valtio 同步
7. react 里禁止使用 context，尽量避免不必要的 re-render

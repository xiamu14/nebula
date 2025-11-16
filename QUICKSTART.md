# Nebula 快速入门指南

## 前置要求

- Bun (推荐) 或 Node.js 18+
- PostgreSQL 数据库
- OpenRouter API 密钥 (用于 AI 分析)

## 5 分钟快速启动

### 1. 克隆并安装依赖

```bash
cd nebula
bun install
```

### 2. 配置环境变量

```bash
cp .env.example .env
```

编辑 `.env` 文件:

```env
# 数据库连接
DATABASE_URL="postgresql://user:password@localhost:5432/nebula?schema=public"

# OpenRouter API 密钥
OPENROUTER_API_KEY="sk-or-v1-xxxxx"
```

**获取 OpenRouter API 密钥**:
1. 访问 https://openrouter.ai/
2. 注册账号
3. 在 Keys 页面创建 API 密钥
4. 复制密钥到 `.env` 文件

### 3. 初始化数据库

```bash
# 推送 schema 到数据库
bunx prisma db push --schema=lib/prisma/schemas/schema.prisma

# (可选) 查看数据库
bunx prisma studio --schema=lib/prisma/schemas/schema.prisma
```

### 4. 启动开发服务器

```bash
bun run dev
```

访问 http://localhost:3000

## 首次使用

### 创建第一条记录

1. 在月视图中点击今天的日期
2. 会弹出编辑器 Modal,包含模板内容
3. 编辑内容:

```markdown
## Meals
### Breakfast
- [x] 鸡蛋
- [x] 牛奶
- [ ] 面包

### Lunch
- [x] 米饭
- [x] 青菜
- [x] 鸡肉

### Dinner
- [ ] 粥

### Drinks
- [x] 咖啡
- [x] 茶

### Snacks
- [ ] 坚果

---

## Exercise

| 完成 | 名称 | 时长(min) | 卡路里 | 感受 |
|:----:|:----:|:---------:|:------:|:----:|
|  ✅  | 跑步 |    30     |  250   | 很好 |
|  ✅  | 瑜伽 |    20     |  100   | 放松 |

---

## Notes

今天完成了两项运动,感觉很棒!饮食也很健康。

明天计划:
- 早起跑步
- 准备工作汇报

---

## Mood
- 平静: 0.7
- 愉悦: 0.8
- 压力: 0.2
```

4. 点击 "Save" 按钮
5. 等待几秒,AI 会自动分析内容
6. Modal 自动关闭
7. 观察日期格子的变化:
   - 边框颜色变绿 (高充实度)
   - 背景颜色变黄 (愉悦心情占主导)
   - 底部进度条显示完成度

## 理解月视图

### 边框颜色 (充实度)
- **深绿色**: 80%+ (非常充实)
- **绿色**: 60%+ (充实)
- **黄色**: 40%+ (一般)
- **橙色**: 20%+ (较少)
- **红色**: <20% (很少)
- **灰色**: 无数据

### 背景颜色 (主要心情)
- **蓝色**: 平静
- **黄色**: 愉悦
- **绿色**: 开心/快乐
- **灰色**: 沮丧
- **红色**: 压力
- **橙色**: 焦虑

### 进度条
底部小进度条显示整体完成度 (0-100%)

## Markdown 格式说明

### Meals (餐饮)
使用 checkbox 格式:
- `- [ ]` 表示未完成
- `- [x]` 表示已完成

### Exercise (运动)
使用表格格式:
- 完成列: `✅` 表示完成,空格表示未完成
- 名称: 运动项目名称
- 时长: 分钟数
- 卡路里: 消耗的卡路里
- 感受: 一句话描述

### Notes (笔记)
自由格式,支持:
- **加粗**
- *斜体*
- 列表
- 图片
- 链接

### Mood (心情)
格式: `- 心情名称: 数值`
- 数值范围: 0.0 - 1.0
- 可以自定义心情名称

## 常见问题

### Q: AI 分析失败怎么办?
A: 检查:
1. `.env` 中的 `OPENROUTER_API_KEY` 是否正确
2. 网络连接是否正常
3. OpenRouter 账户是否有余额
4. 查看浏览器控制台和终端日志

### Q: 如何查看原始 Markdown?
A:
1. 使用 Prisma Studio: `bunx prisma studio --schema=lib/prisma/schemas/schema.prisma`
2. 在 DayMeta 表中查看 markdown 字段

### Q: 能否导出数据?
A: 当前版本暂不支持,但 Markdown 内容存储在数据库中,可以通过 Prisma Studio 或 SQL 查询导出

### Q: 支持移动端吗?
A: 当前版本针对桌面优化,移动端可以使用但体验可能不完美

## 下一步

- 尝试连续记录几天
- 观察月视图的变化趋势
- 调整 Markdown 模板适合你的需求
- 自定义心情类别

## 获取帮助

- 查看 `README.md` 了解详细文档
- 查看 `Todos/readme.md` 了解项目设计思路
- 查看 `Todos/implementation-summary.md` 了解实现细节

祝你使用愉快! 🎉

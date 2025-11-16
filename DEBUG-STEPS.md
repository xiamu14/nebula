# Next.js Fetch 卡住问题诊断

## 🔍 问题现象

在 Next.js API 路由中调用 OpenRouter API 时卡住:
- ✅ `test-openrouter.js` (Node.js) 可以成功调用
- ❌ Next.js API 路由卡住,没有响应

## 📋 诊断步骤

### 步骤 1: 测试 Next.js 的 fetch 功能

访问测试端点:
```bash
# 在浏览器打开
http://localhost:3000/api/test-fetch

# 或者用 curl
curl http://localhost:3000/api/test-fetch
```

观察开发服务器的日志,查找:
```
[Test Fetch] Starting test...
[Test Fetch] Test 1: Testing basic fetch to httpbin.org...
[Test Fetch] Test 1 completed in XXX ms
[Test Fetch] Test 2: Testing OpenRouter API access...
[Test Fetch] Test 2 completed in XXX ms
[Test Fetch] Test 3: Testing simple chat completion...
[Test Fetch] Test 3 completed in XXX ms
```

### 步骤 2: 分析结果

#### 情况 A: Test 1 失败 (httpbin.org)
**问题**: Next.js 的 fetch 完全不工作
**解决方案**: 检查 Next.js 版本和配置

#### 情况 B: Test 1 成功,Test 2/3 失败
**问题**: 无法访问 OpenRouter API
**可能原因**:
1. 网络限制/防火墙
2. API Key 问题
3. DNS 解析问题

#### 情况 C: Test 2 成功,Test 3 超时
**问题**: POST 请求超时
**可能原因**: OpenRouter 服务器响应慢

#### 情况 D: 所有测试都卡住
**问题**: Next.js fetch 在开发环境有问题
**解决方案**: 见下方

## 🛠️ 可能的解决方案

### 解决方案 1: 使用 undici (Node.js 的现代 fetch)

安装 undici:
```bash
bun add undici
```

修改 `app/api/analytic/route.ts`:
```typescript
import { fetch as undiciFetch } from 'undici';

// 在 API 调用处使用
const response = await undiciFetch("https://openrouter.ai/...", {
  // ... options
});
```

### 解决方案 2: 配置 Next.js 允许外部请求

编辑 `next.config.ts`:
```typescript
const nextConfig: NextConfig = {
  experimental: {
    // 允许外部 API 调用
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
};
```

### 解决方案 3: 使用环境变量禁用 fetch 缓存

创建 `.env.local`:
```env
NEXT_RUNTIME=nodejs
```

重启服务器:
```bash
bun run dev
```

### 解决方案 4: 检查是否是 Turbopack 的问题

尝试不使用 Turbopack:
```bash
# 编辑 package.json
"dev": "next dev --turbo"  # 改为
"dev": "next dev"

# 重启
bun run dev
```

### 解决方案 5: 使用 axios 替代 fetch

安装 axios:
```bash
bun add axios
```

修改 API 调用:
```typescript
import axios from 'axios';

const response = await axios.post(
  "https://openrouter.ai/api/v1/chat/completions",
  {
    model: "z-ai/glm-4.5-air:free",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.1,
  },
  {
    headers: {
      "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
    },
    timeout: 50000,
  }
);
```

### 解决方案 6: 临时使用 Mock API

如果以上都不行,暂时使用 Mock API:

编辑 `app/components/editor/Editor.tsx`:
```typescript
// 第 83 行,改为使用 mock
await fetch('/api/analytic-mock', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ date, markdown }),
});
```

## 🔬 深度调试

### 检查 Node.js 版本

```bash
node --version
bun --version
```

确保:
- Node.js >= 18.17
- Bun >= 1.0

### 检查网络

```bash
# 测试能否访问 OpenRouter
curl -I https://openrouter.ai

# 测试 API 端点
curl -X POST https://openrouter.ai/api/v1/chat/completions \
  -H "Authorization: Bearer $OPENROUTER_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"z-ai/glm-4.5-air:free","messages":[{"role":"user","content":"hi"}]}'
```

### 查看完整日志

重启开发服务器,启用详细日志:
```bash
NODE_OPTIONS='--trace-warnings' bun run dev
```

## 📞 报告问题

如果以上都不能解决,请提供:
1. `/api/test-fetch` 的输出
2. 开发服务器的完整日志
3. Node.js/Bun 版本
4. 操作系统

## ⚡ 快速临时方案

**立即可用的方案** (不需要调试):

使用 Mock API,不调用 AI:
```typescript
// app/components/editor/Editor.tsx 第 83 行
await fetch('/api/analytic-mock', {
```

这样可以:
- ✅ 立即保存数据
- ✅ 使用正则解析 (不是 AI)
- ✅ 月视图正常显示
- ✅ 所有功能可用

等网络问题解决后再切换回真实 AI。

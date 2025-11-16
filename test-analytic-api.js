// 测试 Analytic API 的脚本
// 运行: node test-analytic-api.js

const testMarkdown = `## Meals
### Breakfast
- [x] 鸡蛋
- [x] 面包

### Lunch
- [x] 米饭
- [x] 青菜

### Dinner
- [ ] 粥

### Drinks
- [x] 咖啡

### Snacks
- [ ] 坚果

---

## Exercise

| 完成 | 名称 | 时长(min) | 卡路里 | 感受 |
|:----:|:----:|:---------:|:------:|:----:|
|  ✅  | 跑步 |    30     |  250   | 很好 |

---

## Notes

今天完成了运动,感觉很棒!

---

## Mood
- 平静: 0.7
- 愉悦: 0.8
- 压力: 0.2
`;

async function testAnalyticAPI() {
  console.log('🚀 Testing Analytic API...\n');

  const url = 'http://localhost:3000/api/analytic';
  const data = {
    date: new Date().toISOString().split('T')[0],
    markdown: testMarkdown,
  };

  console.log('📤 Sending request to:', url);
  console.log('📅 Date:', data.date);
  console.log('📝 Markdown length:', data.markdown.length);
  console.log('\n⏳ Waiting for response...\n');

  try {
    const startTime = Date.now();

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const duration = Date.now() - startTime;

    console.log('✅ Response received in', duration, 'ms');
    console.log('📊 Status:', response.status, response.statusText);

    const result = await response.json();

    if (response.ok) {
      console.log('\n✨ Success! AI Analysis Results:');
      console.log(JSON.stringify(result, null, 2));
    } else {
      console.log('\n❌ Error Response:');
      console.log(JSON.stringify(result, null, 2));
    }
  } catch (error) {
    console.error('\n💥 Request failed:', error.message);
    console.error('Stack:', error.stack);
  }
}

console.log(`
╔════════════════════════════════════════════════════════╗
║           Nebula Analytic API Test Script             ║
╚════════════════════════════════════════════════════════╝
`);

testAnalyticAPI();

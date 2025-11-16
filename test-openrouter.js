// 测试 OpenRouter API 连接
// 运行: node test-openrouter.js

const dotenv = require('dotenv');
const path = require('path');

// 加载 .env 文件
dotenv.config({ path: path.join(__dirname, '.env') });

const API_KEY = process.env.OPENROUTER_API_KEY;

console.log('╔════════════════════════════════════════════════════════╗');
console.log('║         OpenRouter API Connection Test                ║');
console.log('╚════════════════════════════════════════════════════════╝\n');

console.log('1. Checking API Key...');
console.log('   API Key exists:', !!API_KEY);
console.log('   API Key length:', API_KEY?.length || 0);
console.log('   API Key prefix:', API_KEY?.substring(0, 10) + '...' || 'N/A');
console.log('');

if (!API_KEY) {
  console.error('❌ ERROR: OPENROUTER_API_KEY not found in .env file!');
  console.log('\nPlease:');
  console.log('1. Copy .env.example to .env');
  console.log('2. Add your OpenRouter API key to OPENROUTER_API_KEY');
  console.log('3. Get a key from: https://openrouter.ai/keys');
  process.exit(1);
}

async function testOpenRouter() {
  console.log('2. Testing OpenRouter API connection...\n');

  const testPrompt = "Say 'hello' in JSON format like {\"message\": \"hello\"}";

  console.log('   Endpoint: https://openrouter.ai/api/v1/chat/completions');
  console.log('   Model: z-ai/glm-4.5-air:free');
  console.log('   Prompt:', testPrompt);
  console.log('\n⏳ Sending request...\n');

  const startTime = Date.now();

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://nebula-mocha.vercel.app/',
        'X-Title': 'nebula-test',
      },
      body: JSON.stringify({
        model: 'z-ai/glm-4.5-air:free',
        messages: [
          {
            role: 'user',
            content: testPrompt,
          },
        ],
        temperature: 0.1,
      }),
    });

    const duration = Date.now() - startTime;
    console.log(`✅ Response received in ${duration}ms`);
    console.log('   Status:', response.status, response.statusText);

    const data = await response.json();

    if (response.ok) {
      console.log('\n✨ Success! API is working correctly.\n');
      console.log('   AI Response:', data.choices?.[0]?.message?.content || 'N/A');
      console.log('   Model Used:', data.model || 'N/A');
      console.log('   Tokens Used:', data.usage?.total_tokens || 'N/A');
      console.log('\n✅ OpenRouter API is working! You can use it in your app.');
    } else {
      console.log('\n❌ API Error Response:');
      console.log(JSON.stringify(data, null, 2));

      if (response.status === 401) {
        console.log('\n⚠️  Authentication failed. Please check:');
        console.log('   1. Your API key is correct');
        console.log('   2. Your API key is active');
        console.log('   3. Visit https://openrouter.ai/keys to verify');
      } else if (response.status === 402) {
        console.log('\n⚠️  Payment required. Please check:');
        console.log('   1. Your OpenRouter account balance');
        console.log('   2. Add credits at https://openrouter.ai/credits');
      } else if (response.status === 429) {
        console.log('\n⚠️  Rate limit exceeded. Please wait and try again.');
      } else if (response.status === 503) {
        console.log('\n⚠️  Model is currently unavailable. Try a different model.');
      }
    }
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`\n💥 Request failed after ${duration}ms`);
    console.error('   Error:', error.message);

    if (error.message.includes('fetch')) {
      console.log('\n⚠️  Network error. Please check:');
      console.log('   1. Your internet connection');
      console.log('   2. Proxy or firewall settings');
      console.log('   3. Try: curl https://openrouter.ai/api/v1/models');
    }
  }
}

testOpenRouter();

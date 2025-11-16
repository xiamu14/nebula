#!/bin/bash

echo "╔════════════════════════════════════════════════════════╗"
echo "║       Next.js Fetch Diagnosis                          ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

echo "1. Checking if dev server is running..."
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "   ✅ Dev server is running on port 3000"
else
    echo "   ❌ Dev server is NOT running"
    echo "   Please run: bun run dev"
    exit 1
fi

echo ""
echo "2. Testing basic fetch endpoint..."
curl -s http://localhost:3000/api/test-fetch > /tmp/test-fetch-result.json
if [ $? -eq 0 ]; then
    echo "   ✅ Test fetch endpoint responded"
    echo ""
    echo "   Results:"
    cat /tmp/test-fetch-result.json | jq '.' 2>/dev/null || cat /tmp/test-fetch-result.json
else
    echo "   ❌ Test fetch endpoint failed"
fi

echo ""
echo "╔════════════════════════════════════════════════════════╗"
echo "║  Now check your terminal running 'bun run dev'        ║"
echo "║  Look for [Test Fetch] log messages                   ║"
echo "╚════════════════════════════════════════════════════════╝"

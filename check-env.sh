#!/bin/bash

echo "╔════════════════════════════════════════════════════════╗"
echo "║           Nebula Environment Check                     ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

# Check .env file
echo "1. Checking .env file..."
if [ -f .env ]; then
    echo "   ✅ .env file exists"
else
    echo "   ❌ .env file NOT found"
    echo "   Please run: cp .env.example .env"
    exit 1
fi

# Check OPENROUTER_API_KEY
echo ""
echo "2. Checking OPENROUTER_API_KEY..."
if grep -q "OPENROUTER_API_KEY=" .env; then
    KEY_VALUE=$(grep "OPENROUTER_API_KEY=" .env | cut -d '=' -f2)
    if [ -z "$KEY_VALUE" ] || [ "$KEY_VALUE" = "your-openrouter-api-key-here" ]; then
        echo "   ❌ OPENROUTER_API_KEY not configured"
        echo "   Please set a valid API key in .env"
        exit 1
    else
        echo "   ✅ OPENROUTER_API_KEY is set"
        echo "   Length: ${#KEY_VALUE} characters"
    fi
else
    echo "   ❌ OPENROUTER_API_KEY not found in .env"
    exit 1
fi

# Check DATABASE_URL
echo ""
echo "3. Checking DATABASE_URL..."
if grep -q "DATABASE_URL=" .env; then
    DB_VALUE=$(grep "DATABASE_URL=" .env | cut -d '=' -f2)
    if [ -z "$DB_VALUE" ] || [[ "$DB_VALUE" == *"user:password"* ]]; then
        echo "   ⚠️  DATABASE_URL might need configuration"
    else
        echo "   ✅ DATABASE_URL is set"
    fi
else
    echo "   ❌ DATABASE_URL not found in .env"
fi

# Check Prisma Client
echo ""
echo "4. Checking Prisma Client..."
if [ -d "lib/prisma/generated" ]; then
    echo "   ✅ Prisma Client generated"
else
    echo "   ❌ Prisma Client NOT generated"
    echo "   Please run: bun run db:generate"
fi

# Check network connectivity
echo ""
echo "5. Checking network connectivity to OpenRouter..."
if curl -s --max-time 5 https://openrouter.ai/api/v1/models > /dev/null 2>&1; then
    echo "   ✅ Can reach OpenRouter API"
else
    echo "   ❌ Cannot reach OpenRouter API"
    echo "   Please check your internet connection"
fi

# Test API with simple request
echo ""
echo "6. Testing OpenRouter API with your key..."
echo "   (This will make a small API call)"

if [ ! -f "test-openrouter.js" ]; then
    echo "   ⚠️  test-openrouter.js not found, skipping API test"
else
    echo "   Run: node test-openrouter.js"
fi

echo ""
echo "╔════════════════════════════════════════════════════════╗"
echo "║                   Summary                              ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""
echo "To test your setup:"
echo "  1. node test-openrouter.js     (Test OpenRouter API)"
echo "  2. node test-analytic-api.js   (Test full analytic endpoint)"
echo ""

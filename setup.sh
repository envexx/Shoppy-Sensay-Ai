#!/bin/bash

echo "🚀 Sensay Shopping AI Setup Script"
echo "=================================="

# Step 1: Install dependencies
echo "📦 Installing dependencies..."
npm install

# Step 2: Generate SDK
echo "🔧 Generating Sensay SDK..."
npx @openapitools/openapi-generator-cli generate -i https://api.sensay.io/schema -g typescript-axios -o ./sensay-sdk

# Step 3: Install SDK dependencies
echo "📚 Installing SDK dependencies..."
cd sensay-sdk
npm install

# Step 4: Build SDK
echo "🔨 Building SDK..."
npm run build

# Step 5: Go back to project directory
cd ..

# Step 6: Install SDK in main project
echo "🔗 Installing SDK in main project..."
npm install ./sensay-sdk

# Step 7: Build project
echo "🏗️ Building main project..."
npm run build

echo ""
echo "✅ Setup completed!"
echo "💡 You can now run: npm start"
echo "📋 Or for development: npm run dev"

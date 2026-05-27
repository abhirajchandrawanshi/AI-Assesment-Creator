#!/bin/bash

# VedaAI Setup Script
# This script sets up the entire project for development

set -e  # Exit on error

echo "🚀 VedaAI Setup Script"
echo "===================="
echo ""

# Check Node.js version
echo "✓ Checking Node.js version..."
node_version=$(node -v)
echo "  Node.js: $node_version"
echo ""

# Backend Setup
echo "📦 Setting up Backend..."
cd backend

if [ ! -f .env ]; then
    echo "  Creating .env file..."
    cat > .env << 'EOF'
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
# Leave empty to use in-memory database (development only)
MONGODB_URI=mongodb://localhost:27017/vedaai

# Cache & Queue Configuration
# Leave empty to use in-memory queue (development only)
REDIS_URL=redis://localhost:6379

# AI Configuration
# Get from: https://aistudio.google.com
GEMINI_API_KEY=

# Optional: OpenAI fallback
# Get from: https://platform.openai.com
OPENAI_API_KEY=
EOF
    echo "  ✓ Created .env file (update API keys as needed)"
else
    echo "  ✓ .env file already exists"
fi

echo "  Installing dependencies..."
npm install
echo "  ✓ Backend dependencies installed"
echo ""

# Frontend Setup
cd ../frontend

echo "📦 Setting up Frontend..."

if [ ! -f .env.local ]; then
    echo "  Creating .env.local file..."
    cat > .env.local << 'EOF'
NEXT_PUBLIC_API_URL=http://localhost:5000
EOF
    echo "  ✓ Created .env.local file"
else
    echo "  ✓ .env.local file already exists"
fi

echo "  Installing dependencies..."
npm install
echo "  ✓ Frontend dependencies installed"
echo ""

cd ../

echo "✅ Setup Complete!"
echo ""
echo "🎯 Next Steps:"
echo ""
echo "1. Start Backend:"
echo "   cd backend && npm run dev"
echo ""
echo "2. Start Frontend (in another terminal):"
echo "   cd frontend && npm run dev"
echo ""
echo "3. Open http://localhost:3000 in your browser"
echo ""
echo "📝 Configuration:"
echo "   Backend:  backend/.env"
echo "   Frontend: frontend/.env.local"
echo ""
echo "⚠️  Optional Dependencies (for full functionality):"
echo "   - MongoDB: brew install mongodb-community (macOS) or chocolatey install mongodb (Windows)"
echo "   - Redis:   brew install redis (macOS) or chocolatey install redis (Windows)"
echo ""
echo "📚 See README.md for more information"

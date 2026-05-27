@echo off
REM VedaAI Setup Script for Windows
REM This script sets up the entire project for development

setlocal enabledelayedexpansion

echo.
echo 🚀 VedaAI Setup Script (Windows)
echo ================================
echo.

REM Check Node.js version
echo ✓ Checking Node.js version...
node -v
echo.

REM Backend Setup
echo 📦 Setting up Backend...
cd backend

if not exist .env (
    echo   Creating .env file...
    (
        echo # Server Configuration
        echo PORT=5000
        echo NODE_ENV=development
        echo.
        echo # Database Configuration
        echo # Leave empty to use in-memory database (development only^)
        echo MONGODB_URI=mongodb://localhost:27017/vedaai
        echo.
        echo # Cache ^& Queue Configuration
        echo # Leave empty to use in-memory queue (development only^)
        echo REDIS_URL=redis://localhost:6379
        echo.
        echo # AI Configuration
        echo # Get from: https://aistudio.google.com
        echo GEMINI_API_KEY=
        echo.
        echo # Optional: OpenAI fallback
        echo # Get from: https://platform.openai.com
        echo OPENAI_API_KEY=
    ) > .env
    echo   ✓ Created .env file (update API keys as needed^)
) else (
    echo   ✓ .env file already exists
)

echo   Installing dependencies...
call npm install
echo   ✓ Backend dependencies installed
echo.

REM Frontend Setup
cd ..\frontend

echo 📦 Setting up Frontend...

if not exist .env.local (
    echo   Creating .env.local file...
    (
        echo NEXT_PUBLIC_API_URL=http://localhost:5000
    ) > .env.local
    echo   ✓ Created .env.local file
) else (
    echo   ✓ .env.local file already exists
)

echo   Installing dependencies...
call npm install
echo   ✓ Frontend dependencies installed
echo.

cd ..\

echo ✅ Setup Complete!
echo.
echo 🎯 Next Steps:
echo.
echo 1. Start Backend:
echo    cd backend ^&^& npm run dev
echo.
echo 2. Start Frontend (in another terminal^):
echo    cd frontend ^&^& npm run dev
echo.
echo 3. Open http://localhost:3000 in your browser
echo.
echo 📝 Configuration:
echo    Backend:  backend\.env
echo    Frontend: frontend\.env.local
echo.
echo ⚠️  Optional Dependencies (for full functionality^):
echo    - MongoDB: Download from https://www.mongodb.com/try/download/community
echo    - Redis:   Download from https://github.com/microsoftarchive/redis/releases
echo.
echo 📚 See README.md for more information
echo.
pause

@echo off
REM 🚀 Workflow App Deployment Script for Windows
REM This script will deploy your workflow app to GitHub Pages

echo 🚀 Starting deployment to GitHub Pages...

REM Check if git is installed
git --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Git is not installed. Please install Git first.
    pause
    exit /b 1
)

REM Check if we're in the right directory
if not exist "index.html" (
    echo ❌ Please run this script from the workflow-app directory
    pause
    exit /b 1
)

REM Initialize git repository (if not already done)
if not exist ".git" (
    echo 📁 Initializing git repository...
    git init
)

REM Add all files
echo 📝 Adding files to git...
git add .

REM Commit changes
echo 💾 Committing changes...
git commit -m "Deploy workflow app to GitHub Pages"

REM Add remote origin (if not already done)
git remote get-url origin >nul 2>&1
if errorlevel 1 (
    echo 🔗 Adding remote origin...
    git remote add origin https://github.com/rahimkhasiyev/workflowapp.git
)

REM Set main branch
echo 🌿 Setting main branch...
git branch -M main

REM Push to GitHub
echo ⬆️ Pushing to GitHub...
git push -u origin main

echo.
echo ✅ Deployment completed!
echo.
echo 🎉 Your workflow app will be available at:
echo    https://rahimkhasiyev.github.io/workflowapp
echo.
echo 📋 Next steps:
echo    1. Go to https://github.com/rahimkhasiyev/workflowapp
echo    2. Click 'Settings' → 'Pages'
echo    3. Select 'Deploy from a branch'
echo    4. Choose 'main' branch and '/ (root)' folder
echo    5. Click 'Save'
echo.
echo ⏳ It may take a few minutes for your site to be live.
echo.
echo 🔗 Your app URL: https://rahimkhasiyev.github.io/workflowapp
echo.
pause

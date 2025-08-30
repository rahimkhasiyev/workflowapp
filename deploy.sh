#!/bin/bash

# 🚀 Workflow App Deployment Script
# This script will deploy your workflow app to GitHub Pages

echo "🚀 Starting deployment to GitHub Pages..."

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install Git first."
    exit 1
fi

# Check if we're in the right directory
if [ ! -f "index.html" ]; then
    echo "❌ Please run this script from the workflow-app directory"
    exit 1
fi

# Initialize git repository (if not already done)
if [ ! -d ".git" ]; then
    echo "📁 Initializing git repository..."
    git init
fi

# Add all files
echo "📝 Adding files to git..."
git add .

# Commit changes
echo "💾 Committing changes..."
git commit -m "Deploy workflow app to GitHub Pages"

# Add remote origin (if not already done)
if ! git remote get-url origin &> /dev/null; then
    echo "🔗 Adding remote origin..."
    git remote add origin https://github.com/rahimkhasiyev/workflowapp.git
fi

# Set main branch
echo "🌿 Setting main branch..."
git branch -M main

# Push to GitHub
echo "⬆️ Pushing to GitHub..."
git push -u origin main

echo ""
echo "✅ Deployment completed!"
echo ""
echo "🎉 Your workflow app will be available at:"
echo "   https://rahimkhasiyev.github.io/workflowapp"
echo ""
echo "📋 Next steps:"
echo "   1. Go to https://github.com/rahimkhasiyev/workflowapp"
echo "   2. Click 'Settings' → 'Pages'"
echo "   3. Select 'Deploy from a branch'"
echo "   4. Choose 'main' branch and '/ (root)' folder"
echo "   5. Click 'Save'"
echo ""
echo "⏳ It may take a few minutes for your site to be live."
echo ""
echo "🔗 Your app URL: https://rahimkhasiyev.github.io/workflowapp"

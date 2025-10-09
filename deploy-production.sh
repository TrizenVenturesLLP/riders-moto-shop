#!/bin/bash

# Production Deployment Script for Riders Moto Shop
# This script builds and prepares the application for production deployment

echo "🚀 Starting production deployment for Riders Moto Shop..."

# Set production environment variables
export VITE_API_URL=https://rmsadminbackend.llp.trizenventures.com/api/v1
export VITE_NODE_ENV=production

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Build the application for production
echo "🔨 Building application for production..."
npm run build

# Verify build output
if [ -d "dist" ]; then
    echo "✅ Build completed successfully!"
    echo "📁 Build output: dist/"
    echo "🌐 Production API URL: https://rmsadminbackend.llp.trizenventures.com/api/v1"
    echo ""
    echo "📋 Next steps:"
    echo "1. The Docker image can be built using: docker build -t riders-moto-shop ."
    echo "2. Or deploy using Captain with the captain-definition file"
    echo "3. The application will use the production API automatically"
else
    echo "❌ Build failed!"
    exit 1
fi

echo "🎉 Production deployment preparation complete!"

# Production Deployment Script for Riders Moto Shop
# This script builds and prepares the application for production deployment

Write-Host "🚀 Starting production deployment for Riders Moto Shop..." -ForegroundColor Green

# Set production environment variables
$env:VITE_API_URL = "https://rmsadminbackend.llp.trizenventures.com/api/v1"
$env:VITE_NODE_ENV = "production"

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
npm ci

# Build the application for production
Write-Host "🔨 Building application for production..." -ForegroundColor Yellow
npm run build

# Verify build output
if (Test-Path "dist") {
    Write-Host "✅ Build completed successfully!" -ForegroundColor Green
    Write-Host "📁 Build output: dist/" -ForegroundColor Cyan
    Write-Host "🌐 Production API URL: https://rmsadminbackend.llp.trizenventures.com/api/v1" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "📋 Next steps:" -ForegroundColor Yellow
    Write-Host "1. The Docker image can be built using: docker build -t riders-moto-shop ." -ForegroundColor White
    Write-Host "2. Or deploy using Captain with the captain-definition file" -ForegroundColor White
    Write-Host "3. The application will use the production API automatically" -ForegroundColor White
} else {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "🎉 Production deployment preparation complete!" -ForegroundColor Green

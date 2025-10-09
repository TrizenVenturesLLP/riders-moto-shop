# Riders Moto Shop - Production Deployment Guide

## 🚀 Quick Deployment

### Using Docker (Recommended)

1. **Build the Docker image:**
   ```bash
   docker build -t riders-moto-shop .
   ```

2. **Run the container:**
   ```bash
   docker run -p 80:80 riders-moto-shop
   ```

### Using Captain

1. **Deploy with Captain:**
   ```bash
   captain deploy
   ```

### Manual Build

1. **Run the deployment script:**
   ```bash
   # Windows PowerShell
   .\deploy-production.ps1
   
   # Linux/Mac
   ./deploy-production.sh
   ```

2. **Or build manually:**
   ```bash
   npm ci
   npm run build
   ```

## 📋 Configuration

### Production API URL
The application is configured to use the production API:
- **API Base URL:** `https://rmsadminbackend.llp.trizenventures.com/api/v1`

### Environment Variables
- `VITE_API_URL` - API base URL (defaults to production URL)
- `VITE_NODE_ENV` - Environment mode (production)

## 🔧 Build Configuration

### Vite Configuration
- **Development server:** Port 8080
- **Build output:** `dist/` directory
- **Optimizations:** Enabled for production builds

### Nginx Configuration
- **Port:** 80
- **Static assets:** Cached for 1 year
- **SPA routing:** Configured for React Router
- **Security headers:** Enabled

## 📁 File Structure

```
riders-moto-shop/
├── src/config/api.ts          # API configuration (production ready)
├── Dockerfile                 # Docker configuration
├── nginx.conf                 # Nginx configuration
├── captain-definition         # Captain deployment config
├── deploy-production.ps1      # Windows deployment script
├── deploy-production.sh       # Linux/Mac deployment script
└── DEPLOYMENT.md             # This file
```

## ✅ Production Checklist

- [x] API URLs updated to production
- [x] No localhost references in source code
- [x] Docker configuration optimized
- [x] Nginx configuration for SPA
- [x] Build scripts ready
- [x] Security headers configured
- [x] Static asset caching enabled

## 🐛 Troubleshooting

### API Connection Issues
- Verify the production API is accessible: `https://rmsadminbackend.llp.trizenventures.com/api/v1`
- Check CORS configuration on the backend
- Ensure environment variables are set correctly

### Build Issues
- Clear node_modules and reinstall: `rm -rf node_modules && npm ci`
- Check Node.js version compatibility
- Verify all dependencies are installed

### Deployment Issues
- Check Docker daemon is running
- Verify port 80 is available
- Check nginx configuration syntax

## 📞 Support

For deployment issues or questions, refer to the main project documentation or contact the development team.

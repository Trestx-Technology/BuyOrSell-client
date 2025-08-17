#!/bin/bash

# Deployment script for BuyOrSell Client
# This script should be run on the EC2 instance

set -e

# Configuration
APP_NAME="buy-or-sell-client"
DEPLOY_PATH="/var/www/buy-or-sell-client"
BACKUP_PATH="/var/www/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

echo "🚀 Starting deployment for $APP_NAME..."

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_PATH

# Backup current version if it exists
if [ -d "$DEPLOY_PATH" ]; then
    echo "📦 Creating backup of current version..."
    tar -czf "$BACKUP_PATH/${APP_NAME}_${TIMESTAMP}.tar.gz" -C "$DEPLOY_PATH" .
    
    # Keep only last 5 backups
    ls -t "$BACKUP_PATH"/${APP_NAME}_*.tar.gz | tail -n +6 | xargs -r rm
fi

# Stop the application
echo "⏹️  Stopping application..."
pm2 stop $APP_NAME || true

# Navigate to deployment directory
cd $DEPLOY_PATH

# Install dependencies
echo "📦 Installing dependencies..."
yarn install --frozen-lockfile --production

# Start the application
echo "▶️  Starting application..."
if [ -f "ecosystem.config.js" ]; then
    pm2 start ecosystem.config.js --env production
else
    pm2 start npm --name $APP_NAME -- start
fi

# Save PM2 configuration
echo "💾 Saving PM2 configuration..."
pm2 save

# Check application status
echo "📊 Application status:"
pm2 status

echo "✅ Deployment completed successfully!"
echo "🌐 Application should be running on port 3000"

# EC2 Deployment Setup Guide

This guide explains how to set up your EC2 instance and GitHub Actions for automated deployment.

## 🔑 Required GitHub Secrets

Add these secrets to your GitHub repository (`Settings` > `Secrets and variables` > `Actions`):

### Production Environment

- `EC2_PRIVATE_KEY`: Your EC2 private key (PEM file content)
- `EC2_PRODUCTION_HOST`: Production EC2 instance public IP or domain
- `EC2_USER`: SSH username (usually `ubuntu` or `ec2-user`)
- `EC2_PRODUCTION_PATH`: Production deployment path (e.g., `/var/www/buy-or-sell-client`)

### Development Environment

- `EC2_DEVELOPMENT_HOST`: Development EC2 instance public IP or domain
- `EC2_DEVELOPMENT_PATH`: Development deployment path (e.g., `/var/www/buy-or-sell-client-dev`)

## 🚀 EC2 Instance Setup

### 1. Launch EC2 Instance

- Use Ubuntu 22.04 LTS or Amazon Linux 2
- Configure security groups to allow SSH (port 22) and HTTP (port 80/3000)
- Attach your key pair

### 2. Install Required Software

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Yarn globally
curl -fsSL https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt update
sudo apt install yarn

# Install PM2 globally
sudo npm install -g pm2

# Install PM2 startup script
pm2 startup

# Install Nginx (optional, for reverse proxy)
sudo apt install nginx -y
```

### 3. Create Deployment Directory

```bash
# Create deployment directory
sudo mkdir -p /var/www/buy-or-sell-client
sudo mkdir -p /var/www/buy-or-sell-client-dev

# Set ownership
sudo chown -R $USER:$USER /var/www/buy-or-sell-client
sudo chown -R $USER:$USER /var/www/buy-or-sell-client-dev

# Set permissions
sudo chmod -R 755 /var/www/buy-or-sell-client
sudo chmod -R 755 /var/www/buy-or-sell-client-dev
```

### 4. Configure Nginx (Optional)

```bash
# Create Nginx configuration
sudo nano /etc/nginx/sites-available/buy-or-sell-client

# Add this configuration:
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}

# Enable the site
sudo ln -s /etc/nginx/sites-available/buy-or-sell-client /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## 🔄 Deployment Process

### Automatic Deployment

- **Production**: Push to `main` branch triggers production deployment
- **Development**: Push to `dev` branch triggers development deployment
- **Pull Requests**: Create preview deployments for testing

### Manual Deployment

You can also run the deployment script manually on your EC2 instance:

```bash
cd /var/www/buy-or-sell-client
chmod +x deploy.sh
./deploy.sh
```

## 📊 Monitoring

### PM2 Commands

```bash
# Check application status
pm2 status

# View logs
pm2 logs buy-or-sell-client

# Monitor resources
pm2 monit

# Restart application
pm2 restart buy-or-sell-client
```

### System Monitoring

```bash
# Check system resources
htop
df -h
free -h

# Check application ports
netstat -tlnp | grep :3000
```

## 🚨 Troubleshooting

### Common Issues

1. **Permission Denied**: Check file ownership and permissions
2. **Port Already in Use**: Stop existing processes or change port
3. **Build Failures**: Check Node.js version and dependencies
4. **SSH Connection Issues**: Verify security groups and key pairs

### Logs

- **PM2 Logs**: `pm2 logs buy-or-sell-client`
- **Nginx Logs**: `/var/log/nginx/access.log`, `/var/log/nginx/error.log`
- **System Logs**: `journalctl -u nginx`, `journalctl -u pm2-root`

## 🔒 Security Considerations

1. **Firewall**: Configure security groups to allow only necessary ports
2. **SSH Keys**: Use key-based authentication, disable password auth
3. **Updates**: Regularly update your EC2 instance and dependencies
4. **Monitoring**: Set up CloudWatch alarms for resource monitoring
5. **Backups**: The deployment script automatically creates backups

## 📝 Environment Variables

Create `.env` files on your EC2 instances for environment-specific configuration:

```bash
# Production
nano /var/www/buy-or-sell-client/.env

# Development
nano /var/www/buy-or-sell-client-dev/.env
```

Example `.env` content:

```env
NODE_ENV=production
PORT=3000
DATABASE_URL=your_database_url
API_KEY=your_api_key
```

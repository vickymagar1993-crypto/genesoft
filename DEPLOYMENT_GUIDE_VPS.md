# VPS Deployment Guide

Complete guide for deploying Genesoft Infotech website to any VPS (DigitalOcean, Linode, Vultr, etc.)

## 📋 Prerequisites

- VPS with Ubuntu 20.04+ or 22.04
- Root or sudo access
- Domain name (optional but recommended)
- Minimum 1GB RAM, 1 CPU Core, 10GB Disk

## 🚀 Quick Deploy (Production)

### 1. Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt update
sudo apt install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Install PM2 (Process Manager)
sudo npm install -g pm2

# Install Nginx (Reverse Proxy)
sudo apt install -y nginx
```

### 2. Upload Project Files

**Option A: Using SCP**
```bash
# From your local machine
scp -r genesoft-main root@YOUR_SERVER_IP:/var/www/
```

**Option B: Using Git (if you have a private repo)**
```bash
# On server
cd /var/www
git clone https://your-repo-url.git genesoft-main
```

**Option C: Upload ZIP**
```bash
# On server
cd /var/www
wget https://your-file-host.com/genesoft-main.zip
unzip genesoft-main.zip
```

### 3. Install Dependencies & Build

```bash
cd /var/www/genesoft-main

# Install dependencies
npm install --production

# Build for production
npm run build

# Copy static assets to standalone
cp -r public .next/standalone/
cp -r .next/static .next/standalone/.next/
```

### 4. Configure Environment Variables

```bash
# Create environment file
nano .env.local
```

Add the following:
```env
MONGO_URL=mongodb://localhost:27017
DB_NAME=genesoft_db
NODE_ENV=production
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
```

### 5. Start with PM2

```bash
# Start the application
cd /var/www/genesoft-main
PORT=3000 pm2 start .next/standalone/server.js --name genesoft

# Save PM2 process list
pm2 save

# Enable PM2 startup on boot
pm2 startup
# Copy and run the command it outputs
```

### 6. Configure Nginx

```bash
# Create Nginx config
sudo nano /etc/nginx/sites-available/genesoft
```

Paste the following configuration:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Static files caching
    location /_next/static/ {
        proxy_pass http://localhost:3000;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # Upload files
    location /uploads/ {
        proxy_pass http://localhost:3000;
        add_header Cache-Control "public, max-age=2592000";
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/genesoft /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 7. Set Up SSL (Let's Encrypt)

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal is set up automatically
# Test renewal
sudo certbot renew --dry-run
```

## 🔄 Updating the Application

```bash
# Stop PM2 process
pm2 stop genesoft

# Pull latest changes (if using git)
cd /var/www/genesoft-main
git pull

# Or upload new files via SCP

# Rebuild
npm install --production
npm run build
cp -r public .next/standalone/
cp -r .next/static .next/standalone/.next/

# Restart PM2
pm2 restart genesoft
```

## 🛠️ Maintenance Commands

```bash
# View logs
pm2 logs genesoft

# Monitor resources
pm2 monit

# Restart application
pm2 restart genesoft

# Stop application
pm2 stop genesoft

# MongoDB status
sudo systemctl status mongod

# Nginx status
sudo systemctl status nginx

# Check disk space
df -h

# Check memory
free -h
```

## 🔐 Security Best Practices

### 1. Firewall Setup

```bash
# Install UFW
sudo apt install -y ufw

# Allow SSH
sudo ufw allow 22/tcp

# Allow HTTP & HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Enable firewall
sudo ufw enable
```

### 2. MongoDB Security

```bash
# Create admin user
mongosh

use admin
db.createUser({
  user: "admin",
  pwd: "STRONG_PASSWORD_HERE",
  roles: [ { role: "userAdminAnyDatabase", db: "admin" } ]
})

use genesoft_db
db.createUser({
  user: "genesoft_user",
  pwd: "ANOTHER_STRONG_PASSWORD",
  roles: [ { role: "readWrite", db: "genesoft_db" } ]
})
exit
```

Update `.env.local`:
```env
MONGO_URL=mongodb://genesoft_user:ANOTHER_STRONG_PASSWORD@localhost:27017/genesoft_db
```

Enable MongoDB authentication:
```bash
sudo nano /etc/mongod.conf
```

Add:
```yaml
security:
  authorization: enabled
```

Restart MongoDB:
```bash
sudo systemctl restart mongod
```

### 3. System Updates

```bash
# Create update script
sudo nano /usr/local/bin/system-update.sh
```

Paste:
```bash
#!/bin/bash
apt update
apt upgrade -y
apt autoremove -y
```

```bash
sudo chmod +x /usr/local/bin/system-update.sh

# Schedule weekly updates
sudo crontab -e
# Add: 0 2 * * 0 /usr/local/bin/system-update.sh
```

## 📊 Monitoring Setup

### 1. PM2 Monitoring

```bash
# Link to PM2 Plus (optional)
pm2 link YOUR_SECRET_KEY YOUR_PUBLIC_KEY
```

### 2. Disk Space Monitoring

```bash
# Create monitoring script
nano /usr/local/bin/disk-alert.sh
```

Paste:
```bash
#!/bin/bash
THRESHOLD=80
USAGE=$(df / | tail -1 | awk '{print $5}' | sed 's/%//')
if [ $USAGE -gt $THRESHOLD ]; then
    echo "Disk usage is ${USAGE}%" | mail -s "Disk Alert" admin@yourdomain.com
fi
```

```bash
chmod +x /usr/local/bin/disk-alert.sh

# Schedule daily check
crontab -e
# Add: 0 9 * * * /usr/local/bin/disk-alert.sh
```

## 🔍 Troubleshooting

### Website Not Loading

```bash
# Check PM2 status
pm2 status

# Check logs
pm2 logs genesoft --lines 100

# Check Nginx
sudo nginx -t
sudo systemctl status nginx

# Check if port 3000 is listening
sudo netstat -tlnp | grep 3000
```

### Database Connection Issues

```bash
# Check MongoDB status
sudo systemctl status mongod

# Check MongoDB logs
sudo tail -f /var/log/mongodb/mongod.log

# Test connection
mongosh --host localhost --port 27017
```

### High Memory Usage

```bash
# Check memory
free -h

# Check PM2 memory
pm2 monit

# Restart if needed
pm2 restart genesoft
```

## 📦 Backup Strategy

### Automated MongoDB Backup

```bash
# Create backup script
sudo nano /usr/local/bin/backup-mongo.sh
```

Paste:
```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/mongodb"
mkdir -p $BACKUP_DIR

mongodump --db genesoft_db --out $BACKUP_DIR/$DATE

# Keep only last 7 days
find $BACKUP_DIR -type d -mtime +7 -exec rm -rf {} \;
```

```bash
chmod +x /usr/local/bin/backup-mongo.sh

# Schedule daily backup
crontab -e
# Add: 0 3 * * * /usr/local/bin/backup-mongo.sh
```

### Restore from Backup

```bash
mongorestore --db genesoft_db /backups/mongodb/20260117_030000/genesoft_db
```

## 🌍 Custom Domain Setup

1. Point your domain's A record to your VPS IP
2. Update Nginx server_name with your domain
3. Run Certbot for SSL
4. Update `NEXT_PUBLIC_BASE_URL` in `.env.local`

---

**Support**: For issues, refer to Next.js documentation or contact technical support.

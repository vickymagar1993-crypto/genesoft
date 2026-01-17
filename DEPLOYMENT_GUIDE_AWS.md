# AWS Deployment Guide

Complete guide for deploying Genesoft Infotech website to Amazon Web Services (AWS)

## 🏗️ Architecture Overview


User → Route 53 (DNS) → CloudFront (CDN) → ALB → EC2 Instance(s)
                                                    ↓
                                            MongoDB Atlas/DocumentDB
```

## 📋 Prerequisites

- AWS Account
- AWS CLI installed locally
- Domain name (optional)
- SSH key pair

## 🚀 Deployment Options

### Option A: EC2 + MongoDB Atlas (Recommended)

### Option B: EC2 + DocumentDB

### Option C: Elastic Beanstalk

---

## 🎯 Option A: EC2 + MongoDB Atlas

### 1. Set Up MongoDB Atlas

1. Go to <https://www.mongodb.com/cloud/atlas>
2. Create a free cluster
3. Whitelist your EC2 IP (or 0.0.0.0/0 for testing)
4. Create database user
5. Get connection string:
   ```text
   mongodb+srv://username:password@cluster.mongodb.net/genesoft_db
   ```

### 2. Launch EC2 Instance

```bash
# Using AWS CLI
aws ec2 run-instances \
  --image-id ami-0c55b159cbfafe1f0 \
  --count 1 \
  --instance-type t3.small \
  --key-name your-key-pair \
  --security-group-ids sg-XXXXXXXX \
  --subnet-id subnet-XXXXXXXX \
  --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=Genesoft-Web}]'
```

**Or via AWS Console:**

1. EC2 Dashboard → Launch Instance
2. Choose Ubuntu Server 22.04 LTS
4. Configure security group:
   - SSH (22) from your IP
   - HTTP (80) from 0.0.0.0/0
   - HTTPS (443) from 0.0.0.0/0
   - Custom TCP (3000) from security group only
5. Launch and download key pair

### 3. Connect to EC2

```bash
# Set key permissions
chmod 400 your-key.pem

# Connect
ssh -i "your-key.pem" ubuntu@YOUR_EC2_PUBLIC_IP
```

### 4. Install Software

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install Nginx
sudo apt install -y nginx

# Install Git
sudo apt install -y git
```

### 5. Deploy Application

```bash
# Clone or upload your code
cd /var/www
sudo mkdir genesoft-main
sudo chown ubuntu:ubuntu genesoft-main
cd genesoft-main

# Upload via SCP from local machine:
# scp -i "your-key.pem" -r genesoft-main ubuntu@YOUR_EC2_IP:/var/www/

# Install dependencies
npm install --production

# Create .env.local
nano .env.local
```

Add:

```env
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/genesoft_db
DB_NAME=genesoft_db
NODE_ENV=production
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
```

```bash
# Build
npm run build

# Copy assets
cp -r public .next/standalone/
cp -r .next/static .next/standalone/.next/

# Start with PM2
cd /var/www/genesoft-main
PORT=3000 pm2 start .next/standalone/server.js --name genesoft
pm2 save
pm2 startup
```

### 6. Configure Nginx

```bash
sudo nano /etc/nginx/sites-available/genesoft
```

Paste:

```nginx
server {
    listen 80;
    server_name YOUR_EC2_PUBLIC_DNS yourdomain.com;

    client_max_body_size 20M;

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

    location /_next/static/ {
        proxy_pass http://localhost:3000;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    location /uploads/ {
        proxy_pass http://localhost:3000;
        add_header Cache-Control "public, max-age=2592000";
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/genesoft /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 7. Set Up SSL with Let's Encrypt

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

### 8. Configure Application Load Balancer (Optional for HA)

1. Create Target Group:
   - Protocol: HTTP
   - Port: 80
   - Health check path: /
   - Register EC2 instances

2. Create Application Load Balancer:
   - Internet-facing
   - Add HTTPS listener (port 443)
   - Attach SSL certificate from ACM
   - Forward to target group

3. Update Route 53:
   - Create A record
   - Alias to ALB

---

## 🎯 Option B: EC2 + DocumentDB

### 1. Create DocumentDB Cluster

```bash
# Using AWS CLI
aws docdb create-db-cluster \
  --db-cluster-identifier genesoft-docdb \
  --engine docdb \
  --master-username admin \
  --master-user-password YOUR_PASSWORD \
  --vpc-security-group-ids sg-XXXXXXXX \
  --db-subnet-group-name default
```

### 2. Create Instance

```bash
aws docdb create-db-instance \
  --db-instance-identifier genesoft-docdb-instance \
  --db-instance-class db.t3.medium \
  --engine docdb \
  --db-cluster-identifier genesoft-docdb
```

### 3. Get Connection String

```bash
# From AWS Console or CLI
# Example: genesoft-docdb.cluster-XXXXXX.us-east-1.docdb.amazonaws.com:27017
```

### 4. Update .env.local

```env
MONGO_URL=mongodb://admin:YOUR_PASSWORD@genesoft-docdb.cluster-XXXXXX.us-east-1.docdb.amazonaws.com:27017/?tls=true&tlsCAFile=rds-combined-ca-bundle.pem&replicaSet=rs0&readPreference=secondaryPreferred&retryWrites=false
DB_NAME=genesoft_db
```

### 5. Download TLS Certificate

```bash
cd /var/www/genesoft-main
wget https://truststore.pki.rds.amazonaws.com/global/global-bundle.pem
mv global-bundle.pem rds-combined-ca-bundle.pem
```

Follow EC2 deployment steps from Option A.

---

## 🎯 Option C: Elastic Beanstalk

### 1. Install EB CLI

```bash
pip install awsebcli
```

### 2. Initialize EB

```bash
cd genesoft-main
eb init -p node.js-18 genesoft-app --region us-east-1
```

### 3. Create .ebextensions

```bash
mkdir .ebextensions
nano .ebextensions/nginx.config
```

Paste:

```yaml
files:
  "/etc/nginx/conf.d/proxy.conf":
    mode: "000644"
    owner: root
    group: root
    content: |
      client_max_body_size 20M;
```

### 4. Create .platform

```bash
mkdir -p .platform/hooks/prebuild
nano .platform/hooks/prebuild/01_build.sh
```

Paste:

```bash
#!/bin/bash
cd /var/app/staging
npm run build
cp -r public .next/standalone/
cp -r .next/static .next/standalone/.next/
```

```bash
chmod +x .platform/hooks/prebuild/01_build.sh
```

### 5. Deploy

```bash
eb create genesoft-env \
  --instance-type t3.small \
  --envvars MONGO_URL=YOUR_MONGO_URL,DB_NAME=genesoft_db,NODE_ENV=production

# Or deploy to existing environment
eb deploy
```

---

## 🔒 Security Best Practices

### 1. IAM Roles

Create IAM role for EC2:

- AmazonS3ReadOnlyAccess (for assets)
- CloudWatchLogsFullAccess (for monitoring)

Attach to EC2 instance.

### 2. Security Groups

**Web Server SG:**

- Inbound: 80 (HTTP), 443 (HTTPS)
- Outbound: All

**Database SG:**

- Inbound: 27017 from Web Server SG only
- Outbound: None

### 3. Enable CloudWatch Monitoring

```bash
# Install CloudWatch agent
wget https://s3.amazonaws.com/amazoncloudwatch-agent/ubuntu/amd64/latest/amazon-cloudwatch-agent.deb
sudo dpkg -i amazon-cloudwatch-agent.deb

# Configure
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-config-wizard
```

### 4. Enable AWS WAF (Optional)

Protect against DDoS and SQL injection:

1. Create Web ACL
2. Add rules (rate limiting, geo-blocking)
3. Associate with ALB

---

## 📊 Monitoring & Alerts

### CloudWatch Alarms

```bash
# High CPU
aws cloudwatch put-metric-alarm \
  --alarm-name genesoft-high-cpu \
  --alarm-description "Alert when CPU exceeds 80%" \
  --metric-name CPUUtilization \
  --namespace AWS/EC2 \
  --statistic Average \
  --period 300 \
  --threshold 80 \
  --comparison-operator GreaterThanThreshold

# High Disk Usage
aws cloudwatch put-metric-alarm \
  --alarm-name genesoft-high-disk \
  --alarm-description "Alert when disk exceeds 80%" \
  --metric-name DiskSpaceUtilization \
  --namespace System/Linux \
  --statistic Average \
  --period 300 \
  --threshold 80 \
  --comparison-operator GreaterThanThreshold
```

---

## 🔄 CI/CD Pipeline (GitHub Actions)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to AWS

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Deploy to EC2
        env:
          PRIVATE_KEY: ${{ secrets.EC2_SSH_KEY }}
          HOST: ${{ secrets.EC2_HOST }}
          USER: ubuntu
        run: |
          echo "$PRIVATE_KEY" > private_key
          chmod 600 private_key
          ssh -i private_key -o StrictHostKeyChecking=no $USER@$HOST '
            cd /var/www/genesoft-main &&
            git pull &&
            npm ci --production &&
            npm run build &&
            cp -r public .next/standalone/ &&
            cp -r .next/static .next/standalone/.next/ &&
            pm2 restart genesoft
          '
```

---

## 💰 Cost Optimization

**Monthly Estimate:**

- EC2 t3.small (24/7): ~$15/month
- MongoDB Atlas M0 (Free): $0
- Route 53 Hosted Zone: $0.50/month
- Data Transfer: ~$5/month
- **Total: ~$20-25/month**

**For Higher Traffic:**

- EC2 t3.medium: ~$30/month
- MongoDB Atlas M10: ~$57/month
- ALB: ~$16/month
- **Total: ~$103/month**

---

## 📦 Backup Strategy

### EC2 Snapshots

```bash
# Create snapshot
aws ec2 create-snapshot \
  --volume-id vol-XXXXXXXX \
  --description "Genesoft backup $(date +%Y%m%d)"

# Automate with Lambda (daily snapshots)
```

### MongoDB Atlas Backups

- Automatic continuous backups
- Point-in-time recovery
- Download snapshots as needed

---

## 🔍 Troubleshooting

### Check Application Logs

```bash
# PM2 logs
pm2 logs genesoft

# System logs
sudo journalctl -u nginx -n 100
```

### Check AWS Resources

```bash
# EC2 status
aws ec2 describe-instance-status --instance-ids i-XXXXXXXX

# DocumentDB status
aws docdb describe-db-clusters --db-cluster-identifier genesoft-docdb
```

---

**For AWS Support**: Contact AWS Support or refer to AWS Documentation

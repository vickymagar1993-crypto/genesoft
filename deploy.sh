#!/bin/bash

# Deployment Script for Genesoft Infotech
# This script helps deploy the application to AWS EC2

echo "🚀 Starting deployment process..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Step 1: Build the application
echo -e "${YELLOW}📦 Building Next.js application...${NC}"
yarn build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Build failed!${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build successful${NC}"

# Step 2: Create deployment package
echo -e "${YELLOW}📦 Creating deployment package...${NC}"

# Exclude unnecessary files
zip -r deployment.zip . \
  -x "node_modules/*" \
  -x ".git/*" \
  -x ".next/cache/*" \
  -x "*.log" \
  -x ".env.local" \
  -x "test_result.md" \
  -x "deployment.zip"

echo -e "${GREEN}✅ Deployment package created: deployment.zip${NC}"

# Step 3: Instructions for manual upload
echo -e "${YELLOW}📤 Next steps:${NC}"
echo "1. Upload deployment.zip to your EC2 instance:"
echo "   scp -i your-key.pem deployment.zip ubuntu@<ec2-ip>:~/"
echo ""
echo "2. SSH into your EC2 instance:"
echo "   ssh -i your-key.pem ubuntu@<ec2-ip>"
echo ""
echo "3. On EC2, extract and restart:"
echo "   unzip -o deployment.zip -d ~/genesoft-infotech"
echo "   cd ~/genesoft-infotech"
echo "   yarn install --production"
echo "   pm2 restart genesoft"
echo ""
echo -e "${GREEN}✅ Deployment package ready!${NC}"

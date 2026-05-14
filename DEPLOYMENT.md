# Deployment Guide - Influencer Management Platform

Complete guide for deploying the full-stack MERN application to production.

## 📋 Pre-Deployment Checklist

### Backend
- [ ] MongoDB Atlas cluster created
- [ ] Cloudinary account set up
- [ ] OpenAI API key obtained
- [ ] Stripe account configured
- [ ] Email service (Gmail/SendGrid) configured
- [ ] Environment variables documented

### Frontend
- [ ] API endpoints configured
- [ ] Stripe public key added
- [ ] Socket.io URL configured
- [ ] Build tested locally

## 🚀 Backend Deployment

### Option 1: Heroku

1. **Install Heroku CLI**
```bash
npm install -g heroku
```

2. **Login to Heroku**
```bash
heroku login
```

3. **Create Heroku App**
```bash
cd server
heroku create your-app-name
```

4. **Set Environment Variables**
```bash
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=your_mongodb_uri
heroku config:set JWT_SECRET=your_jwt_secret
heroku config:set CLOUDINARY_CLOUD_NAME=your_cloud_name
heroku config:set CLOUDINARY_API_KEY=your_api_key
heroku config:set CLOUDINARY_API_SECRET=your_api_secret
heroku config:set OPENAI_API_KEY=your_openai_key
heroku config:set STRIPE_SECRET_KEY=your_stripe_secret
heroku config:set EMAIL_USER=your_email
heroku config:set EMAIL_PASS=your_email_password
heroku config:set CLIENT_URL=https://your-frontend-url.com
```

5. **Deploy**
```bash
git add .
git commit -m "Deploy to Heroku"
git push heroku main
```

6. **Seed Database (Optional)**
```bash
heroku run npm run seed
```

### Option 2: Railway

1. **Install Railway CLI**
```bash
npm install -g @railway/cli
```

2. **Login and Initialize**
```bash
railway login
railway init
```

3. **Add Environment Variables**
Go to Railway dashboard → Variables → Add all environment variables

4. **Deploy**
```bash
railway up
```

### Option 3: DigitalOcean App Platform

1. **Connect GitHub Repository**
- Go to DigitalOcean App Platform
- Create new app from GitHub
- Select your repository

2. **Configure Build Settings**
- Build Command: `npm install`
- Run Command: `npm start`
- Environment: Node.js

3. **Add Environment Variables**
Add all variables from `.env.example`

4. **Deploy**
Click "Deploy" button

### Option 4: AWS EC2

1. **Launch EC2 Instance**
- Ubuntu 22.04 LTS
- t2.micro (free tier)
- Configure security groups (ports 22, 80, 443, 5000)

2. **SSH into Instance**
```bash
ssh -i your-key.pem ubuntu@your-ec2-ip
```

3. **Install Dependencies**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install Nginx
sudo apt install -y nginx
```

4. **Clone and Setup**
```bash
git clone your-repo-url
cd Influencer_management_system/server
npm install
```

5. **Create .env File**
```bash
nano .env
# Add all environment variables
```

6. **Start with PM2**
```bash
pm2 start server.js --name influencer-api
pm2 startup
pm2 save
```

7. **Configure Nginx**
```bash
sudo nano /etc/nginx/sites-available/default
```

Add:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

8. **Restart Nginx**
```bash
sudo systemctl restart nginx
```

9. **Setup SSL with Let's Encrypt**
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## 🎨 Frontend Deployment

### Option 1: Vercel (Recommended)

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Login**
```bash
vercel login
```

3. **Deploy**
```bash
cd client
vercel
```

4. **Set Environment Variables**
Go to Vercel Dashboard → Settings → Environment Variables:
```
VITE_API_BASE_URL=https://your-backend-url.com/api
VITE_SOCKET_URL=https://your-backend-url.com
VITE_STRIPE_PUBLIC_KEY=pk_live_your_stripe_public_key
```

5. **Redeploy**
```bash
vercel --prod
```

### Option 2: Netlify

1. **Install Netlify CLI**
```bash
npm install -g netlify-cli
```

2. **Login**
```bash
netlify login
```

3. **Build**
```bash
cd client
npm run build
```

4. **Deploy**
```bash
netlify deploy --prod --dir=dist
```

5. **Set Environment Variables**
Go to Netlify Dashboard → Site Settings → Environment Variables

6. **Configure Redirects**
Create `client/public/_redirects`:
```
/*    /index.html   200
```

### Option 3: AWS S3 + CloudFront

1. **Build**
```bash
cd client
npm run build
```

2. **Create S3 Bucket**
- Go to AWS S3
- Create bucket with unique name
- Enable static website hosting
- Set index document: `index.html`
- Set error document: `index.html`

3. **Upload Files**
```bash
aws s3 sync dist/ s3://your-bucket-name --delete
```

4. **Create CloudFront Distribution**
- Origin: Your S3 bucket
- Viewer Protocol Policy: Redirect HTTP to HTTPS
- Default Root Object: `index.html`
- Custom Error Response: 404 → /index.html (200)

5. **Set Environment Variables**
Rebuild with production environment variables before uploading

### Option 4: Docker + Docker Hub

1. **Create Dockerfile** (client/Dockerfile)
```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ARG VITE_API_BASE_URL
ARG VITE_SOCKET_URL
ARG VITE_STRIPE_PUBLIC_KEY
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_SOCKET_URL=$VITE_SOCKET_URL
ENV VITE_STRIPE_PUBLIC_KEY=$VITE_STRIPE_PUBLIC_KEY
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

2. **Create nginx.conf**
```nginx
server {
    listen 80;
    location / {
        root /usr/share/nginx/html;
        index index.html;
        try_files $uri $uri/ /index.html;
    }
}
```

3. **Build and Push**
```bash
docker build -t your-username/influencer-frontend \
  --build-arg VITE_API_BASE_URL=https://api.example.com/api \
  --build-arg VITE_SOCKET_URL=https://api.example.com \
  --build-arg VITE_STRIPE_PUBLIC_KEY=pk_live_xxx \
  .
docker push your-username/influencer-frontend
```

## 🔧 Post-Deployment Configuration

### 1. Update CORS Settings
In `server/server.js`, update CORS origin:
```javascript
const corsOptions = {
  origin: ['https://your-frontend-domain.com'],
  credentials: true,
};
```

### 2. Update Socket.io CORS
```javascript
const io = new Server(server, {
  cors: {
    origin: 'https://your-frontend-domain.com',
    credentials: true,
  },
});
```

### 3. Configure Stripe Webhooks
1. Go to Stripe Dashboard → Webhooks
2. Add endpoint: `https://your-backend-url.com/api/subscription/webhook`
3. Select events: `checkout.session.completed`, `customer.subscription.deleted`
4. Copy webhook secret to `STRIPE_WEBHOOK_SECRET` env variable

### 4. Setup MongoDB Indexes
```bash
# Connect to MongoDB
mongosh "your-mongodb-uri"

# Create indexes
use influencer_platform
db.users.createIndex({ email: 1 }, { unique: true })
db.stores.createIndex({ username: 1 }, { unique: true })
db.products.createIndex({ store: 1 })
db.analytics.createIndex({ product: 1, createdAt: -1 })
```

### 5. Configure Email Service

**Gmail:**
1. Enable 2-factor authentication
2. Generate app password
3. Use app password in `EMAIL_PASS`

**SendGrid:**
1. Create API key
2. Update email service in `server/services/emailService.js`

### 6. Setup Monitoring

**Backend Monitoring:**
```bash
# Install PM2 monitoring
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

**Error Tracking:**
- Sentry: Add to both frontend and backend
- LogRocket: Add to frontend for session replay

### 7. Setup Backups

**MongoDB Backups:**
```bash
# Daily backup script
mongodump --uri="your-mongodb-uri" --out=/backups/$(date +%Y%m%d)

# Add to crontab
0 2 * * * /path/to/backup-script.sh
```

**File Backups:**
- Cloudinary handles media backups
- Code in Git repository

## 🔒 Security Checklist

- [ ] All environment variables set correctly
- [ ] HTTPS enabled (SSL certificate)
- [ ] CORS configured for production domains only
- [ ] Rate limiting enabled
- [ ] Helmet.js security headers active
- [ ] MongoDB connection string secured
- [ ] API keys not exposed in frontend
- [ ] JWT secret is strong and unique
- [ ] File upload limits enforced
- [ ] Input validation on all endpoints
- [ ] SQL injection protection (using Mongoose)
- [ ] XSS protection enabled

## 📊 Performance Optimization

### Backend
- [ ] Enable compression middleware
- [ ] Setup Redis for caching
- [ ] Optimize database queries
- [ ] Add database indexes
- [ ] Enable CDN for static assets

### Frontend
- [ ] Enable gzip compression
- [ ] Optimize images (WebP format)
- [ ] Lazy load routes
- [ ] Enable service worker
- [ ] Setup CDN (CloudFront/Cloudflare)

## 🧪 Testing Production

### Backend Health Check
```bash
curl https://your-backend-url.com/api/health
```

### Frontend Check
1. Open browser console
2. Check for errors
3. Test authentication flow
4. Test file uploads
5. Test real-time notifications
6. Test payment flow (Stripe test mode)

### Load Testing
```bash
# Install Apache Bench
sudo apt install apache2-utils

# Test API endpoint
ab -n 1000 -c 10 https://your-backend-url.com/api/products
```

## 🔄 CI/CD Setup

### GitHub Actions

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Heroku
        uses: akhileshns/heroku-deploy@v3.12.12
        with:
          heroku_api_key: ${{secrets.HEROKU_API_KEY}}
          heroku_app_name: "your-app-name"
          heroku_email: "your-email@example.com"
          appdir: "server"

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{secrets.VERCEL_TOKEN}}
          vercel-org-id: ${{secrets.ORG_ID}}
          vercel-project-id: ${{secrets.PROJECT_ID}}
          working-directory: ./client
```

## 📱 Mobile App (Future)

Consider React Native for mobile:
- Reuse API layer
- Reuse business logic
- Native performance
- Push notifications

## 🆘 Troubleshooting

### Backend Issues

**MongoDB Connection Failed:**
```bash
# Check connection string
# Whitelist IP in MongoDB Atlas
# Verify network access
```

**Socket.io Not Connecting:**
```bash
# Check CORS settings
# Verify WebSocket support on hosting
# Check firewall rules
```

**File Upload Failing:**
```bash
# Verify Cloudinary credentials
# Check file size limits
# Verify multer configuration
```

### Frontend Issues

**API Calls Failing:**
- Check CORS configuration
- Verify API URL in environment variables
- Check network tab in browser DevTools

**Build Errors:**
```bash
# Clear cache and rebuild
rm -rf node_modules dist .vite
npm install
npm run build
```

**Environment Variables Not Working:**
- Ensure variables start with `VITE_`
- Rebuild after changing variables
- Check hosting platform environment settings

## 📞 Support

For deployment issues:
1. Check logs: `pm2 logs` or hosting platform logs
2. Review error messages
3. Check environment variables
4. Verify all services are running
5. Test API endpoints individually

## 🎉 Success!

Your Influencer Management Platform is now live! 🚀

Monitor your application:
- Backend: Check PM2 dashboard or hosting logs
- Frontend: Check Vercel/Netlify analytics
- Database: Monitor MongoDB Atlas metrics
- Errors: Setup Sentry or similar service

Remember to:
- Keep dependencies updated
- Monitor performance
- Backup regularly
- Review security periodically
- Scale as needed

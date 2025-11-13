# Deployment Guide

This guide covers cost-effective deployment options for the Personal ERP application.

## Architecture Overview

- **Frontend**: React with Vite
- **Backend**: Node.js with Express
- **Database**: SQLite (development) / PostgreSQL (production)
- **Authentication**: JWT tokens

## Cost-Effective Deployment Options

### Option 1: Free Tier Deployment (Recommended for Personal Use)

#### Frontend Deployment - Vercel (Free)

1. Push your code to GitHub
2. Visit [vercel.com](https://vercel.com)
3. Click "Import Project" and select your repository
4. Configure build settings:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add environment variable:
   - `VITE_API_URL`: Your backend URL (e.g., `https://your-app.railway.app/api`)
6. Deploy

**Alternative**: Netlify (also free) - similar process

#### Backend Deployment - Railway (Free Tier)

1. Visit [railway.app](https://railway.app)
2. Create a new project
3. Select "Deploy from GitHub repo"
4. Choose your repository
5. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npx prisma generate && npm run build`
   - **Start Command**: `npm start`
6. Add environment variables:
   - `DATABASE_URL`: Railway will provide this if you add PostgreSQL
   - `JWT_SECRET`: Generate a secure random string
   - `PORT`: Railway provides this automatically
   - `NODE_ENV`: `production`
7. Add PostgreSQL database:
   - Click "New" → "Database" → "Add PostgreSQL"
   - Railway will automatically set DATABASE_URL
8. Deploy

**Alternatives**:
- **Render** (free tier): Similar to Railway
- **Fly.io** (free tier): Good for containerized apps

#### Database Options

**For Production (Free Tiers)**:
1. **Railway PostgreSQL**: Included with Railway (500MB free)
2. **Supabase**: Free PostgreSQL database (500MB)
3. **PlanetScale**: Serverless MySQL (5GB free)
4. **ElephantSQL**: Free PostgreSQL (20MB - limited)

**For SQLite in Production** (if you want to keep it simple):
- Use Railway with persistent volume
- Good for single-family use, not recommended for multi-tenant

### Option 2: Budget VPS ($5-10/month)

Deploy everything on a single VPS from:
- **DigitalOcean**: $6/month droplet
- **Linode**: $5/month instance
- **Vultr**: $5/month instance
- **Hetzner**: €4.5/month (~$5)

#### Setup on VPS:

```bash
# Install Node.js, Nginx, and PM2
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs nginx
sudo npm install -g pm2

# Clone your repository
git clone https://github.com/yourusername/Personal-ERP-Application.git
cd Personal-ERP-Application

# Setup backend
cd backend
npm install
cp .env.example .env
# Edit .env with your settings
npx prisma migrate deploy
npx prisma generate
npm run build
pm2 start dist/index.js --name "erp-backend"
pm2 save
pm2 startup

# Setup frontend
cd ../frontend
npm install
# Create .env with VITE_API_URL=http://your-domain.com/api
npm run build

# Configure Nginx
sudo nano /etc/nginx/sites-available/erp
```

Nginx configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        root /path/to/Personal-ERP-Application/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site and restart Nginx
sudo ln -s /etc/nginx/sites-available/erp /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Setup SSL with Let's Encrypt (free)
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

### Option 3: Docker Deployment

The application can be containerized for deployment on any platform supporting Docker.

#### Create Dockerfile for Backend:

```dockerfile
# backend/Dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY prisma ./prisma
RUN npx prisma generate

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

#### Create Dockerfile for Frontend:

```dockerfile
# frontend/Dockerfile
FROM node:20-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### Docker Compose (for VPS deployment):

```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://user:password@db:5432/erp
      - JWT_SECRET=${JWT_SECRET}
      - PORT=3000
      - NODE_ENV=production
    depends_on:
      - db

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    environment:
      - VITE_API_URL=http://your-domain.com/api

  db:
    image: postgres:15-alpine
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=erp

volumes:
  postgres_data:
```

## Database Migration to Production

### From SQLite to PostgreSQL:

1. Update `backend/prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"  // Changed from sqlite
  url      = env("DATABASE_URL")
}
```

2. Run migrations:
```bash
cd backend
npx prisma migrate deploy
```

## Cost Summary

### Free Tier (Recommended Start):
- **Frontend** (Vercel/Netlify): Free
- **Backend** (Railway/Render): Free
- **Database** (Railway/Supabase): Free
- **Total**: $0/month (with limitations)

### Budget VPS:
- **Everything on VPS**: $5-10/month
- **Domain**: $10-15/year
- **Total**: ~$5-10/month

### Scaling Costs:
- Start with free tier
- Move to VPS when you need more resources
- Only upgrade when necessary

## Monitoring & Maintenance

- Use PM2 for process management on VPS
- Set up basic logging
- Regular database backups
- Keep dependencies updated

## Security Checklist

- [ ] Change JWT_SECRET to a strong random string
- [ ] Use HTTPS (Let's Encrypt on VPS, automatic on Vercel/Railway)
- [ ] Keep dependencies updated
- [ ] Regular database backups
- [ ] Use environment variables for all secrets
- [ ] Enable CORS only for your frontend domain
- [ ] Set secure password requirements

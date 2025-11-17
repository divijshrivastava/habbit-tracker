# Deployment Guide

This guide will help you deploy the Habit Tracker application to various platforms.

## Prerequisites

1. A MongoDB database (use MongoDB Atlas for free cloud database)
2. Git repository pushed to GitHub

## MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account and cluster
3. Create a database user
4. Whitelist your IP (or use 0.0.0.0/0 for all IPs)
5. Get your connection string (should look like: `mongodb+srv://username:password@cluster.mongodb.net/habit-tracker`)

## Deployment Options

### Option 1: Render.com (Recommended - Free Tier Available)

1. Create an account at [Render.com](https://render.com)
2. Click "New +" and select "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: habit-tracker
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Add Environment Variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: A random secret key (generate one with: `openssl rand -base64 32`)
   - `JWT_EXPIRE`: 7d
   - `NODE_ENV`: production
6. Click "Create Web Service"

### Option 2: Railway.app (Free Tier Available)

1. Install Railway CLI: `npm install -g @railway/cli`
2. Login: `railway login`
3. Initialize: `railway init`
4. Add environment variables:
   ```bash
   railway variables set MONGODB_URI="your-mongodb-uri"
   railway variables set JWT_SECRET="your-jwt-secret"
   railway variables set JWT_EXPIRE="7d"
   railway variables set NODE_ENV="production"
   ```
5. Deploy: `railway up`

### Option 3: Heroku

1. Install Heroku CLI
2. Login: `heroku login`
3. Create app: `heroku create habit-tracker-app`
4. Set environment variables:
   ```bash
   heroku config:set MONGODB_URI="your-mongodb-uri"
   heroku config:set JWT_SECRET="your-jwt-secret"
   heroku config:set JWT_EXPIRE="7d"
   heroku config:set NODE_ENV="production"
   ```
5. Deploy: `git push heroku main`

### Option 4: DigitalOcean App Platform

1. Go to [DigitalOcean](https://www.digitalocean.com)
2. Create a new app
3. Connect your GitHub repository
4. Configure environment variables in the dashboard
5. Deploy

## Environment Variables Required

- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT tokens (generate with `openssl rand -base64 32`)
- `JWT_EXPIRE`: Token expiration time (default: 7d)
- `NODE_ENV`: production
- `PORT`: (Usually auto-assigned by hosting platform)

## Testing Your Deployment

After deployment, test your API:

1. Health check:
   ```bash
   curl https://your-app-url.com/api/health
   ```

2. Register a user:
   ```bash
   curl -X POST https://your-app-url.com/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
   ```

3. Create a habit:
   ```bash
   curl -X POST https://your-app-url.com/api/habits \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -d '{"name":"Exercise","description":"Daily workout","frequency":"daily"}'
   ```

## Troubleshooting

- **MongoDB connection fails**: Check your MongoDB URI and network access settings
- **Server crashes**: Check logs for errors, ensure all environment variables are set
- **CORS errors**: Update `CLIENT_URL` environment variable to match your frontend URL

## Next Steps

After deployment:
1. Note your API URL
2. Set up a frontend application
3. Configure the frontend to use your deployed API
4. Set up monitoring and logging

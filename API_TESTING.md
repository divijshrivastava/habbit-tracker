# API Testing Guide

Your Habit Tracker API is now deployed and live!

## Base URL
```
https://habit-tracker-black-frog-7282.fly.dev
```

## Available Endpoints

### Health Check
```bash
curl https://habit-tracker-black-frog-7282.fly.dev/api/health
```

### 1. User Registration
```bash
curl -X POST https://habit-tracker-black-frog-7282.fly.dev/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

Response:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### 2. User Login
```bash
curl -X POST https://habit-tracker-black-frog-7282.fly.dev/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### 3. Get Current User (Protected Route)
```bash
curl https://habit-tracker-black-frog-7282.fly.dev/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 4. Create a Habit (Protected Route)
```bash
curl -X POST https://habit-tracker-black-frog-7282.fly.dev/api/habits \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name": "Morning Exercise",
    "description": "30 minutes of cardio",
    "frequency": "daily",
    "goal": 1
  }'
```

### 5. Get All Habits (Protected Route)
```bash
curl https://habit-tracker-black-frog-7282.fly.dev/api/habits \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 6. Mark Habit as Complete (Protected Route)
```bash
curl -X POST https://habit-tracker-black-frog-7282.fly.dev/api/habits/HABIT_ID/complete \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "date": "2025-11-17",
    "count": 1,
    "notes": "Completed morning run"
  }'
```

### 7. Get Analytics Overview (Protected Route)
```bash
curl https://habit-tracker-black-frog-7282.fly.dev/api/analytics/overview \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 8. Get Habit Analytics (Protected Route)
```bash
curl https://habit-tracker-black-frog-7282.fly.dev/api/analytics/habit/HABIT_ID \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Quick Test Flow

1. **Register a user** and save the token
2. **Create a habit** using the token
3. **Mark it complete** for today
4. **Check analytics** to see your progress

## Example Complete Flow

```bash
# 1. Register
RESPONSE=$(curl -s -X POST https://habit-tracker-black-frog-7282.fly.dev/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"test123"}')

# Extract token (requires jq)
TOKEN=$(echo $RESPONSE | jq -r '.token')

# 2. Create a habit
HABIT=$(curl -s -X POST https://habit-tracker-black-frog-7282.fly.dev/api/habits \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name":"Read","description":"Read for 30 min","frequency":"daily"}')

# Extract habit ID
HABIT_ID=$(echo $HABIT | jq -r '.data._id')

# 3. Mark complete
curl -X POST https://habit-tracker-black-frog-7282.fly.dev/api/habits/$HABIT_ID/complete \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"date":"2025-11-17"}'

# 4. View analytics
curl https://habit-tracker-black-frog-7282.fly.dev/api/analytics/overview \
  -H "Authorization: Bearer $TOKEN"
```

## Features

✅ User authentication with JWT
✅ Create and manage habits
✅ Track daily completions
✅ Automatic streak calculation
✅ Analytics and projections
✅ Success rate tracking
✅ 30-day completion history

## Next Steps

1. Build a frontend (React, Vue, or Angular)
2. Connect frontend to this API
3. Add more features (reminders, social sharing, etc.)
4. Set up monitoring and error tracking
5. Add rate limiting for production

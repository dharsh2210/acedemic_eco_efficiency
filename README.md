# Eco-Efficiency Tracker — Deployment Guide

## 🚀 Deploy in 3 Steps

---

### STEP 1: MongoDB Atlas (Free Database)

1. Go to **https://mongodb.com/atlas** → Create free account
2. Create a **free M0 cluster** (choose any region)
3. Under **Database Access** → Add user (e.g. `ecouser`) with a strong password
4. Under **Network Access** → Add IP Address → **Allow Access from Anywhere** (0.0.0.0/0)
5. Click **Connect** → **Connect your application** → Copy the connection string
6. It looks like: `mongodb+srv://ecouser:PASSWORD@cluster0.xxxxx.mongodb.net/`
7. Add `/eco_tracker` at the end: `mongodb+srv://ecouser:PASSWORD@cluster0.xxxxx.mongodb.net/eco_tracker`

---

### STEP 2: Deploy Backend on Render

1. Push this project to **GitHub**
2. Go to **https://render.com** → New → **Web Service**
3. Connect your GitHub repo
4. Set these settings:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: `Node`
5. Add **Environment Variables**:
   ```
   MONGO_URI    = mongodb+srv://ecouser:PASSWORD@cluster0.xxxxx.mongodb.net/eco_tracker
   JWT_SECRET   = any_long_random_string_here_like_abc123xyz456
   NODE_ENV     = production
   PORT         = 5000
   ```
6. Click **Create Web Service** — wait for deployment
7. Copy your backend URL e.g. `https://eco-backend-xxxx.onrender.com`
8. **Seed the database**: In Render dashboard → your backend service → **Shell** tab:
   ```bash
   node seed.js
   ```

---

### STEP 3: Deploy Frontend on Render

1. In Render → New → **Static Site**
2. Connect same GitHub repo
3. Set these settings:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `build`
4. Add **Environment Variable**:
   ```
   REACT_APP_API_URL = https://eco-backend-xxxx.onrender.com/api
   ```
   (Replace with YOUR actual backend URL from Step 2)
5. Under **Redirects/Rewrites** → Add rule:
   - Source: `/*`
   - Destination: `/index.html`
   - Action: `Rewrite`
6. Click **Create Static Site**

---

## ✅ Login Credentials (after seeding)

| Role                  | Email                   | Password |
|-----------------------|-------------------------|----------|
| Sustainability Officer| john@campus.edu         | admin123 |
| Energy Technician     | mike@energy.edu         | pass123  |
| NMC Member            | alex@energy.edu         | pass123  |
| Plumbing Specialist   | tom@water.edu           | pass123  |
| Irrigation Manager    | irr@water.edu           | pass123  |
| Waste Manager         | manager@waste.edu       | pass123  |
| Sanitation Officer    | sanitation@waste.edu    | pass123  |

**Admin Portal Password** (on login page): `1234`

---

## 💻 Local Development

```bash
# Backend
cd backend
npm install
# Create .env with your Atlas URI (or local MongoDB)
echo "MONGO_URI=mongodb://localhost:27017/eco_tracker" > .env
echo "JWT_SECRET=localsecret123" >> .env
echo "PORT=5000" >> .env
node seed.js
npm run dev

# Frontend (new terminal)
cd frontend
npm install
# For local dev, proxy is already set to localhost:5000 in package.json
npm start
```

---

## 🔧 Common Issues

| Problem | Fix |
|---------|-----|
| Login fails | Make sure you ran `node seed.js` after deploying |
| CORS error | Backend `server.js` already has `origin: '*'` — should be fine |
| "Cannot GET /api/..." | Check backend is running and `REACT_APP_API_URL` points to correct URL |
| Blank page on frontend | Make sure the Rewrite rule `/* → /index.html` is set in Render |
| MongoDB connection error | Check Atlas Network Access allows `0.0.0.0/0` and URI is correct |
| Render sleeps (free tier) | Free tier sleeps after 15min. First load may take 30-60 seconds to wake up |


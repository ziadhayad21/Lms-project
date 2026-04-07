# English LMS Deployment Guide 🚀

This guide provides step-by-step instructions to deploy your LMS platform to production using **Render** (Backend), **Vercel** (Frontend), and **MongoDB Atlas** (Database).

---

## 1. Database Setup (MongoDB Atlas)

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a new Cluster (Shared Tier is free).
3. Under **Network Access**, add `0.0.0.0/0` (Allow access from anywhere) for deployment.
4. Under **Database Access**, create a user with a strong password.
5. Click **Connect** -> **Connect your application** and copy the **Connection String**.
   - It should look like: `mongodb+srv://<user>:<password>@cluster0.xxx.mongodb.net/english-lms?retryWrites=true&w=majority`

---

## 2. Backend Deployment (Render)

1. Create an account at [Render](https://render.com).
2. Click **New +** -> **Web Service**.
3. Connect your GitHub/GitLab repository.
4. Set the following configurations:
   - **Name:** `english-lms-api`
   - **Environment:** `Node`
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. Click **Advanced** -> **Add Environment Variable**:
   - `MONGODB_URI`: (Your MongoDB Atlas connection string)
   - `JWT_SECRET`: (A long random string)
   - `NODE_ENV`: `production`
   - `CLIENT_URL`: `https://your-app-name.vercel.app` (You can update this after deploying the frontend)
6. Click **Create Web Service**.

---

## 3. Frontend Deployment (Vercel)

1. Create an account at [Vercel](https://vercel.com).
2. Click **Add New** -> **Project**.
3. Import your GitHub repository.
4. Set the following configurations:
   - **Framework Preset:** `Next.js`
   - **Root Directory:** `frontend`
   - **Environment Variables**:
     - `NEXT_PUBLIC_API_URL`: `https://your-render-api-url.onrender.com/api/v1`
5. Click **Deploy**.

---

## 4. Final Connection

1. Once the frontend is deployed, copy its URL (e.g., `https://english-lms.vercel.app`).
2. Go back to your **Render** dashboard -> **Environment**.
3. Update the `CLIENT_URL` variable to your Vercel URL.
4. Render will automatically redeploy the backend.
5. **Test:** Navigate to your Vercel URL and try to login!

---

## 💡 Troubleshooting

- **CORS Errors:** Ensure the `CLIENT_URL` on Render exactly matches your Vercel URL (including `https://` and no trailing slash).
- **Upload Issues:** Render's free tier has an ephemeral filesystem. If you need uploaded videos to persist forever, consider using **Render Blueprints with a Disk** or connecting to **AWS S3/Cloudinary**.
- **Cold Start:** Render's free tier sleeps after 15 minutes of inactivity. The first request to the API might take ~30 seconds to wake up the server.

---

**Happy Teaching! 🎓**

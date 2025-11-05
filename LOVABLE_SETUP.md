# Lovable Preview Setup Guide

## Current Port Configuration

- **Frontend (Vite)**: Port 8080 (local development)
- **Backend (Spring Boot)**: Port 8082
- **MongoDB**: Port 27017

## For Lovable Preview Mode

When using Lovable preview, the frontend runs on Lovable's servers (lovable.dev domain), so it cannot access `localhost`. You need to expose your local backend to the internet.

### Option 1: Using ngrok (Recommended)

1. **Install ngrok**: Download from https://ngrok.com/

2. **Start your backend** (if not already running):
   ```powershell
   cd job-clock-sync\backend
   mvn spring-boot:run
   ```

3. **Expose backend with ngrok**:
   ```powershell
   ngrok http 8082
   ```

4. **Copy the ngrok URL** (e.g., `https://abc123.ngrok.io`)

5. **Set environment variable in Lovable**:
   - Go to your Lovable project settings
   - Add environment variable: `VITE_API_URL=https://abc123.ngrok.io/api`
   - Or create `.env` file in project root with: `VITE_API_URL=https://abc123.ngrok.io/api`

### Option 2: Using localtunnel

1. **Install localtunnel**:
   ```powershell
   npm install -g localtunnel
   ```

2. **Expose backend**:
   ```powershell
   lt --port 8082
   ```

3. **Use the provided URL** and set `VITE_API_URL` in Lovable

### Option 3: Using cloudflared

1. **Install cloudflared**: Download from https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/

2. **Expose backend**:
   ```powershell
   cloudflared tunnel --url http://localhost:8082
   ```

3. **Use the provided URL** and set `VITE_API_URL` in Lovable

## CORS Configuration

The backend is already configured to allow requests from:
- `http://localhost:*` (local development)
- `https://*.lovable.dev` (Lovable preview)
- `https://lovable.dev` (Lovable production)

## Testing

After setting up the tunnel:

1. Verify backend is accessible: `https://your-tunnel-url/api/auth/login`
2. Set `VITE_API_URL` in Lovable environment variables
3. Test the preview in Lovable

## Notes

- Keep the tunnel running while using Lovable preview
- The tunnel URL changes each time you restart ngrok (free tier)
- For production, deploy your backend to a cloud service (AWS, Heroku, etc.)


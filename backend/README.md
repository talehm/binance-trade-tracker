
# Binance Trading App Backend

This is a secure Node.js backend for the Binance Trading App. It provides proxy services to the Binance API while adding security layers.

## Security Features

- API Key authentication for frontend-backend communication
- Rate limiting to prevent abuse
- CORS protection to limit request origins
- Helmet for setting secure HTTP headers
- Request size limiting to prevent abuse
- HMAC signature verification for Binance API requests

## Setup Instructions

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
3. Copy the example environment file and update it with your values:
   ```
   cp .env.example .env
   ```
4. Start the development server:
   ```
   npm run dev
   ```

## Environment Variables

- `PORT`: The port on which the server runs (default: 5000)
- `NODE_ENV`: Environment mode (development/production)
- `FRONTEND_URL`: Your frontend application URL for CORS
- `API_KEY`: Secret API key for frontend-backend authentication

## API Endpoints

- `GET /api/health`: Health check endpoint
- `/api/binance/*`: Proxy to Binance API (requires authentication)

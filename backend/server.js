
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const { createProxyMiddleware } = require('http-proxy-middleware');
const crypto = require('crypto');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet()); // Set security headers
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173', // Allow only our frontend
  credentials: true
}));
app.use(express.json({ limit: '10kb' })); // Limit request body size

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests, please try again later.'
});
app.use('/api', apiLimiter);

// Authentication middleware
const authenticateApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  
  if (!apiKey || apiKey !== process.env.API_KEY) {
    return res.status(401).json({ error: 'Unauthorized: Invalid API key' });
  }
  
  next();
};

// Routes
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Binance API proxy with authentication using env variables
app.use('/api/binance', authenticateApiKey, createProxyMiddleware({
  target: 'https://api.binance.com',
  changeOrigin: true,
  pathRewrite: {
    '^/api/binance': '/'
  },
  onProxyReq: (proxyReq, req) => {
    // Add Binance API key header from environment variable
    proxyReq.setHeader('X-MBX-APIKEY', process.env.BINANCE_API_KEY);
    
    // For endpoints requiring signatures
    if (req.method === 'POST' || req.url.includes('api/v3/account')) {
      const timestamp = Date.now();
      
      // Add timestamp parameter
      let query = `timestamp=${timestamp}`;
      
      // Calculate signature using environment variable
      const signature = crypto
        .createHmac('sha256', process.env.BINANCE_API_SECRET)
        .update(query)
        .digest('hex');
      
      // Add signature to query
      query += `&signature=${signature}`;
      
      // Append to URL for GET requests
      if (req.method === 'GET') {
        proxyReq.path += (proxyReq.path.includes('?') ? '&' : '?') + query;
      }
    }
  }
}));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`💻 Health check available at http://localhost:${PORT}/api/health`);
  console.log(`🔒 API is protected with API key authentication`);
});

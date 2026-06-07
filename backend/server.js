const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
const isProduction = process.env.NODE_ENV === 'production';
app.use(cors({
  origin: isProduction ? true : 'http://localhost:5173',
  credentials: true
}));

// Routes
app.use('/api/auth', require('./routes/auth'));

// Serve static files in production
if (isProduction) {
  const fs = require('fs');
  const frontendDistPath = path.join(__dirname, '../frontend/dist');
  
  // Check if dist folder exists
  if (fs.existsSync(frontendDistPath)) {
    app.use(express.static(frontendDistPath));
    
    // Handle SPA routing - all non-API routes return index.html
    app.get('*', (req, res, next) => {
      if (!req.path.startsWith('/api')) {
        res.sendFile(path.join(frontendDistPath, 'index.html'));
      } else {
        next();
      }
    });
  } else {
    console.warn('Warning: frontend/dist not found. Please build the frontend first.');
  }
}

// Basic route
app.get('/', (req, res) => {
  if (isProduction) {
    const fs = require('fs');
    const indexPath = path.join(__dirname, '../frontend/dist', 'index.html');
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.json({ message: 'Welcome to the API (Frontend not built)' });
    }
  } else {
    res.json({ message: 'Welcome to the API' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3000;

// Connect to database and start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${isProduction ? 'production' : 'development'}`);
  });
}).catch(err => {
  console.error('Failed to connect to database:', err.message);
  process.exit(1);
});

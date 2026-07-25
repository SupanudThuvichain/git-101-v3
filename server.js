const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// ========================================================
// MIDDLEWARE
// ========================================================

// Security headers (relaxed CSP for CDN assets: Leaflet, FontAwesome, Google Fonts, CARTO tiles, etc.)
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "https://unpkg.com"],
        styleSrc: [
          "'self'",
          "'unsafe-inline'",
          "https://unpkg.com",
          "https://fonts.googleapis.com",
          "https://cdnjs.cloudflare.com",
        ],
        fontSrc: [
          "'self'",
          "https://fonts.gstatic.com",
          "https://cdnjs.cloudflare.com",
        ],
        imgSrc: [
          "'self'",
          "data:",
          "https://*.basemaps.cartocdn.com",
          "https://server.arcgisonline.com",
          "https://*.tile.opentopomap.org",
          "https://*.tile.openstreetmap.org",
        ],
        connectSrc: ["'self'"],
        frameSrc: ["'self'"],
      },
    },
    crossOriginEmbedderPolicy: false, // allow iframe embedding of map.html from index.html
  })
);

// HTTP request logging
app.use(morgan('dev'));

// ========================================================
// STATIC FILES
// ========================================================
app.use(express.static(path.join(__dirname, 'public')));

// ========================================================
// API ROUTES
// ========================================================

// GET /api/traffic-lights — returns the full traffic lights JSON dataset
app.get('/api/traffic-lights', (req, res) => {
  res.sendFile(path.join(__dirname, 'data', 'trafficLights.json'));
});

// ========================================================
// CATCH-ALL: serve index.html for any unmatched route (SPA-like)
// ========================================================
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ========================================================
// START SERVER
// ========================================================
app.listen(PORT, () => {
  console.log(`\n🚦 Phetchaburi Traffic Lights Map Server`);
  console.log(`   ➜ Local:   http://localhost:${PORT}`);
  console.log(`   ➜ API:     http://localhost:${PORT}/api/traffic-lights`);
  console.log(`   ➜ Map:     http://localhost:${PORT}/map.html\n`);
});

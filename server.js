// server.js
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';
import cookieParser from 'cookie-parser';

// Setup __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5500;

const CLIENT_ID = '1407901384187183284';
const CLIENT_SECRET = 'fX-w_gdFfdrJ5cLcO3Z_1_xd8VVC5Zkq';
const REDIRECT_URI = 'http://localhost:5500/callback'; // Change to your deployed URL when live

// Middleware
app.use(cookieParser());
app.use(express.static(path.join(__dirname)));

// Home page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Check login
app.get('/check-login', async (req, res) => {
  const token = req.cookies.discord_token;
  if (!token) return res.json({ loggedIn: false });

  try {
    const userRes = await fetch('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (userRes.status === 200) {
      const userData = await userRes.json();
      return res.json({ loggedIn: true, username: userData.username });
    } else {
      return res.json({ loggedIn: false });
    }
  } catch {
    return res.json({ loggedIn: false });
  }
});

// Discord OAuth2 callback
app.get('/callback', async (req, res) => {
  const code = req.query.code;

  if (!code) return res.send('No code provided');

  try {
    const params = new URLSearchParams({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: 'authorization_code',
      code,
      redirect_uri: REDIRECT_URI,
      scope: 'identify'
    });

    const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      body: params,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    const tokenData = await tokenResponse.json();
    if (!tokenData.access_token) return res.send('Error: No access token received');

    // Set token as HTTP-only cookie
    res.cookie('discord_token', tokenData.access_token, { httpOnly: true });

    // Redirect back to home
    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.send('Error logging in');
  }
});

// Dummy routes
app.get('/edit-profile', (req,res)=>res.send('Edit Profile Page (Coming Soon)'));
app.get('/leaderboard', (req,res)=>res.send('Leaderboard Page (Coming Soon)'));
app.get('/search', (req,res)=>res.send('Search for Controller Page (Coming Soon)'));

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

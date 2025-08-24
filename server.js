// server.js
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = 5500;

const CLIENT_ID = '1407901384187183284';
const CLIENT_SECRET = 'fX-w_gdFfdrJ5cLcO3Z_1_xd8VVC5Zkq';
const REDIRECT_URI = 'https://radarly.online/callback';

app.use(express.static(path.join(__dirname)));

// Home page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Discord OAuth2 callback
app.get('/callback', async (req, res) => {
  const code = req.query.code;
  if (!code) return res.send('No code provided');

  try {
    // Exchange code for access token
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

    // Get user info
    const userResponse = await fetch('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` }
    });

    const userData = await userResponse.json();

    // Send callback page with welcome and buttons
    res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Radarly</title>
<link rel="stylesheet" href="style.css">
</head>
<body>
  <div id="overlay"></div>
  <img src="/RadarlyLogo.PNG" alt="Radarly Logo" id="logo">
  <div class="card">
    <div class="welcome">Welcome back,</div>
    <div class="username">${userData.username}</div>
    <div class="buttons">
      <a href="/edit-profile" class="edit-profile">Edit Profile</a>
      <a href="/leaderboard" class="leaderboard">Leaderboard</a>
      <a href="/search" class="search-controller">Search for Controller</a>
    </div>
  </div>
  <script>
    const images = [
      '/images/bg1.PNG','/images/bg2.PNG','/images/bg3.PNG','/images/bg4.PNG',
      '/images/bg5.PNG','/images/bg6.PNG','/images/bg7.PNG','/images/bg8.PNG',
      '/images/bg9.PNG','/images/bg10.PNG'
    ];
    const randomImage = images[Math.floor(Math.random() * images.length)];
    document.body.style.backgroundImage = \`url('\${randomImage}')\`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundRepeat = 'no-repeat';
  </script>
</body>
</html>
    `);

  } catch (error) {
    console.error(error);
    res.send('Error logging in');
  }
});

// Dummy routes for buttons
app.get('/edit-profile', (req,res)=>res.send('Edit Profile Page (Coming Soon)'));
app.get('/leaderboard', (req,res)=>res.send('Leaderboard Page (Coming Soon)'));
app.get('/search', (req,res)=>res.send('Search for Controller Page (Coming Soon)'));

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

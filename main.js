const CLIENT_ID = '1407901384187183284';
const REDIRECT_URI = encodeURIComponent(window.location.origin + '/callback');
const SCOPE = 'identify';
const actionBtn = document.getElementById('action-btn');

const images = [
  '/images/bg1.PNG',
  '/images/bg2.PNG',
  '/images/bg3.PNG',
  '/images/bg4.PNG',
  '/images/bg5.PNG',
  '/images/bg6.PNG',
  '/images/bg7.PNG',
  '/images/bg8.PNG',
  '/images/bg9.PNG',
  '/images/bg10.PNG'
];

// Random background image
const randomImage = images[Math.floor(Math.random() * images.length)];
document.body.style.backgroundImage = `url('${randomImage}')`;

// Check if user is already logged in
async function checkLogin() {
  try {
    const res = await fetch('/check-login');
    const data = await res.json();

    if (data.loggedIn) {
      actionBtn.textContent = `Continue as ${data.username}`;
      actionBtn.href = '/'; // Continue to homepage
    } else {
      actionBtn.textContent = 'Login with Discord';
      actionBtn.href = `https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${REDIRECT_URI}&scope=${SCOPE}`;
    }
  } catch (err) {
    console.error('Error checking login:', err);
    actionBtn.textContent = 'Login with Discord';
    actionBtn.href = `https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${REDIRECT_URI}&scope=${SCOPE}`;
  }
}

checkLogin();

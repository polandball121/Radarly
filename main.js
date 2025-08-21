// This version did NOT check login persistently
// Random background for home page

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

const randomImage = images[Math.floor(Math.random() * images.length)];
document.body.style.backgroundImage = `url('${randomImage}')`;
document.body.style.backgroundSize = 'cover';
document.body.style.backgroundPosition = 'center';
document.body.style.backgroundRepeat = 'no-repeat';

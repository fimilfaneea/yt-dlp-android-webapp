// Node.js script to generate base64 icons
const fs = require('fs');

function generateIconSVG(size) {
  const svg = `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <circle cx="${size/2}" cy="${size/2}" r="${size * 0.45}" fill="#de0000"/>
  <g stroke="white" stroke-width="${size * 0.06}" stroke-linecap="round" fill="none">
    <line x1="${size/2}" y1="${size * 0.25}" x2="${size/2}" y2="${size * 0.6}"/>
    <polyline points="${size * 0.38},${size * 0.48} ${size/2},${size * 0.6} ${size * 0.62},${size * 0.48}"/>
    <line x1="${size * 0.3}" y1="${size * 0.7}" x2="${size * 0.7}" y2="${size * 0.7}"/>
  </g>
  <text x="${size/2}" y="${size * 0.85}" font-family="Arial" font-size="${size * 0.12}" font-weight="bold" fill="white" text-anchor="middle">YT</text>
</svg>`;
  return svg;
}

// Generate SVG icons
fs.writeFileSync('public/icon-192.svg', generateIconSVG(192));
fs.writeFileSync('public/icon-512.svg', generateIconSVG(512));

console.log('SVG icons generated successfully!');
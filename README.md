# YT-DLP for Termux (React)

A minimal React web app that generates yt-dlp commands for Termux on Android devices.

## Features

- 🎨 Material You dark theme design
- 📋 Auto-paste URL from clipboard
- 📥 Copy download command for Termux
- 🔄 Copy update command for yt-dlp
- 📱 PWA installable
- ⚡ Built with Vite + React

## Prerequisites

### On Android:
1. Install **Termux** from [F-Droid](https://f-droid.org/packages/com.termux/)
2. In Termux, run:
   ```bash
   pkg update && pkg upgrade
   pkg install python
   pip install yt-dlp
   termux-setup-storage
   ```

## Usage

1. Open the web app
2. URL auto-fills from clipboard
3. Tap **Copy Command** to copy the download command
4. Open Termux and paste the command
5. Press Enter to download

Downloads are saved to: `/storage/emulated/0/Download/yt-dlp/`

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment

Deploy to Vercel:
```bash
npm run deploy
```

Or push to GitHub and import in Vercel dashboard.

## Tech Stack

- React 18
- Vite
- Vercel Analytics
- PWA Support

## License

MIT
import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [url, setUrl] = useState('')
  const [status, setStatus] = useState({ message: '', type: '' })
  const [copiedButton, setCopiedButton] = useState('')
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showInstallButton, setShowInstallButton] = useState(false)

  // Auto-paste URL from clipboard on mount
  useEffect(() => {
    const pasteFromClipboard = async () => {
      try {
        if (navigator.clipboard && navigator.clipboard.readText) {
          const text = await navigator.clipboard.readText()
          if (text && isValidURL(text)) {
            setUrl(text)
          }
        }
      } catch (err) {
        console.log('Clipboard access not available')
      }
    }
    pasteFromClipboard()
  }, [])

  // PWA install prompt handler
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowInstallButton(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const isValidURL = (string) => {
    try {
      const url = new URL(string)
      return url.protocol === 'http:' || url.protocol === 'https:'
    } catch (_) {
      return false
    }
  }

  const showStatus = (message, type = 'info') => {
    setStatus({ message, type })
    setTimeout(() => {
      setStatus({ message: '', type: '' })
    }, 3000)
  }

  const copyToClipboard = async (text, buttonName) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedButton(buttonName)
      setTimeout(() => setCopiedButton(''), 2000)
      return true
    } catch (err) {
      console.error('Failed to copy:', err)
      return false
    }
  }

  const validateUrl = () => {
    if (!url) {
      showStatus('Please enter a URL', 'error')
      return false
    }
    if (!isValidURL(url)) {
      showStatus('Please enter a valid URL', 'error')
      return false
    }
    return true
  }

  const handleDownload = async () => {
    if (!validateUrl()) return

    const command = `mkdir -p /storage/emulated/0/Download/yt-dlp && cd /storage/emulated/0/Download/yt-dlp && yt-dlp --no-part "${url}"`
    const copied = await copyToClipboard(command, 'download')

    if (copied) {
      showStatus('Command copied! Paste in Termux', 'success')
    } else {
      showStatus('Failed to copy command', 'error')
    }
  }

  const handleDownload360 = async () => {
    if (!validateUrl()) return

    const command = `mkdir -p /storage/emulated/0/Download/yt-dlp && cd /storage/emulated/0/Download/yt-dlp && yt-dlp --no-part -f "bestvideo[height<=360]+bestaudio/best[height<=360]" "${url}"`
    const copied = await copyToClipboard(command, '360p')

    if (copied) {
      showStatus('360p command copied! Paste in Termux', 'success')
    } else {
      showStatus('Failed to copy command', 'error')
    }
  }

  const handleDownload480 = async () => {
    if (!validateUrl()) return

    const command = `mkdir -p /storage/emulated/0/Download/yt-dlp && cd /storage/emulated/0/Download/yt-dlp && yt-dlp --no-part -f "bestvideo[height<=480]+bestaudio/best[height<=480]" "${url}"`
    const copied = await copyToClipboard(command, '480p')

    if (copied) {
      showStatus('480p command copied! Paste in Termux', 'success')
    } else {
      showStatus('Failed to copy command', 'error')
    }
  }

  const handleDownloadAudio = async () => {
    if (!validateUrl()) return

    const command = `mkdir -p /storage/emulated/0/Download/yt-dlp && cd /storage/emulated/0/Download/yt-dlp && yt-dlp --no-part -x --audio-format mp3 "${url}"`
    const copied = await copyToClipboard(command, 'audio')

    if (copied) {
      showStatus('Audio command copied! Paste in Termux', 'success')
    } else {
      showStatus('Failed to copy command', 'error')
    }
  }

  const handleUpdate = async () => {
    const command = 'pip install -U "yt-dlp[default]"'
    const copied = await copyToClipboard(command, 'update')

    if (copied) {
      showStatus('Update command copied! Paste in Termux', 'info')
    } else {
      showStatus('Failed to copy command', 'error')
    }
  }

  const handleClear = () => {
    setUrl('')
  }

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      if (outcome === 'accepted') {
        setShowInstallButton(false)
      }
      setDeferredPrompt(null)
    }
  }

  return (
    <div className="container">
      {/* Header */}
      <header className="header">
        <h1 className="title">YT-DLP</h1>
        <span className="subtitle">for Termux</span>
      </header>

      {/* Main Card */}
      <div className="card">
        {/* URL Input Section */}
        <div className="input-group">
          <label htmlFor="url-input" className="input-label">
            Video URL
          </label>
          <div className="input-wrapper">
            <input
              type="url"
              id="url-input"
              className="input-field"
              placeholder="Paste YouTube URL here"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleDownload()}
              autoComplete="off"
              spellCheck="false"
            />
            {url && (
              <button
                className="clear-btn"
                onClick={handleClear}
                aria-label="Clear"
              >
                <span className="material-icons">clear</span>
              </button>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="button-group">
          <button
            className={`btn btn-primary ${copiedButton === 'download' ? 'success' : ''}`}
            onClick={handleDownload}
          >
            <span className="material-icons">
              {copiedButton === 'download' ? 'check' : 'content_copy'}
            </span>
            <span>{copiedButton === 'download' ? 'Copied!' : 'Best Quality'}</span>
          </button>

          <button
            className={`btn btn-primary ${copiedButton === '480p' ? 'success' : ''}`}
            onClick={handleDownload480}
          >
            <span className="material-icons">
              {copiedButton === '480p' ? 'check' : 'hd'}
            </span>
            <span>{copiedButton === '480p' ? 'Copied!' : '480p'}</span>
          </button>

          <button
            className={`btn btn-primary ${copiedButton === '360p' ? 'success' : ''}`}
            onClick={handleDownload360}
          >
            <span className="material-icons">
              {copiedButton === '360p' ? 'check' : 'sd'}
            </span>
            <span>{copiedButton === '360p' ? 'Copied!' : '360p'}</span>
          </button>

          <button
            className={`btn btn-primary ${copiedButton === 'audio' ? 'success' : ''}`}
            onClick={handleDownloadAudio}
          >
            <span className="material-icons">
              {copiedButton === 'audio' ? 'check' : 'music_note'}
            </span>
            <span>{copiedButton === 'audio' ? 'Copied!' : 'Audio MP3'}</span>
          </button>

          <button
            className={`btn btn-secondary ${copiedButton === 'update' ? 'success' : ''}`}
            onClick={handleUpdate}
          >
            <span className="material-icons">
              {copiedButton === 'update' ? 'check' : 'update'}
            </span>
            <span>{copiedButton === 'update' ? 'Copied!' : 'Update YT-DLP'}</span>
          </button>
        </div>

        {/* Status Message */}
        {status.message && (
          <div className={`status ${status.type}`}>
            {status.message}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="footer">
        <p className="hint">Downloads save to: /Download/</p>
        <p className="hint-secondary">Paste command in Termux to download</p>
      </footer>

      {/* PWA Install Button */}
      {showInstallButton && (
        <button className="install-button" onClick={handleInstallClick}>
          <span className="material-icons">download</span>
          Install App
        </button>
      )}
    </div>
  )
}

export default App
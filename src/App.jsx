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

  const handleDownload = async () => {
    if (!url) {
      showStatus('Please enter a URL', 'error')
      return
    }

    if (!isValidURL(url)) {
      showStatus('Please enter a valid URL', 'error')
      return
    }

    const command = `cd /storage/emulated/0/Download && yt-dlp -o "%(title)[:15]s.%(ext)s" --replace-in-metadata title "[^a-zA-Z0-9]" "" "${url}"`
    const copied = await copyToClipboard(command, 'download')

    if (copied) {
      showStatus('Command copied! Paste in Termux', 'success')
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
            <span>{copiedButton === 'download' ? 'Copied!' : 'Copy Command'}</span>
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
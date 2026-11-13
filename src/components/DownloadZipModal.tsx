import React, { useState } from 'react';
import { Download, Copy, Check, ExternalLink, X, Terminal, FileArchive, Sparkles } from 'lucide-react';
import { soundEffects } from '../utils/soundEffects.ts';

interface DownloadZipModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DownloadZipModal: React.FC<DownloadZipModalProps> = ({ isOpen, onClose }) => {
  const [downloadStatus, setDownloadStatus] = useState<'idle' | 'downloading' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCurl, setCopiedCurl] = useState(false);
  const [copiedWget, setCopiedWget] = useState(false);

  if (!isOpen) return null;

  // The full public domain URL of this running Cloud Run development server
  const publicAppUrl = window.location.origin;
  const directZipUrl = `${publicAppUrl}/sanatanverse-source.zip`;
  const curlCmd = `curl -LO "${directZipUrl}"`;
  const wgetCmd = `wget "${directZipUrl}"`;

  const handleBlobDownload = async () => {
    soundEffects.playPanelSwoosh();
    setDownloadStatus('downloading');
    setStatusMessage('Preparing archive stream...');

    try {
      // Step 1: Attempt standard blob download via fetch
      const resp = await fetch('/api/download-zip');
      if (resp.ok) {
        const blob = await resp.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = blobUrl;
        a.download = 'sanatanverse-source.zip';
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
          window.URL.revokeObjectURL(blobUrl);
          document.body.removeChild(a);
        }, 300);

        soundEffects.playTempleBell();
        setDownloadStatus('success');
        setStatusMessage('ZIP download initiated! Check your browser downloads folder.');
        return;
      }
    } catch (err) {
      console.warn('Direct blob fetch failed, trying base64 fallback...', err);
    }

    // Step 2: Resilient Base64 Fallback (bypasses any iframe network restriction)
    try {
      setStatusMessage('Direct stream interrupted, assembling from base64 memory buffer...');
      const fallbackResp = await fetch('/api/zip-base64');
      if (!fallbackResp.ok) throw new Error('Base64 backup endpoint returned ' + fallbackResp.status);
      const data = await fallbackResp.json();
      
      const byteCharacters = atob(data.base64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const fallbackBlob = new Blob([byteArray], { type: 'application/zip' });

      const blobUrl = window.URL.createObjectURL(fallbackBlob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = blobUrl;
      a.download = 'sanatanverse-source.zip';
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        window.URL.revokeObjectURL(blobUrl);
        document.body.removeChild(a);
      }, 300);

      soundEffects.playTempleBell();
      setDownloadStatus('success');
      setStatusMessage('ZIP downloaded successfully via memory buffer!');
    } catch (e: unknown) {
      const errText = e instanceof Error ? e.message : 'Unknown error';
      setDownloadStatus('error');
      setStatusMessage(`Browser blocked automatic download (${errText}). Please use the direct link or curl command below!`);
    }
  };

  const copyToClipboard = async (text: string, type: 'link' | 'curl' | 'wget') => {
    try {
      await navigator.clipboard.writeText(text);
      soundEffects.playPanelSwoosh();
      if (type === 'link') {
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2500);
      } else if (type === 'curl') {
        setCopiedCurl(true);
        setTimeout(() => setCopiedCurl(false), 2500);
      } else if (type === 'wget') {
        setCopiedWget(true);
        setTimeout(() => setCopiedWget(false), 2500);
      }
    } catch {
      // Fallback
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-2xl bg-[#0f0e0d] border border-amber-500/40 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-amber-950/50 text-stone-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <FileArchive className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-amber-300">
                Download SanatanVerse Codebase
              </h3>
              <p className="text-xs text-stone-400">
                Complete, production-ready React 19 + Express + Tailwind v4 repository
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              soundEffects.playPanelSwoosh();
              onClose();
            }}
            className="p-1.5 text-stone-400 hover:text-stone-100 hover:bg-stone-800/60 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="mt-5 space-y-5">
          {/* Option 1: Direct In-Memory Browser Download */}
          <div className="p-4 rounded-xl bg-stone-900/90 border border-stone-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-stone-200 font-semibold text-sm">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Method 1: Direct Browser Download</span>
              </div>
              <span className="text-[11px] text-amber-400/90 bg-amber-950/60 border border-amber-500/30 px-2 py-0.5 rounded-full">
                ~189 KB (.zip)
              </span>
            </div>

            <p className="text-xs text-stone-400 leading-relaxed">
              Triggers a direct download using memory buffer streaming. Bypasses iframe sandbox download blocks.
            </p>

            <button
              onClick={handleBlobDownload}
              disabled={downloadStatus === 'downloading'}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-bold text-stone-950 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 hover:brightness-110 active:scale-[0.99] rounded-lg transition-all shadow-md shadow-amber-500/20 disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>{downloadStatus === 'downloading' ? 'Assembling Archive...' : 'Download sanatanverse-source.zip'}</span>
            </button>

            {statusMessage && (
              <div
                className={`text-xs p-2.5 rounded-lg border flex items-center gap-2 ${
                  downloadStatus === 'success'
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                    : downloadStatus === 'error'
                    ? 'bg-rose-950/40 border-rose-500/40 text-rose-300'
                    : 'bg-stone-800 text-stone-300 border-stone-700'
                }`}
              >
                {downloadStatus === 'success' && <Check className="w-4 h-4 shrink-0 text-emerald-400" />}
                <span>{statusMessage}</span>
              </div>
            )}
          </div>

          {/* Option 2: Direct URL & Open in New Window */}
          <div className="p-4 rounded-xl bg-stone-900/60 border border-stone-800/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-stone-300">
                Method 2: Direct Full Link (Open / Bookmark)
              </span>
              <a
                href={directZipUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-amber-400 hover:text-amber-300 inline-flex items-center gap-1 hover:underline"
              >
                <span>Open Link</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="flex items-center gap-2 bg-stone-950 border border-stone-800 rounded-lg p-2 text-xs font-mono text-stone-300 select-all overflow-x-auto">
              <span className="truncate flex-1">{directZipUrl}</span>
              <button
                onClick={() => copyToClipboard(directZipUrl, 'link')}
                className="px-2.5 py-1 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded text-[11px] flex items-center gap-1 transition-colors shrink-0"
              >
                {copiedLink ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedLink ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Option 3: Terminal Command (cURL / wget) */}
          <div className="p-4 rounded-xl bg-stone-900/60 border border-stone-800/80 space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-stone-300">
              <Terminal className="w-3.5 h-3.5 text-amber-400" />
              <span>Method 3: Terminal / Command Line Download</span>
            </div>

            <div className="space-y-2 font-mono text-xs">
              <div className="flex items-center justify-between bg-stone-950 border border-stone-800 rounded-lg p-2 text-stone-300">
                <span className="truncate flex-1 mr-2">{curlCmd}</span>
                <button
                  onClick={() => copyToClipboard(curlCmd, 'curl')}
                  className="px-2 py-1 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded text-[11px] flex items-center gap-1 transition-colors shrink-0"
                >
                  {copiedCurl ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedCurl ? 'Copied' : 'cURL'}</span>
                </button>
              </div>

              <div className="flex items-center justify-between bg-stone-950 border border-stone-800 rounded-lg p-2 text-stone-300">
                <span className="truncate flex-1 mr-2">{wgetCmd}</span>
                <button
                  onClick={() => copyToClipboard(wgetCmd, 'wget')}
                  className="px-2 py-1 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded text-[11px] flex items-center gap-1 transition-colors shrink-0"
                >
                  {copiedWget ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedWget ? 'Copied' : 'wget'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-5 pt-4 border-t border-stone-800/80 flex items-center justify-between text-[11px] text-stone-500">
          <span>Contains full repository + 14 unit tests + Master Blueprint</span>
          <button
            onClick={() => {
              soundEffects.playPanelSwoosh();
              onClose();
            }}
            className="text-stone-400 hover:text-stone-200 hover:underline"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

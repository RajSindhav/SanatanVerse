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

  const publicAppUrl = window.location.origin;
  const directZipUrl = `${publicAppUrl}/sanatanverse-source.zip`;
  const curlCmd = `curl -LO "${directZipUrl}"`;
  const wgetCmd = `wget "${directZipUrl}"`;

  const handleBlobDownload = async () => {
    soundEffects.playPanelSwoosh();
    setDownloadStatus('downloading');
    setStatusMessage('Preparing archive stream...');

    try {
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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#141c31]/65 backdrop-blur-sm animate-fadeIn"
      onClick={() => {
        soundEffects.playPanelSwoosh();
        onClose();
      }}
    >
      <div
        className="relative w-full max-w-2xl bg-[#fbf7ee] border border-[#dcc8a4] rounded-2xl p-6 sm:p-8 shadow-[0_28px_64px_rgba(14,20,38,0.35)] text-[#4e4030] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[#dcc8a4]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#faebd7] border border-[#e2c29b] flex items-center justify-center text-[#b45309]">
              <FileArchive className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-[#231b12]">
                Download SanatanVerse Codebase
              </h3>
              <p className="text-xs text-[#6f5d47]">
                Complete, production-ready React 19 + Express + Tailwind v4 repository
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              soundEffects.playPanelSwoosh();
              onClose();
            }}
            className="p-1.5 text-[#5a4b38] hover:text-[#231b12] hover:bg-[#efe3cc] rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="mt-5 space-y-5">
          {/* Option 1 */}
          <div className="p-4 rounded-xl bg-[#f5ecda] border border-[#dcc8a4] space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-[#231b12] font-semibold text-sm">
                <Sparkles className="w-4 h-4 text-[#b45309]" />
                <span>Method 1: Direct Browser Download</span>
              </div>
              <span className="text-[11px] font-mono text-[#92400e]">
                Source Archive (.zip)
              </span>
            </div>

            <p className="text-xs text-[#5a4b38] leading-relaxed">
              Triggers a direct download using memory buffer streaming. Bypasses iframe sandbox download blocks.
            </p>

            <button
              onClick={handleBlobDownload}
              disabled={downloadStatus === 'downloading'}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-semibold text-[#fffaf0] bg-[#b45309] hover:bg-[#92400e] active:scale-[0.99] rounded-lg transition-all shadow-sm disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>{downloadStatus === 'downloading' ? 'Assembling Archive...' : 'Download sanatanverse-source.zip'}</span>
            </button>

            {statusMessage && (
              <div
                className={`text-xs p-2.5 rounded-lg border flex items-center gap-2 ${
                  downloadStatus === 'success'
                    ? 'bg-[#ebf6f0] border-[#a9d1be] text-emerald-800'
                    : downloadStatus === 'error'
                    ? 'bg-[#faecee] border-[#e2b6bc] text-rose-800'
                    : 'bg-[#efe3cc] text-[#4e4030] border-[#d5bf97]'
                }`}
              >
                {downloadStatus === 'success' && <Check className="w-4 h-4 shrink-0 text-emerald-700" />}
                <span>{statusMessage}</span>
              </div>
            )}
          </div>

          {/* Option 2 */}
          <div className="p-4 rounded-xl bg-[#f5ecda] border border-[#dcc8a4] space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#231b12]">
                Method 2: Direct Full Link (Open / Bookmark)
              </span>
              <a
                href={directZipUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-medium text-[#b45309] hover:text-[#92400e] inline-flex items-center gap-1 hover:underline"
              >
                <span>Open Link</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="flex items-center gap-2 bg-[#fffdf8] border border-[#d5bf97] rounded-lg p-2 text-xs font-mono text-[#3e3121] select-all overflow-x-auto">
              <span className="truncate flex-1">{directZipUrl}</span>
              <button
                onClick={() => copyToClipboard(directZipUrl, 'link')}
                className="px-2.5 py-1 bg-[#efe3cc] hover:bg-[#e5d4b3] text-[#231b12] rounded text-[11px] flex items-center gap-1 transition-colors shrink-0"
              >
                {copiedLink ? <Check className="w-3 h-3 text-emerald-700" /> : <Copy className="w-3 h-3" />}
                <span>{copiedLink ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Option 3 */}
          <div className="p-4 rounded-xl bg-[#f5ecda] border border-[#dcc8a4] space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#231b12]">
              <Terminal className="w-3.5 h-3.5 text-[#b45309]" />
              <span>Method 3: Terminal / Command Line Download</span>
            </div>

            <div className="space-y-2 font-mono text-xs">
              <div className="flex items-center justify-between bg-[#fffdf8] border border-[#d5bf97] rounded-lg p-2 text-[#3e3121]">
                <span className="truncate flex-1 mr-2">{curlCmd}</span>
                <button
                  onClick={() => copyToClipboard(curlCmd, 'curl')}
                  className="px-2 py-1 bg-[#efe3cc] hover:bg-[#e5d4b3] text-[#231b12] rounded text-[11px] flex items-center gap-1 transition-colors shrink-0"
                >
                  {copiedCurl ? <Check className="w-3 h-3 text-emerald-700" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedCurl ? 'Copied' : 'cURL'}</span>
                </button>
              </div>

              <div className="flex items-center justify-between bg-[#fffdf8] border border-[#d5bf97] rounded-lg p-2 text-[#3e3121]">
                <span className="truncate flex-1 mr-2">{wgetCmd}</span>
                <button
                  onClick={() => copyToClipboard(wgetCmd, 'wget')}
                  className="px-2 py-1 bg-[#efe3cc] hover:bg-[#e5d4b3] text-[#231b12] rounded text-[11px] flex items-center gap-1 transition-colors shrink-0"
                >
                  {copiedWget ? <Check className="w-3 h-3 text-emerald-700" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedWget ? 'Copied' : 'wget'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-5 pt-4 border-t border-[#dcc8a4] flex items-center justify-between text-[11px] text-[#6f5d47]">
          <span>Contains full repository + unit tests + editorial blueprint</span>
          <button
            onClick={() => {
              soundEffects.playPanelSwoosh();
              onClose();
            }}
            className="text-[#5a4b38] hover:text-[#231b12] hover:underline font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

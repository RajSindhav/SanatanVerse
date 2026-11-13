import React, { useState } from 'react';
import { Check, X } from 'lucide-react';

interface FounderPassModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FounderPassModal: React.FC<FounderPassModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName || !trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setErrorMsg('Please enter your name and a valid email address.');
      return;
    }

    setErrorMsg(null);
    setIsSubmitted(true);
  };

  const handleResetAndClose = () => {
    setIsSubmitted(false);
    setName('');
    setEmail('');
    setErrorMsg(null);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={handleResetAndClose}
    >
      <div
        className="relative w-full max-w-md bg-[#11100e] border border-stone-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleResetAndClose}
          className="absolute top-5 right-5 p-1.5 rounded-lg text-stone-400 hover:text-stone-100 hover:bg-stone-800/70 transition-colors"
          aria-label="Close Modal"
        >
          <X className="w-4 h-4" />
        </button>

        {!isSubmitted ? (
          <>
            <div className="space-y-2">
              <div className="text-xs font-medium tracking-wider uppercase text-amber-400/90">
                Early Access Waitlist
              </div>
              <h3 className="font-serif text-2xl font-semibold text-stone-100">
                Stay Updated on Launch
              </h3>
              <p className="text-sm text-stone-400 leading-relaxed">
                Our first comics and interactive timeline stories are currently in planning. Join
                the waitlist to receive early previews when they launch.
              </p>
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1.5">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full px-3.5 py-2.5 bg-[#090807] border border-stone-800 rounded-lg text-sm text-stone-100 placeholder:text-stone-500 focus:outline-none focus:border-amber-400 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-3.5 py-2.5 bg-[#090807] border border-stone-800 rounded-lg text-sm text-stone-100 placeholder:text-stone-500 focus:outline-none focus:border-amber-400 transition-colors"
                />
              </div>

              {errorMsg && (
                <p className="text-xs text-rose-400">{errorMsg}</p>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-lg font-semibold text-sm bg-amber-400 text-stone-950 hover:bg-amber-300 transition-colors"
              >
                Join Waitlist
              </button>
            </form>
          </>
        ) : (
          <div className="py-4 space-y-5 text-center">
            <div className="w-10 h-10 rounded-full bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center mx-auto">
              <Check className="w-5 h-5 text-emerald-400" />
            </div>

            <div className="space-y-2">
              <h3 className="font-serif text-xl font-semibold text-stone-100">
                Thank you, {name}
              </h3>
              <p className="text-sm text-stone-400 leading-relaxed">
                We have noted <span className="text-stone-200">{email}</span> for early launch
                updates once our first comic stories are ready.
              </p>
            </div>

            <button
              onClick={handleResetAndClose}
              className="px-6 py-2.5 rounded-lg text-xs font-medium bg-stone-800 text-stone-200 hover:bg-stone-700 transition-colors"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

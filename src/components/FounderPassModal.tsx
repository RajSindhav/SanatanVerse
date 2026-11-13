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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#141c31]/65 backdrop-blur-sm"
      onClick={handleResetAndClose}
    >
      <div
        className="relative w-full max-w-md bg-[#fbf7ee] border border-[#dcc8a4] rounded-2xl p-6 sm:p-8 space-y-6 shadow-[0_24px_54px_rgba(14,20,38,0.35)]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleResetAndClose}
          className="absolute top-5 right-5 p-1.5 rounded-lg text-[#6f5d47] hover:text-[#231b12] hover:bg-[#efe3cc] transition-colors"
          aria-label="Close Modal"
        >
          <X className="w-4 h-4" />
        </button>

        {!isSubmitted ? (
          <>
            <div className="space-y-2">
              <div className="text-xs font-semibold tracking-wider uppercase text-[#b45309]">
                Early Access Waitlist
              </div>
              <h3 className="font-serif text-2xl font-semibold text-[#231b12]">
                Stay Updated on Launch
              </h3>
              <p className="text-sm text-[#5a4b38] leading-relaxed">
                Our first comics and interactive timeline stories are currently in planning. Join
                the waitlist to receive early previews when they launch.
              </p>
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#3e3121] mb-1.5">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full px-3.5 py-2.5 bg-[#fffdf8] border border-[#d5bf97] rounded-lg text-sm text-[#231b12] placeholder:text-[#8d795e] focus:outline-none focus:border-[#b45309] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#3e3121] mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-3.5 py-2.5 bg-[#fffdf8] border border-[#d5bf97] rounded-lg text-sm text-[#231b12] placeholder:text-[#8d795e] focus:outline-none focus:border-[#b45309] transition-colors"
                />
              </div>

              {errorMsg && (
                <p className="text-xs text-rose-700">{errorMsg}</p>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-lg font-semibold text-sm bg-[#b45309] text-[#fffaf0] hover:bg-[#92400e] transition-colors shadow-sm"
              >
                Join Waitlist
              </button>
            </form>
          </>
        ) : (
          <div className="py-4 space-y-5 text-center">
            <div className="w-10 h-10 rounded-full bg-[#ebf6f0] border border-[#a9d1be] flex items-center justify-center mx-auto">
              <Check className="w-5 h-5 text-emerald-700" />
            </div>

            <div className="space-y-2">
              <h3 className="font-serif text-xl font-semibold text-[#231b12]">
                Thank you, {name}
              </h3>
              <p className="text-sm text-[#5a4b38] leading-relaxed">
                We have noted <span className="font-medium text-[#231b12]">{email}</span> for early launch
                updates once our first comic stories are ready.
              </p>
            </div>

            <button
              onClick={handleResetAndClose}
              className="px-6 py-2.5 rounded-lg text-xs font-medium bg-[#efe3cc] text-[#231b12] hover:bg-[#e5d4b3] transition-colors"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Check } from 'lucide-react';

export const WaitlistSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    setErrorMsg(null);
    setSubmittedEmail(trimmed);
    setEmail('');
  };

  return (
    <section
      id="waitlist-section"
      className="scroll-mt-16 py-20 sm:py-28 relative overflow-hidden bg-gradient-to-b from-[#1a2540] to-[#141c31] border-t border-[#d4a84f]/30"
    >
      <div
        className="absolute inset-x-0 top-0 h-44 bg-[radial-gradient(ellipse_at_top,rgba(241,196,99,0.12),transparent_70%)] pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <div className="text-xs font-semibold tracking-wider uppercase text-[#f4c86a]">
          Early Access
        </div>

        <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#fcf7ec] tracking-tight text-balance">
          Follow the Journey
        </h2>

        <p className="text-sm sm:text-base text-[#ddd0b8] leading-relaxed max-w-xl mx-auto">
          We are crafting our opening stories and comic art slate. Leave your email to be notified
          when the first chapters go live.
        </p>

        {!submittedEmail ? (
          <form
            onSubmit={handleSubmit}
            noValidate
            className="max-w-md mx-auto pt-2 space-y-3"
          >
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errorMsg) setErrorMsg(null);
                }}
                placeholder="you@example.com"
                aria-label="Email address for launch updates"
                className="flex-1 px-4 py-3 rounded-lg bg-[#fbf7ee] border border-[#d4a84f]/50 text-sm text-[#231b12] placeholder:text-[#7c6951] shadow-xs focus:outline-none focus:border-[#f4c86a] transition-colors"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-lg font-semibold text-sm bg-gradient-to-r from-[#f1c463] to-[#e09d34] text-[#181208] hover:from-[#f7d27d] hover:to-[#ebaa42] shadow-[0_4px_18px_rgba(229,169,60,0.28)] transition-all whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f5cf76]"
              >
                Notify Me
              </button>
            </div>
            {errorMsg && (
              <p className="text-xs text-rose-300 text-left">{errorMsg}</p>
            )}
          </form>
        ) : (
          <div className="inline-flex items-center gap-2.5 px-5 py-3 rounded-lg bg-[#222f50] border border-[#d4a84f]/40 shadow-xs text-sm text-[#f7ecd6]">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              You are on the list (<span className="font-medium text-[#f4c86a]">{submittedEmail}</span>). We will share updates once stories are ready.
            </span>
          </div>
        )}
      </div>
    </section>
  );
};

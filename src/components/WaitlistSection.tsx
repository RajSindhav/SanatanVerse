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
    <section id="waitlist-section" className="scroll-mt-16 py-20 sm:py-28 bg-[#090807]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <div className="text-xs font-medium tracking-wider uppercase text-amber-400/90">
          Early Access
        </div>

        <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-stone-100 tracking-tight text-balance">
          Follow the Journey
        </h2>

        <p className="text-sm sm:text-base text-stone-400 leading-relaxed max-w-xl mx-auto">
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
                className="flex-1 px-4 py-3 rounded-lg bg-[#11100e] border border-stone-800 text-sm text-stone-100 placeholder:text-stone-500 focus:outline-none focus:border-amber-400 transition-colors"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-lg font-semibold text-sm bg-amber-400 text-stone-950 hover:bg-amber-300 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
              >
                Notify Me
              </button>
            </div>
            {errorMsg && (
              <p className="text-xs text-rose-400 text-left">{errorMsg}</p>
            )}
          </form>
        ) : (
          <div className="inline-flex items-center gap-2.5 px-5 py-3 rounded-lg bg-[#11100e] border border-stone-800 text-sm text-stone-200">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              You are on the list (<span className="text-amber-300">{submittedEmail}</span>). We will share updates once stories are ready.
            </span>
          </div>
        )}
      </div>
    </section>
  );
};

import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowRightIcon, TickIcon } from '../components/icons';

export function Login() {
  const [step, setStep] = useState<'credentials' | 'otp'>('credentials');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('••••••••••••');
  const [otp, setOtp] = useState('');
  const otpRefs = useRef<Array<HTMLInputElement | null>>([]);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const phoneDigits = phone.replace(/\D/g, '');
  const fullPhone = `+252${phoneDigits}`;
  const maskedPhone = `+252${'*'.repeat(Math.max(phoneDigits.length - 3, 0))}${phoneDigits.slice(-3)}`;

  const updateOtpDigit = (index: number, digit: string) => {
    const nextOtp = otp.padEnd(6, ' ').split('');
    nextOtp[index] = digit;
    const normalizedOtp = nextOtp.join('').replace(/\s/g, '');
    setOtp(normalizedOtp);
    if (digit && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpPaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const pastedCode = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    setOtp(pastedCode);
    otpRefs.current[Math.min(pastedCode.length, 5)]?.focus();
  };

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (step === 'otp') {
      if (!/^\d{6}$/.test(otp)) {
        setError('Enter the 6-digit verification code');
        return;
      }

      setLoading(true);
      setError('');
      setTimeout(() => {
        login(fullPhone, password);
        setLoading(false);
        navigate('/inbox', { replace: true });
      }, 400);
      return;
    }

    if (!phone.trim()) {
      setError('Please enter your phone number');
      return;
    }

    setLoading(true);
    setError('');

    setTimeout(() => {
      setLoading(false);
      setStep('otp');
    }, 400);
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-surface p-4 sm:p-6 lg:p-10">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-2xl border border-hairline bg-white lg:grid-cols-[0.7fr_1.3fr]">
        <aside className="relative hidden min-h-[620px] items-center overflow-hidden bg-yale p-10 text-white lg:flex lg:flex-col lg:justify-center">
        </aside>

        <main className="flex min-h-[620px] flex-col justify-center p-6 sm:p-10 lg:p-14">
          <div className="mx-auto w-full max-w-md">
            <div className="mb-8">
              {step === 'otp' ? (
                <p className="text-meta font-semibold uppercase tracking-[0.1em] text-primary">
                  Verification
                </p>
              ) : (
                <p className="text-meta font-semibold uppercase tracking-[0.1em] text-primary">
                  Staff sign in
                </p>
              )}
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-ink">
                {step === 'otp' ? 'Confirm your identity' : 'Welcome back'}
              </h2>
              <p className="mt-2 text-body text-muted">
                {step === 'otp'
                  ? `Enter the 6-digit code sent to ${maskedPhone}.`
                  : 'Sign in to continue to your workspace.'}
              </p>
            </div>

            <div className="rounded-xl border border-hairline bg-surface/40 p-5 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded-lg border border-danger/20 bg-danger/5 px-3.5 py-2.5 text-meta font-medium text-danger">
                {error}
              </div>
            )}

            {step === 'credentials' ? (
            <>
            <div>
              <label htmlFor="login-phone" className="block text-body font-semibold text-ink">
                Phone number
              </label>
              <div className="mt-1.5 flex items-stretch overflow-hidden rounded-lg border border-hairline bg-white transition-all duration-150 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
                <span className="flex items-center border-r border-hairline bg-surface/70 px-3.5 font-mono text-body font-medium text-muted">
                  +252
                </span>
                <input
                  id="login-phone"
                  type="tel"
                  inputMode="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  required
                  className="min-w-0 flex-1 bg-white px-3.5 py-2.5 text-body text-ink placeholder:text-muted/60 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label htmlFor="login-password" className="block text-body font-semibold text-ink">
                Password
              </label>
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1.5 w-full rounded-lg border border-hairline bg-white px-3.5 py-2.5 text-body text-ink placeholder:text-muted/60 transition-all duration-150 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="flex items-center justify-between">
              <label
                htmlFor="rememberMe"
                className="group inline-flex cursor-pointer items-center gap-2.5 select-none"
              >
                <input
                  id="rememberMe"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="sr-only"
                />
                <div
                  aria-hidden="true"
                  className={[
                    'flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-all duration-150 ease-standard',
                    'group-focus-within:ring-2 group-focus-within:ring-primary/20',
                    rememberMe
                      ? 'border-primary bg-primary text-white'
                      : 'border-hairline bg-white group-hover:border-primary/50',
                  ].join(' ')}
                >
                  {rememberMe && (
                    <TickIcon className="h-3 w-3" strokeWidth={2.5} />
                  )}
                </div>
                <span className="text-meta font-medium text-muted transition-colors group-hover:text-ink">
                  Remember me
                </span>
              </label>
            </div>
            </>
            ) : (
              <div>
                <label htmlFor="login-otp" className="block text-body font-semibold text-ink">
                  Verification code
                </label>
                <div className="mt-2 flex gap-2 sm:gap-3">
                  {Array.from({ length: 6 }, (_, index) => (
                    <input
                      key={index}
                      ref={(element) => {
                        otpRefs.current[index] = element;
                      }}
                      id={`login-otp-${index + 1}`}
                      type="text"
                      inputMode="numeric"
                      autoComplete={index === 0 ? 'one-time-code' : 'off'}
                      pattern="[0-9]*"
                      maxLength={1}
                      value={otp[index] ?? ''}
                      onChange={(event) => updateOtpDigit(index, event.target.value.replace(/\D/g, '').slice(-1))}
                      onKeyDown={(event) => {
                        if (event.key === 'Backspace' && !otp[index] && index > 0) {
                          otpRefs.current[index - 1]?.focus();
                        }
                      }}
                      onPaste={handleOtpPaste}
                      aria-label={`Verification digit ${index + 1}`}
                      autoFocus={index === 0}
                      className="h-12 min-w-0 flex-1 rounded-lg border border-hairline bg-white text-center font-mono text-xl text-ink transition-all duration-150 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  ))}
                </div>
                <p className="mt-2 text-meta text-muted">
                  Use the code from your authenticator or official device.
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-body font-semibold text-white transition-all duration-150 hover:bg-primaryHover active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-60"
            >
              {loading ? (
                <span>{step === 'otp' ? 'Verifying...' : 'Continuing...'}</span>
              ) : (
                <>
                  <span>{step === 'otp' ? 'Open dashboard' : 'Continue'}</span>
                  <ArrowRightIcon className="h-4 w-4" strokeWidth={2} />
                </>
              )}
            </button>
            {step === 'otp' && (
              <button
                type="button"
                onClick={() => {
                  setStep('credentials');
                  setOtp('');
                  setError('');
                }}
                className="w-full text-center text-meta font-medium text-muted transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                Back to sign in
              </button>
            )}
          </form>
            </div>

            <p className="mt-6 text-center text-meta text-muted">
              Access is reserved for authorised officers.
            </p>
          </div>
        </main>
        </div>
    </div>
  );
}

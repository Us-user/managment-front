import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { emailSignup, emailVerify, telegramInit, OAUTH_URLS } from '@/api/auth'
import { getWorkspaces } from '@/api/workspace'
import { useAuthStore } from '@/stores/authStore'
import { toast } from 'sonner'

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.15-4.53H2.18v2.84A11 11 0 0 0 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.85 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.67-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.67 2.84C6.71 7.31 9.14 5.38 12 5.38z"
      />
    </svg>
  )
}

function GithubIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
      <path d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58l-.01-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.5.99.11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.11-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6.01 0c2.29-1.55 3.3-1.23 3.3-1.23.65 1.66.24 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.8 5.62-5.48 5.92.43.37.81 1.1.81 2.22l-.01 3.29c0 .32.22.7.83.58A12 12 0 0 0 24 12.5C24 5.87 18.63.5 12 .5z" />
    </svg>
  )
}

function TelegramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-[#229ED9]" aria-hidden="true">
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.833.94z" />
    </svg>
  )
}

function ProviderButton({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode
  label: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center justify-center gap-2.5 rounded-md border border-border bg-transparent px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
    >
      {icon}
      {label}
    </button>
  )
}

function AuthForm({ mode }: { mode: 'login' | 'register' }) {
  const navigate = useNavigate()
  const setAuth = useAuthStore(s => s.setAuth)
  const setWorkspace = useAuthStore(s => s.setWorkspace)

  const [step, setStep] = useState<'email' | 'code'>('email')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)

  const verb = mode === 'login' ? 'Sign in' : 'Sign up'

  function oauth(url: string) {
    window.location.href = url
  }

  async function telegram() {
    try {
      const res = await telegramInit()
      const link = Object.values(res).find(
        v => typeof v === 'string' && (v.startsWith('http') || v.startsWith('t.me')),
      )
      if (typeof link === 'string') {
        window.open(link.startsWith('http') ? link : `https://${link}`, '_blank')
      } else {
        toast.info('Telegram login started — check your Telegram app')
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Telegram login failed')
    }
  }

  async function doSendCode() {
    setLoading(true)
    try {
      await emailSignup(email)
      toast.success(`We sent a 6-digit code to ${email}`)
      setStep('code')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not send code')
    } finally {
      setLoading(false)
    }
  }

  function sendCode(e: React.FormEvent) {
    e.preventDefault()
    doSendCode()
  }

  async function verifyCode(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const result = await emailVerify(email, code)
      setAuth(result.user, result.access_token)

      const workspaces = await getWorkspaces(result.access_token)
      if (workspaces.length > 0) {
        setWorkspace(workspaces[0])
        navigate('/')
      } else {
        navigate('/onboarding/workspace')
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Invalid or expired code')
    } finally {
      setLoading(false)
    }
  }

  if (step === 'code') {
    return (
      <form onSubmit={verifyCode} className="flex flex-col gap-4">
        <button
          type="button"
          onClick={() => {
            setStep('email')
            setCode('')
          }}
          className="flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft size={14} />
          Back
        </button>

        <div>
          <p className="text-sm text-foreground">Enter the 6-digit code sent to</p>
          <p className="text-sm font-medium text-foreground">{email}</p>
        </div>

        <Input
          autoFocus
          inputMode="numeric"
          pattern="\d{6}"
          maxLength={6}
          required
          placeholder="000000"
          value={code}
          onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
          className="text-center text-lg tracking-[0.5em]"
        />

        <Button type="submit" className="w-full" disabled={loading || code.length !== 6}>
          {loading ? 'Verifying…' : 'Verify & continue'}
        </Button>

        <button
          type="button"
          onClick={doSendCode}
          disabled={loading}
          className="text-center text-sm text-muted-foreground hover:text-foreground disabled:opacity-50"
        >
          Resend code
        </button>
      </form>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2.5">
        <ProviderButton
          icon={<GoogleIcon />}
          label={`${verb} with Google`}
          onClick={() => oauth(OAUTH_URLS.google)}
        />
        <ProviderButton
          icon={<GithubIcon />}
          label={`${verb} with GitHub`}
          onClick={() => oauth(OAUTH_URLS.github)}
        />
        <ProviderButton icon={<TelegramIcon />} label={`${verb} with Telegram`} onClick={telegram} />
      </div>

      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs text-muted-foreground">or</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <form onSubmit={sendCode} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-foreground">Email</label>
          <Input
            type="email"
            required
            placeholder="name@company.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>

        <Button type="submit" className="w-full" disabled={loading || !email}>
          {loading ? 'Sending code…' : 'Continue'}
        </Button>
      </form>

      <p className="text-center text-xs text-muted-foreground">
        By {mode === 'login' ? 'signing in' : 'signing up'}, you understand and agree to our{' '}
        <a href="#" className="underline underline-offset-2 hover:text-foreground">
          Terms of Service
        </a>{' '}
        and{' '}
        <a href="#" className="underline underline-offset-2 hover:text-foreground">
          Privacy Policy
        </a>
        .
      </p>
    </div>
  )
}

export function AuthPage() {
  return (
    <div className="flex min-h-svh items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">Work in all dimensions.</h1>
          <p className="mt-1 text-base text-muted-foreground">Welcome back to Plane.</p>
        </div>

        <Tabs defaultValue="login">
          <TabsList className="mb-6 w-full">
            <TabsTrigger value="login" className="flex-1">
              Login
            </TabsTrigger>
            <TabsTrigger value="register" className="flex-1">
              Register
            </TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <AuthForm mode="login" />
          </TabsContent>
          <TabsContent value="register">
            <AuthForm mode="register" />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

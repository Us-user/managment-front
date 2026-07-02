import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { login, register } from '@/api/auth'
import { getWorkspaces } from '@/api/workspace'
import { useAuthStore } from '@/stores/authStore'
import { toast } from 'sonner'

function TelegramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.833.94z" />
    </svg>
  )
}

function AuthForm({ mode }: { mode: 'login' | 'register' }) {
  const navigate = useNavigate()
  const setAuth = useAuthStore(s => s.setAuth)
  const setWorkspace = useAuthStore(s => s.setWorkspace)

  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const result =
        mode === 'login'
          ? await login(email, password)
          : await register(email, password, displayName)

      setAuth(result.user, result.access_token)

      const workspaces = await getWorkspaces(result.access_token)
      if (workspaces.length > 0) {
        setWorkspace(workspaces[0])
        navigate('/')
      } else {
        navigate('/onboarding/workspace')
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <button
        type="button"
        onClick={() => toast.info('Telegram sign-in coming soon')}
        className="flex items-center justify-center gap-2.5 rounded-md border border-border bg-transparent px-4 py-2.5 text-sm font-medium text-[#229ED9] transition-colors hover:bg-muted"
      >
        <TelegramIcon />
        {mode === 'login' ? 'Sign in with Telegram' : 'Sign up with Telegram'}
      </button>

      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs text-muted-foreground">or</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      {mode === 'register' && (
        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-foreground">Full name</label>
          <Input
            required
            placeholder="Your name"
            value={displayName}
            onChange={e => setDisplayName(e.target.value)}
          />
        </div>
      )}

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

      <div className="flex flex-col gap-1.5">
        <label className="text-sm text-foreground">Password</label>
        <Input
          type="password"
          required
          minLength={8}
          placeholder="Min. 8 characters"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Please wait…' : 'Continue'}
      </Button>

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
    </form>
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

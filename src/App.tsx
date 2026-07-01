import { APP_NAME } from '@/lib/constants'

function App() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-2">
      <h1 className="text-3xl font-bold text-blue-600">{APP_NAME}</h1>
      <p className="text-gray-500">Tailwind CSS работает 🎉</p>
    </div>
  )
}

export default App

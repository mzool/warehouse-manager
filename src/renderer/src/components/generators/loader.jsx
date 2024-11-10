import { useEffect, useState } from 'react'

const LoadingSpinner = ({
  size = 'h-8 w-8',
  color = 'text-indigo-600',
  duration = 5000,
  fallbackMessage = 'This is taking longer than usual...'
}) => {
  const [isSlow, setIsSlow] = useState(false)

  // Timeout handler for slow responses
  useEffect(() => {
    const timer = setTimeout(() => setIsSlow(true), duration)
    return () => clearTimeout(timer)
  }, [duration])

  return (
    <div className="flex flex-col items-center space-y-2 z-50">
      {/* Spinner */}
      <div
        className={`animate-spin ${size} border-4 border-t-transparent border-indigo-600 rounded-full ${color}`}
      />

      {/* Fallback Message for Slow Responses */}
      {isSlow && <p className="text-sm text-indigo-600">{fallbackMessage}</p>}
    </div>
  )
}

export default LoadingSpinner

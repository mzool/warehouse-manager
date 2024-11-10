import React, { useEffect } from 'react'

const Notification = ({ message, type, duration = 6000, onDismiss }) => {
  // Styles based on the notification type
  const getNotificationStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-100 border-green-400 text-green-700'
      case 'error':
        return 'bg-red-100 border-red-400 text-red-700'
      case 'info':
        return 'bg-blue-100 border-blue-400 text-blue-700'
      default:
        return ''
    }
  }

  useEffect(() => {
    // Auto-dismiss notification after specified duration
    const timer = setTimeout(() => {
      onDismiss()
    }, duration)

    // Clear timeout on component unmount
    return () => clearTimeout(timer)
  }, [duration, onDismiss])

  return (
    <div
      className={`flex items-center p-4 mb-4 border-l-4 rounded-lg shadow-md ${getNotificationStyles()}`}
      role="alert"
    >
      <div className="flex-1">{message}</div>
      <button
        onClick={onDismiss}
        className="ml-4 text-lg font-semibold text-gray-500 hover:text-gray-800"
      >
        &times; {/* Close icon */}
      </button>
    </div>
  )
}

export default Notification

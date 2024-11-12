import { useState } from 'react'

const Tooltip = ({ children, content, position = 'top' }) => {
  const [isVisible, setIsVisible] = useState(false)

  // Define tooltip position styles
  const positionClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2'
  }

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {/* Target Element (Children) */}
      {children}

      {/* Tooltip Content */}
      {isVisible && (
        <div
          className={`z-20 absolute whitespace-nowrap bg-gray-800 text-white text-sm px-2 py-1 rounded shadow-lg transition-opacity duration-200 ease-in-out ${positionClasses[position]}`}
        >
          {content}
        </div>
      )}
    </div>
  )
}

export default Tooltip

import React, { useState } from 'react'
import PropTypes from 'prop-types'

const Tabs = ({ tabs, activeTabIndex = 0, onTabChange }) => {
  const [activeIndex, setActiveIndex] = useState(activeTabIndex)

  const handleTabClick = (index) => {
    setActiveIndex(index)
    if (onTabChange) onTabChange(index)
  }

  return (
    <div className="w-full">
      {/* Tab Navigation */}
      <div className="flex space-x-2 border-b border-gray-300">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => handleTabClick(index)}
            className={`py-2 px-4 transition-colors duration-200 ${
              index === activeIndex
                ? 'bg-cyan-900 text-white'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-4">{tabs[activeIndex].content}</div>
    </div>
  )
}

// PropTypes for type-checking props
Tabs.propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      content: PropTypes.node.isRequired
    })
  ).isRequired,
  activeTabIndex: PropTypes.number,
  onTabChange: PropTypes.func
}

export default Tabs

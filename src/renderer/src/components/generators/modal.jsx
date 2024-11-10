import React from 'react'
import { createPortal } from 'react-dom'

const Modal = ({ isOpen, onClose, title, children, footer }) => {
  if (!isOpen) return null

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-auto">
      <div className="relative bg-white rounded-lg shadow-lg p-6 w-full max-w-lg md:max-w-2xl lg:max-w-3xl overflow-y-auto max-h-[90vh] m-4">
        <div className="flex justify-between items-center mb-4">
          {title && <h2 className="text-xl font-semibold truncate">{title}</h2>}
          <button
            onClick={onClose}
            className="text-red-600 hover:text-red-800 text-2xl"
            aria-label="Close modal"
          >
            &times;
          </button>
        </div>
        <div className="mb-4 overflow-y-auto">{children}</div>
        {footer && <div className="mt-4 border-t pt-4">{footer}</div>}
      </div>
    </div>,
    document.body
  )
}

export default Modal

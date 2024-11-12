import React from 'react'

const ConfirmationDialog = ({
  isOpen,
  title = 'Are you sure?',
  message,
  confirmButtonLabel = 'Confirm',
  cancelButtonLabel = 'Cancel',
  onConfirm,
  onCancel
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full space-y-4">
        {/* Dialog Header */}
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>

        {/* Dialog Message */}
        <p className="text-gray-600">{message}</p>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            {cancelButtonLabel}
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            {confirmButtonLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmationDialog

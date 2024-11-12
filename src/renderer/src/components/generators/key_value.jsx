import { useState, useEffect } from 'react'

const KeyValueForm = ({ initialValues = [], onSubmit }) => {
  // Set initial state based on the provided initialValues prop
  const [fields, setFields] = useState(
    initialValues.length > 0 ? initialValues : [{ key: '', value: '' }]
  )

  // Update state for a specific field
  const handleChange = (index, field, value) => {
    const updatedFields = [...fields]
    updatedFields[index][field] = value
    setFields(updatedFields)
  }

  // Add a new blank key-value field
  const handleAddField = () => {
    setFields([...fields, { key: '', value: '' }])
  }

  // Remove a specific field
  const handleRemoveField = (index) => {
    const updatedFields = fields.filter((_, i) => i !== index)
    setFields(updatedFields)
  }

  // Submit form data as JSON object
  const handleSubmit = (e) => {
    e.preventDefault()
    // Convert fields array to an object
    const data = fields.reduce((obj, item) => {
      if (item.key.trim()) {
        obj[item.key] = item.value
      }
      return obj
    }, {})
    onSubmit(data) // Pass JSON object to parent component
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white shadow-md rounded-md space-y-4">
      {/* Render key-value fields */}
      {fields.map((field, index) => (
        <div key={index} className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Key"
            value={field.key}
            onChange={(e) => handleChange(index, 'key', e.target.value)}
            className="w-1/2 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
          />
          <input
            type="text"
            placeholder="Value"
            value={field.value}
            onChange={(e) => handleChange(index, 'value', e.target.value)}
            className="w-1/2 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
          />
          <button
            type="button"
            onClick={() => handleRemoveField(index)}
            className="p-2 text-red-600 hover:text-red-800 focus:outline-none"
          >
            Remove
          </button>
        </div>
      ))}

      {/* Add Field Button */}
      <button
        type="button"
        onClick={handleAddField}
        className="w-full px-4 py-2 text-white bg-slate-600 rounded-md hover:bg-slate-700"
      >
        Add Field
      </button>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700"
      >
        Submit
      </button>
    </form>
  )
}

export default KeyValueForm

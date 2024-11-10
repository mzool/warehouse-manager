import { useState } from 'react'
import Papa from 'papaparse' // For parsing CSV files
import Notification from '../generators/notification'

function MaterialsForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    code: '',
    ar_name: '',
    active: true,
    measure_unit: '',
    reorder_on: 0,
    brand: '',
    unit_price: 0,
    price_unit_of_measure: ''
  })
  const [csvData, setCsvData] = useState(null)

  // Handle individual input change
  const handleChange = (e) => {
    const { name, value, type } = e.target
    const formattedValue = type === 'number' ? Number(value) : value
    setFormData((prevData) => ({ ...prevData, [name]: formattedValue }))
  }

  // Handle CSV file upload and parsing
  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        setCsvData(result.data) // Parsed CSV data
      }
    })
  }
  const [msg, setMessage] = useState({ error: '', success: '' })
  // Submit single entry form
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await onSubmit([formData])
      window.scrollTo({
        behavior: 'smooth',
        top: 0
      })
      setMessage({ error: '', success: 'Material added successfully' })
    } catch (err) {
      window.scrollTo({
        behavior: 'smooth',
        top: 0
      })
      setMessage({ error: err.message })
      return
    }
    setFormData({
      name: '',
      description: '',
      code: '',
      ar_name: '',
      active: true,
      measure_unit: '',
      reorder_on: 0,
      brand: '',
      unit_price: 0,
      price_unit_of_measure: ''
    })
  }

  // Submit parsed CSV data
  const handleCsvSubmit = () => {
    if (csvData) {
      onSubmit(csvData)
      setCsvData(null)
    }
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Add Material</h2>
      {(msg.error || msg.success) && (
        <Notification
          message={msg.error || msg.success}
          type={msg.error ? 'error' : 'success'}
          onDismiss={() => {
            setMessage({ error: '', success: '' })
          }}
        />
      )}
      {/* CSV Upload */}
      <div className="mb-6">
        <label className="block text-gray-700 font-bold mb-2">Upload CSV</label>
        <input
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 cursor-pointer"
        />
        <button
          type="button"
          onClick={handleCsvSubmit}
          className="mt-4 bg-slate-500 text-white py-2 px-4 rounded-md hover:bg-slate-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          disabled={!csvData}
        >
          Submit CSV
        </button>
      </div>

      <hr className="my-6" />

      {/* Manual Entry Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {[
          'name',
          'description',
          'code',
          'ar_name',
          'measure_unit',
          'brand',
          'price_unit_of_measure'
        ].map((field) => (
          <div key={field}>
            <label className="block text-gray-700 font-bold mb-1">
              {field.replace('_', ' ').toUpperCase()}
            </label>
            <input
              type="text"
              name={field}
              value={formData[field]}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-slate-200"
              placeholder={`Enter ${field}`}
            />
          </div>
        ))}

        <div>
          <label className="block text-gray-700 font-bold mb-1">Active</label>
          <select
            name="active"
            value={formData.active}
            onChange={(e) =>
              setFormData((prevData) => ({ ...prevData, active: e.target.value === 'true' }))
            }
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-slate-200"
          >
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-700 font-bold mb-1">Reorder On</label>
          <input
            type="number"
            name="reorder_on"
            value={formData.reorder_on}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-slate-200"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-bold mb-1">Unit Price</label>
          <input
            type="number"
            step="0.01"
            name="unit_price"
            value={formData.unit_price}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-slate-200"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-slate-500 text-white py-2 px-4 rounded-md hover:bg-slate-600"
        >
          Add Material
        </button>
      </form>
    </div>
  )
}

export default MaterialsForm

import { useState, useEffect, useMemo } from 'react'
import Tooltip from './tooltip'

// DataTable component
const DataTable = ({ data = [], colorSchema, selectedCols = [], actions }) => {
  const [filteredData, setFilteredData] = useState(data)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  // Collect unique keys for headers across all data rows
  const uniqueHeaders = useMemo(() => Array.from(new Set(data.flatMap(Object.keys))), [data])

  // Filter data based on the search term
  useEffect(() => {
    const lowercasedSearchTerm = searchTerm.toLowerCase()
    const filtered = data.filter((row) =>
      Object.values(row).some((value) => String(value).toLowerCase().includes(lowercasedSearchTerm))
    )
    setFilteredData(filtered)
    setCurrentPage(1) // Reset to first page on search
  }, [searchTerm, data])

  // Get current page data
  const indexOfLastRow = currentPage * rowsPerPage
  const indexOfFirstRow = indexOfLastRow - rowsPerPage
  const currentRows = Array.isArray(filteredData)
    ? filteredData.slice(indexOfFirstRow, indexOfLastRow)
    : []

  // Handle pagination
  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  // Calculate total pages
  const totalPages = Math.ceil(filteredData.length / rowsPerPage)

  return (
    <div className="w-full p-4 shadow-lg shadow-gray-700 border bg-gray-100">
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search..."
          className="p-2 border rounded-md shadow-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="p-2 border rounded-md shadow-md"
          value={rowsPerPage}
          onChange={(e) => {
            setCurrentPage(1)
            setRowsPerPage(parseInt(e.target.value))
          }}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
          <option value={data.length}>All</option>
        </select>
      </div>
      <div className="overflow-auto" style={{ maxHeight: '500px' }}>
        <table className="min-w-full border-collapse">
          <thead
            style={{
              backgroundColor: colorSchema.headerBg,
              color: colorSchema.text
            }}
          >
            <tr>
              {selectedCols.length > 0
                ? selectedCols.map((key) => (
                    <th
                      key={key}
                      className="p-2 border text-left sticky top-0 z-10"
                      style={{ backgroundColor: colorSchema.headerBg }}
                    >
                      {key}
                    </th>
                  ))
                : uniqueHeaders.map((key) => (
                    <th
                      key={key}
                      className="p-2 border text-left sticky top-0 z-10"
                      style={{ backgroundColor: colorSchema.headerBg }}
                    >
                      {key}
                    </th>
                  ))}
              {actions && (
                <th
                  className="p-2 border text-left sticky top-0 z-10"
                  style={{ backgroundColor: colorSchema.headerBg }}
                >
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {currentRows.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={`cursor-pointer ${
                  rowIndex % 2 === 0 ? colorSchema.evenRow : colorSchema.oddRow
                }`}
              >
                {selectedCols.length > 0
                  ? selectedCols.map((header, cellIndex) => (
                      <td key={cellIndex} className="p-2 border">
                        {row[header] ?? ''} {/* Display blank if value is missing */}
                      </td>
                    ))
                  : uniqueHeaders.map((header, cellIndex) => (
                      <td key={cellIndex} className="p-2 border">
                        {row[header] ?? ''} {/* Display blank if value is missing */}
                      </td>
                    ))}
                {actions && (
                  <td className="p-2 border">
                    {actions.map((action, index) => (
                      <Tooltip key={index} content={action.name}>
                        <button style={{ color: action.color }} onClick={() => action.handler(row)}>
                          {action.label}
                        </button>
                      </Tooltip>
                    ))}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div
          className="flex justify-between items-center mt-4 p-2"
          style={{
            backgroundColor: colorSchema.paginationBg,
            color: colorSchema.text
          }}
        >
          <button
            className="p-2 rounded-md"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="p-2 rounded-md"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}

export default DataTable

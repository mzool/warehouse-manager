import { useState, useEffect } from 'react'
import DataTable from '../generators/table'
import { BiEdit, BiTrash } from 'react-icons/bi' // Import delete icon
import Modal from '../generators/modal'
import DynamicForm from '../generators/form'
import Notification from '../generators/notification'
import LoadingSpinner from '../generators/loader'
import ConfirmationDialog from '../generators/confrimationbox'
const MaterialTable = () => {
  // State for search, filter, and pagination
  const [materials, setMaterials] = useState([])
  const [modal, setModal] = useState({
    title: '',
    open: false
  })
  const [selectedRow, setSelected] = useState({})
  const [loading, setLoading] = useState(false) // Loading state
  const [message, setMessage] = useState({ success: '', error: '', open: false })
  const [isDialogOpen, setIsDialogOpen] = useState(false) // State for confirmation dialog
  const [rowToDelete, setRowToDelete] = useState(null) // State to keep track of row to delete

  // Form submit handler
  const handleSubmit = async (values) => {
    setLoading(true)
    try {
      await window.api.updateMaterial({ id: values._id, data: values })
      await fetchMaterials() // Refresh the material list after update
    } catch (error) {
      console.error('Error updating material:', error)
      setMessage({ open: true, error: error.message, success: '' })
    } finally {
      setLoading(false)
    }
  }

  // Fetch materials
  const fetchMaterials = async () => {
    setLoading(true)
    setMessage({ open: false, error: '', success: '' })
    try {
      let data = await window.api.getMaterials()
      setMaterials(data)
    } catch (error) {
      setMessage({ open: true, error: error.message, success: '' })
    } finally {
      setLoading(false)
    }
  }

  // Delete material handler
  const handleDelete = async () => {
    if (!rowToDelete) return
    setLoading(true)
    try {
      await window.api.removeMaterial(rowToDelete) // Call the removeMaterial API
      await fetchMaterials() // Refresh the material list after delete
      setMessage({ success: 'Material deleted successfully', error: '', open: true })
    } catch (error) {
      setMessage({ success: '', error: error.message, open: true })
    } finally {
      setLoading(false)
      setIsDialogOpen(false)
      setRowToDelete(null)
    }
  }

  // Open confirmation dialog before delete
  const confirmDelete = (id) => {
    setRowToDelete(id)
    setIsDialogOpen(true)
  }

  useEffect(() => {
    fetchMaterials()
  }, [])

  return (
    <>
      {/* Loader while fetching or performing actions */}
      {loading && <LoadingSpinner />}

      {(message.error || message.success) && (
        <Notification
          type={message.error ? 'error' : 'success'}
          message={message.error || message.success}
          onDismiss={() => setMessage({ success: '', error: '', open: false })}
        />
      )}

      {/* Modal for editing material */}
      <Modal
        isOpen={modal.open}
        title={modal.title}
        onClose={() => {
          setModal({ open: false, title: '' })
          setSelected({})
        }}
      >
        {
          <DynamicForm
            fields={Object.entries(selectedRow).map(([key, value]) => ({
              id: key,
              name: key,
              required: false,
              type: 'text',
              initialValue: value,
              readonly: key === '_id' ? true : false
            }))}
            onSubmit={handleSubmit}
            colorSchema={{
              inputText: '#1E293B', // Slate-800 for text
              formBg: '#F8FAFC', // Gray-50 for form background
              border: '#CBD5E1', // Gray-300 for input borders
              submitButton: '#1e293b' // Slate-900 for button background
            }}
          />
        }
      </Modal>
      {/* DataTable with edit and delete actions */}
      <DataTable
        data={materials}
        colorSchema={{
          headerBg: '#334155', // Dark slate for header background
          oddRow: '#e2e8f0', // Light gray for odd rows
          evenRow: 'white', // White for even rows
          paginationBg: '#334155', // Slate for pagination background
          text: 'white', // White text for readability
          tableBg: 'gray' // Light gray for table container
        }}
        actions={[
          {
            name: 'edit',
            label: <BiEdit />,
            handler: (row) => {
              setSelected(row)
              setModal({ open: true, title: 'Edit Material' })
            },
            color: 'blue'
          },
          {
            name: 'delete',
            label: <BiTrash />,
            handler: (row) => confirmDelete(row._id), // Open confirmation dialog before delete
            color: 'red'
          }
        ]}
      />

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={isDialogOpen}
        title="Confirm Deletion"
        message="Are you sure you want to delete this material?"
        confirmButtonLabel="Delete"
        cancelButtonLabel="Cancel"
        onConfirm={handleDelete}
        onCancel={() => setIsDialogOpen(false)}
      />
    </>
  )
}

export default MaterialTable

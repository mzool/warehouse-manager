import { useEffect, useState } from 'react'
import KeyValueForm from '../generators/key_value'
import Notification from '../generators/notification'
import DataTable from '../generators/table'
import LoadingSpinner from '../generators/loader'
import { BiEdit } from 'react-icons/bi'
import Modal from '../generators/modal'

function SpecificationPage() {
  const [specs, setSpecs] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState({
    open: false,
    title: '',
    data: {}
  })
  const [msg, setMessage] = useState({
    payload: [],
    types: []
  })

  useEffect(() => {
    async function getSpecs() {
      try {
        const res = await window.api.getMaterialSpecs()
        setSpecs([...res])
      } catch (error) {
        setMessage({
          payload: ['Failed to load specifications'],
          types: ['error']
        })
      } finally {
        setLoading(false)
      }
    }
    getSpecs()
  }, [])

  return (
    <>
      {msg.payload.length > 0 &&
        msg.payload.map((ms, index) => (
          <Notification
            key={index}
            type={msg.types[index]}
            message={ms}
            onDismiss={() => setMessage({ payload: [], types: [] })}
          />
        ))}

      {loading && <LoadingSpinner />}

      <Modal
        isOpen={modal.open}
        title={modal.title}
        onClose={() =>
          setModal({
            open: false,
            title: '',
            data: {}
          })
        }
      >
        <KeyValueForm
          initialValues={Object.entries(modal.data).map(([key, value]) => ({
            key,
            value
          }))}
          onSubmit={async (updatedData) => {
            try {
              setLoading(true)
              const res = await window.api.updateMaterialSpecs(updatedData)
              setMessage({ types: ['info'], payload: [res] })
            } catch (err) {
              setMessage({ types: ['error'], payload: [err.message] })
            }

            setModal({
              open: false,
              title: '',
              data: {}
            })
            setSpecs(await window.api.getMaterialSpecs())
            setLoading(false)
          }}
        />
      </Modal>

      <DataTable
        data={specs}
        colorSchema={{
          headerBg: '#334155',
          oddRow: '#e2e8f0',
          evenRow: 'white',
          paginationBg: '#334155',
          text: 'white',
          tableBg: 'gray'
        }}
        actions={[
          {
            name: 'update specs',
            label: <BiEdit />,
            color: 'blue',
            handler: (row_data) => {
              setModal({
                open: true,
                title: 'Update Specifications',
                data: row_data
              })
            }
          }
        ]}
      />
    </>
  )
}

export default SpecificationPage

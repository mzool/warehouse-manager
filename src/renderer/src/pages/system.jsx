import GoHomeNav from '../components/goHomeNav'
import Notification from '../components/generators/notification'
import { useState } from 'react'
function System() {
  const [msg, setMessage] = useState({
    type: '',
    payload: []
  })
  return (
    <div className="flex flex-col gap-2 ">
      <GoHomeNav />
      {/* remove database */}
      <div className="bg-red-100 p-2 rounded ">
        {msg.payload.length > 0 &&
          msg.payload.map((ms, ind) => (
            <Notification
              key={ind}
              type={msg.type}
              message={ms}
              onDismiss={() => setMessage({ type: '', payload: '' })}
            />
          ))}
        <button
          className="bg-red-600 text-white rounded px-4 py-2"
          onClick={async () => {
            const res = await window.api.clearDB()
            setMessage({ payload: res, type: 'info' })
          }}
        >
          clear database
        </button>
      </div>
    </div>
  )
}

export default System

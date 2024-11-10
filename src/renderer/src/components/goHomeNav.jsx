import { useContext } from 'react'
import { pageContext } from '../context'
import { FaHome } from 'react-icons/fa'
function GoHomeNav({ pageName }) {
  const { setPageContext } = useContext(pageContext)

  function goHome() {
    setPageContext('home')
  }
  return (
    <div className="w-full flex items-center justify-between p-4 bg-slate-700 text-white">
      <button
        onClick={goHome}
        className="flex items-center gap-2 text-white text-lg font-semibold hover:text-slate-300"
      >
        <FaHome />
        <span>Home Page</span>
      </button>
      <h1 className="text-2xl font-bold">{pageName}</h1>
    </div>
  )
}

export default GoHomeNav

import { useContext } from 'react'
import { pageContext } from '../context'

function Products() {
  const { setPageContext } = useContext(pageContext)
  function goHome() {
    setPageContext('home')
  }
  return (
    <div>
      <button onClick={goHome}>home</button>
    </div>
  )
}

export default Products

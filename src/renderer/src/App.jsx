// App.js
import { useContext } from 'react'
import { PageProvider, pageContext } from './context'
import HomePage from './pages/home'
import Materials from './pages/materials'
import Inventories from './pages/inventories'
import Users from './pages/users'
import System from './pages/system'
import Orders from './pages/orders'
import Reports from './pages/reports'
import Suppliers from './pages/suppliers'
import Products from './pages/products'
const render = {
  home: <HomePage />,
  materials: <Materials />,
  inventories: <Inventories />,
  users: <Users />,
  system: <System />,
  orders: <Orders />,
  reports: <Reports />,
  suppliers: <Suppliers />,
  products: <Products />
}

function App() {
  const { page } = useContext(pageContext) // Get the current page from the context

  return (
    <div>
      {render[page] || <HomePage />} {/* Render the page based on context */}
    </div>
  )
}

export default function AppWithProvider() {
  return (
    <PageProvider>
      <App />
    </PageProvider>
  )
}

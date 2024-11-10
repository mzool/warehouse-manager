import bg from '../assets/inventory.png'
import { useContext } from 'react'
import { pageContext } from '../context'

const HomePage = () => {
  const { setPageContext } = useContext(pageContext) // Correct destructuring

  function handleCardClick(pg) {
    setPageContext(pg) // Update the context with the selected page
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="bg-black bg-opacity-50 min-h-screen py-12">
        <div className="container mx-auto text-white">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Card 1: Materials */}
            <div
              onClick={() => handleCardClick('materials')}
              className="bg-black bg-opacity-60 rounded-lg shadow-lg p-6 hover:bg-opacity-80 transition cursor-pointer"
            >
              <h2 className="text-2xl font-semibold text-center mb-4">Materials</h2>
              <p className="text-center">Manage all materials in your warehouse.</p>
            </div>

            {/* Card 2: Inventories */}
            <div
              onClick={() => handleCardClick('inventories')}
              className="bg-black bg-opacity-60 rounded-lg shadow-lg p-6 hover:bg-opacity-80 transition cursor-pointer"
            >
              <h2 className="text-2xl font-semibold text-center mb-4">Inventories</h2>
              <p className="text-center">Track your inventory levels in real-time.</p>
            </div>

            {/* Card 3: Suppliers */}
            <div
              onClick={() => handleCardClick('suppliers')}
              className="bg-black bg-opacity-60 rounded-lg shadow-lg p-6 hover:bg-opacity-80 transition cursor-pointer"
            >
              <h2 className="text-2xl font-semibold text-center mb-4">Suppliers</h2>
              <p className="text-center">Manage your suppliers and their details.</p>
            </div>

            {/* Card 4: Users */}
            <div
              onClick={() => handleCardClick('users')}
              className="bg-black bg-opacity-60 rounded-lg shadow-lg p-6 hover:bg-opacity-80 transition cursor-pointer"
            >
              <h2 className="text-2xl font-semibold text-center mb-4">Users</h2>
              <p className="text-center">Manage user roles and permissions.</p>
            </div>

            {/* Card 7: Products */}
            <div
              onClick={() => handleCardClick('products')}
              className="bg-black bg-opacity-60 rounded-lg shadow-lg p-6 hover:bg-opacity-80 transition cursor-pointer"
            >
              <h2 className="text-2xl font-semibold text-center mb-4">Products</h2>
              <p className="text-center">Manage and track product details.</p>
            </div>

            {/* Card 8: Reports */}
            <div
              onClick={() => handleCardClick('reports')}
              className="bg-black bg-opacity-60 rounded-lg shadow-lg p-6 hover:bg-opacity-80 transition cursor-pointer"
            >
              <h2 className="text-2xl font-semibold text-center mb-4">Reports</h2>
              <p className="text-center">Generate and view detailed reports.</p>
            </div>

            {/* Card 9: Orders */}
            <div
              onClick={() => handleCardClick('orders')}
              className="bg-black bg-opacity-60 rounded-lg shadow-lg p-6 hover:bg-opacity-80 transition cursor-pointer"
            >
              <h2 className="text-2xl font-semibold text-center mb-4">Orders</h2>
              <p className="text-center">Manage and track customer orders.</p>
            </div>

            {/* Card 10: System */}
            <div
              onClick={() => handleCardClick('system')}
              className="bg-black bg-opacity-60 rounded-lg shadow-lg p-6 hover:bg-opacity-80 transition cursor-pointer"
            >
              <h2 className="text-2xl font-semibold text-center mb-4">System</h2>
              <p className="text-center">System settings and configurations.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage

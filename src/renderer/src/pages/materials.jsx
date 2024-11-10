import MaterialsForm from '../components/materials/addNew'
import MaterialTable from '../components/materials/getMaterials'
import Tabs from '../components/generators/tabs'
import GoHomeNav from '../components/goHomeNav'

function Materials() {
  // Define tabs for the Tabs component
  const tabs = [
    {
      label: 'Add Material',
      content: <MaterialsForm onSubmit={addMaterialsToDb} />
    },
    { label: 'View Materials', content: <MaterialTable /> }
  ]

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100">
      {/* Header with Go Home button */}
      <GoHomeNav />

      {/* Tabs Navigation */}
      <div className="w-full  mt-6 px-4">
        <Tabs tabs={tabs} activeTabIndex={0} />
      </div>
    </div>
  )
}

export default Materials

async function addMaterialsToDb(data) {
  await window.api.addMaterials(data)
}

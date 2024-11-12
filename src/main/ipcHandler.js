import {
  getAllItems,
  updateItem,
  filterItems,
  deleteItem,
  addItem,
  clearAllData
} from './database/init_db'
export default {
  'clear-db': async () => {
    return await clearAllData()
  },
  'get-materials': async () => await getAllItems('materials'),
  'add-materials': async (e, materials) => {
    try {
      for (const mat of materials) {
        const doc = await addItem('materials', mat)
        await addItem('materials-specs', { material_id: doc._id, material_name: doc.name })
      }
      return 'Materials added successfully'
    } catch (error) {
      console.error('Error adding materials: ', error)
    }
  },
  'update-material': async (e, filter) => await updateItem('materials', filter.id, filter.data),
  'delete-material': async (e, id) => await deleteItem('materials', id),
  'get-material-specs': async (e) => await getAllItems('materials-specs'),
  'update-material-specs': async (e, data) => {
    if (!data.material_id) return 'Invalid material id'

    const mat = await filterItems('materials', { _id: data.material_id, name: data.material_name })
    const s = await filterItems('materials-specs', { _id: data._id, material_id: data.material_id })

    if (!mat || !s) {
      return 'Do not change any ID'
    }
    console.log(data);
    
    try {
      await updateItem('materials-specs', data._id, data)
      return 'Updated successfully'
    } catch (err) {
      return err.message
    }
  }
}

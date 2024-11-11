import {
  allDbs,
  getAllItems,
  updateItem,
  getItemById,
  deleteItem,
  addItem
} from './database/init_db'
export default {
  'get-materials': () => getAllItems(allDbs.materials),
  'add-materials': async (e, materials) => {
    try {
      for (const mat of materials) {
        await addItem(allDbs.materials, mat)
      }
      console.log('Materials added successfully')
    } catch (error) {
      console.error('Error adding materials: ', error)
    }
  }
}

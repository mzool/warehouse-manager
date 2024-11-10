import { addMaterials, getMaterials, removeMaterial, updateMaterial } from './materials/materials'
import getTables from './database/getTableInfo'
import db from './database/init_db'
export default {
  'get-materials': () => getMaterials(db),
  'get-tables': () => getTables(db),
  'add-materials': (e, data) => addMaterials(db, data),
  'update-material': (e, data) => updateMaterial(db, data),
  'remove-material': (e, data) => removeMaterial(db, data)
}

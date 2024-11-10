import getter from '../database/getter'
import dbInserter from '../database/inserter'
import dbUpdater from '../database/updater'
import remover from '../database/remover'

// Get materials
export async function getMaterials(db) {
  const result = await getter(db, 'materials')
  return result
}

// Add materials
export async function addMaterials(db, data) {
  // Validate that materials is an array
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error('Materials must be a non-empty array.')
  }

  // Prepare the data for insertion
  const materials = data.map((material) => {
    const {
      name,
      code,
      active,
      measure_unit,
      description = '',
      ar_name = '',
      reorder_on = null,
      brand = '',
      unit_price = 0,
      price_unit_of_measure = ''
    } = material

    // Validate required fields
    if (!name || !code || active === undefined || !measure_unit) {
      throw new Error("The fields 'name', 'code', 'active', and 'measure_unit' are required.")
    }

    return {
      name,
      code,
      active: active === 'yes' ? 1 : 0,
      measure_unit,
      description,
      ar_name,
      reorder_on,
      brand,
      unit_price,
      price_unit_of_measure
    }
  })

  // Use dbInserter to insert the data into the database
  try {
    const results = await Promise.all(
      materials.map((material) => dbInserter(db, 'materials', { data: material }))
    )
    return results
  } catch (error) {
    throw new Error('Failed to insert materials: ' + error.message)
  }
}

// Update material
export async function updateMaterial(db, data) {
  // Ensure data is valid
  if (!data || Object.keys(data).length === 0) {
    throw new Error('No data provided to update.')
  }
  const { id } = data
  if (!id) {
    throw new Error('Provide id')
  }

  // Prepare the data for update
  const updatedData = { ...data }
  if (updatedData.active) {
    updatedData.active = updatedData.active === 'yes' ? 1 : 0
  }

  // Create the options object with the filter and the updated data
  const options = {
    filter: [{ colName: 'id', value: id }],
    data: updatedData
  }

  // Use dbUpdater to update the material record
  try {
    const result = await dbUpdater(db, 'materials', options)
    return result
  } catch (error) {
    throw new Error('Failed to update material: ' + error.message)
  }
}

// Remove material
export async function removeMaterial(db, id) {
  // Validate that an id is provided
  if (!id) {
    throw new Error('Provide id for the material to remove.')
  }

  // Create the options object with the filter
  const options = {
    filter: [{ colName: 'id', value: id }]
  }

  // Use dbRemover to delete the material record
  try {
    const result = await remover(db, 'materials', options)
    return result
  } catch (error) {
    throw new Error('Failed to remove material: ' + error.message)
  }
}

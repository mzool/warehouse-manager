import { app } from 'electron'
import path from 'path'
import Datastore from '@seald-io/nedb'

const dbNames = [
  'materials',
  'suppliers',
  'users',
  'inventories',
  'groups',
  'products',
  'materials-specs'
]
const allDbs = {}

// Load all databases once on startup and handle errors
const loadAllDatabases = async () => {
  try {
    for (const dbName of dbNames) {
      const dbPath = path.join(app.getPath('userData'), `${dbName}.db`)
      const db = new Datastore({ filename: dbPath, autoload: true })

      // Wrap loadDatabase in a promise for async loading and error handling
      await new Promise((resolve, reject) => {
        db.loadDatabase((err) => {
          if (err) {
            console.error(`Error loading database ${dbName}: ${err}`)
            reject(err)
          } else {
            console.log(`Database ${dbName} loaded successfully`)
            allDbs[dbName] = db
            resolve()
          }
        })
      })
    }
  } catch (error) {
    console.error('Error loading databases:', error)
  }
}

// Call the loading function once at the start of the app
loadAllDatabases()

// Database operation functions (no need for ensureDbLoaded)

const addItem = (dbName, data) => {
  const db = allDbs[dbName]
  return new Promise((resolve, reject) => {
    if (!db) {
      return reject(`Database ${dbName} is not loaded`)
    }
    db.insert(data, (err, newDoc) => {
      if (err) {
        reject(`Error adding item: ${err}`)
      } else {
        resolve(newDoc)
      }
    })
  })
}

const getAllItems = (dbName) => {
  const db = allDbs[dbName]
  return new Promise((resolve, reject) => {
    if (!db) {
      return reject(`Database ${dbName} is not loaded`)
    }
    db.find({}, (err, docs) => {
      if (err) {
        reject(`Error fetching items: ${err}`)
      } else {
        resolve(docs)
      }
    })
  })
}

const filterItems = (dbName, filter) => {
  const db = allDbs[dbName]
  return new Promise((resolve, reject) => {
    if (!db) {
      return reject(`Database ${dbName} is not loaded`)
    }
    db.findOne({ ...filter }, (err, doc) => {
      if (err) {
        reject(`Error fetching item: ${err}`)
      } else {
        resolve(doc)
      }
    })
  })
}

const updateItem = (dbName, id, updateData) => {
  const db = allDbs[dbName]
  return new Promise((resolve, reject) => {
    if (!db) {
      return reject(`Database ${dbName} is not loaded`)
    }
    db.update({ _id: id }, { $set: updateData }, {}, (err, numReplaced) => {
      if (err) {
        reject(`Error updating item: ${err}`)
      } else {
        resolve(numReplaced)
      }
    })
  })
}

const deleteItem = (dbName, id) => {
  const db = allDbs[dbName]
  return new Promise((resolve, reject) => {
    if (!db) {
      return reject(`Database ${dbName} is not loaded`)
    }
    db.remove({ _id: id }, {}, (err, numRemoved) => {
      if (err) {
        console.error(`Error deleting item from ${dbName}: ${err}`)
        reject(`Error deleting item: ${err}`)
      } else if (numRemoved === 0) {
        console.warn(`No item found to delete with ID: ${id}`)
        resolve(numRemoved)
      } else {
        console.log(`Item deleted from ${dbName}, ID: ${id}`)
        resolve(numRemoved)
      }
    })
  })
}
const clearAllData = async () => {
  const results = [] // Array to store the results
  try {
    for (const dbName of dbNames) {
      const db = allDbs[dbName]
      if (!db) {
        console.warn(`Database ${dbName} not loaded. Skipping.`)
        continue
      }

      // Clear all data in the database and collect the result
      await new Promise((resolve, reject) => {
        db.remove({}, { multi: true }, (err, numRemoved) => {
          if (err) {
            console.error(`Error clearing data in ${dbName}: ${err}`)
            reject(`Error clearing data: ${err}`)
          } else {
            results.push(`Cleared ${numRemoved} items from ${dbName}`)
            resolve()
          }
        })
      })
    }
  } catch (error) {
    console.error('Error clearing all data:', error)
  }

  // Return all the results after all databases have been processed
  return results
}

export { addItem, getAllItems, filterItems, updateItem, deleteItem, clearAllData }

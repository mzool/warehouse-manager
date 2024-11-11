import { app } from 'electron'
import path from 'path'
import Datastore from '@seald-io/nedb'

const dbs_names = ['materials', 'suppliers', 'users', 'inventories', 'groups', 'products']

const allDbs = {}

for (const dbname of dbs_names) {
  const dbPath = path.join(app.getPath('userData'), dbname + '.db')
  allDbs[dbname] = new Datastore({ filename: dbPath, autoload: true })
}

const ensureDbLoaded = (db) => {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject(`Database not initialized.`)
    }
    db.loadDatabase((err) => {
      if (err) reject(`Failed to load database: ${err}`)
      resolve(db)
    })
  })
}

// Function to add a new item to the database
const addItem = (db, data) => {
  ensureDbLoaded(db)
  return new Promise((resolve, reject) => {
    db.insert(data, (err, newDoc) => {
      if (err) {
        reject('Error adding item: ' + err)
      } else {
        resolve(newDoc) // Returns the inserted item
      }
    })
  })
}

// Function to get all items from the database
const getAllItems = (db) => {
  ensureDbLoaded(db)
  return new Promise((resolve, reject) => {
    db.find({}, (err, docs) => {
      if (err) {
        reject('Error fetching items: ' + err)
      } else {
        resolve(docs) // Returns all documents in the database
      }
    })
  })
}

// Function to get an item by a specific query (e.g., by ID)
const getItemById = (db, filter) => {
  ensureDbLoaded(db)
  return new Promise((resolve, reject) => {
    db.findOne({ ...filter }, (err, doc) => {
      if (err) {
        reject('Error fetching item: ' + err)
      } else {
        resolve(doc) // Returns the item with the matching ID
      }
    })
  })
}

// Function to update an existing item
const updateItem = (db, id, updateData) => {
  ensureDbLoaded(db)
  return new Promise((resolve, reject) => {
    db.update({ _id: id }, { $set: updateData }, {}, (err, numReplaced) => {
      if (err) {
        reject('Error updating item: ' + err)
      } else {
        resolve(numReplaced) // Returns the number of updated items
      }
    })
  })
}

// Function to delete an item by ID
const deleteItem = (db, id) => {
  ensureDbLoaded(db)
  return new Promise((resolve, reject) => {
    db.remove({ _id: id }, {}, (err, numRemoved) => {
      if (err) {
        reject('Error deleting item: ' + err)
      } else {
        resolve(numRemoved) // Returns the number of removed items
      }
    })
  })
}

export { addItem, getAllItems, getItemById, updateItem, deleteItem, allDbs }

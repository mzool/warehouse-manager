export default async function dbInserter(db, tableName, options) {
  try {
    // Validate table name
    if (!/^[a-zA-Z_]+$/.test(tableName)) {
      throw new Error('Invalid table name')
    }

    const columns = Object.keys(options.data)
    const values = Object.values(options.data)

    // Prepare SQL query to insert data
    const columnNames = columns.map((col) => `"${col}"`).join(', ')
    const placeholders = columns.map(() => '?').join(', ')

    const query = `INSERT INTO ${tableName} (${columnNames}) VALUES (${placeholders})`

    // Return a promise that resolves when insertion is complete
    return new Promise((resolve, reject) => {
      db.serialize(() => {
        // Start transaction
        db.run('BEGIN TRANSACTION')

        // Insert the data into the table
        const stmt = db.prepare(query)
        stmt.run(values, function (err) {
          if (err) {
            // Rollback if an error occurs
            db.run('ROLLBACK')
            reject(new Error('Database insertion failed: ' + (err.message || 'Unknown error')))
            return
          }

          // Commit the transaction
          db.run('COMMIT')

          // Resolve with the inserted row ID or data
          resolve('New record added successfully')
        })
        stmt.finalize()
      })
    })
  } catch (err) {
    // In case of any unexpected errors, make sure to handle them
    throw new Error('Database insertion failed: ' + (err.message || 'Unknown error'))
  }
}

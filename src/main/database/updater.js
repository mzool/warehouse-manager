// dbUpdater updates records in the SQLite database based on provided filters and data to update
export default async function dbUpdater(db, tableName, options) {
  try {
    // Validate the table name for safety
    if (!/^[a-zA-Z_]+$/.test(tableName)) {
      throw new Error('Invalid table name')
    }

    const columns = Object.keys(options.data)
    const values = Object.values(options.data)
    const setClauses = columns.map((col) => `"${col}" = ?`)

    // Prepare filter conditions
    const filterClauses = options.filter.map((filter) => {
      const { colName, value, operator = '=' } = filter
      if (!/^[a-zA-Z_]+$/.test(colName)) {
        throw new Error('Invalid column name in filter')
      }
      values.push(value)
      return `"${colName}" ${operator} ?`
    })

    // SQL query for the update operation
    const query = `UPDATE ${tableName} SET ${setClauses.join(', ')} WHERE ${filterClauses.join(' AND ')}`

    // Return a promise for asynchronous handling
    return new Promise((resolve, reject) => {
      db.serialize(() => {
        // Begin transaction
        db.run('BEGIN TRANSACTION')

        // Run the update query
        db.run(query, values, function (err) {
          if (err) {
            // Rollback if error occurs
            db.run('ROLLBACK')
            reject(new Error('Database update failed: ' + (err.message || 'Unknown error')))
            return
          }

          // Commit the transaction if no errors
          db.run('COMMIT', (commitErr) => {
            if (commitErr) {
              reject(
                new Error(
                  'Transaction commit failed: ' + (commitErr.message || 'Unknown error'),
                  500
                )
              )
            } else {
              // Resolve with the count of rows updated
              resolve({ updatedRows: this.changes })
            }
          })
        })
      })
    })
  } catch (err) {
    // In case of unexpected error
    return Promise.reject(new Error('Database update failed: ' + (err.message || 'Unknown error')))
  }
}

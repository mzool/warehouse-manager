export default async function dbRemover(db, tableName, options) {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run('BEGIN TRANSACTION')

      // Validate table name
      if (!/^[a-zA-Z_]+$/.test(tableName)) {
        db.run('ROLLBACK')
        return reject(new Error('Invalid table name', 400))
      }

      // Build filter clause and collect values
      const filterClauses = options.filter.map((filter, index) => {
        const { colName, operator = '=' } = filter
        if (!/^[a-zA-Z_]+$/.test(colName)) {
          db.run('ROLLBACK')
          return reject(new Error('Invalid column name in filter', 400))
        }
        return `"${colName}" ${operator} ?`
      })
      const filterValues = options.filter.map((f) => f.value)

      // Construct DELETE query
      const query = `DELETE FROM "${tableName}" WHERE ${filterClauses.join(' AND ')}`

      db.run(query, filterValues, function (err) {
        if (err) {
          db.run('ROLLBACK')
          return reject(new Error('Database deletion failed: ' + err.message))
        }

        db.run('COMMIT', (commitErr) => {
          if (commitErr) {
            return reject(new Error('Transaction commit failed: ' + commitErr.message))
          }
          resolve(this.changes) // `this.changes` contains the number of rows deleted
        })
      })
    })
  })
}

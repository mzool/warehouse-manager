export default async function dbGetter(db, tableName, options = {}) {
  return new Promise((resolve, reject) => {
    try {
      // Validate table name to prevent injection in the table name
      if (!/^[a-zA-Z_]+$/.test(tableName)) {
        throw new Error('Invalid table name')
      }

      // Build column selection part of the query
      const columns =
        options.cols && options.cols.length > 0
          ? options.cols.map((col) => `"${col}"`).join(', ')
          : '*' // Default to all columns

      // Start query with SELECT clause
      let query = `SELECT ${columns} FROM "${tableName}"`

      // Prepare filter conditions if provided
      const queryParams = []
      if (options.filter && options.filter.length > 0) {
        const filterClauses = options.filter.map((filter) => {
          const { colName, value } = filter

          // Validate column name to prevent injection
          if (!/^[a-zA-Z_]+$/.test(colName)) {
            throw new Error('Invalid column name in filter')
          }

          // Add placeholder for each filter and collect the value
          queryParams.push(value)
          return `"${colName}" = ?` // Use `?` for SQLite parameterized query
        })

        // Join all filter clauses with 'AND' to form the WHERE clause
        query += ` WHERE ${filterClauses.join(' AND ')}`
      }

      // Execute query with prepared parameters
      db.all(query, queryParams, (err, rows) => {
        if (err) {
          reject(new Error('Database query failed: ' + err.message))
        } else {
          resolve(rows)
        }
      })
    } catch (err) {
      reject(err) // Reject the promise if there’s any validation or unexpected error
    }
  })
}

export default async function getTables(db) {
  db.all("SELECT name FROM sqlite_master WHERE type='table';", (err, rows) => {
    if (err) {
      console.error('Error fetching tables:', err.message)
      return
    }

    // List of all table names
    console.log('Tables in the database:')
    rows.forEach((row) => {
      console.log(row.name)
    })
  })
}

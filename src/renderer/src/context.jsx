// context.js
import { createContext, useState } from 'react'

export const pageContext = createContext()

export const PageProvider = ({ children }) => {
  const [page, setPage] = useState('home')

  const setPageContext = (newPage) => {
    setPage(newPage)
  }

  return <pageContext.Provider value={{ page, setPageContext }}>{children}</pageContext.Provider>
}

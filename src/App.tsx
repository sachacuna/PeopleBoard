import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'
import UsersList from './components/UsersList'
import { type User, SortBy } from './assets/types.d'

function App() {
  const [users, setUsers] = useState<User[]>([])
  const [showColor, setShowColor] = useState<boolean>(false)
  const [sorting, setSorting] = useState<SortBy>(SortBy.NONE)
  const [loading, setLoading] = useState<boolean>(true)
  const [countryFilter, setCountryFilter] = useState<string | null>(null)

  const originalUsers = useRef<User[]>([])

  const toggleColor = () => {
    setShowColor(!showColor)
  }

  const toggleSortByCountry = () => {
    const newSortValue = sorting === SortBy.NONE ? SortBy.COUNTRY : SortBy.NONE
    setSorting(newSortValue)
  }

  const handleDelete = (email: string) => {
    const filteredUsers = users.filter((user: User) => user.email !== email)
    setUsers(filteredUsers)
  }

  const handleReset = () => {
    setUsers(originalUsers.current)
  }

  const handleChangeSort = (sort: SortBy) => {
    setSorting(sort)
  }

  useEffect(() => {
    setLoading(true)
    fetch('https://randomuser.me/api?results=30')
      .then(async res => await res.json())
      .then(res => {
        setUsers(res.results)
        setLoading(false)
        originalUsers.current = res.results
      })
      .catch(e => {
        console.error(e)
        setLoading(false)
      })
  }, [])

  const filteredUsers = useMemo(() => {
    return typeof countryFilter === 'string' && countryFilter.length ?
      users.filter(user => {
        return user.location.country.toLowerCase().includes(countryFilter.toLowerCase())
      })
      : users
  }, [users, countryFilter])

  const sortedUsers = useMemo(() => {
    if (sorting === SortBy.NONE) return filteredUsers
    const compareProperties: Record<string, (user: User) => any> = {
      [SortBy.COUNTRY]: user => user.location.country,
      [SortBy.NAME]: user => user.name.first,
      [SortBy.LAST]: user => user.name.last,
    }
    return [...filteredUsers].sort((a, b) => {
      return compareProperties[sorting](a).localeCompare(compareProperties[sorting](b))
    })
  }, [filteredUsers, sorting])

  return (
    <div className='App'>
      <h1>User List ({users.length})</h1>
      <header>
        <button onClick={toggleColor}>
          Row colors
        </button>
        <button onClick={toggleSortByCountry}>
          {sorting === SortBy.COUNTRY ? 'Do not sort by country' : 'Sort by country'}
        </button>
        <button onClick={handleReset}>
          Reset users
        </button>
        <input placeholder='Filter by Country' onChange={(e) => {
          setCountryFilter(e.target.value)
        }}
        />
      </header>
      <main>
        {loading ? (
          <div >
            <p>Loading users...</p>
          </div>
        ) : (
          <UsersList changeSorting={handleChangeSort} users={sortedUsers} showColor={showColor} deleteUser={handleDelete} />
        )}
      </main>
    </div>
  )
}

export default App

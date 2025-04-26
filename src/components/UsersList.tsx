import { type User, SortBy } from '../assets/types.d'

interface Props {
  users: User[]
  showColor: boolean
  deleteUser: (email: string) => void
  changeSorting: (sort: SortBy) => void
}

const UsersList = ({ users, showColor, deleteUser, changeSorting }: Props) => {

  return (
    <table width='100%'>
      <thead>
        <tr>
          <th>Picture</th>
          <th className="pointer" onClick={() => changeSorting(SortBy.NAME)}>Name</th>
          <th className="pointer" onClick={() => changeSorting(SortBy.LAST)}>Last Name</th>
          <th className="pointer" onClick={() => changeSorting(SortBy.COUNTRY)}>Country</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody className={showColor ? 'table--showColors' : ''}>
        {
          users.map((user) => {
            return (
              <tr key={user.email} >
                <td>
                  <img src={user.picture.thumbnail} />
                </td>
                <td>
                  {user.name.first}
                </td>
                <td>
                  {user.name.last}
                </td>
                <td>
                  {user.location.country}
                </td>
                <td>
                  <button onClick={() => deleteUser(user.email)}>Delete</button>
                </td>
              </tr>
            )
          })}
      </tbody>
    </table>
  )
}


export default UsersList
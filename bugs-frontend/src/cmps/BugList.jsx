
import { Link } from 'react-router-dom'
import { BugPreview } from './BugPreview'
import { userService } from '../services/user.service'

export function BugList({ bugs, onRemoveBug, onEditBug }) {

  function isAllowed(bug) {
    const loggedinUser = userService.getLoggedinUser()
    return loggedinUser && (loggedinUser.isAdmin || bug?.owner?._id === loggedinUser?._id)
  }

  return (
    <ul className="bug-list">
      {bugs.map((bug) => (
        <li className="bug-preview" key={bug._id}>
          <BugPreview bug={bug} />
          <div>
            {isAllowed(bug) && <button
              onClick={() => {
                onRemoveBug(bug._id)
              }}
            >
              x
            </button>}
            {isAllowed(bug) && <button
              onClick={() => {
                onEditBug(bug)
              }}
            >
              Edit
            </button>}
          </div>
          <Link to={`/bug/${bug._id}`}>Details</Link>
        </li>
      ))}
    </ul>
  )
}

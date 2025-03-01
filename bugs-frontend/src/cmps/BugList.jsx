
import { Link } from 'react-router-dom'
import { BugPreview } from './BugPreview'
import { userService } from '../services/user.service';

export function BugList({ bugs, onRemoveBug, onEditBug }) {

  function isAllowed(bug) {
    const loggedinUser = userService.getLoggedinUser();
    if (!loggedinUser) return false;

    // If owner is an object with an _id property:
    if (bug.owner && typeof bug.owner === 'object' && bug.owner._id) {
      return loggedinUser?.isAdmin || bug.creator?._id === loggedinUser?._id;
    }
    // If owner is stored as a string:
    return loggedinUser?.isAdmin || bug.creator?._id === loggedinUser?._id;
  }

  return (
    <ul className="bug-list">
      {bugs.map((bug) => (
        <li className="bug-preview" key={bug._id}>
          <BugPreview bug={bug} />
          <div>
            {
              isAllowed(bug) &&
              <button
                onClick={() => {
                  onRemoveBug(bug._id)
                }}
              >
                x
              </button>}
            {
              isAllowed(bug) &&
              <button
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

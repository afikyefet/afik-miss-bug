import { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { BugFilter } from '../cmps/BugFilter.jsx'
import { BugList } from '../cmps/BugList.jsx'
import { bugService } from '../services/bug/index.js'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service.js'
import { userService } from '../services/user/user.service.remote.js'
import { debounce } from '../services/util.service.js'
import { loadUser } from '../store/userActions.js'


export function BugIndex() {
  const [bugs, setBugs] = useState([])
  const [filterBy, setFilterBy] = useState(bugService.getDefaultFilter())
  const onSetFilterBy = useCallback(debounce(_onSetFilterBy, 350), [])
  const loggedInUser = useSelector(state => state.userModule.loggedInUser)

  useEffect(() => {
    loadBugs(filterBy)
    loadUser(userService.getLoggedinUser()?._id)
  }, [filterBy])

  useEffect(() => {
  }, [loggedInUser])

  function _onSetFilterBy(filterBy) {
    setFilterBy(prevFilter => ({ ...prevFilter, ...filterBy }))
  }

  async function loadBugs(filterBy = {}) {
    const bugs = await bugService.query(filterBy)
    setBugs(bugs)
  }

  async function onRemoveBug(bugId) {
    try {
      await bugService.remove(bugId)
      console.log('Deleted Succesfully!')
      setBugs(prevBugs => prevBugs.filter((bug) => bug._id !== bugId))
      showSuccessMsg('Bug removed')
    } catch (err) {
      console.log('Error from onRemoveBug ->', err)
      showErrorMsg('Cannot remove bug')
    }
  }

  async function onEditBug(bug) {
    const severity = +prompt('New severity?')
    const bugToSave = { ...bug, severity }
    try {

      const savedBug = await bugService.save(bugToSave)
      console.log('Updated Bug:', savedBug)
      setBugs(prevBugs => prevBugs.map((currBug) =>
        currBug._id === savedBug._id ? savedBug : currBug
      ))
      showSuccessMsg('Bug updated')
    } catch (err) {
      console.log('Error from onEditBug ->', err)
      showErrorMsg('Cannot update bug')
    }
  }

  function onChangePageIdx(pageIdx) {
    setFilterBy(prevFilter => ({ ...prevFilter, pageIdx: pageIdx }))
  }

  if (!bugs) return <div>Loading...</div>

  const isPaging = filterBy.pageIdx !== undefined

  return (
    <main className="main-layout">
      <h3>Bugs App</h3>
      <main>
        <div className="bug-pagination">
          <label> Use paging
            <input type="checkbox" checked={isPaging} onChange={() => onChangePageIdx(isPaging ? undefined : 0)} />
          </label>
          {isPaging && <>
            <button disabled={filterBy.pageIdx <= 0} onClick={() => onChangePageIdx(filterBy.pageIdx - 1)}>-</button>
            <span>{filterBy.pageIdx + 1}</span>
            <button disabled={bugs == 0} onClick={() => onChangePageIdx(filterBy.pageIdx + 1)}>+</button>
          </>}
        </div>
        <Link to='/bug/edit'>Add Bug ⛐</Link>
        <BugFilter filterBy={filterBy} setFilterBy={setFilterBy} onSetFilterBy={onSetFilterBy} />
        <BugList bugs={bugs} onRemoveBug={onRemoveBug} onEditBug={onEditBug} />
      </main>
    </main>
  )
}

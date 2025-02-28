import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router"

import { bugService } from "../services/bug.service.js"
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js"

export function BugEdit() {

    const [bugToEdit, setBugToEdit] = useState(bugService.getEmptyBug())
    const [showLabelsDropdown, setShowLabelsDropdown] = useState(false)
    const labels = bugService.getLabelsList()
    const selectedLabels = bugToEdit.labels || []

    // console.log(bugToEdit);


    const navigate = useNavigate()
    const params = useParams()

    useEffect(() => {
        if (params.bugId) loadBug()
    }, [])

    function toggleLabelsDropdown() {
        setShowLabelsDropdown(prev => !prev)
    }
    async function loadBug() {
        try {
            const bugToEdit = await bugService.get(params.bugId)
            setBugToEdit(bugToEdit)
        } catch (err) {
            console.log('err:', err)
        }
    }

    function handleChange({ target }) {
        const field = target.name
        let value = target.value

        switch (target.type) {
            case 'number':
            case 'range':
                value = +value || ''
                break;

            case 'checkbox':
                value = target.checked
                break

            default:
                break;
        }
        setBugToEdit(prevBugToEdit => ({ ...prevBugToEdit, [field]: value }))
    }

    function handleLabelChange({ target }) {
        const { value, checked } = target
        setBugToEdit(prevBugToEdit => {
            const currentLabels = prevBugToEdit.labels || []
            return {
                ...prevBugToEdit,
                labels: checked
                    ? [...currentLabels, value]
                    : currentLabels.filter(label => label !== value),
            }
        })
    }

    async function onBugSave() {
        try {
            return await bugService.save(bugToEdit)
                .then(() => {
                    showSuccessMsg("Bug saves successfully!")
                    navigate('/bug')
                })
        } catch (error) {
            console.log(error);
            showErrorMsg("Couldnt save bug!")
        }
    }

    const { title, severity, description } = bugToEdit

    return (
        <section className="bug-edit">
            <label htmlFor="title">Title:</label>
            <input onChange={handleChange} value={title} type="text" name="title" id="title" />
            <label htmlFor="description">Description:</label>
            <input onChange={handleChange} value={description} type="text" name="description" id="description" />
            <label htmlFor="severity">Severity:</label>
            <input onChange={handleChange} value={severity} type="number" name="severity" id="severity" />
            <div className="dropdown">
                <button type="button" onClick={toggleLabelsDropdown}>
                    Labels
                </button>
                <span>

                    {selectedLabels.length > 0 && `(${selectedLabels.join(", ")})`}
                </span>
                {showLabelsDropdown && (
                    <div className="dropdown-content">
                        {labels.map(label => (
                            <label key={label} className="dropdown-item">
                                <input
                                    type="checkbox"
                                    name="labels"
                                    value={label}
                                    checked={selectedLabels.includes(label)}
                                    onChange={handleLabelChange}
                                />
                                {label}
                            </label>
                        ))}
                    </div>
                )}
            </div>
            <button onClick={() => onBugSave()}>Save</button>
        </section>
    )
}
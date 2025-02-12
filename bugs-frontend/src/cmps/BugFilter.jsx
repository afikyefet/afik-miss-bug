import React, { useState } from "react"
import { bugService } from "../services/bug.service"

export function BugFilter({ filterBy, setFilterBy }) {
	const [showLabelsDropdown, setShowLabelsDropdown] = useState(false)
	const labels = bugService.getLabelsList()

	function handleChange({ target }) {
		const field = target.name
		let value = target.type === "checkbox" ? target.checked : target.value
		if (field === "severity" && value !== "") value = +value
		setFilterBy(prevFilter => ({
			...prevFilter,
			[field]: value,
		}))
	}

	function handleLabelChange({ target }) {
		console.log(filterBy)

		const { value, checked } = target
		setFilterBy(prevFilter => {
			const currentLabels = prevFilter.labels || []
			return {
				...prevFilter,
				labels: checked
					? [...currentLabels, value]
					: currentLabels.filter(label => label !== value),
			}
		})
	}

	function toggleLabelsDropdown() {
		setShowLabelsDropdown(prev => !prev)
	}

	const selectedLabels = filterBy.labels || []

	return (
		<section className="bug-filter">
			<form className="container">
				<section className="filter">
					<label htmlFor="bug-title">
						Title:
						<input
							type="text"
							name="title"
							id="bug-title"
							value={filterBy.title || ""}
							onChange={handleChange}
						/>
					</label>

					<label htmlFor="bug-severity">
						Severity:
						<input
							type="number"
							name="severity"
							id="bug-severity"
							min={0}
							value={filterBy.severity || ""}
							onChange={handleChange}
						/>
					</label>

					<label htmlFor="bug-description">
						Description:
						<input
							type="text"
							name="description"
							id="bug-description"
							value={filterBy.description || ""}
							onChange={handleChange}
						/>
					</label>

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
				</section>
				<section className="sort">
					<label htmlFor="sort-by">
						Sort by:
						<select
							name="sortBy"
							id="sort-by"
							value={filterBy.sortBy || "none"}
							onChange={handleChange}
						>
							<option value="none">none</option>
							<option value="title">Title</option>
							<option value="severity">Sevirity</option>
						</select>
					</label>

					<label htmlFor="descending">
						Descending:
						<input
							type="checkbox"
							name="descending"
							id="descending"
							checked={filterBy.descending || false}
							onChange={handleChange}
						/>
					</label>
				</section>
			</form>
			{/* Optionally add a reset button here */}
			{/* <button className="reset btn-secondary" onClick={() => setFilterReset()}>clear</button> */}
		</section>
	)
}

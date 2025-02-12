

export function BugFilter() {

	return (
		<section className="bug-filter">
			<form className="container">
				<section className="filter">

					<label htmlFor="bug-name">
						Name:
						<input
							type="text"
							name="name"
							id="bug-name"
						/>
					</label>

					<label htmlFor="bug-price">
						Price:
						<input
							type="number"
							name="price"
							id="bug-price"
							min={0}
						/>
					</label>

				</section>
				<section className="sort">

					<label htmlFor="bug-stock">
						In Stock:
						<select
							name="inStock"
							id="bug-stock"
						>
							<option value="All">All</option>
							<option value="In Stock">In Stock</option>
							<option value="Out Of Stock">Out Of Stock</option>
						</select>
					</label>

					<label htmlFor="sort-by">Sort by:
						<select
							name="sortBy"
							id="sort-by"
						>
							<option name="none" id="none">none</option>
							<option name="price" id="price">price </option>
							<option name="alphabet" id="alphabet">alphabet</option>
						</select>
					</label>
					<label htmlFor="descending">descending:</label>
					<input
						type="checkbox"
						name="descending"
						id="descending"
					/>
				</section>
			</form>
			{/* <button className="reset btn-secondary" onClick={() => setFilterReset()}>clear</button> */}
		</section>
	)
}
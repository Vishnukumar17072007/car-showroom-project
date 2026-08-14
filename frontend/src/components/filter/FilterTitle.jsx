function FilterTitle({onReset}) {
    return(
        // <!-- filter-title -->
        <div className="layer-1 d-flex flex-wrap mb-3">
            <p className="h6">Filter By</p>
                <p className="reset-filter" onClick={onReset}>Reset all</p>
        </div>
    );
}

export default FilterTitle
function AvailableFilter({checked, onChange}) {
    return(
        // <!-- available filter -->
            <div className="available-filter-css d-flex flex-wrap mt-4 mb-3">
                <label className="form-check-label" htmlFor="availabilitySwitch">
                    AVAILABLE NOW ONLY   
                </label>
                <div className="form-check form-switch">
                    <input className="form-check-input" type="checkbox" id="availabilitySwitch" checked={checked} onChange={onChange}/>
                </div>
            </div>
    );
}

export default AvailableFilter;
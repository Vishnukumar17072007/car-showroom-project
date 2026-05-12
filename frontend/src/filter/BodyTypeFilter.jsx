import { useState } from "react";

function BodyTypeFilter({selected, onChange}) {

    const [openContent, setOpenContent] = useState(false);
    const [rotateArrow, setRotateArrow] = useState(false);

    const bodyTypes = ["sedan", "wagon", "coupe", "hatchback", "pickup", "sport coupe", "crossover", "van"];

    return(
        // <!-- bodyType filter -->
            <div className="body-type-filter-css mb-3">
                <div className={`car_type bg-light border-none border-bottom-1 ${rotateArrow ? "active" : ""}`} onClick={() => {
                    setOpenContent(!openContent);
                    setRotateArrow(!rotateArrow);
                    }}>CAR BODY TYPE <span className={"bi bi-chevron-down arrow"}></span>
                </div>

                <div className={`car_type_list row ms-2 ${openContent ? "show" : ""}`} id="car-type">
                    {bodyTypes.map((t) => (
                        <div key={t} className="car_type_checkbox col-6">
                            <input type="checkbox" name="" id="" checked={selected === t} onChange={() => onChange(t)}/>
                            <span> {t}</span>
                        </div>
                    ))}
                </div>
            </div>
    );
}

export default BodyTypeFilter;
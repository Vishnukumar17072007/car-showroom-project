import { useState } from "react";

function TransmissionFilter({selected, onChange}) {

        const [openContent, setOpenContent] = useState(false);
        const [rotateArrow, setRotateArrow] = useState(false);
        
    return(
        // transmission-filter
        <div className="transmission-filter-css mb-3">
            <div className={`transmission ${rotateArrow ? "active" : ""}`} onClick={() => {
                setOpenContent(!openContent);
                setRotateArrow(!rotateArrow);
            }}>
                TRANSMISSION 
                <span className="bi bi-chevron-down arrow"></span>
            </div>
        
            <div className={`trans_content ${openContent ? "show" : ""}`}>
                {["Any", "Automatic", "manual"].map((t)=>(
                    <button key={t} className={selected === t ? "active-filter-btn" : ""} onClick={() => onChange(t)}>{t}</button>
                ))}
            </div>
        </div>
    );
}

export default TransmissionFilter
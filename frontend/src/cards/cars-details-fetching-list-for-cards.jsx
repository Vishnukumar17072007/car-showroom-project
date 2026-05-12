import useFetch from "../useFetch/useFetch";
import Cards from "./car-cards"
import { useAuth } from "../context/auth/useAuth";
import API from '../api/axios';
import { useState } from "react";
import toast from 'react-hot-toast';
import { CarGridSkeleton } from '../component/PageSkeletons';

function CarDetailsFetchingListForCards({filters, search}){

    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [updateCar, setUpdateCar] = useState({});
    const { user } = useAuth();
    const [refreshKey, setRefeshKey] = useState(0);

    function handleRefresh(){
        setRefeshKey(k => k+1);
    }

    const params = new URLSearchParams();

    if(filters?.available) params.append("available", "true");
    if(filters?.bodyType) params.append("bodyType", filters.bodyType);
    if(filters?.transmission) params.append("transmission", filters.transmission);
    if(filters?.fuelType) params.append("fuelType", filters.fuelType);
    if(filters?.maxPrice) params.append("maxPrice", filters.maxPrice);
    if(search) params.append("search", search);
    params.append("_t", refreshKey);

    const queryString = params.toString();
    const url = `${import.meta.env.VITE_API_URL}/cars${queryString ? "?" + queryString : ""}`;

    const [carDetails, error, loading] = useFetch(url);

    async function handleUpdateSubmit() {
        const { brand, model, bodyType, image, price, rating, available } = updateCar;
    
        // ✅ required field check
        if (!brand?.trim() || !model?.trim() || !bodyType?.trim() || !image?.trim()) {
            toast.error('Brand, Model, Body Type and Image URL are required.');
            return;
        }
        if (!price || price <= 0) {
            toast.error('Please enter a valid price.');
            return;
        }
        if (!rating || rating < 1 || rating > 10) {
            toast.error('Rating must be between 1 and 10.');
            return;
        }

        if (available === undefined || available === null || available === '' || available < 0) {
            toast.error('Stock count cannot be negative or empty.');
            return;
        }
    
        await API.post('/cars/addCar', updateCar);
        setShowUpdateForm(false);
        handleRefresh();
        toast.success('Car added successfully!');
    }

    if(loading){
        return (
            <>
                {!error && <CarGridSkeleton count={15} />}
                {error && <p>{error}</p>}
            </>
    )
    }
    
    // carDetails.sort((x,y) => x.price - y.price);//x is index 1 and y is index 2, if true changes made in ascending order
    //(x,y) => y-x; x is index 1 and y is index 2, if true changes made in desending order
    // const FilteredCarDetailsFetchingListForCards = carDetails.filter((carDetail)=>carDetail.rating>0) 

    if(carDetails.length === 0){
        return (
            <div className="car_card_box d-flex justify-content-center align-items-center" style={{ minHeight: "200px" }}>
                <p style={{ fontSize: "1.2rem", color: "gray" }}>🚗 No cars found matching your search.</p>
            </div>
        )
    }

    const CarDetailsFetchingListForCards = carDetails.map((Detail)=>{
        return <Cards key = {Detail._id} _id={Detail._id} brand={Detail.brand} model={Detail.model} bodyType={Detail.bodyType} image={Detail.image} price={Detail.price} rating={Detail.rating} available={Detail.available} onUpdate={handleRefresh}/>
    });

    return(
        <>
            <div className="car_card_box d-flex flex-wrap gap-2">
                {CarDetailsFetchingListForCards}

                {user?.role === "admin" && (
                    <div className="car-card-update" onClick={() => setShowUpdateForm(true)}>
                        <div className="car_image-update">
                            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQbyJMDaCMqaZj-SBNRrPi2whKdXndBx_oUHw&s" alt="" style={{color: "white"}}/>
                        </div>
                        <div className="car_card_body-update">
                            Add CARS
                        </div>
                    </div>
                )}

                {showUpdateForm && (<div className="updateForm">
                    <div className="updateFormContent">
                        <input type="text" className="updateBrand" placeholder='Brand Name' onChange={e => setUpdateCar({...updateCar, brand: e.target.value})}/>
                        <input type="text" className="updateModel" placeholder='Model Name' onChange={e => setUpdateCar({...updateCar, model: e.target.value})}/>
                        <input type="text" className="updatebodyType" placeholder='Body Type' onChange={e => setUpdateCar({...updateCar, bodyType: e.target.value})}/>
                        <input type="text" className="updateImage" placeholder='Image URL' onChange={e => setUpdateCar({...updateCar, image: e.target.value})}/>
                        <input type="number" className="updatePrice" placeholder='Price Amount in INR' onChange={e => setUpdateCar({...updateCar, price: Number(e.target.value)})}/>
                        <input type="number" className="updateRating" placeholder='Rating of Car' onChange={e => setUpdateCar({...updateCar, rating: Number(e.target.value)})}/>
                        <input type="number" className="updateAvailable" placeholder='Stock Count (available units)' onChange={e => setUpdateCar({...updateCar, available: Number(e.target.value)})}/>
                        <div className="SaveOrCancel-btnGroup">
                            <button className="cancelbtn btn" onClick={() => { setShowUpdateForm(false) }}>Cancel</button>
                            <button className="saveBtn btn" onClick={() => {handleUpdateSubmit(updateCar)}}>Save</button>
                        </div>
                    </div>
                </div>)}
                
            </div>

        </>
    );
}


export default CarDetailsFetchingListForCards
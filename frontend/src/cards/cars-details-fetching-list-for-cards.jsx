import useFetch from "../useFetch/useFetch";
import Cards from "./car-cards"
import { useAuth } from "../context/auth/useAuth";
import API from '../api/axios';
import { useState, useMemo, useCallback } from "react";
import toast from 'react-hot-toast';
import { CarGridSkeleton } from '../component/PageSkeletons';

function CarDetailsFetchingListForCards({ filters, search }) {
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [updateCar, setUpdateCar] = useState({});
    const { user } = useAuth();
    const [refreshKey, setRefreshKey] = useState(0);

    const handleRefresh = useCallback(() => {
        setRefreshKey(k => k + 1);
    }, []);

    const params = new URLSearchParams();
    if (filters?.available) params.append("available", "true");
    if (filters?.bodyType) params.append("bodyType", filters.bodyType);
    if (filters?.transmission) params.append("transmission", filters.transmission);
    if (filters?.fuelType) params.append("fuelType", filters.fuelType);
    if (filters?.maxPrice) params.append("maxPrice", filters.maxPrice);
    if (search) params.append("search", search);
    params.append("limit", "50");
    params.append("page", "1");
    if (refreshKey) params.append("_refresh", String(refreshKey));

    const queryString = params.toString();
    const url = `${import.meta.env.VITE_API_URL}/cars${queryString ? `?${queryString}` : ""}`;

    const [response, error, loading] = useFetch(url);

    const carList = useMemo(() => {
        if (!response) return [];
        if (Array.isArray(response)) return response;
        return response.cars || [];
    }, [response]);

    async function handleUpdateSubmit() {
        const {
            brand, model, image, frontImage, rearImage, rightSideImage, leftSideImage,
            bodyType, fuelType, transmission, seats, engineType, mileage, price, rating, available,
        } = updateCar;

        if (!brand?.trim() || !model?.trim() || !bodyType?.trim() || !image?.trim()
            || !frontImage?.trim() || !rearImage?.trim() || !rightSideImage?.trim() || !leftSideImage?.trim()
            || !fuelType?.trim() || !transmission?.trim() || !engineType?.trim() || !mileage?.trim()) {
            toast.error('All fields are required.');
            return;
        }
        if (!seats) {
            toast.error('Please enter seats count.');
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

        try {
            await API.post('/cars/addCar', updateCar);
            setShowUpdateForm(false);
            setUpdateCar({});
            handleRefresh();
            toast.success('Car added successfully!');
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to add car!");
        }
    }

    if (loading) {
        return (
            <>
                {!error && <CarGridSkeleton count={12} />}
                {error && <p>{error}</p>}
            </>
        );
    }

    if (!carList.length) {
        return (
            <div className="car_card_box d-flex justify-content-center align-items-center" style={{ minHeight: "200px" }}>
                <p style={{ fontSize: "1.2rem", color: "gray" }}>🚗 No cars found matching your search.</p>
            </div>
        );
    }

    return (
        <>
            <div className="car_card_box d-flex flex-wrap gap-2">
                {carList.map((detail) => (
                    <Cards
                        key={detail._id}
                        _id={detail._id}
                        brand={detail.brand}
                        model={detail.model}
                        bodyType={detail.bodyType}
                        image={detail.image}
                        frontImage={detail.frontImage}
                        rearImage={detail.rearImage}
                        leftSideImage={detail.leftSideImage}
                        rightSideImage={detail.rightSideImage}
                        transmission={detail.transmission}
                        fuelType={detail.fuelType}
                        seats={detail.seats}
                        mileage={detail.mileage}
                        engineType={detail.engineType}
                        price={detail.price}
                        rating={detail.rating}
                        available={detail.available}
                        onUpdate={handleRefresh}
                    />
                ))}

                {user?.role === "admin" && (
                    <div className="car-card-update" onClick={() => setShowUpdateForm(true)}>
                        <div className="car_image-update">
                            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQbyJMDaCMqaZj-SBNRrPi2whKdXndBx_oUHw&s" alt="Add car" loading="lazy" />
                        </div>
                        <div className="car_card_body-update">Add CARS</div>
                    </div>
                )}

                {showUpdateForm && (
                    <div className="updateForm">
                        <div className="updateFormContent">
                            <input type="text" placeholder='Brand Name' onChange={e => setUpdateCar({ ...updateCar, brand: e.target.value })} required />
                            <input type="text" placeholder='Model Name' onChange={e => setUpdateCar({ ...updateCar, model: e.target.value })} required />
                            <input type="text" placeholder='Image URL' onChange={e => setUpdateCar({ ...updateCar, image: e.target.value })} required />
                            <input type="text" placeholder='Front Image URL' onChange={e => setUpdateCar({ ...updateCar, frontImage: e.target.value })} required />
                            <input type="text" placeholder='Rear Image URL' onChange={e => setUpdateCar({ ...updateCar, rearImage: e.target.value })} required />
                            <input type="text" placeholder='Right Side Image URL' onChange={e => setUpdateCar({ ...updateCar, rightSideImage: e.target.value })} required />
                            <input type="text" placeholder='Left Side Image URL' onChange={e => setUpdateCar({ ...updateCar, leftSideImage: e.target.value })} required />
                            <input type="text" placeholder='Body Type' onChange={e => setUpdateCar({ ...updateCar, bodyType: e.target.value })} required />
                            <input type="text" placeholder='Transmission' onChange={e => setUpdateCar({ ...updateCar, transmission: e.target.value })} required />
                            <input type="text" placeholder='Fuel Type' onChange={e => setUpdateCar({ ...updateCar, fuelType: e.target.value })} required />
                            <input type="text" placeholder='Engine Type' onChange={e => setUpdateCar({ ...updateCar, engineType: e.target.value })} required />
                            <input type="number" placeholder='Seats' onChange={e => setUpdateCar({ ...updateCar, seats: Number(e.target.value) })} required />
                            <input type="text" placeholder='Mileage' onChange={e => setUpdateCar({ ...updateCar, mileage: e.target.value })} required />
                            <input type="number" placeholder='Price (INR)' onChange={e => setUpdateCar({ ...updateCar, price: Number(e.target.value) })} required />
                            <input type="number" placeholder='Rating' onChange={e => setUpdateCar({ ...updateCar, rating: Number(e.target.value) })} required />
                            <input type="number" placeholder='Stock count' onChange={e => setUpdateCar({ ...updateCar, available: Number(e.target.value) })} required />
                            <div className="SaveOrCancel-btnGroup">
                                <button type="button" className="cancelBtn btn" onClick={() => setShowUpdateForm(false)}>Cancel</button>
                                <button type="button" className="saveBtn btn" onClick={handleUpdateSubmit}>Save</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default CarDetailsFetchingListForCards;

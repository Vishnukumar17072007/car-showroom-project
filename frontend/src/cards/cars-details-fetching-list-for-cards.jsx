import Cards from "./car-cards";
import { useAuth } from "../context/auth/useAuth";
import API from '../api/axios';
import { useState, useCallback, useEffect } from "react";
import toast from 'react-hot-toast';
import { CarGridSkeleton } from '../component/PageSkeletons';
import CatalogPagination from '../component/CatalogPagination';
import { useCarsCatalog, CARS_PAGE_SIZE } from '../hooks/useCarsCatalog';

function CarDetailsFetchingListForCards({ filters, search }) {
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [updateCar, setUpdateCar] = useState({});
    const [page, setPage] = useState(1);
    const [refreshKey, setRefreshKey] = useState(0);
    const { user } = useAuth();

    // Reset to page 1 when filters or search change
    useEffect(() => {
        setPage(1);
    }, [filters, search]);

    const handleRefresh = useCallback(() => {
        setRefreshKey(k => k + 1);
    }, []);

    const { cars: carList, page: currentPage, pages, total, loading, error } = useCarsCatalog({
        filters,
        search,
        page,
        limit: CARS_PAGE_SIZE,
        refreshKey,
    });

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
            await API.post('/cars/', updateCar);
            setShowUpdateForm(false);
            setUpdateCar({});
            setPage(1);
            handleRefresh();
            toast.success('Car added successfully!');
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to add car!");
        }
    }

    if (loading) {
        return (
            <>
                {!error && <CarGridSkeleton count={CARS_PAGE_SIZE} />}
                {error && <p className="catalog-error">{error}</p>}
            </>
        );
    }

    if (error) {
        return <p className="catalog-error">{error}</p>;
    }

    if (!carList.length) {
        return (
            <div className="car_card_box d-flex flex-column gap-3">
                <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "200px" }}>
                    <p style={{ fontSize: "1.2rem", color: "gray" }}>🚗 No cars found matching your search.</p>
                </div>
                <CatalogPagination
                    page={currentPage}
                    pages={pages}
                    total={total}
                    onPageChange={setPage}
                />
            </div>
        );
    }

    return (
        <div className="catalog-list-wrap">

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

            <CatalogPagination
                page={currentPage}
                pages={pages}
                total={total}
                onPageChange={setPage}
            />
        </div>
    );
}

export default CarDetailsFetchingListForCards;

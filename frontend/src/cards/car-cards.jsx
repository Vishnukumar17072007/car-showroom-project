import { memo, useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useWishList } from '../context/wish/useWishList';
import { useCart } from '../context/cart/useCart';
import { useAuth } from "../context/auth/useAuth";
import API from '../api/axios';
import { createPortal } from 'react-dom';
import toast from 'react-hot-toast';

function Cards(props) {
    const navigate = useNavigate();
    const { addToWishList, removeFromWishList, isInWishList } = useWishList();
    const { addToCart, removeFromCart, isInCart } = useCart();
    const { user } = useAuth();

    const [showEditModal, setShowEditModal] = useState(false);
    const [editData, setEditData] = useState({
        _id: props._id,
        brand: props.brand,
        model: props.model,
        bodyType: props.bodyType,
        image: props.image,
        frontImage: props.frontImage,
        rearImage: props.rearImage,
        leftSideImage: props.leftSideImage,
        rightSideImage: props.rightSideImage,
        transmission: props.transmission,
        fuelType: props.fuelType,
        engineType: props.engineType,
        seats: props.seats,
        mileage: props.mileage,
        price: props.price,
        rating: props.rating,
        available: props.available,
    });

    const car = {
        _id: props._id,
        brand: props.brand,
        model: props.model,
        bodyType: props.bodyType,
        image: props.image,
        price: props.price,
        rating: props.rating,
        available: props.available,
    };

    async function handleDelete() {
        try {
            await API.patch(`/cars/soft-delete/${props._id}`);
            props.onUpdate?.();
            toast.success("Car deleted successfully.");
        } catch (err) {
            toast.error(err.response?.data?.message || "Delete failed");
        }
    }

    async function handleEditSubmit() {
        const { brand, model, bodyType, image, price, rating } = editData;

        if (!brand?.trim() || !model?.trim() || !bodyType?.trim() || !image?.trim()) {
            toast.error('Brand, model, body type and image URL are required.');
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

        try {
            await API.put(`/cars/${props._id}`, editData);
            setShowEditModal(false);
            props.onUpdate?.();
            toast.success('Car updated successfully!');
        } catch (err) {
            toast.error(err.response?.data?.message || "Update failed");
        }
    }

    if (!props.brand) return null;

    return (
        <>
            <div className="car-card">
                <div className="car_image" onClick={() => navigate(`/vehicles/${props._id}`)}>
                    <img
                        src={props.image}
                        alt={`${props.brand} ${props.model}`}
                        loading="lazy"
                        decoding="async"
                        width={300}
                        height={200}
                    />
                    {user && (
                        <p
                            className="bi bi-heart-fill wishListToggle"
                            onClick={(e) => {
                                e.stopPropagation();
                                isInWishList(car._id) ? removeFromWishList(car._id) : addToWishList(car._id);
                            }}
                            style={{ color: isInWishList(car._id) ? "red" : "var(--gold)" }}
                        />
                    )}
                </div>
                <div className="car_card_body">
                    <div className="car_title">
                        <div style={{ display: "flex", justifyContent: "start", alignItems: "flex-start" }}>
                            <b className='p-1'>{props.brand} {props.model}</b>
                            <p className='rating p-1' style={{ margin: 0, whiteSpace: "nowrap" }}>⭐{props.rating}</p>
                        </div>
                        <p className='p-1' style={{ fontWeight: "lighter", margin: "0%" }}>{props.brand}.{props.bodyType}</p>
                    </div>
                    <b className='d-block p-1'>₹{car.price?.toLocaleString('en-IN')}</b>
                    {user && (
                        <button
                            type="button"
                            className={`bi bi-cart-plus-fill me-1 p-1 ${isInCart(car._id) ? "btn-remove" : "btn-add"}`}
                            onClick={() => isInCart(car._id) ? removeFromCart(car._id) : addToCart(car._id)}
                        >
                            {isInCart(car._id) ? "Remove from Cart" : "Add to Cart"}
                        </button>
                    )}
                    {user?.role === "admin" && (
                        <div className="EditOrDeleteCar">
                            <button type="button" className='btn-edit' onClick={() => setShowEditModal(true)}>Edit</button>
                            <button type="button" className="btn-delete" onClick={handleDelete}>Delete</button>
                        </div>
                    )}
                </div>

                {showEditModal && createPortal(
                    <div className="editModal">
                        <div className="editModalContent">
                            <label>Brand Name: </label>
                            <input type="text" placeholder='Brand Name' defaultValue={editData.brand} onChange={e => setEditData({ ...editData, brand: e.target.value })} required />
                            <label>Modal Name: </label>
                            <input type="text" placeholder='Model Name' defaultValue={editData.model} onChange={e => setEditData({ ...editData, model: e.target.value })} required />
                            <label>Image Url: </label>
                            <input type="text" placeholder='Image URL' defaultValue={editData.image} onChange={e => setEditData({ ...editData, image: e.target.value })} required />
                            <label>Front Image URL: </label>
                            <input type="text" placeholder='Front Image URL' defaultValue={editData.frontImage} onChange={e => setEditData({ ...editData, frontImage: e.target.value })} />
                            <label>Rear Image URL: </label>
                            <input type="text" placeholder='Rear Image URL' defaultValue={editData.rearImage} onChange={e => setEditData({ ...editData, rearImage: e.target.value })} />
                            <label>Right Side Image URL: </label>
                            <input type="text" placeholder='Right Side Image URL' defaultValue={editData.rightSideImage} onChange={e => setEditData({ ...editData, rightSideImage: e.target.value })} />
                            <label>Left Side Image URL: </label>
                            <input type="text" placeholder='Left Side Image URL' defaultValue={editData.leftSideImage} onChange={e => setEditData({ ...editData, leftSideImage: e.target.value })} />
                            <label>Body Type: </label>
                            <input type="text" placeholder='Body Type' defaultValue={editData.bodyType} onChange={e => setEditData({ ...editData, bodyType: e.target.value })} required />
                            <label>Transmission Type: </label>
                            <input type="text" placeholder='Transmission' defaultValue={editData.transmission} onChange={e => setEditData({ ...editData, transmission: e.target.value })} />
                            <label>Fuel Type: </label>
                            <input type="text" placeholder='Fuel Type' defaultValue={editData.fuelType} onChange={e => setEditData({ ...editData, fuelType: e.target.value })} />
                            <label>Engine Type: </label>
                            <input type="text" placeholder='Engine Type' defaultValue={editData.engineType} onChange={e => setEditData({ ...editData, engineType: e.target.value })} />
                            <label>Seats: </label>
                            <input type="number" placeholder='Seats' defaultValue={editData.seats} onChange={e => setEditData({ ...editData, seats: Number(e.target.value) })} />
                            <label>Mileage: </label>
                            <input type="text" placeholder='Mileage' defaultValue={editData.mileage} onChange={e => setEditData({ ...editData, mileage: e.target.value })} />
                            <label>Price: </label>
                            <input type="number" placeholder='Price (INR)' defaultValue={editData.price} onChange={e => setEditData({ ...editData, price: Number(e.target.value) })} required />
                            <label>Rating: </label>
                            <input type="number" placeholder='Rating' defaultValue={editData.rating} onChange={e => setEditData({ ...editData, rating: Number(e.target.value) })} required />
                            <label>Stock: </label>
                            <input type="number" placeholder='Stock count' defaultValue={editData.available} onChange={e => setEditData({ ...editData, available: Number(e.target.value) })} />
                            <div className="SaveOrCancel-btnGroup">
                                <button type="button" className="cancelBtn btn" onClick={() => setShowEditModal(false)}>Cancel</button>
                                <button type="button" className="saveBtn btn" onClick={handleEditSubmit}>Save</button>
                            </div>
                        </div>
                    </div>,
                    document.body
                )}
            </div>
        </>
    );
}

Cards.propTypes = {
    _id: PropTypes.string,
    brand: PropTypes.string,
    model: PropTypes.string,
    bodyType: PropTypes.string,
    image: PropTypes.string,
    frontImage: PropTypes.string,
    rearImage: PropTypes.string,
    leftSideImage: PropTypes.string,
    rightSideImage: PropTypes.string,
    transmission: PropTypes.string,
    engineType: PropTypes.string,
    fuelType: PropTypes.string,
    mileage: PropTypes.string,
    seats: PropTypes.number,
    price: PropTypes.number,
    rating: PropTypes.number,
    available: PropTypes.number,
    onUpdate: PropTypes.func,
};

export default memo(Cards);
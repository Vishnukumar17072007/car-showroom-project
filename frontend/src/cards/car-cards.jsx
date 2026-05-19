import PropTypes from 'prop-types'
import { Navigate, useNavigate } from 'react-router-dom';
import { useWishList } from '../context/wish/useWishList';
import { useCart } from '../context/cart/useCart';
import { useAuth } from "../context/auth/useAuth";
import { useState } from 'react';
import API from '../api/axios';
import { createPortal } from 'react-dom';
import toast from 'react-hot-toast';

function Cards(props){
    const navigate = useNavigate();

    const { addToWishList, removeFromWishList, isInWishList } = useWishList();
    const { addToCart, removeFromCart, isInCart } = useCart();
    const {user} = useAuth();

    const [showEditModal, setShowEditModal] = useState(false);
    const [editData, setEditData] = useState({
        _id: props._id,
        brand: props.brand,
        model: props.model,
        bodyType: props.bodyType,
        image: props.image,
        price: props.price,
        rating: props.rating,
        available: props.available
    });

    const car = { _id: props._id, brand: props.brand, model: props.model,bodyType: props.bodyType, image: props.image, price: props.price, rating: props.rating,available: props.available }

    async function handleDelete() {
        try {
            await API.patch(`/cars/soft-delete/${props._id}`);
            props.onUpdate();
            toast.success("A Car Detail Card have been successfully Deleted.");
        }
        catch(err) {
            toast.error(err.response?.data?.message || "Delete Failed");
        }
    }

    async function handleEditSubmit() {
        const { brand, model, bodyType, image, price, rating } = editData;
    
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
    
        try {
            await API.put(`/cars/${props._id}`, editData);
            setShowEditModal(false);
            props.onUpdate();
            toast.success('Car updated successfully!');
        } catch(err) {
            toast.error(err.response?.data?.message || "Update Failed");
        }
    }

    return(
        <>
            {props.brand && (<div className="car-card" >
                <div className="car_image" onClick={() => { navigate(`/vehicles/${props._id}`)}}>
                    <img src={props.image} alt="car-image" style={{width: "100%", height:"100%", backgroundColor: "white", borderRadius:"5px"}}></img>
                    {user && <p className="bi bi-heart-fill wishListToggle" 
                        onClick={() => isInWishList(car._id) ? removeFromWishList(car._id) : addToWishList(car._id)} 
                        style={{color: isInWishList(car._id) ? "red" : "var(--gold)"}}>
                    </p>}
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
                    {user && <button className={`bi bi-cart-plus-fill me-1 p-1 ${isInCart(car._id) ? "btn-remove" : "btn-add"}`}
                        onClick={() => isInCart(car._id) ? removeFromCart(car._id) : addToCart(car._id)}>
                        {isInCart(car._id) ? "Remove from Cart" : "Add to Cart"}
                    </button>}
                    {user?.role==="admin" && (
                        <div className="EditOrDeleteCar">
                            <button className='btn-edit' onClick={() => setShowEditModal(true) }>Edit</button>
                            <button className="btn-delete" onClick={ handleDelete }>Delete</button>
                        </div>
                    )}
                </div>
                
                { showEditModal && createPortal(
                    <div className="editModal">
                        <div className="editModalContent">
                            <input type="text" className="modalBrand" placeholder='Brand Name' onChange={e => setEditData({...editData, brand: e.target.value})} required/>
                            <input type="text" className="modalModel" placeholder='Model Name' onChange={e => setEditData({...editData, model: e.target.value})} required/>
                            <input type="text" className="modalImage" placeholder='Image URL' onChange={e => setEditData({...editData, image: e.target.value})} required/>
                            <input type="text" className="modalFrontImage" placeholder='Front side of car Image URL' onChange={e => setEditData({...editData, frontImage: e.target.value})} required/>
                            <input type="text" className="modalRearImage" placeholder='Rear side of car Image URL' onChange={e => setEditData({...editData, frontImage: e.target.value})} required/>
                            <input type="text" className="modalRightSideImage" placeholder='Right side of car Image URL' onChange={e => setEditData({...editData, frontImage: e.target.value})} required/>
                            <input type="text" className="modalLeftSideImage" placeholder='Left side of car Image URL' onChange={e => setEditData({...editData, frontImage: e.target.value})} required/>
                            <input type="text" className="modalbodyType" placeholder='Body Type' onChange={e => setEditData({...editData, bodyType: e.target.value})} required/>
                            <input type="text" className="modalTransmission" placeholder='Transmission' onChange={e => setEditData({...editData, transmission: e.target.value})} required/>
                            <input type="text" className="modalFuelType" placeholder='Fuel Type' onChange={e => setEditData({...editData, fuelType: e.target.value})} required/>
                            <input type="text" className="modalEngineType" placeholder='Engine Type' onChange={e => setEditData({...editData, engineType: e.target.value})} required/>
                            <input type="text" className="modalSeats" placeholder='Seats' onChange={e => setEditData({...editData, seats: Number(e.target.value)})} required/>
                            <input type="text" className="modalMileage" placeholder='Mileage' onChange={e => setEditData({...editData, mileage: e.target.value})} required/>
                            <input type="number" className="modalPrice" placeholder='Price Amount in INR' onChange={e => setEditData({...editData, price: Number(e.target.value)})} required/>
                            <input type="number" className="modalRating" placeholder='Rating of Car' onChange={e => setEditData({...editData, rating: Number(e.target.value)})} required/>
                            <input type="number" className="modalAvailable" placeholder='Stock Count (available units)' onChange={e => setEditData({...editData, available: Number(e.target.value)})} required/>
                            <div className="SaveOrCancel-btnGroup">
                                <button className="cancelBtn btn" onClick={() => { setShowEditModal(false) }}>Cancel</button>
                                <button className="saveBtn btn" onClick={handleEditSubmit}>Save</button>
                            </div>
                        </div>
                    </div>,
                    document.body
                )}
            </div>)}
        </>
    );
}

Cards.propTypes = {
    brand : PropTypes.string,
    model: PropTypes.string,
    bodyType: PropTypes.string,
    image: PropTypes.string,
    fronImage: PropTypes.string,
    rearImage: PropTypes.string,
    leftSideImage: PropTypes.string,
    rightSideImage: PropTypes.string,
    transmission: PropTypes.string,
    engineType: PropTypes.string,
    fuelType: PropTypes.string,
    mileage: PropTypes.string,
    seats: PropTypes.number,
    price: PropTypes.number,
    rating : PropTypes.number,
    onUpdate: PropTypes.func
}

export default Cards;
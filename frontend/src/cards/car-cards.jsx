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

    const [showEditModal, SetShowEditModal] = useState(false);
    const [editData, SetEditData] = useState({
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
            await API.delete(`/cars/${props._id}`);
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
            SetShowEditModal(false);
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
                    <b className='d-block p-1'>${props.price}</b>
                    {user && <button className={`bi bi-cart-plus-fill me-1 p-1 ${isInCart(car._id) ? "btn-remove" : "btn-add"}`}
                        onClick={() => isInCart(car._id) ? removeFromCart(car._id) : addToCart(car._id)}>
                        {isInCart(car._id) ? "Remove from Cart" : "Add to Cart"}
                    </button>}
                    {user?.role==="admin" && (
                        <div className="EditOrDeleteCar">
                            <button className='btn-edit' onClick={() => SetShowEditModal(true) }>Edit</button>
                            <button className="btn-delete" onClick={ handleDelete }>Delete</button>
                        </div>
                    )}
                </div>
                
                { showEditModal && createPortal(
                    <div className="editModal">
                        <div className="editModalContent">
                            <input type="text" className="modalBrand" value={editData.brand} placeholder='Brand Name' onChange={e => SetEditData({...editData, brand: e.target.value})}/>
                            <input type="text" className="modalModel" value={editData.model} placeholder='Model Name' onChange={e => SetEditData({...editData, model: e.target.value})}/>
                            <input type="text" className="modalType" value={editData.bodyType} placeholder='Body Type' onChange={e => SetEditData({...editData, bodyType: e.target.value})}/>
                            <input type="text" className="modalImage" value={editData.image} placeholder='Image URL' onChange={e => SetEditData({...editData, image: e.target.value})}/>
                            <input type="number" className="modalPrice" value={editData.price} placeholder='Price Amount in INR' onChange={e => SetEditData({...editData, price: e.target.value})}/>
                            <input type="number" className="modalRating" value={editData.rating} placeholder='Rating of Car' onChange={e => SetEditData({...editData, rating: e.target.value})}/>
                            <div className="SaveOrCancel-btnGroup">
                                <button className="cancelbtn btn" onClick={() => { SetShowEditModal(false) }}>Cancel</button>
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
    price: PropTypes.number,
    rating : PropTypes.number,
    onUpdate: PropTypes.func
}

export default Cards
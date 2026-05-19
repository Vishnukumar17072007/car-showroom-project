import { useWishList } from '../context/wish/useWishList';
import { useCart } from '../context/cart/useCart';
import { useNavigate } from 'react-router-dom';
import { CarGridSkeleton } from '../component/PageSkeletons';

function WishList(){
    const wishListCtx = useWishList();
    const wishListItems = wishListCtx?.wishListItems ?? [];
    const wishListLoading = wishListCtx?.wishListLoading;
    const {addToCart, removeFromCart, isInCart} = useCart();
    const wishList = wishListItems ?? [];
    const navigate = useNavigate();

    function CartToggle(car){
        const carId = car?._id;
        if(isInCart(carId)){
            removeFromCart(carId);
        }
        else{
            addToCart(carId);
        }
    }

    return(
        <>
            <div className="cart_page">
                <h2 style={{ padding: '5px', color: 'var(--text)', backgroundColor: "white" }}>
                    WishList 
                </h2>
                {wishListLoading && <CarGridSkeleton count={10} />}
                {!wishListLoading && (
                <>
                {wishList.length === 0 && 
                    <div className="d-flex justify-content-center align-items-center" style={{ minHeight:     "200px" }}>
                        <p style={{ fontSize: "1.2rem", color: "gray" }}>No cars in wishlist!</p>
                    </div>
                }
                <div className="car_card_box d-flex flex-wrap gap-2" style={{justifyContent: "start"}}>
                    {wishList.map((car, index) => (
                        <div key={index} className="car-card" style={{width: "243px"}}>
                            <div className="car_image" style={{ cursor: "pointer" }} onClick={() => navigate(`/vehicles/${car._id}`)}>
                                <img src={car.image} alt="car-image" style={{width: "100%",height:"100%", backgroundColor: "white", borderRadius:"5px"}}></img>
                            </div>
                            <div className="car_card_body">
                                <div className="car_title">
                                    <b>{car.brand} {car.model}</b>
                                    <p style={{fontWeight:"lighter", margin:"0%"}}>{car.brand}.{car.bodyType}</p>
                                    <p className='rating'>⭐{car.rating}</p>
                                </div>
                                <b className='d-block'>₹{car.price?.toLocaleString('en-IN')}</b>
                                <button className={`bi bi-cart-plus-fill me-1 btn ${isInCart(car._id) ? "btn-remove" : "btn-add"}`} onClick={() => CartToggle(car)}>
                                {isInCart(car?._id) ? "Remove from Cart" : "Add to Cart"}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                </>
                )}
            </div>
        </>
    );
}

export default WishList;
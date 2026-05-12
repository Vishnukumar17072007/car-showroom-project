import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/auth/useAuth";

function SideTopNavbar() {

    const location = useLocation();
    const { user } = useAuth();

    const faviconTopArr = [["bi bi-house", "Home", "/"], ["bi bi-car-front", "Vehicles", "/vehicles"], ["bi bi-heart", "WishList", "/wishlist"], ["bi bi-cart", "Cart", "/addToCart"], ["bi bi-bag-check", "Orders", "/orders"]];

    const proctectedRoutes = new Set([
        "/wishlist","/addToCart","/orders"
    ]);

    return(
        <>
            {
                faviconTopArr.map((item, index) => {
                    const isActive = location.pathname === item[2];
                    
                    if(!user && proctectedRoutes.has(item[2])){
                        return null;
                    }

                    return(
                        <li key = {index} className={`side_bar_menu_lists ps-2 ${isActive ? "active" : ""}`}>
                                <Link className={item[0] + " text-decoration-none text-white side_bar_menu_items d-block w-100"} to={item[2]}> {item[1]}</Link>
                        </li>
                    );
                })
            }
            {user?.role === 'admin' && (
                <li className={`side_bar_menu_lists ps-2 ${location.pathname === '/admin/orders' ? 'active' : ''}`}>
                    <Link className="bi bi-receipt text-decoration-none text-white side_bar_menu_items d-block w-100" to="/admin/orders"> All Orders</Link>
                </li>
            )}
        </>
    );
}

export default SideTopNavbar;
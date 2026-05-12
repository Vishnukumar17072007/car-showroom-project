import { useAuth } from "../../context/auth/useAuth";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import SubscriptionModal from "../../component/SubscriptionModal";
import LoginTab from "../../login/login";

function SubscriptionBanner({ sub, onViewPlans, isActive, onActivate }) {

    const { user } = useAuth();
    const [showLoginTab, setShowLoginTab] = useState(false);

    if (sub === "premium") return null;

    return (
        <>
            <li
                className={`side_bar_menu_lists p-0 ${isActive ? "active" : ""}`}
                onClick={
                    (user)
                        ? () => {
                              onActivate();
                              onViewPlans();
                          }
                        : () => setShowLoginTab(true)
                }
            >
                <p className={"bi bi-piggy-bank text-decoration-none text-white side_bar_menu_items d-block m-0 p-3 ps-3"}>Upgrade Plan</p>
            </li>
            {showLoginTab && <LoginTab onClose = {() => setShowLoginTab(false)}/>}
        </>
    );
}

function SideBottomNavbar() {
    
    const faviconBotArr = [["bi bi-person-bounding-box", "Support"], ["bi bi-box-arrow-left", "Logout"]];
    
    const {user, logout} = useAuth();
    const [showModal, setShowModal] = useState(false);
    const [activeBottomItem, setActiveBottomItem] = useState("");
    const location = useLocation();

    useEffect(() => {
        // Keep bottom-nav active state in sync with current route.
        // When user navigates using top navbar, clear bottom selection.
        if (location.pathname !== "/support") {
            setActiveBottomItem("");
        }
    }, [location.pathname]);
    
    const selectedItem = location.pathname === "/support" ? "Support" : activeBottomItem;
    
    return(
        <>
            <SubscriptionBanner
                sub={user?.subscription}
                isActive={selectedItem === "Upgrade Plan"}
                onActivate={() => setActiveBottomItem("Upgrade Plan")}
                onViewPlans={() => setShowModal(true)}
            />
            {
                faviconBotArr.map((item,index) => {

                    if(item[1] === "Logout" && !user) return null;

                    return(
                        <li key={index} className={`side_bar_menu_lists ps-2 w-100 ${selectedItem === item[1] ? "active" : ""}`}>
                            {
                                item[1] === "Support" ? (
                                    <Link
                                        className={item[0] + " text-decoration-none text-white side_bar_menu_items d-block w-100"}
                                        to="/support"
                                        onClick={() => setActiveBottomItem("Support")}
                                    >
                                        {" " + item[1]}
                                    </Link>
                                ) : (
                                    <button
                                        type="button"
                                        className={item[0] + " text-decoration-none text-white side_bar_menu_items d-block w-100 border-0 bg-transparent text-start"}
                                        onClick={() => {
                                    setActiveBottomItem("Logout");
                                    logout();
                                }}
                                    >
                                        {" " + item[1]}
                                    </button>
                                )
                            }
                        </li>
                    );
                })
            }

            {showModal && <SubscriptionModal onClose={() => setShowModal(false)} />}
        </>
    );
}

export default SideBottomNavbar;
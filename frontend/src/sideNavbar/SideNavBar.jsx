// component/SideNavbar.jsx

import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import { useAuth } from "../context/auth/useAuth";
import SubscriptionModal from "../component/SubscriptionModal";


// ── Subscription Banner (local helper) ──────────────────────────────────────
function SubscriptionBanner({ sub, onViewPlans, isActive, onActivate }) {

  const navigate = useNavigate();

  const { user } = useAuth();
  if (sub === "premium") return null;

  return (
    <>
      <li
        className={`side_bar_menu_lists p-0 ${isActive ? "active" : ""}`}
        onClick={
          user
            ? () => {
                onActivate();
                onViewPlans();
              }
            : () => {
              navigate('/login');
            }
        }
      >
        <p className="bi bi-piggy-bank text-decoration-none side_bar_menu_items d-block m-0 p-3 ps-3">
          Upgrade Plan
        </p>
      </li>
      
    </>
  );
}

// ── Main Sidebar Component ───────────────────────────────────────────────────
function SideNavbar() {
  const location = useLocation();
  const { user } = useAuth();

  const [showModal, setShowModal] = useState(false);
  const [upgradePlanActive, setUpgradePlanActive] = useState(false);

  const topNavItems = [
    ["bi bi-speedometer2", "Dashboard", "/dashboard"],
    ["bi bi-car-front", "Vehicles", "/vehicles"],
    ["bi bi-heart", "WishList", "/wishlist"],
    ["bi bi-cart", "Cart", "/cartList"],
    ["bi bi-receipt", "Orders", "/orders"],
  ];

  const protectedRoutes = new Set(["/wishlist", "/cartList", "/orders"]);

  return (
    <>
      <div className="topNavBar">
        {/* ── Top Nav Items ── */}
        {topNavItems.map((item, index) => {
          if (!user && protectedRoutes.has(item[2])) return null;

          const isActive = location.pathname === item[2];

          return (
            <li
              key={index}
              className={`side_bar_menu_lists ps-2 ${isActive ? "active" : ""}`}
            >
              <Link
                className={
                  item[0] +
                  " text-decoration-none side_bar_menu_items d-block w-100"
                }
                to={item[2]}
              >
                {" " + item[1]}
              </Link>
            </li>
          );
        })}

        {/* ── Admin Features ── */}
        {user?.role === "admin" && (
          <>
          </>
        )}
      </div>

      <div className="divider" style={{ borderBottom: "1px solid grey" }}></div>
      <div className="bottomNavBar">
        {/* ── Bottom Items ── */}
        <SubscriptionBanner
          sub={user?.subscription}
          isActive={upgradePlanActive}
          onActivate={() => setUpgradePlanActive(true)}
          onViewPlans={() => setShowModal(true)}
        />

        {/* Support */}
        <li
          className={`side_bar_menu_lists ps-2 w-100 ${location.pathname === "/support" ? "active" : ""}`}
        >
          <Link
            className="bi bi-person-bounding-box text-decoration-none side_bar_menu_items d-block w-100"
            to="/support"
          >
            {" "}
            Support
          </Link>
        </li>

        {/* Profile */}
        {user && (
          <li
            className={`side_bar_menu_lists ps-2 w-100 ${location.pathname === "/profile" ? "active" : ""}`}
          >
            <Link
              className="bi bi-person text-decoration-none side_bar_menu_items d-block w-100"
              to="/profile"
            >
              {" "}
              Profile
            </Link>
          </li>
        )}
      </div>

      {showModal && (
        <SubscriptionModal
          onClose={() => {
            setShowModal(false);
            setUpgradePlanActive(false);
          }}
        />
      )}
    </>
  );
}

export default SideNavbar;

// component/SideNavbar.jsx

import { Link, useLocation } from "react-router-dom";

import { useAuth } from "../context/auth/useAuth";

// ── Main Sidebar Component ───────────────────────────────────────────────────
function SideNavbar() {
  const location = useLocation();
  const { user } = useAuth();


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
    </>
  );
}

export default SideNavbar;

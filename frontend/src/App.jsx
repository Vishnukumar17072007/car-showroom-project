import "./style/index.css";
import TopHeader from "./topHeader/topHeader";
import { Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./context/auth/useAuth";
import { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import SideNavbar from "./sideNavbar/SideNavBar";
import { AppBootstrapSkeleton } from "./component/PageSkeletons";

function App() {
  const { authLoading } = useAuth();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const location = useLocation();

  // pages where sidebar/header should not appear
  const hideLayout = ["/login"].includes(location.pathname);
  const hideSidenavbar = ["/"].includes(location.pathname);


  useEffect(() => {
    setMobileNavOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (mobileNavOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [mobileNavOpen]);

  if (authLoading) {
    return <AppBootstrapSkeleton pathname={location.pathname} />;
  }

  return (
    <>
      <Toaster position="top-right" />

      {!hideLayout && <TopHeader />}

      {(!hideLayout && !hideSidenavbar) && (
        <button
          type="button"
          className="hamburger-toggle bi bi-list"
          aria-label="Toggle navigation"
          onClick={() => setMobileNavOpen((prev) => !prev)}
        />
      )}

      {(!hideLayout && !hideSidenavbar) && mobileNavOpen && (
        <div
          className="side-menu-backdrop"
          onClick={() => setMobileNavOpen(false)}
        />
      )}

      <div className="main-body d-flex flex-wrap">
        {(!hideLayout && !hideSidenavbar) && (
          <div
            className={`side-menu d-flex flex-column pt-2 ${
              mobileNavOpen ? "mobile-open" : ""
            }`}
          >
            <SideNavbar />
          </div>
        )}

        <div className={hideLayout ? "w-100" : "OutLetContent"}>
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default App;
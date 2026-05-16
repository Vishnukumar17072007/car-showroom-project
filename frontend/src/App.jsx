import './style/index.css'
import TopHeader from './topHeader/topHeader';
import { Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './context/auth/useAuth';
import { Toaster } from 'react-hot-toast';
import { useEffect, useState } from 'react';
import SideNavbar from './sideNavbar/SideNavBar';

function App() {

  const { authLoading } = useAuth();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMobileNavOpen(false);
  }, [location.pathname]);

  if (authLoading) {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        color: "white"
      }}>
        Loading...
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-right" />
      <TopHeader/>
      <button
        type="button"
        className="hamburger-toggle bi bi-list"
        aria-label="Toggle navigation"
        onClick={() => setMobileNavOpen(prev => !prev)}
      />
      {mobileNavOpen && <div className="side-menu-backdrop" onClick={() => setMobileNavOpen(false)} />}
      <div className="main-body d-flex flex-wrap">
      {/* Side menu bar */}
        <div className={`side-menu d-flex flex-column pt-2 ${mobileNavOpen ? "mobile-open" : ""}`}>
          <SideNavbar />
        </div>
        <div className="OutLetContent">
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default App

import { StrictMode, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './style/index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthProvider } from './context/auth/authProvider.jsx'
import { WishListProvider } from './context/wish/wishListProvider.jsx'
import { OrderProvider } from './context/order/orderProvider.jsx'
import { CartProvider } from './context/cart/cartProvider.jsx'
import ProtectedRoutes from './component/ProtectedRoutes.jsx'
import AdminRoute from './component/AdminRoute.jsx'
import { SearchProvider } from './context/search/searchProvider.jsx'
import ProfileProvider from './context/profile/profileProvider.jsx';

const Home = lazy(() => import('./paths/home.jsx'));
const Vehicles = lazy(() => import('./paths/vehicles.jsx'));
const CarDetailsPage = lazy(() => import('./paths/CarDetailsPage.jsx'));
const WishList = lazy(() => import('./paths/wishList.jsx'));
const Support = lazy(() => import('./paths/support.jsx'));
const NotFound = lazy(() => import('./paths/NotFound.jsx'));
const Orders = lazy(() => import('./paths/orders.jsx'));
const Cart = lazy(() => import('./paths/cart.jsx'));
const AdminOrders = lazy(() => import('./paths/AdminOrders.jsx'));
const Profile = lazy(() => import('./paths/Profile.jsx'));
const EditProfile = lazy(() => import('./paths/EditProfile.jsx'));
const AdminDashboard = lazy(() => import('./paths/AdminDashboard.jsx'));
const Login = lazy(() => import('./paths/Login.jsx'));
const UserDashboard = lazy(() => import('./paths/UserDashboard.jsx'));
const Invoices = lazy(() => import('./paths/Invoices.jsx'));

function PageLoader() {
  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
      <div className="spinner-border" role="status" />
    </div>
  );
}

function LazyPage({ children }) {
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <LazyPage><NotFound /></LazyPage>,
    children: [
      { index: true, element: <LazyPage><Home /></LazyPage> },
      { path: "/login", element: <LazyPage><Login /></LazyPage> },
      {
        element: <ProtectedRoutes />,
        children: [
          { path: "/vehicles", element: <LazyPage><Vehicles /></LazyPage> },
          { path: "/vehicles/:id", element: <LazyPage><CarDetailsPage /></LazyPage> },
          { path: "/wishlist", element: <LazyPage><WishList /></LazyPage> },
          { path: "/orders", element: <LazyPage><Orders /></LazyPage> },
          { path: "/cartList", element: <LazyPage><Cart /></LazyPage> },
          { path: "/support", element: <LazyPage><Support /></LazyPage> },
          { path: "/profile", element: <LazyPage><Profile /></LazyPage> },
          { path: "/editProfile", element: <LazyPage><EditProfile /></LazyPage> },
          { path: "/dashboard", element: <LazyPage><UserDashboard /></LazyPage> },
        ]
      },
      {
        element: <AdminRoute />,
        children: [
          { path: "/admin/orders", element: <LazyPage><AdminOrders /></LazyPage> },
          { path: "/admin/dashboard", element: <LazyPage><AdminDashboard /></LazyPage> },
          { path: "/admin/invoices", element: <LazyPage><Invoices /></LazyPage> },
        ]
      }
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <WishListProvider>
        <OrderProvider>
          <CartProvider>
            <SearchProvider>
              <ProfileProvider>
                <RouterProvider router={router} />
              </ProfileProvider>
            </SearchProvider>
          </CartProvider>
        </OrderProvider>
      </WishListProvider>
    </AuthProvider>
  </StrictMode>,
)

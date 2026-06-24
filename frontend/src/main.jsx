import { lazy, Suspense } from 'react'
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
import UserRoute from './component/UserRoute.jsx'
import { SearchProvider } from './context/search/searchProvider.jsx'
import ProfileProvider from './context/profile/profileProvider.jsx';
import { NotificationProvider } from './context/notification/notificationProvider.jsx';
import { RoutePageSkeleton } from './component/PageSkeletons.jsx';
import { ThemeProvider } from './context/theme/themeProvider.jsx';

const Home = lazy(() => import('./pages/home.jsx'));
const Vehicles = lazy(() => import('./pages/vehicles.jsx'));
const CarDetailsPage = lazy(() => import('./pages/CarDetailsPage.jsx'));
const WishList = lazy(() => import('./pages/wishList.jsx'));
const Support = lazy(() => import('./pages/support.jsx'));
const NotFound = lazy(() => import('./pages/NotFound.jsx'));
const Cart = lazy(() => import('./pages/cart.jsx'));
const Orders = lazy(() => import('./pages/Orders.jsx'));
const Profile = lazy(() => import('./pages/Profile.jsx'));
const EditProfile = lazy(() => import('./pages/EditProfile.jsx'));
const Login = lazy(() => import('./pages/Login.jsx'));
const Dashboard = lazy(() => import('./pages/Dashboard.jsx'));
const Notifications = lazy(() => import('./pages/Notification.jsx'));
const AuthCallback = lazy(() => import('./component/AuthCallback.jsx'))

function PageLoader() {
  return <RoutePageSkeleton />;
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
      { path: "/auth/callback", element: <LazyPage><AuthCallback /></LazyPage> },
      {
        element: <UserRoute />,
        children: [
          { path: "/", element: <LazyPage><Home /></LazyPage> },
          { path: "/login", element: <LazyPage><Login /></LazyPage> },
        ]
      },
      {
        element: <ProtectedRoutes />,
        children: [
          { path: "/dashboard", element: <LazyPage><Dashboard /></LazyPage> },
          { path: "/vehicles", element: <LazyPage><Vehicles /></LazyPage> },
          { path: "/vehicles/:id", element: <LazyPage><CarDetailsPage /></LazyPage> },
          { path: "/wishlist", element: <LazyPage><WishList /></LazyPage> },
          { path: "/cartList", element: <LazyPage><Cart /></LazyPage> },
          { path: "/orders", element: <LazyPage><Orders /></LazyPage> },
          { path: "/support", element: <LazyPage><Support /></LazyPage> },
          { path: "/profile", element: <LazyPage><Profile /></LazyPage> },
          { path: "/editProfile", element: <LazyPage><EditProfile /></LazyPage> },
          { path: "/notifications", element: <LazyPage><Notifications /></LazyPage> },
        ]
      },
      {
        element: <AdminRoute />,
        children: [
          // { path: "/admin/orders", element: <LazyPage><AdminOrders /></LazyPage> },
        ]
      }
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <ThemeProvider>
    <AuthProvider>
      <NotificationProvider>
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
      </NotificationProvider>
    </AuthProvider>
  </ThemeProvider>
)

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './style/index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './paths/home.jsx';
import Vehicles from './paths/vehicles.jsx';
import CarDetailsPage from './paths/CarDetailsPage.jsx';
import WishList from './paths/wishList.jsx';
import Support from './paths/support.jsx';
import NotFound from './paths/NotFound.jsx'
import Orders from './paths/orders.jsx'
import Cart from './paths/cart.jsx'
import { AuthProvider } from './context/auth/authProvider.jsx'
import { WishListProvider } from './context/wish/wishListProvider.jsx'
import { OrderProvider } from './context/order/orderProvider.jsx'
import { CartProvider } from './context/cart/cartProvider.jsx'
import ProtectedRoutes from './component/ProtectedRoutes.jsx'
import { SearchProvider } from './context/search/searchProvider.jsx'
import AdminOrders from './paths/AdminOrders.jsx';
import Profile from './paths/Profile.jsx';
import EditProfile from './paths/EditProfile.jsx';

const router = createBrowserRouter([
  {
    path : "/",
    element : <App />,
    errorElement : <NotFound />,
    children: [
      { index: true,              element: <Home /> },
      { path: "/vehicles",         element: <Vehicles /> },
      { path: "/vehicles/:id", element: <CarDetailsPage />},
      { path: "/support",         element: <Support /> },
      {path: "/profile", element: <Profile />},
      {path: "/editProfile", element: <EditProfile />},
      {
        element : <ProtectedRoutes />,
        children: [
          { path: "/admin/orders", element: <AdminOrders /> },
          { path: "/wishlist", element: <WishList /> },
          { path: "/orders", element: <Orders />},
          { path: "/addToCart", element: <Cart /> }
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
              <RouterProvider router={router} />
            </SearchProvider>
          </CartProvider>
        </OrderProvider>
      </WishListProvider>
    </AuthProvider>
  </StrictMode>,
)

//"npm run dev" command to run the appilication 
//can be run using backend directory
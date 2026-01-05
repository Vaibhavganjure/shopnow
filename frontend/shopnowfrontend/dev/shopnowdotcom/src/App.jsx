import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import RootLayout from './component/layout/RootLayout'
import Home from './component/home/Home';
import Products from './component/product/Products';
import ProductDetails from './component/product/ProductDetails';
import "react-toastify/dist/ReactToastify.css"
import Cart from './component/cart/Cart';
// import Order from './component/order/Order';
import AddProduct from './component/product/AddProduct';
import ProductUpdate from './component/product/ProductUpdate';
import UserRegistration from './component/user/UserRegistration';
import Login from './component/auth/Login';
import ProtectedRoutes from './component/auth/ProtectedRoutes';
import Unauthorized from './component/unauthorized/Unauthorized';
import UserProfile from './component/user/UserProfile';
import CheckOut from './component/checkout/CheckOut';


function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path='/' element={<RootLayout />}>
        <Route index element={<Home />} />
        <Route path='/products' element={<Products />} />
        <Route path='/products/:name' element={<Products />} />
        <Route path='/products/category/:categoryId/products' element={<Products />} />
        <Route path='/product/:productId/details' element={<ProductDetails />} />
        <Route path="/register" element={<UserRegistration />} />
        <Route path='/login' element={<Login />} />
        <Route path='/unauthorized' element={<Unauthorized />} />
        <Route path="/my-account/:userId" element={<UserProfile />} />
        <Route path='/logout' element={<Login />} />
        <Route path='/checkout/:userId/checkout' element={<CheckOut />} />
        <Route path='/user-profile/:userId/profile' element={<UserProfile />} />

        <Route element={<ProtectedRoutes useOutlet={true} allowedRoles={["ROLE_USER", "ROLE_ADMIN"]} />} >
          <Route path='/user/:userId/my-cart' element={<Cart />} />
          {/* <Route path="/user/:userId/orders" element={<Order />} /> */}
        </Route>

        <Route element={<ProtectedRoutes useOutlet={true} allowedRoles={["ROLE_ADMIN"]} />} >
          <Route path="/add-product" element={<AddProduct />} />
          <Route path="/update-product/:productId/update" element={<ProductUpdate />} />
        </Route>
      </Route>
    )
  )

  return (
    <RouterProvider router={router} />

  );
}

export default App

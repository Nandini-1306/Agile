import React from 'react'
import Home from './home/Home'
import { Route, Routes, useNavigate } from "react-router-dom";
import Profiles from './profile/Profiles'
import Signup from './Components/Signup'
import VendorSignup from './Components/VendorSignup'
import Cart from './cart/Cart'
import UserDashboard from './Components/UserDashboard'
import FruitSection from './Components/FruitSection'
import VeggieSection from './Components/VeggieSection'
import AboutUs from './Components/AboutUs'
import EditProfile from './Components/EditProfile'
import VendorDashboard from './Components/VendorDashboard'
import VendorProfiles from './Components/VendorProfiles'
import EditProfileVendor from './Components/EditProfileVendor'
import {useState} from 'react'
import ViewOrders from './Components/ViewOrders';
import AddProduct from './Components/AddProduct';
import Invoice from './Components/invoice';
import { Toaster } from 'react-hot-toast';


  function App() {
    const [cartItems, setCartItems] = useState(() => {
      const savedCart = localStorage.getItem('cartItems');
      return savedCart ? JSON.parse(savedCart) : [];
  });

  const navigate = useNavigate();

  function addToCart(newItem) {
    const updatedCart = [...cartItems, newItem];
    setCartItems(updatedCart);
    localStorage.setItem('cartItems', JSON.stringify(updatedCart));
}

// Remove items from cart function
function removeFromCart(index) {
    const updatedCart = cartItems.filter((_, itemIndex) => itemIndex !== index);
    setCartItems(updatedCart);
    localStorage.setItem('cartItems', JSON.stringify(updatedCart));
}

function clearCart() {
    setCartItems([]); // Clear the state
    localStorage.removeItem('cartItems'); // Clear from localStorage
}

// Handle Logout function
function handleLogout() {
    // Clear cart from localStorage and state
    setCartItems([]); // Clear the state
    localStorage.removeItem('cartItems'); // Clear from localStorage
    console.log("Logging out...");

    // Redirect to the login page after logging out
    navigate('/');  // Programmatic navigation to the login page
}


  return (
    <>
     <Toaster/>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/profile" element={<Profiles />} />
      <Route path="/user/edit" element={<EditProfile />} />
      <Route path="/cart" element={<Cart cartItems={cartItems} removeFromCart={removeFromCart} clearCart={clearCart}/>} />
      <Route path="/vendor/edit" element={<EditProfileVendor />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/register/vendor" element={<VendorSignup />} />
      <Route path="/register/user" element={<Signup />} /> 
      <Route path="/about-us" element={<AboutUs />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/userdashboard" element={<UserDashboard clearCart={clearCart} />} />
      <Route path="/fruitsection" element={<FruitSection addToCart={addToCart} />} />
      <Route path="/veggiesection" element={<VeggieSection addToCart={addToCart} />} />
      <Route path="/vendordashboard" element={<VendorDashboard />} />
      <Route path="/vendorProfile" element={<VendorProfiles />} />
      <Route path="/vieworders" element={<ViewOrders />} />
      <Route path="/addproduct" element={<AddProduct />} />
      <Route path="/invoice" element={<Invoice />} />
    </Routes>
  </>
  )
}

export default App

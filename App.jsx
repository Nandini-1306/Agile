import React from 'react'
import Home from './home/Home'
import { Route, Routes } from "react-router-dom"
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



  function App() {
    const [cartItems, setCartItems] = useState([]);

    const addToCart = (product) => {
        setCartItems((prevItems) => {
            const existingItem = prevItems.find(item => item.name === product.name);
            if (existingItem) {
                return prevItems.map(item => 
                    item.name === product.name 
                        ? { ...item, quantity: item.quantity + product.quantity } 
                        : item
                );
            }
            return [...prevItems, { ...product, quantity: product.quantity }];
        });
    };

    const removeFromCart = (index) => {
        setCartItems((prevItems) => prevItems.filter((_, i) => i !== index));
    };

  return (<>
    

    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/profile" element={<Profiles />} />
      <Route path="/user/edit" element={<EditProfile />} />
      <Route path="/cart" element={<Cart cartItems={cartItems} removeFromCart={removeFromCart} />} />
      <Route path="/vendor/edit" element={<EditProfileVendor />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/register/vendor" element={<VendorSignup />} />
      <Route path="/register/user" element={<Signup />} /> 
      <Route path="/about-us" element={<AboutUs />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/userdashboard" element={<UserDashboard />} />
      <Route path="/fruitsection" element={<FruitSection addToCart={addToCart} />} />
      <Route path="/veggiesection" element={<VeggieSection addToCart={addToCart} />} />
      <Route path="/vendordashboard" element={<VendorDashboard />} />
      <Route path="/vendorProfile" element={<VendorProfiles />} />
    </Routes>
  </>
  )
}

export default App
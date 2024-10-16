import React, { useState } from 'react';
import { Route, Routes, useNavigate } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import Home from './home/Home';
import Profiles from './profile/Profiles';
import Signup from './Components/Signup';
import VendorSignup from './Components/VendorSignup';
import Cart from './cart/Cart';
import UserDashboard from './Components/UserDashboard';
import FruitSection from './Components/FruitSection';
import VeggieSection from './Components/VeggieSection';
import AboutUs from './Components/AboutUs';
import EditProfile from './Components/EditProfile';
import VendorDashboard from './Components/VendorDashboard';
import VendorProfiles from './Components/VendorProfiles';
import EditProfileVendor from './Components/EditProfileVendor';
import ViewOrders from './Components/ViewOrders';
import AddProduct from './Components/AddProduct';
import Invoice from './Components/invoice';
import Subscription_Product_list from './Components/Subscription_Product_list';
import Subscription_FruitSection from './Components/Subscription_FruitSection';
import Subscription_VeggieSection from './Components/Subscription_VeggieSection';
import Subscription_cart from './Components/Subscription_cart';
import MySubscription from './Components/mysubscription';
import Review from './Components/Review';
import Vendor from './Components/Vendor';
import VendorList from './Components/VendorList';
import VendorReview from './Components/VendorReview';
import ViewCompleteOrder from './Components/ViewCompleteOrder';

function App() {
    const [cartItems, setCartItems] = useState(() => {
        const savedCart = localStorage.getItem('cartItems');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    const navigate = useNavigate();

    // const addToCart = (newItem) => {
    //     const updatedCart = [...cartItems, newItem];
    //     setCartItems(updatedCart);
    //     localStorage.setItem('cartItems', JSON.stringify(updatedCart));
    // };.
    const addToCart = (item) => {
      setCartItems(prevItems => [...prevItems, item]); // Add new item to cart
  };
  const updateCart = (items) => {
    setCartItems(items); // Update the cart state
};
    const removeFromCart = (index) => {
        const updatedCart = cartItems.filter((_, itemIndex) => itemIndex !== index);
        setCartItems(updatedCart);
        localStorage.setItem('cartItems', JSON.stringify(updatedCart));
    };

    const clearCart = () => {
        setCartItems([]);
        localStorage.removeItem('cartItems');
    };

    const handleLogout = () => {
        setCartItems([]);
        localStorage.removeItem('cartItems');
        console.log("Logging out...");
        navigate('/');
    };

    return (
        <>
            <Toaster />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/profile" element={<Profiles />} />
                <Route path="/user/edit" element={<EditProfile />} />
                <Route path="/cart" element={<Cart cartItems={cartItems} removeFromCart={removeFromCart} clearCart={clearCart} />} />
                <Route path="/vendor/edit" element={<EditProfileVendor />} />
                <Route path="/subscription_cart" element={<Subscription_cart cartItems={cartItems} removeFromCart={removeFromCart} clearCart={clearCart} />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/register/vendor" element={<VendorSignup />} />
                <Route path="/register/user" element={<Signup />} />
                <Route path="/about-us" element={<AboutUs />} />
                <Route path="/userdashboard" element={<UserDashboard clearCart={clearCart} />} />
                <Route path="/fruitsection" element={<FruitSection addToCart={addToCart} updateCart={updateCart}/>} />
                <Route path="/veggiesection" element={<VeggieSection addToCart={addToCart} />} />
                <Route path="/vendordashboard" element={<VendorDashboard />} />
                <Route path="/vendorProfile" element={<VendorProfiles />} />
                <Route path="/vieworders" element={<ViewOrders />} />
                <Route path="/addproduct" element={<AddProduct />} />
                <Route path="/invoice" element={<Invoice />} />
                <Route path="/subscription_Product_list" element={<Subscription_Product_list />} />
                <Route path="/subscription_FruitSection" element={<Subscription_FruitSection />} />
                <Route path="/subscription_VeggieSection" element={<Subscription_VeggieSection />} />
                <Route path="/mysubscription" element={<MySubscription />} />
                <Route path="/review" element={<Review />} />
                <Route path="/vendor/:vendorID" element={<Vendor />} />
                <Route path="/vendors/details" element={<VendorList />} />
                <Route path="/reviews/vendors" element={<VendorReview />} />
                <Route path="/orders/done" element={<ViewCompleteOrder />} />
            </Routes>
        </>
    );
}

export default App;

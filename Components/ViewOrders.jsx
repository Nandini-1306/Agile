import React, { useState, useEffect } from 'react';
import './ViewOrders.css';
import VendorNavbar from './VendorNavbar';
import axios from 'axios';

const ViewOrders = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const vendor = JSON.parse(localStorage.getItem('Vendors'));
                const vendorID = vendor ? vendor.vendorID : null;
                const response = await axios.get(`http://localhost:3000/orders?vendor=${vendorID}`);
                
                console.log(response.data); // Log the fetched orders
                setOrders(response.data);
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };

        fetchOrders();
    }, []);

    const handleAcceptOrder = async (orderID) => {
        try {
            // Send a PATCH request to update the order status to 'Done'
            const response = await axios.patch(`http://localhost:3000/orders/${orderID}`, { Status: 'Done' });
            
            // Remove the order from the state after accepting it
            setOrders(prevOrders => 
                prevOrders.filter(order => order.orderID !== orderID)
            );
    
            console.log('Order accepted and removed from frontend:', response.data); // Log success message
        } catch (error) {
            console.error('Error accepting order:', error);
        }
    };
    

    return (
        <>
            <VendorNavbar />
            <div className="vendor-dashboard">
                <h1>Vendor Dashboard</h1>
                <div className="orders-section">
                    <h2>User Orders</h2>
                    <ul>
                        {orders.length > 0 ? orders.map(order => (
                            <li key={order.orderID}>
                                <p><strong>User:</strong> {order.userID}</p>
                                <p><strong>Order Date:</strong> {order.OrderDate.slice(0, 10)}</p>
                                <p><strong>Total Amount:</strong> Rs. {order.TotalAmount}</p>
                                <p><strong>Status:</strong> {order.Status}</p>
                                <div className="order-actions">
                                    
                                        <button onClick={() => handleAcceptOrder(order.orderID)} className="accept-btn">Accept</button>
                                    
                                </div>
                            </li>
                        )) : (
                            <p>No orders available.</p>
                        )}
                    </ul>
                </div>
            </div>
        </>
    );
};

export default ViewOrders;

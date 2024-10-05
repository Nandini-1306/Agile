


import React, { useState, useEffect } from 'react';
import './FruitSection.css';
import DashboardNavbar from './DashboardNavbar.jsx';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { io } from 'socket.io-client';
import { toast } from "react-hot-toast";

const socket = io('http://localhost:3000');

function FruitSection({ addToCart, clearCart }) {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [quantities, setQuantities] = useState({}); // For tracking quantities of each product

    const fetchProducts = async () => {
        try {
            const response = await axios.get('/products');
            console.log('Fetched products:', response.data);
            if (Array.isArray(response.data)) {
                setProducts(response.data);
                // Initialize quantities to 1 for each product
                const initialQuantities = response.data.reduce((acc, product) => {
                    acc[product.productID] = 1;
                    return acc;
                }, {});
                setQuantities(initialQuantities);
            } else {
                console.error('Data is not an array:', response.data);
                setProducts([]); // Reset products if not an array
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();

        socket.on('newProduct', (newProduct) => {
            setProducts((prevProducts) => {
                const existingProductIndex = prevProducts.findIndex(product => product.productID === newProduct.productID);
                if (existingProductIndex !== -1) {
                    const updatedProducts = [...prevProducts];
                    updatedProducts[existingProductIndex].quantity += newProduct.quantity;
                    updatedProducts[existingProductIndex].isNew = false;
                    return updatedProducts;
                } else {
                    return [...prevProducts, { ...newProduct, isNew: true }];
                }
            });
        });

        return () => {
            socket.off('newProduct');
        };
    }, []);

    const handleAddToCart = (product) => {
        const selectedQuantity = quantities[product.productID];
        console.log("Selected Quantity:", selectedQuantity);
        if (selectedQuantity > product.quantity) {
            alert('Selected quantity exceeds available stock.');
            return; // Exit if the selected quantity is more than available
        }
        console.log("Adding to cart:", {
            name: product.productName,
            quantity: selectedQuantity,
            price: product.price,
        });
    
        addToCart({
            name: product.productName,
            quantity: selectedQuantity,
            price: product.price,
        });
        // navigate('/cart');
    };
    
    const handleQuantityChange = (productID, value) => {
        if (value < 1) return; // Prevent negative or zero quantities
        setQuantities((prevQuantities) => ({
            ...prevQuantities,
            [productID]: Math.min(value, products.find(p => p.productID === productID)?.quantity || 0) // Ensure it doesn't exceed available stock
        }));
    };
    
    <label htmlFor={`quantity-${products.productID}`} style={styles.quantityLabel}>
        Select Quantity:
    </label>
    
    const handleProceedToBuy = () => {
        clearCart();
        fetchProducts(); // Refresh product list
    };

    return (
        <>
            <DashboardNavbar />
            <div style={styles.productList}>
                <h2 style={styles.title}>Product List</h2>
                {loading ? (
                    <p style={styles.loadingText}>Loading products...</p>
                ) : products.length > 0 ? (
                    products.map((product) => (
                        <div style={styles.productCard} key={product.productID}>
                        <h3 style={styles.productName}>{product.productName}</h3>
                        <p style={styles.productInfo}>Price: ₹{product.price} per piece</p>
                        <p style={styles.productInfo}>Available Quantity: {product.quantity}</p>
                        <label htmlFor={`quantity-${product.productID}`} style={styles.quantityLabel}>
                            Select Quantity:
                        </label>
                        <input
                            type="number"
                            id={`quantity-${product.productID}`}
                            min="1"
                            max="100"
                            value={quantities[product.productID]}
                            onChange={(e) => handleQuantityChange(product.productID, Number(e.target.value))}
                            style={styles.quantityInput}
                        />
                        {product.isNew && <span style={styles.newTag}>New!</span>}
                        <button
                            className="add-to-cart-btn"
                            onClick={() => handleAddToCart(product)}
                        >
                            Add to Cart
                        </button>
                    </div>
                    
                    ))
                ) : (
                    <p style={styles.noProductsText}>No products available.</p>
                )}
                <button onClick={handleProceedToBuy}>Proceed to Buy</button>
            </div>
        </>
    );
}

const styles = {
    productList: {
        padding: '20px',
        backgroundColor: '#343a40',
        borderRadius: '8px',
        maxWidth: '1200px',
        margin: 'auto',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        color: 'white',
    },
    title: {
        fontSize: '2.5rem',
        marginBottom: '20px',
        textAlign: 'center',
    },
    productCard: {
        backgroundColor: '#495057',
        borderRadius: '8px',
        padding: '20px',
        marginBottom: '20px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        position: 'relative',
    },
    productName: {
        margin: '0 0 10px 0',
    },
    productInfo: {
        margin: '5px 0',
        color: '#f8f9fa',
    },
    loadingText: {
        color: 'white',
    },
    noProductsText: {
        color: 'white',
    },
    newTag: {
        position: 'absolute',
        top: '10px',
        right: '10px',
        backgroundColor: '#28a745',
        color: 'white',
        padding: '5px',
        borderRadius: '5px',
        fontSize: '0.8rem',
    },
    quantityLabel: {
        marginRight: '10px',
        color: 'white',
    },
    quantityInput: {
        width: '50px',
        margin: '10px 0',
        padding: '5px',
    },
};

export default FruitSection; 



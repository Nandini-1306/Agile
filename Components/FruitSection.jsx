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
    const [quantities, setQuantities] = useState({}); 

    const fetchProducts = async () => {
        try {
            const response = await axios.get('/products');
            console.log('Fetched products:', response.data);

            if (Array.isArray(response.data)) {
                setProducts(response.data);
                const initialQuantities = response.data.reduce((acc, product) => {
                    acc[product.productID] = 1;
                    return acc;
                }, {});
                setQuantities(initialQuantities);
            } else {
                console.error('Data is not an array:', response.data);
                setProducts([]);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
            toast.error('Failed to fetch products. Please try again later.');
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
            toast.error('Selected quantity exceeds available stock.');
            return; 
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
        toast.success(`${product.productName} added to cart`);
    };

    const handleQuantityChange = (productID, value) => {
        if (value < 1) return; 
        setQuantities((prevQuantities) => ({
            ...prevQuantities,
            [productID]: Math.min(value, products.find(p => p.productID === productID)?.quantity || 0)
        }));
    };

    const handleProceedToBuy = () => {
        clearCart();
        fetchProducts(); 
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
                            <img src={product.imageURL || 'Fruit/defaultImage.jpg'} alt={product.productName} style={styles.productImage} />
                            <p style={styles.productInfo}>Price: ₹{product.price} per piece</p>
                            <p style={styles.productInfo}>Available Quantity: {product.quantity}</p>
                            <label htmlFor={`quantity-${product.productID}`} style={styles.quantityLabel}>
                                Select Quantity:
                            </label>
                            <input
                                type="number"
                                id={`quantity-${product.productID}`}
                                min="1"
                                max={product.quantity}
                                value={quantities[product.productID]}
                                onChange={(e) => handleQuantityChange(product.productID, Number(e.target.value))}
                                style={styles.quantityInput}
                            />
                            {product.isNew && <span style={styles.newTag}>New!</span>}
                            <button
                                className="add-to-cart-btn"
                                onClick={() => handleAddToCart(product)}
                                disabled={quantities[product.productID] < 1 || quantities[product.productID] > product.quantity} // Disable if invalid quantity
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
    loadingText: {
        textAlign: 'center',
        fontSize: '1.5rem',
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
    productImage: {
        width: '100%', // Set to 100% of the parent container
        maxWidth: '200px', // Max width for the image
        height: 'auto', // Maintain aspect ratio
        objectFit: 'cover', // Adjust how the image fits
        borderRadius: '8px', // Optional: rounded corners
    },
    productInfo: {
        margin: '5px 0',
        color: '#f8f9fa',
    },
    noProductsText: {
        color: 'white',
        textAlign: 'center',
        fontSize: '1.5rem',
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

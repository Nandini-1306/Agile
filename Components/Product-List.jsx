import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000'); // Adjust based on your backend URL

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:3000/products'); // Adjusted endpoint
                console.log('Fetched products:', response.data); // Log the response data
                const productsData = Array.isArray(response.data) ? response.data : response.data.products || []; // Adjust as necessary
                setProducts(productsData);
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
        
        // Listen for new product events
        socket.on('newProduct', (newProduct) => {
            setProducts((prevProducts) => {
                const existingProductIndex = prevProducts.findIndex(product => product.productID === newProduct.productID);
                if (existingProductIndex !== -1) {
                    // Product exists, update the quantity
                    const updatedProducts = [...prevProducts];
                    updatedProducts[existingProductIndex].quantity += newProduct.quantity;
                    updatedProducts[existingProductIndex].isNew = false; // Mark as updated
                    return updatedProducts;
                } else {
                    // New product, add it to the list
                    return [...prevProducts, { ...newProduct, isNew: true }]; // Mark as new
                }
            });
        });

        // Clean up the socket listener on component unmount
        return () => {
            socket.off('newProduct');
        };
    }, []);

    return (
        <div style={styles.productList}>
            <h2 style={styles.title}>Product List</h2>
            {loading ? (
                <p style={styles.loadingText}>Loading products...</p>
            ) : Array.isArray(products) && products.length > 0 ? (
                <div>
                    {products.map((product) => (
                        <div style={styles.productCard} key={product.productID}>
                            <h3 style={styles.productName}>{product.productName}</h3>
                            <p style={styles.productInfo}>Price: ${product.price}</p>
                            <p style={styles.productInfo}>Quantity: {product.quantity}</p>
                            {product.isNew && <span style={styles.newTag}>New!</span>} {/* New tag */}
                        </div>
                    ))}

                </div>
            ) : (
                <p style={styles.noProductsText}>No products available.</p>
            )}
            <button className="add-to-cart-btn" onClick={() => handleAddToCart({ name: products.productName, quantity: products.quantity, price: products.price })}>
                                    Add to Cart
             </button>
            <style>{`
                .product-list {
                    padding: 20px;
                    background-color: #343a40; /* Dark background for contrast */
                    border-radius: 8px;
                    max-width: 1200px;
                    margin: auto;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                    color: white; /* Set font color to white */
                }

                .product-card {
                    background-color: #495057; /* Slightly lighter for contrast */
                    border-radius: 8px;
                    padding: 20px;
                    margin-bottom: 20px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                    position: relative; /* For positioning the tag */
                }

                .product-card h3 {
                    margin: 0 0 10px 0;
                    color: #ffffff; /* White color for product names */
                }

                .product-info {
                    margin: 5px 0;
                    color: #f8f9fa; /* Light color for product info */
                }
                
                .loading-text, .no-products-text {
                    color: #ffffff; /* White color for loading and no products text */
                }

                .newTag {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    background-color: #28a745; /* Green background for new tag */
                    color: white;
                    padding: 5px;
                    border-radius: 5px;
                    font-size: 0.8rem;
                }
            `}</style>
        </div>
    );
};

const styles = {
    productList: {
        padding: '20px',
        backgroundColor: '#343a40', // Dark background
        borderRadius: '8px',
        maxWidth: '1200px',
        margin: 'auto',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        color: 'white', // White font color
    },
    title: {
        fontSize: '2.5rem',
        marginBottom: '20px',
        textAlign: 'center',
    },
    productCard: {
        backgroundColor: '#495057', // Slightly lighter card background
        borderRadius: '8px',
        padding: '20px',
        marginBottom: '20px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        position: 'relative', // Position for the new tag
    },
    productName: {
        margin: '0 0 10px 0',
    },
    productInfo: {
        margin: '5px 0',
        color: '#f8f9fa', // Light color for product info
    },
    loadingText: {
        color: 'white', // White for loading text
    },
    noProductsText: {
        color: 'white', // White for no products text
    },
    newTag: {
        position: 'absolute',
        top: '10px',
        right: '10px',
        backgroundColor: '#28a745', // Green background for new tag
        color: 'white',
        padding: '5px',
        borderRadius: '5px',
        fontSize: '0.8rem',
    },
};

export default ProductList;

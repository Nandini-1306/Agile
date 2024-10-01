import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './VendorDashboard.css';
import VendorNavbar from './VendorNavbar';

const VendorDashboard = () => {

    return (
        <>
            <VendorNavbar/>
            <div style={styles.dashboardContent}>
                <h1 style={styles.dashboardTitle}>Welcome, Vendor!</h1>
                <p style={styles.dashboardDescription}>Manage your products, view and track orders.</p>
                
                <div style={styles.cardsContainer}>
                    <div style={styles.card}>
                        <h3 style={styles.cardTitle}>Manage Products</h3>
                        <p style={styles.cardDescription}>Add, edit, or remove products from your inventory.</p>
                        <Link to='/addproduct'>
                            <button style={styles.cardButton}>Add Products</button>
                        </Link>
                    </div>

                    <div style={styles.card}>
                        <h3 style={styles.cardTitle}>Orders</h3>
                        <p style={styles.cardDescription}>View and manage your customer orders.</p>
                        <Link to='/vieworders'>
                            <button style={styles.cardButton}>View Orders</button>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
};

const styles = {
    dashboardContainer: {
        backgroundColor: '#1D232A', // Dark background color
        color: '#f1f1f1', // Light text color
        minHeight: '100vh',
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
    },
    navbar: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 20px',
        backgroundColor: '#2C2F36',
        borderRadius: '10px',
        marginBottom: '30px',
    },
    navbarBrand: {
        color: '#fff',
        fontSize: '24px',
        fontWeight: 'bold',
    },
    navLinks: {
        listStyle: 'none',
        display: 'flex',
        margin: 0,
    },
    navItem: {
        marginLeft: '20px',
    },
    navLink: {
        color: '#f1f1f1',
        textDecoration: 'none',
        fontSize: '16px',
        transition: 'color 0.3s',
    },
    navLinkHover: {
        color: '#28a745',
    },
    dashboardContent: {
        textAlign: 'center',
    },
    dashboardTitle: {
        fontSize: '36px',
        marginBottom: '20px',
    },
    dashboardDescription: {
        fontSize: '18px',
        marginBottom: '40px',
    },
    cardsContainer: {
        display: 'flex',
        justifyContent: 'center',
        gap: '20px',
    },
    card: {
        backgroundColor: '#2C2F36',
        borderRadius: '10px',
        padding: '20px',
        width: '300px',
        textAlign: 'center',
        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
    },
    cardTitle: {
        fontSize: '22px',
        marginBottom: '15px',
        color: '#fff',
    },
    cardDescription: {
        fontSize: '16px',
        marginBottom: '20px',
        color: '#d1d1d1',
    },
    cardButton: {
        padding: '10px 20px',
        backgroundColor: '#28a745',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '16px',
        transition: 'background-color 0.3s',
    },
    cardButtonHover: {
        backgroundColor: '#218838',
    },
};

export default VendorDashboard;

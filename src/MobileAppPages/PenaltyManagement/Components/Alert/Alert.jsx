import React, { useState } from 'react';

export const Alert = ({ title, message, onClose }) => {
    return (
        <div style={overlayStyle}>
            <div style={dialogStyle}>
                <h3 style={{ marginBottom: 8, color: '#333' }}>{title}</h3>
                <p style={{ color: '#555', marginBottom: 16 }}>{message}</p>
                <div style={buttonContainer}>
                    <button style={btnStyle} >DISMISS</button>
                    <button style={btnStyle} >CANCEL</button>
                    <button style={btnStyle} >OKAY</button>
                </div>
            </div>
        </div>
    );
};

// Styles
const overlayStyle = {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
};

const dialogStyle = {
    backgroundColor: '#fff',
    width: '85%',
    maxWidth: 320,
    borderRadius: 8,
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
    padding: 16,
    textAlign: 'center',
};

const buttonContainer = {
    display: 'flex',
    justifyContent: 'space-around',
    borderTop: '1px solid #eee',
    paddingTop: 10,
};

const btnStyle = {
    border: 'none',
    background: 'none',
    color: '#00C853',
    fontWeight: 'bold',
    fontSize: 14,
    cursor: 'pointer',
};
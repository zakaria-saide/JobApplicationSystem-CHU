import React from 'react';
import { Route, Navigate } from 'react-router-dom';

const ProtectedRoute = (props) => {
    const isAuthenticated = !!localStorage.getItem('authToken');
    return (
        <Route {...props} element={isAuthenticated ? props.element : <Navigate to="/LogIn" />} />
    );
};

export default ProtectedRoute;

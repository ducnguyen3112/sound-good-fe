import React from 'react';
import {Navigate, Outlet} from 'react-router-dom';


const PrivateRoute = () => {
    const isAuthenticated = !!localStorage.getItem('token');
    const isAdmin = localStorage.getItem('role') === 'ADMIN';
    if (isAuthenticated) {
        if (!isAdmin) {
            return <Outlet/>;
        } else {
            return <Outlet/>;
        }
    } else {
        return  <Navigate to="/login" />;
    }
};

export default PrivateRoute;

import React from 'react'
import { useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'

const ProtectedRoutes = ({children,allowedRoles=[],useOutlet=false}) => {

    const location = useLocation();
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const userRoles = useSelector((state) => state.auth.roles);

    if(!isAuthenticated){
        return <Navigate to="/login" state={{ from: location }} replace />;
    }  
    const userRolesLower=userRoles.map(role=>role.toLowerCase());
    const allowedRolesLower=allowedRoles.map(role=>role.toLowerCase());
    const isAuthorized = allowedRolesLower.some(role => userRolesLower.includes(role));

    if(isAuthorized){
        return useOutlet ? <Outlet /> : children;
    }else{
        return <Navigate to="/unauthorized" state={{ from: location }} replace />;      
    
    }

}
export default ProtectedRoutes

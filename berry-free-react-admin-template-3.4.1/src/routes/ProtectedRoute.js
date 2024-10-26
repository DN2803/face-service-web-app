import React from 'react';
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types'; // Import PropTypes for prop validation

const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return !!token; // Return true if token exists, false otherwise
};

const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/" />; // Redirect to login if not authenticated
  }
  return children; // Render the children components if authenticated
};

// Add propTypes validation for 'children'
ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired // Ensure 'children' prop is passed and is a valid React node
};

export default ProtectedRoute;

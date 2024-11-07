import React from 'react';
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types'; // Import PropTypes for prop validation
import { callAPI } from 'utils/api_caller';

const isAuthenticated = async () => {
  const token = localStorage.getItem('access_token');
  if (!token) {
    return false; // No token in localStorage, user is not authenticated
  }
  
  try {
    // Assuming callAPI is asynchronous
    const response = await callAPI("/user/my-info", "POST", {}, null, token);
    
    // Check if the response is valid, and assume true if the API confirms authentication
    return response && response.status === 200; 
  } catch (error) {
    console.error("Authentication check failed:", error);
    return false;
  }
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

import React,  {useState, useEffect} from 'react';
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types'; // Import PropTypes for prop validation
import { callAPI } from 'utils/api_caller';
import { BACKEND_ENDPOINTS } from 'services/constant';
const isAuthenticated = async () => {
  const token = localStorage.getItem('access_token');
  if (!token) {
    return false; // No token in localStorage, user is not authenticated
  }
  
  try {
    // Assuming callAPI is asynchronous
    const response = await callAPI(BACKEND_ENDPOINTS.user.info, "POST", {}, null, token);
    console.log(response);
    // Check if the response is valid, and assume true if the API confirms authentication
    return response && response.status === 200; 
  } catch (error) {
    console.error("Authentication check failed:", error);
    return false;
  }
};


const ProtectedRoute = ({ children }) => {
  const [isAuth, setIsAuth] = useState(null); // Initialize state for authentication status

  useEffect(() => {
    // Run the authentication check when component mounts
    const checkAuthentication = async () => {
      const authenticated = await isAuthenticated();
      setIsAuth(authenticated);
    };
    checkAuthentication();
  }, []); // Empty dependency array to run only once after initial render

  if (isAuth === null) {
    return <div>Loading...</div>; // Loading state while checking authentication
  }

  if (!isAuth) {
    return <Navigate to="/" />; // Redirect to login if not authenticated
  }

  return children; // Render the children components if authenticated
};

// Add propTypes validation for 'children'
ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired // Ensure 'children' prop is passed and is a valid React node
};

export default ProtectedRoute;

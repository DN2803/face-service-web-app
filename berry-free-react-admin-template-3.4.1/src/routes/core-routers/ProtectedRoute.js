import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import { Navigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setRedirectRoute } from 'store/actions/authActions';

const ProtectedRoute = ({ children }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const isAuthenticated = useSelector(state => state.auth.user);
  useEffect(() => {
    if (!isAuthenticated) {
      // Lưu trữ route hiện tại vào Redux trước khi chuyển hướng
      dispatch(setRedirectRoute(location.pathname));
    }
  }, [isAuthenticated, dispatch, location]);

  if (!isAuthenticated) {
    return <Navigate to="/pages/login/login3" />;
  }

  // Nếu đã đăng nhập, hiển thị component con
  return children;
};

// Add propTypes validation for 'children'
ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired, // Ensure 'children' prop is passed and is a valid React node
};

export default ProtectedRoute;

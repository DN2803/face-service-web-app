import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

const usePreviousRoute = () => {
  const [previousRoute, setPreviousRoute] = useState(null);
  const navigate = useNavigate();
  const location = useLocation(); // Lấy thông tin đường dẫn hiện tại

  // Lưu lại đường dẫn trước đó khi location thay đổi
  useEffect(() => {
    // Nếu có đường dẫn trước đó, cập nhật lại previousRoute
    const currentPath = location.pathname;
    setPreviousRoute(currentPath);
  }, [location]);

  const navigateToPreviousOrDefault = () => {
    console.log(previousRoute);
    if (previousRoute) {
      // Nếu có đường dẫn trước đó, điều hướng đến trang đó
      navigate(previousRoute);
    } else {
      // Nếu không có, điều hướng đến trang mặc định (project)
      navigate('/pages/project');
    }
  };

  return {
    updatePreviousRoute: setPreviousRoute, // Cập nhật đường dẫn trước đó
    navigateToPreviousOrDefault
  };
};

export default usePreviousRoute;

import { createContext, useContext, useState, useEffect } from 'react';

// Tạo context
const UserInfoContext = createContext();

// Tạo provider để cung cấp giá trị cho các component con
export const UserInfoProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState({
    username: '',
    faceid: false
  });

  // Khôi phục trạng thái từ localStorage khi ứng dụng tải lại
  useEffect(() => {
    const savedUserInfo = JSON.parse(localStorage.getItem('user'));
    if (savedUserInfo) {
      setUserInfo(savedUserInfo);
    }
  }, []);

  // Cập nhật lại localStorage mỗi khi userInfo thay đổi
  useEffect(() => {
    if (userInfo.username) { // chỉ lưu khi đã có thông tin người dùng
      localStorage.setItem('user', JSON.stringify(userInfo));
    }
  }, [userInfo]);

  return (
    <UserInfoContext.Provider value={{ userInfo, setUserInfo }}>
      {children}
    </UserInfoContext.Provider>
  );
};

// Tạo custom hook để dễ dàng sử dụng context
export const useUserInfo = () => {
  return useContext(UserInfoContext);
};

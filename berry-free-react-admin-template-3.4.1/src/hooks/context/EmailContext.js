import { createContext, useContext, useState } from 'react';

// Tạo context
const EmailContext = createContext();

// Tạo provider để cung cấp giá trị cho các component con
export const EmailProvider = ({ children }) => {
  const [email, setEmail] = useState('');

  return (
    <EmailContext.Provider value={{ email, setEmail }}>
      {children}
    </EmailContext.Provider>
  );
};

// Tạo custom hook để dễ dàng sử dụng context
export const useEmail = () => {
  return useContext(EmailContext);
};

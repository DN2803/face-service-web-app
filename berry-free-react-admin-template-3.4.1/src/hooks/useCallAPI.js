// import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import axios from "axios";
// import PasswordDialog from "ui-component/PasswordDialog";
const URL_SERVER = process.env.REACT_APP_PUBLIC_BACKEND_URL;


export const useCallAPI = () => {
    // const [isDialogOpen, setDialogOpen] = useState(false);
    // const [resolveDialog, setResolveDialog] = useState(null);
    const apiKey = useSelector(state => state.auth.apiKey)
    const navigate = useNavigate();

    // const requestPassword = () => {
    //     return new Promise((resolve) => {
    //         console.log("hihihi")
    //         setDialogOpen(true); // Hiển thị dialog
    //         setResolveDialog(() => resolve); // Lưu hàm resolve để xử lý sau
    //     });
    // };

    // const handleCloseDialog = (password) => {
    //     console.log(".. is clossing")
    //     setDialogOpen(false); // Đóng dialog
    //     resolveDialog(password);
    // };

    const callAPI = async (endpoint, method, body, withCredentials = false, token, params) => {
        const headers = {
            "Content-Type": "application/json",
            ...(apiKey && {"x-api-key": apiKey}), 
            ...(token && { Authorization: `Bearer ${token}` }) // Thêm token vào header nếu có
        };

        try {
            const response = await axios({
                method: method,
                url: `${URL_SERVER}${endpoint}`,
                headers: headers,
                data: body,
                params,
                withCredentials: withCredentials
            });
            
            return response; // Trả về response nếu thành công
        } catch (error) {
            if (error.response.data.error ==='Signature has expired' && error.response.status === 400) {
                // const newPassword = await requestPassword();
                const newPassword = window.prompt("Phiên đăng nhập đã hết hạn. Vui lòng nhập lại mật khẩu:");
                if (newPassword) {
                    try {
                        await axios.post(
                            `${URL_SERVER}/auth/login/validate/password`, 
                            { password: newPassword }, 
                            {
                                withCredentials: true,
                                headers: {
                                    Authorization: `Bearer ${localStorage.getItem('refresh_token')}`, 
                                },
                            }
                        );
                        // Gọi lại API sau khi xác thực thành công
                        return callAPI(endpoint, method, body, withCredentials, token, params);
                    } catch {
                        navigate("/"); // Chuyển hướng về trang chủ nếu xác thực thất bại
                    }
                } else {
                    navigate("/"); // Chuyển hướng nếu người dùng hủy nhập mật khẩu
                }
            } else {
                throw error; // Ném lỗi nếu không phải 401
            }
        }
    };

    return { 
        callAPI,
        // PasswordDialogComponent: <PasswordDialog open={isDialogOpen} onClose={handleCloseDialog} />,
     };
};

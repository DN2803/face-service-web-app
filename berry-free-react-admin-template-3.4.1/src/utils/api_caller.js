import axios from "axios";

 const URL_SERVER = process.env.REACT_APP_PUBLIC_BACKEND_URL;



 export const callAPI = async (endpoint, method, body, withCredentials = false, token, params) => {
    const headers = {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }) // Thêm token vào header nếu có
    };

    return await axios({
        method: method,
        url: `${URL_SERVER}${endpoint}`,
        headers: headers,
        data: body,
        params,
        withCredentials: withCredentials
    });
};
import { useCallback } from "react";
import { useCallAPI } from "./useCallAPI"; 
import { BACKEND_ENDPOINTS } from "services/constant";
export const useFetchCollections = () => {
    const { callAPI } = useCallAPI();

    const fetchCollections = useCallback(async () => {
        try {
            const response = await callAPI(BACKEND_ENDPOINTS.project.collections, "GET", {}, { withCredentials: true });
            console.log("collection", response);
            // Kiểm tra dữ liệu trả về từ API
            if (response.data && Array.isArray(response.data.collections)) {
                return response.data.collections.map((item) => ({
                    // id: item.id ?? `${item.id}`, 
                    // name: item.name ?? `${item.name}`, 
                    id: item.id, 
                    name: item.name, 
                    description: item.description
                }));
                
            } else {
                console.error("Data format is invalid. Expected an array for 'collections':", response.data);
                return []; // Trả về mảng rỗng nếu dữ liệu không hợp lệ
            }
        } catch (error) {
            console.error("Error fetching collections:", error);
            return []; // Trả về mảng rỗng khi lỗi xảy ra
        }
    }, []);
    

    return { fetchCollections };
};

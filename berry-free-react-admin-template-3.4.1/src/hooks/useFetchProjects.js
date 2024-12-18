import { useCallAPI } from "./useCallAPI"; 
import { BACKEND_ENDPOINTS } from "services/constant";
export const useFetchProjects = () => {
    const { callAPI } = useCallAPI();

    const fetchProjects = async () => {
        try {
            const response = await callAPI(BACKEND_ENDPOINTS.user.project.info, "GET", {}, { withCredentials: true });
            console.log(response.data);
            // Kiểm tra dữ liệu trả về từ API
            if (response.data && Array.isArray(response.data.projects)) {
                // Chuyển đổi dữ liệu như mong muốn
                return response.data.projects.map((project) => ({
                    name: project.project_name, // Mapping logic
                    original_name: project.original_name,
                    api: project.key,
                    exp: project.expires_at,
                    role: project.admin? "dev":"admin",
                    ...(project.admin && {owner: project.admin})
                }));
            } else {
                console.error("projects is not an array:", response.data.projects);
                return []; // Trả về mảng rỗng nếu dữ liệu không hợp lệ
            }
        } catch (error) {
            console.error("Error fetching projects:", error);
            alert(error.response.data.error);
            return []; // Trả về mảng rỗng khi lỗi xảy ra
        }
    };

    return { fetchProjects };
};

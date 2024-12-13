import { useSelector } from 'react-redux';

const useAdminStatus = () => {
    const role = useSelector((state) => state.project?.selectedProject?.role);
    return role === 'admin'
};

export default useAdminStatus;


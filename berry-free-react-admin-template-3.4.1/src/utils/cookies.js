// utils.js
import Cookies from 'js-cookie';

/**
 * Lấy giá trị cookie theo tên.
 * @param {string} name - Tên của cookie.
 * @returns {string|null} - Giá trị của cookie hoặc null nếu không tìm thấy.
 */
export function getCookieValue(name) {
    return Cookies.get(name) || null;  // Trả về giá trị cookie hoặc null
}

/**
 * Giải mã giá trị cookie thành object.
 * @param {string} cookieName - Tên của cookie.
 * @returns {object|null} - Object được giải mã hoặc null nếu không tìm thấy.
 */
// Hàm để giải mã JWT từ cookie
const decodeJWT = (token) => {
    // JWT được tách ra thành ba phần: header, payload và signature
    const parts = token.split('.');
    if (parts.length !== 3) {
        throw new Error('Invalid JWT token');
    }

    // Giải mã phần payload (phần chứa dữ liệu)
    const payload = atob(parts[1]);
    return JSON.parse(payload);
};

// Hàm giải mã cookie
export function parseCookieToObject(cookieName) {
    try {
        const cookieString = getCookieValue(cookieName)
        // Giải mã URL của cookie (bỏ qua %20, %2C,...)
        const decodedCookie = decodeURIComponent(cookieString);

        // Tìm kiếm dấu phẩy ',' để xác định phần JWT
        const jwtToken = decodedCookie.split(',')[1]; // Bỏ qua phần object Object]

        if (jwtToken) {
            // Giải mã JWT để lấy thông tin
            const decodedPayload = decodeJWT(jwtToken);
            return decodedPayload;
        } else {
            throw new Error('Invalid cookie format');
        }
    } catch (error) {
        console.error('Error decoding cookie:', error);
        return null;
    }
}

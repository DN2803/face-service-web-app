export async function convertAndCacheImage(imagePath) {
    // Kiểm tra xem hình ảnh có sẵn trong cache không
    let cachedImage = sessionStorage.getItem(imagePath);

    if (cachedImage) {
        // Nếu có cache, dùng hình ảnh đã cache
        // console.log("Using cached image");
        return cachedImage;
    } else {
        // Nếu chưa có cache, tải ảnh và chuyển sang base64
        const response = await fetch(imagePath);
        const blob = await response.blob();
        const reader = new FileReader();

        return new Promise((resolve) => {
            reader.onloadend = () => {
                const base64data = reader.result;
                // Lưu vào cache
                sessionStorage.setItem(imagePath, base64data);
                resolve(base64data);
            };
            reader.readAsDataURL(blob);
        });
    }
}

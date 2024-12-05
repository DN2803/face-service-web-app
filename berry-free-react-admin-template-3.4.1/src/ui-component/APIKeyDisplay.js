import React, { useState } from 'react';

const ApiKeyDisplay = ({ apiKey = "", numDisplay = 3 }) => {
    const [copied, setCopied] = useState(false);

    const shortenApiKey = (key) => {
        if (!key) return "No API Key Provided";
        if (key.length <= numDisplay) return key; // Nếu key ngắn hơn số ký tự cần hiển thị
        const start = key.slice(0, numDisplay);
        return `${start}...`;
    };

    const handleCopy = () => {
        if (!apiKey) return;
        navigator.clipboard.writeText(apiKey)
            .then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            })
            .catch((err) => console.error("Copy failed: ", err));
    };

    return (
        <div
            onClick={handleCopy}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleCopy();
                }
            }}
            role="button"
            tabIndex="0"
            style={{
                cursor: 'pointer',
                display: 'inline-block',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '5px',
                backgroundColor: copied ? '#d1ecf1' : '#f9f9f9', // Đổi nền khi copied
                transition: 'background-color 0.3s ease',
                userSelect: 'none', // Tránh chọn văn bản khi click
            }}
        >
            {shortenApiKey(apiKey)}
            {copied && <span style={{ marginLeft: '10px', color: '#007bff' }}>Copied!</span>}
        </div>
    );
};

export default ApiKeyDisplay;

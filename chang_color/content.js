// 监听来自popup的消息
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'changeColors') {
        applyColors(request.bgColor, request.textColor);
        sendResponse({ status: 'success' });
    } else if (request.action === 'resetColors') {
        resetColors();
        sendResponse({ status: 'success' });
    }
});

// 应用背景和文本颜色
function applyColors(bgColor, textColor) {
    // 移除可能存在的旧样式
    removeColorStyle();
    
    // 创建新的样式元素
    const style = document.createElement('style');
    style.id = 'custom-page-colors';
    style.textContent = `
        /* 基础背景 */
        body, html {
            background-color: ${bgColor} !important;
            color: ${textColor} !important;
        }
        
        /* 覆盖常见容器背景 */
        body * {
            background-color: transparent !important;
        }
        
        /* 应用文本颜色到所有元素 */
        body, body *, p, div, span, h1, h2, h3, h4, h5, h6, 
        a, li, td, th, label, button, input, textarea, select {
            color: ${textColor} !important;
        }
        
        /* 保留链接的悬停效果 */
        a:hover {
            opacity: 0.8 !important;
        }
        
        /* 保留输入框、按钮等交互元素的原始背景 */
        input, textarea, select, button {
            background-color: initial !important;
        }
        
        /* 保留图片背景 */
        img, video, canvas {
            background-color: initial !important;
        }
        
        /* 为body设置一个基础背景层 */
        body::before {
            content: '';
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: ${bgColor};
            z-index: -9999;
            pointer-events: none;
        }
    `;
    document.head.appendChild(style);
    
    // 保存颜色到localStorage，以便页面刷新后仍然生效
    localStorage.setItem('customBackgroundColor', bgColor);
    localStorage.setItem('customTextColor', textColor);
}

// 恢复默认颜色
function resetColors() {
    removeColorStyle();
    localStorage.removeItem('customBackgroundColor');
    localStorage.removeItem('customTextColor');
}

// 移除自定义样式
function removeColorStyle() {
    const existingStyle = document.getElementById('custom-page-colors');
    if (existingStyle) {
        existingStyle.remove();
    }
}

// 页面加载时检查是否有保存的颜色
(function() {
    const savedBgColor = localStorage.getItem('customBackgroundColor');
    const savedTextColor = localStorage.getItem('customTextColor');
    if (savedBgColor && savedTextColor) {
        applyColors(savedBgColor, savedTextColor);
    }
})();

// 监听storage变化（当在其他标签页修改颜色时）
chrome.storage.onChanged.addListener(function(changes, namespace) {
    if (namespace === 'sync') {
        const bgColor = changes.backgroundColor ? changes.backgroundColor.newValue : localStorage.getItem('customBackgroundColor');
        const textColor = changes.textColor ? changes.textColor.newValue : localStorage.getItem('customTextColor');
        
        if (bgColor && textColor) {
            applyColors(bgColor, textColor);
        } else if (!bgColor && !textColor) {
            resetColors();
        }
    }
});

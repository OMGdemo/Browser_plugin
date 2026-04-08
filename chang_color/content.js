// 监听来自popup的消息
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'changeBgColor') {
        changeBgColorOnly(request.bgColor);
        sendResponse({ status: 'success' });
    } else if (request.action === 'changeTextColor') {
        changeTextColorOnly(request.textColor);
        sendResponse({ status: 'success' });
    } else if (request.action === 'changeColors') {
        applyColors(request.bgColor, request.textColor);
        sendResponse({ status: 'success' });
    } else if (request.action === 'toggleCopy') {
        toggleTextCopy(request.allowCopy);
        sendResponse({ status: 'success' });
    } else if (request.action === 'resetAll') {
        resetAll();
        sendResponse({ status: 'success' });
    }
});

// 只改变背景色
function changeBgColorOnly(bgColor) {
    removeColorStyle();
    
    // 获取已保存的文本色，保持不丢失
    const existingTextColor = localStorage.getItem('customTextColor');
    
    const style = document.createElement('style');
    style.id = 'custom-page-colors';
    
    // 如果有文本色，同时应用
    if (existingTextColor) {
        style.textContent = `
            body, html {
                background-color: ${bgColor} !important;
                color: ${existingTextColor} !important;
            }
            
            body * {
                background-color: transparent !important;
            }
            
            body, body *, p, div, span, h1, h2, h3, h4, h5, h6, 
            a, li, td, th, label, button, input, textarea, select {
                color: ${existingTextColor} !important;
            }
            
            a:hover {
                opacity: 0.8 !important;
            }
            
            input, textarea, select, button {
                background-color: initial !important;
            }
            
            img, video, canvas {
                background-color: initial !important;
            }
            
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
    } else {
        // 只应用背景色
        style.textContent = `
            body, html {
                background-color: ${bgColor} !important;
            }
            
            body * {
                background-color: transparent !important;
            }
            
            input, textarea, select, button {
                background-color: initial !important;
            }
            
            img, video, canvas {
                background-color: initial !important;
            }
            
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
    }
    
    document.head.appendChild(style);
    localStorage.setItem('customBackgroundColor', bgColor);
}

// 只改变文本色
function changeTextColorOnly(textColor) {
    removeColorStyle();
    
    // 获取已保存的背景色，保持不丢失
    const existingBgColor = localStorage.getItem('customBackgroundColor');
    
    const style = document.createElement('style');
    style.id = 'custom-page-colors';
    
    // 如果有背景色，同时应用
    if (existingBgColor) {
        style.textContent = `
            body, html {
                background-color: ${existingBgColor} !important;
                color: ${textColor} !important;
            }
            
            body * {
                background-color: transparent !important;
            }
            
            body, body *, p, div, span, h1, h2, h3, h4, h5, h6, 
            a, li, td, th, label, button, input, textarea, select {
                color: ${textColor} !important;
            }
            
            a:hover {
                opacity: 0.8 !important;
            }
            
            input, textarea, select, button {
                background-color: initial !important;
            }
            
            img, video, canvas {
                background-color: initial !important;
            }
            
            body::before {
                content: '';
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: ${existingBgColor};
                z-index: -9999;
                pointer-events: none;
            }
        `;
    } else {
        // 只应用文本色
        style.textContent = `
            body, html {
                color: ${textColor} !important;
            }
            
            body, body *, p, div, span, h1, h2, h3, h4, h5, h6, 
            a, li, td, th, label, button, input, textarea, select {
                color: ${textColor} !important;
            }
            
            a:hover {
                opacity: 0.8 !important;
            }
        `;
    }
    
    document.head.appendChild(style);
    localStorage.setItem('customTextColor', textColor);
}

// 应用背景和文本颜色
function applyColors(bgColor, textColor) {
    removeColorStyle();
    
    const style = document.createElement('style');
    style.id = 'custom-page-colors';
    style.textContent = `
        body, html {
            background-color: ${bgColor} !important;
            color: ${textColor} !important;
        }
        
        body * {
            background-color: transparent !important;
        }
        
        body, body *, p, div, span, h1, h2, h3, h4, h5, h6, 
        a, li, td, th, label, button, input, textarea, select {
            color: ${textColor} !important;
        }
        
        a:hover {
            opacity: 0.8 !important;
        }
        
        input, textarea, select, button {
            background-color: initial !important;
        }
        
        img, video, canvas {
            background-color: initial !important;
        }
        
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
    
    localStorage.setItem('customBackgroundColor', bgColor);
    localStorage.setItem('customTextColor', textColor);
}

// 切换文字复制功能
function toggleTextCopy(allowCopy) {
    if (allowCopy) {
        // 允许复制 - 移除所有限制
        removeCopyRestrictions();
        localStorage.setItem('allowCopy', 'true');
    } else {
        // 禁止复制 - 添加限制
        addCopyRestrictions();
        localStorage.setItem('allowCopy', 'false');
    }
}

// 添加复制限制
function addCopyRestrictions() {
    removeCopyRestrictions();
    
    const style = document.createElement('style');
    style.id = 'copy-restrictions';
    style.textContent = `
        body, body * {
            -webkit-user-select: none !important;
            -moz-user-select: none !important;
            -ms-user-select: none !important;
            user-select: none !important;
        }
    `;
    document.head.appendChild(style);
    
    // 阻止复制事件
    document.addEventListener('copy', blockCopyEvent, true);
    document.addEventListener('cut', blockCopyEvent, true);
    document.addEventListener('contextmenu', blockContextMenu, true);
}

// 移除复制限制
function removeCopyRestrictions() {
    const existingStyle = document.getElementById('copy-restrictions');
    if (existingStyle) {
        existingStyle.remove();
    }
    
    document.removeEventListener('copy', blockCopyEvent, true);
    document.removeEventListener('cut', blockCopyEvent, true);
    document.removeEventListener('contextmenu', blockContextMenu, true);
}

// 阻止复制事件
function blockCopyEvent(e) {
    e.preventDefault();
    return false;
}

// 阻止右键菜单
function blockContextMenu(e) {
    e.preventDefault();
    return false;
}

// 获取当前文本色
function getCurrentTextColor() {
    return localStorage.getItem('customTextColor');
}

// 获取当前背景色
function getCurrentBgColor() {
    return localStorage.getItem('customBackgroundColor');
}

// 恢复所有默认设置
function resetAll() {
    removeColorStyle();
    removeCopyRestrictions();
    localStorage.removeItem('customBackgroundColor');
    localStorage.removeItem('customTextColor');
    localStorage.removeItem('allowCopy');
}

// 移除自定义样式
function removeColorStyle() {
    const existingStyle = document.getElementById('custom-page-colors');
    if (existingStyle) {
        existingStyle.remove();
    }
}

// 页面加载时检查是否有保存的设置
(function() {
    const savedBgColor = localStorage.getItem('customBackgroundColor');
    const savedTextColor = localStorage.getItem('customTextColor');
    const allowCopy = localStorage.getItem('allowCopy');
    
    if (savedBgColor && savedTextColor) {
        applyColors(savedBgColor, savedTextColor);
    } else if (savedBgColor) {
        changeBgColorOnly(savedBgColor);
    } else if (savedTextColor) {
        changeTextColorOnly(savedTextColor);
    }
    
    if (allowCopy === 'false') {
        addCopyRestrictions();
    }
})();

// 监听storage变化（当在其他标签页修改设置时）
chrome.storage.onChanged.addListener(function(changes, namespace) {
    if (namespace === 'sync') {
        const bgColor = changes.backgroundColor ? changes.backgroundColor.newValue : localStorage.getItem('customBackgroundColor');
        const textColor = changes.textColor ? changes.textColor.newValue : localStorage.getItem('customTextColor');
        const allowCopy = changes.allowCopy;
        
        if (bgColor && textColor) {
            applyColors(bgColor, textColor);
        } else if (bgColor) {
            changeBgColorOnly(bgColor);
        } else if (textColor) {
            changeTextColorOnly(textColor);
        }
        
        if (allowCopy !== undefined) {
            toggleTextCopy(allowCopy.newValue);
        } else if (!bgColor && !textColor && allowCopy === undefined) {
            resetAll();
        }
    }
});

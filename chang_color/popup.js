document.addEventListener('DOMContentLoaded', function() {
    const bgColorPicker = document.getElementById('bgColorPicker');
    const textColorPicker = document.getElementById('textColorPicker');
    const applyBtn = document.getElementById('applyBtn');
    const resetBtn = document.getElementById('resetBtn');
    const statusDiv = document.getElementById('status');
    const bgColorBtns = document.querySelectorAll('#bgColorGrid .color-btn');
    const textColorBtns = document.querySelectorAll('#textColorGrid .color-btn');

    // 加载保存的颜色
    chrome.storage.sync.get(['backgroundColor', 'textColor'], function(result) {
        if (result.backgroundColor) {
            bgColorPicker.value = result.backgroundColor;
        }
        if (result.textColor) {
            textColorPicker.value = result.textColor;
        }
    });

    // 预设背景色点击事件
    bgColorBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const color = this.getAttribute('data-color');
            bgColorPicker.value = color;
        });
    });

    // 预设文本色点击事件
    textColorBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const color = this.getAttribute('data-color');
            textColorPicker.value = color;
        });
    });

    // 应用颜色按钮
    applyBtn.addEventListener('click', function() {
        const bgColor = bgColorPicker.value;
        const textColor = textColorPicker.value;
        
        // 保存颜色到storage
        chrome.storage.sync.set({ 
            backgroundColor: bgColor,
            textColor: textColor
        }, function() {
            // 获取当前活动标签页
            chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
                if (tabs[0]) {
                    // 向content script发送消息
                    chrome.tabs.sendMessage(tabs[0].id, {
                        action: 'changeColors',
                        bgColor: bgColor,
                        textColor: textColor
                    }, function(response) {
                        if (chrome.runtime.lastError) {
                            showStatus('页面刷新后生效', 'error');
                        } else {
                            showStatus('颜色已应用！', 'success');
                        }
                    });
                }
            });
        });
    });

    // 恢复默认按钮
    resetBtn.addEventListener('click', function() {
        chrome.storage.sync.remove(['backgroundColor', 'textColor'], function() {
            bgColorPicker.value = '#ffffff';
            textColorPicker.value = '#000000';
            
            chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
                if (tabs[0]) {
                    chrome.tabs.sendMessage(tabs[0].id, {
                        action: 'resetColors'
                    }, function(response) {
                        if (chrome.runtime.lastError) {
                            showStatus('页面刷新后恢复默认', 'error');
                        } else {
                            showStatus('已恢复默认颜色', 'success');
                        }
                    });
                }
            });
        });
    });

    // 显示状态信息
    function showStatus(message, type) {
        statusDiv.textContent = message;
        statusDiv.className = 'status ' + type;
        
        setTimeout(function() {
            statusDiv.style.display = 'none';
        }, 2000);
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const bgColorPicker = document.getElementById('bgColorPicker');
    const textColorPicker = document.getElementById('textColorPicker');
    const applyBgBtn = document.getElementById('applyBgBtn');
    const applyTextBtn = document.getElementById('applyTextBtn');
    const applyAllBtn = document.getElementById('applyAllBtn');
    const resetBtn = document.getElementById('resetBtn');
    const copyToggle = document.getElementById('copyToggle');
    const statusDiv = document.getElementById('status');
    const bgColorBtns = document.querySelectorAll('#bgColorGrid .color-btn');
    const textColorBtns = document.querySelectorAll('#textColorGrid .color-btn');

    // 加载保存的设置
    chrome.storage.sync.get(['backgroundColor', 'textColor', 'allowCopy'], function(result) {
        if (result.backgroundColor) {
            bgColorPicker.value = result.backgroundColor;
        }
        if (result.textColor) {
            textColorPicker.value = result.textColor;
        }
        if (result.allowCopy !== undefined) {
            copyToggle.checked = result.allowCopy;
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

    // 获取当前活动标签页
    function getCurrentTab(callback) {
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            callback(tabs[0]);
        });
    }

    // 应用背景色
    applyBgBtn.addEventListener('click', function() {
        const bgColor = bgColorPicker.value;
        
        chrome.storage.sync.set({ backgroundColor: bgColor }, function() {
            getCurrentTab(function(tab) {
                if (tab) {
                    chrome.tabs.sendMessage(tab.id, {
                        action: 'changeBgColor',
                        bgColor: bgColor
                    }, function(response) {
                        if (chrome.runtime.lastError) {
                            showStatus('页面刷新后生效', 'error');
                        } else {
                            showStatus('背景色已应用！', 'success');
                        }
                    });
                }
            });
        });
    });

    // 应用文本色
    applyTextBtn.addEventListener('click', function() {
        const textColor = textColorPicker.value;
        
        chrome.storage.sync.set({ textColor: textColor }, function() {
            getCurrentTab(function(tab) {
                if (tab) {
                    chrome.tabs.sendMessage(tab.id, {
                        action: 'changeTextColor',
                        textColor: textColor
                    }, function(response) {
                        if (chrome.runtime.lastError) {
                            showStatus('页面刷新后生效', 'error');
                        } else {
                            showStatus('文本色已应用！', 'success');
                        }
                    });
                }
            });
        });
    });

    // 同时应用两种颜色
    applyAllBtn.addEventListener('click', function() {
        const bgColor = bgColorPicker.value;
        const textColor = textColorPicker.value;
        
        chrome.storage.sync.set({ 
            backgroundColor: bgColor,
            textColor: textColor
        }, function() {
            getCurrentTab(function(tab) {
                if (tab) {
                    chrome.tabs.sendMessage(tab.id, {
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

    // 恢复默认
    resetBtn.addEventListener('click', function() {
        chrome.storage.sync.remove(['backgroundColor', 'textColor', 'allowCopy'], function() {
            bgColorPicker.value = '#ffffff';
            textColorPicker.value = '#000000';
            copyToggle.checked = true;
            
            getCurrentTab(function(tab) {
                if (tab) {
                    chrome.tabs.sendMessage(tab.id, {
                        action: 'resetAll'
                    }, function(response) {
                        if (chrome.runtime.lastError) {
                            showStatus('页面刷新后恢复默认', 'error');
                        } else {
                            showStatus('已恢复默认设置', 'success');
                        }
                    });
                }
            });
        });
    });

    // 文字复制开关
    copyToggle.addEventListener('change', function() {
        const allowCopy = this.checked;
        
        chrome.storage.sync.set({ allowCopy: allowCopy }, function() {
            getCurrentTab(function(tab) {
                if (tab) {
                    chrome.tabs.sendMessage(tab.id, {
                        action: 'toggleCopy',
                        allowCopy: allowCopy
                    }, function(response) {
                        if (chrome.runtime.lastError) {
                            showStatus('页面刷新后生效', 'error');
                        } else {
                            showStatus(allowCopy ? '已允许文字复制' : '已禁止文字复制', 'success');
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

// Service Worker - 后台脚本
// 用于处理插件的生命周期和全局事件

chrome.runtime.onInstalled.addListener(function() {
    console.log('页面背景变色器已安装');
});

// 监听storage变化，同步到所有标签页
chrome.storage.onChanged.addListener(function(changes, namespace) {
    if (namespace === 'sync' && changes.backgroundColor) {
        // 通知所有打开的标签页更新背景色
        chrome.tabs.query({}, function(tabs) {
            tabs.forEach(function(tab) {
                chrome.tabs.sendMessage(tab.id, {
                    action: 'changeColor',
                    color: changes.backgroundColor.newValue
                }).catch(function() {
                    // 忽略无法发送消息的标签页
                });
            });
        });
    }
});

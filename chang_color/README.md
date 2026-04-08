# 页面背景变色器 - Edge浏览器插件

## 功能说明
这是一个Edge浏览器扩展插件，允许用户自定义网页背景颜色，提供更舒适的浏览体验。

## 文件结构
```
chang_color/
├── manifest.json      # 插件配置文件
├── popup.html         # 弹出窗口界面
├── popup.js           # 弹出窗口逻辑
├── content.js         # 页面内容脚本
├── background.js      # 后台服务脚本
└── icons/             # 图标文件夹
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```

## 安装步骤

### 1. 准备图标文件
在 `icons` 文件夹中放置三个尺寸的PNG图标：
- icon16.png (16x16像素)
- icon48.png (48x48像素)
- icon128.png (128x128像素)

**临时方案**：如果暂时没有图标，可以创建一个简单的1x1像素PNG文件，复制三份并重命名。

### 2. 加载插件到Edge浏览器

1. 打开Edge浏览器
2. 地址栏输入：`edge://extensions/`
3. 开启左上角的 **"开发人员模式"**
4. 点击 **"加载解压缩的扩展"**
5. 选择本项目的根目录（`E:\data\mojh\ai_item\chang_color`）
6. 插件安装成功！

### 3. 使用插件

1. 点击浏览器工具栏中的插件图标
2. 在弹出窗口中：
   - 使用颜色选择器选择任意颜色
   - 或点击预设颜色快速选择
   - 点击"应用颜色"按钮
3. 当前页面背景会立即改变
4. 点击"恢复默认"可还原原始背景

## 实现流程详解

### 架构设计

```
用户操作 → popup.js → chrome.storage → content.js → 页面DOM
                ↓                          ↑
            background.js (同步所有标签页)
```

### 核心流程

#### 1. 用户选择颜色
- 用户在popup.html中选择颜色
- popup.js保存颜色到chrome.storage.sync
- 同时向当前标签页的content.js发送消息

#### 2. 应用颜色到页面
- content.js接收消息
- 动态创建<style>标签注入页面
- 使用!important确保样式优先级
- 保存到localStorage实现持久化

#### 3. 跨标签页同步
- background.js监听storage变化
- 通知所有打开的标签页更新
- 实现全局统一背景色

#### 4. 页面刷新保持
- content.js加载时检查localStorage
- 自动应用之前保存的颜色
- 无需重新操作插件

### 技术要点

#### Manifest V3
- 使用最新的Manifest V3规范
- Service Worker替代background page
- 更严格的权限管理

#### 通信机制
- **popup → content**: chrome.tabs.sendMessage()
- **content ↔ background**: chrome.runtime.onMessage
- **数据持久化**: chrome.storage.sync + localStorage

#### CSS注入策略
```javascript
const style = document.createElement('style');
style.id = 'custom-background-color';
style.textContent = `
    body, html {
        background-color: ${color} !important;
    }
`;
document.head.appendChild(style);
```

使用`!important`确保覆盖网站原有样式。

## 功能特性

✅ 自定义颜色选择器  
✅ 10种预设常用颜色  
✅ 实时应用到当前页面  
✅ 跨标签页同步  
✅ 页面刷新后保持设置  
✅ 一键恢复默认  
✅ 友好的状态提示  

## 注意事项

1. **图标文件**：必须先添加图标文件才能正常加载插件
2. **特殊页面**：某些系统页面（如edge://settings）无法修改背景
3. **iframe限制**：部分嵌套iframe可能不受影响
4. **样式冲突**：极少数网站可能因复杂CSS导致效果不佳

## 开发调试

### 查看控制台日志
1. 右键点击插件图标 → "检查弹出内容"
2. 在网页上按F12 → Console查看content.js日志

### 重新加载插件
在 `edge://extensions/` 页面点击插件的刷新按钮

## 扩展建议

🔧 可能的功能增强：
- 为不同网站设置独立颜色
- 透明度调节
- 渐变背景支持
- 定时切换主题
- 导入导出配置
- 快捷键支持

## 兼容性

- ✅ Microsoft Edge (Chromium内核)
- ✅ Google Chrome
- ✅ 其他Chromium内核浏览器

## 技术栈

- HTML5 + CSS3
- Vanilla JavaScript (ES6+)
- Chrome Extension API (Manifest V3)

# 自动生成插件图标脚本
# 此脚本会创建简单的彩色方块作为占位图标

$iconPath = "E:\data\mojh\ai_item\chang_color\icons"

Write-Host "正在生成插件图标..." -ForegroundColor Green

# 使用.NET创建带颜色的PNG
Add-Type -AssemblyName System.Drawing

# 生成三个尺寸的图标
$sizes = @("16", "48", "128")

foreach ($size in $sizes) {
    $fileName = "icon" + $size + ".png"
    $filePath = Join-Path $iconPath $fileName
    $pixelSize = [int]$size
    
    $bmp = New-Object System.Drawing.Bitmap($pixelSize, $pixelSize)
    $graphics = [System.Drawing.Graphics]::FromImage($bmp)
    
    # 填充绿色背景 (#4CAF50)
    $brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(76, 175, 80))
    $graphics.FillRectangle($brush, 0, 0, $pixelSize, $pixelSize)
    
    # 添加简单的调色板图案（白色圆形）
    $whiteBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
    $circleSize = [int]($pixelSize * 0.6)
    $circleX = [int]($pixelSize * 0.2)
    $circleY = [int]($pixelSize * 0.2)
    $graphics.FillEllipse($whiteBrush, $circleX, $circleY, $circleSize, $circleSize)
    
    # 保存为PNG
    $bmp.Save($filePath, [System.Drawing.Imaging.ImageFormat]::Png)
    
    # 释放资源
    $graphics.Dispose()
    $bmp.Dispose()
    
    Write-Host "已生成: $fileName ($pixelSize x $pixelSize)" -ForegroundColor Cyan
}

Write-Host "`n图标生成完成！" -ForegroundColor Green
Write-Host "位置: $iconPath" -ForegroundColor Yellow
Write-Host "`n现在可以在Edge浏览器中加载插件了。" -ForegroundColor White

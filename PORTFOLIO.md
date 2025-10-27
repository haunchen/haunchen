# Frank Chen 個人作品集網站

這是 Frank Chen 的個人作品集網站，使用純 HTML + CSS + JavaScript 實現，無需任何框架或建置工具。

## 專案說明

這個專案是從 Next.js + React + TypeScript 專案 (frank-chen-personal) 1:1 轉換而來的純前端靜態網站。

### 技術棧

- HTML5 (語意化標籤)
- CSS3 (CSS Variables, Grid, Flexbox)
- Vanilla JavaScript ES6+ (無框架)
- Intersection Observer API
- 完整 SEO 設定

### 特色功能

- ✅ 響應式設計 (Mobile/Tablet/Desktop)
- ✅ 平滑滾動動畫
- ✅ 智能導覽列高亮
- ✅ 圖片 Lazy Loading
- ✅ 完整 SEO meta tags
- ✅ Open Graph 社群分享
- ✅ JSON-LD 結構化資料
- ✅ 無障礙設計
- ✅ 跨瀏覽器相容

## 專案結構

```
haunchen/
├── index.html              # 主頁面
├── linktree.html          # 社群連結頁面
├── css/
│   ├── variables.css      # CSS 變數定義
│   ├── reset.css          # CSS Reset
│   ├── layout.css         # 佈局樣式
│   ├── components.css     # 組件樣式
│   ├── animations.css     # 動畫效果
│   └── responsive.css     # 響應式設計
├── js/
│   ├── utils.js          # 工具函式
│   ├── navigation.js     # 導覽列功能
│   ├── animations.js     # 滾動動畫
│   └── main.js           # 主要邏輯
├── images/               # 圖片資源
│   ├── frank-avatar.jpeg
│   ├── favicon.png
│   ├── apple-touch-icon.png
│   ├── blog-screenshot.png
│   ├── n8n-app-screenshot.png
│   ├── iset2020-screenshot.png
│   └── iset2021-screenshot.png
└── README.md             # GitHub Profile README
```

## 使用方式

### 方法一：直接開啟

直接在瀏覽器中開啟 `index.html` 或 `linktree.html` 即可瀏覽。

### 方法二：使用本地伺服器

為了獲得最佳體驗，建議使用本地伺服器：

使用 Python：
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

使用 Node.js (http-server)：
```bash
npx http-server -p 8000
```

使用 PHP：
```bash
php -S localhost:8000
```

然後在瀏覽器中訪問 `http://localhost:8000`

## 頁面說明

### 主頁 (index.html)

包含以下區塊：
- Navigation - 固定導覽列
- Hero - 英雄區塊 (頭像、標題、社群連結)
- About - 關於我 (技能標籤)
- Experience - 工作經歷 (2 個職位)
- Projects - 專案經歷 (4 個專案)
- Portfolio - 作品集 (4 個作品)
- Contact - 聯絡方式
- Footer - 頁腳

### Linktree 頁面 (linktree.html)

社群連結集合頁面，包含：
- 個人資訊
- 8 個社群平台連結
- 精美的漸層背景

## 客製化

### 修改顏色主題

編輯 `css/variables.css`：
```css
:root {
  --color-orange-400: #fb923c;  /* 主題色 */
  --color-gray-900: #111827;    /* 深色背景 */
  /* ... 其他顏色變數 */
}
```

### 修改內容

直接編輯 HTML 檔案中的文字內容即可。

### 修改間距、字體大小

編輯 `css/variables.css` 中的變數：
```css
:root {
  --spacing-md: 1rem;
  --font-size-xl: 1.25rem;
  /* ... 其他變數 */
}
```

## SEO 設定

網站包含完整的 SEO 設定：

### Meta Tags
- title, description, keywords
- author, viewport
- Open Graph (社群分享)
- Twitter Cards
- Canonical URL

### JSON-LD 結構化資料
- Person schema
- ProfilePage schema
- Occupation information

### 語意化 HTML
- 使用 `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`
- 正確的標題層級 (h1-h6)
- 圖片 alt 屬性

## 瀏覽器支援

- Chrome (最新版)
- Firefox (最新版)
- Safari (最新版)
- Edge (最新版)
- Mobile Safari (iOS 12+)
- Chrome Mobile (Android 5+)

## 效能優化

- CSS 分離載入
- 圖片 Lazy Loading
- JavaScript 模組化
- 使用 Intersection Observer (高效能)
- CSS Transform 動畫 (GPU 加速)
- Throttle/Debounce 優化

## 無障礙設計

- 語意化 HTML 標籤
- 鍵盤導航支援
- ARIA 標籤
- Focus 狀態樣式
- Alt 文字描述
- 對比度符合 WCAG 標準

## 部署

### GitHub Pages

1. 將專案推送到 GitHub
2. 在 Repository Settings > Pages 中啟用 GitHub Pages
3. 選擇 branch (通常是 main) 和 root 目錄
4. 等待部署完成

### Netlify / Vercel

直接拖放專案資料夾到平台即可部署。

### 傳統主機

將所有檔案上傳到主機的 public_html 或 www 目錄即可。

## 授權

© 2025 Frank Chen. All rights reserved.

## 聯絡方式

- Email: qwer4488999@gmail.com
- Blog: https://blog.frankchen.tw/
- GitHub: https://github.com/haunchen
- LinkedIn: https://www.linkedin.com/in/frankchen0130/

---

技術支援：如有問題或建議，歡迎透過 GitHub Issues 或 Email 聯繫。

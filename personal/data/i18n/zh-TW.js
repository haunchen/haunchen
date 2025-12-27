/**
 * 中文翻譯檔 (正體中文 - 台灣)
 * Terminal Emulator i18n
 */

export const i18n = {
    terminal: {
        // 啟動器
        launcherText: '開啟終端機',

        // 歡迎訊息
        welcome: '歡迎來到 Frank 的終端機！',
        welcomeHint: '輸入 <span class="highlight">help</span> 查看可用指令',

        // 錯誤訊息
        commandNotFound: '指令不存在:',
        typeHelp: "輸入 'help' 查看可用指令",
        noMatch: '沒有匹配的文章',
        noPosts: '目前沒有文章',
        noPages: '目前沒有頁面',
        invalidPostNumber: '編號無效。請輸入 1 到 {max} 之間的數字',
        invalidPageNumber: '編號無效。請輸入 1 到 {max} 之間的數字',
        postNotFound: '找不到 slug 為 "{slug}" 的文章',
        pageNotFound: '找不到 slug 為 "{slug}" 的頁面',

        // 確認相關
        confirmOpening: '確認開啟文章... <span class="success">✓</span>',
        cancelled: '<span class="terminal-text-muted">已取消開啟</span>',
        enterYN: '<span class="error">請輸入 Y 或 n</span>',
        confirmPlaceholder: '輸入 Y 或 n',
        inputPlaceholder: '輸入 help 查看指令',
        confirmOpen: '是否開啟「{title}」？',

        // 操作提示
        openingPost: '正在開啟文章 [{index}] {title}... <span class="success">✓</span>',
        openingPage: '正在開啟頁面 [{index}] {title}... <span class="success">✓</span>',
        navigatingBlog: '正在前往部落格... <span class="success">✓</span>',
        navigatingGithub: '正在前往 GitHub... <span class="success">✓</span>',

        // 文章/頁面資訊
        foundPost: '<div class="highlight">找到文章：</div>',
        foundPage: '<div class="highlight">找到頁面：</div>',
        titleLabel: '標題:',
        dateLabel: '發布日期:',
        linkLabel: '連結:',

        // 列表標題
        postsListTitle: '最新部落格文章列表 (顯示前 {count} 篇)',
        pagesListTitle: '頁面列表 (共 {count} 頁)',
        postsHint: '輸入 <span class="highlight">post [slug]</span> 或 <span class="highlight">post [編號]</span> 開啟文章',
        pagesHint: '輸入 <span class="highlight">page [slug]</span> 或 <span class="highlight">page [編號]</span> 開啟頁面',

        // Help 指令
        help: {
            title: '<div class="highlight">可用指令：</div>',
            commands: `<div>
<div><span class="highlight">about</span>      - 關於我</div>
<div><span class="highlight">skills</span>     - 技能清單</div>
<div><span class="highlight">experience</span> - 工作經歷</div>
<div><span class="highlight">projects</span>   - 專案作品</div>
<div><span class="highlight">contact</span>    - 聯絡資訊</div>
<div><span class="highlight">posts</span>      - 顯示最新部落格文章列表</div>
<div><span class="highlight">post [slug]</span> - 用 slug 開啟文章（會先詢問）</div>
<div><span class="highlight">blog</span>       - 前往部落格</div>
<div><span class="highlight">github</span>     - 前往 GitHub</div>
<div><span class="highlight">clear</span>      - 清除畫面</div>
<div><span class="highlight">pages</span>      - 顯示頁面列表</div>
<div><span class="highlight">page [slug]</span>  - 用 slug 開啟頁面</div>
</div>`
        },

        // About 指令
        about: {
            title: '<div class="highlight">關於我</div>',
            content: `<div class="terminal-list-item">
嗨！我是 Haunchen，一名系統整合工程師與技術愛好者。<br>
熱衷於探索新技術、自動化流程，以及打造有趣的專案。<br>
喜歡透過程式碼解決問題，並分享學習心得。
</div>`
        },

        // Skills 指令
        skills: {
            title: '<div class="highlight">技能標籤</div>',
            content: `<div class="terminal-list-item">
<span class="success">▪</span> Python · JavaScript · HTML/CSS<br>
<span class="success">▪</span> Docker · Git · Linux<br>
<span class="success">▪</span> 系統整合 · 自動化 · API 開發<br>
<span class="success">▪</span> n8n · Workflow Automation
</div>`
        },

        // Experience 指令
        experience: {
            title: '<div class="highlight">工作經歷</div>',
            content: `<div class="terminal-list-item">
<div><span class="success">▪</span> 系統整合工程師</div>
<div class="terminal-text-muted">
負責系統整合、自動化流程開發與維護
</div>
</div>`
        },

        // Projects 指令
        projects: {
            title: '<div class="highlight">專案作品</div>',
            content: `<div class="terminal-list-item">
請向下滾動查看完整的專案作品集 ↓<br>
或輸入 <span class="highlight">blog</span> 查看更多技術文章
</div>`
        },

        // Contact 指令
        contact: {
            title: '<div class="highlight">聯絡資訊</div>',
            content: `<div class="terminal-list-item">
正在導航到聯絡區域... <span class="success">✓</span>
</div>`
        }
    }
};

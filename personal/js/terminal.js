/**
 * Terminal Emulator for Personal Website
 * Interactive command-line interface
 */

import { postsData } from '../data/posts.js';
import { pagesData } from '../data/pages.js';

/**
 * Escape HTML special characters to prevent XSS
 * @param {string} text - The text to escape
 * @returns {string} The escaped text
 */
function escapeHtml(text) {
    if (!text) return text;
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.toString().replace(/[&<>"']/g, function (m) { return map[m]; });
}

class TerminalEmulator {
    constructor(outputElement, inputElement) {
        this.output = outputElement;
        this.input = inputElement;
        this.promptElement = document.getElementById('terminal-prompt');
        this.commandHistory = [];
        this.historyIndex = -1;
        this.maxHistoryLength = 100; // 命令歷史上限

        // 文章相關設定
        this.postsPerPage = 5;
        this.currentPage = 1;

        // 等待確認狀態
        this.pendingAction = null;

        this.commands = {
            'help': this.showHelp.bind(this),
            'about': this.showAbout.bind(this),
            'skills': this.showSkills.bind(this),
            'experience': this.showExperience.bind(this),
            'projects': this.showProjects.bind(this),
            'contact': this.showContact.bind(this),
            'blog': this.openBlog.bind(this),
            'github': this.openGithub.bind(this),
            'clear': this.clearScreen.bind(this),
            'welcome': this.showWelcome.bind(this),
            'welcome': this.showWelcome.bind(this),
            'pages': this.showPages.bind(this),
            'posts': this.showPosts.bind(this)
        };

        this.init();
    }

    init() {
        this.input.addEventListener('keydown', this.handleKeydown.bind(this));

        // 監聽輸入事件，實作單字元自動執行
        this.input.addEventListener('input', (e) => {
            if (this.pendingAction && e.target.value.length === 1) {
                // 等待確認狀態下，輸入單個字元後自動執行
                setTimeout(() => {
                    const command = this.input.value.trim();
                    if (command) {
                        // 顯示輸入的指令
                        this.addCommand(`$ frank ${this.input.value}`);
                        // 處理確認
                        this.handleConfirmation(command.toLowerCase());
                    }
                    this.input.value = '';
                    this.scrollToBottom();
                }, 200); // 200ms 延遲讓使用者看到輸入
            }
        });

        // 保持輸入框焦點
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.terminal-container')) return;
            this.input.focus();
        });

        // 初始歡迎訊息
        this.showWelcome();

        // 綁定開關事件
        this.bindEvents();

        // 強制初始狀態
        const container = document.querySelector('.terminal-container');
        const launcher = document.getElementById('terminal-launcher');
        if (container && launcher) {
            container.style.display = 'none';
            launcher.style.display = 'flex';

            // 啟動打字效果
            this.typeLauncherText();
        }
    }

    typeLauncherText() {
        const textElement = document.getElementById('launcher-text');
        if (!textElement) return;

        const text = '開啟終端機';
        let index = 0;
        textElement.textContent = '';

        const type = () => {
            if (index < text.length) {
                textElement.textContent += text.charAt(index);
                index++;
                setTimeout(type, 150); // 打字速度
            }
        };

        // 延遲一點開始打字，讓使用者注意到
        setTimeout(type, 300);
    }

    bindEvents() {
        const launcher = document.getElementById('terminal-launcher');
        const closeBtn = document.getElementById('terminal-close');
        const container = document.querySelector('.terminal-container');

        if (launcher) {
            launcher.addEventListener('click', () => this.openTerminal());
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeTerminal());
        }
    }

    openTerminal() {
        const launcher = document.getElementById('terminal-launcher');
        const container = document.querySelector('.terminal-container');

        if (launcher && container) {
            launcher.style.display = 'none';
            container.style.display = 'block';
            container.classList.remove('closing');
            container.classList.add('open');
            this.input.focus();
        }
    }

    closeTerminal() {
        const launcher = document.getElementById('terminal-launcher');
        const container = document.querySelector('.terminal-container');

        if (launcher && container) {
            container.classList.remove('open');
            container.classList.add('closing');

            // 等待動畫結束後隱藏
            setTimeout(() => {
                container.style.display = 'none';
                launcher.style.display = 'flex';
                container.classList.remove('closing');
            }, 300); // 對應 CSS 動畫時間
        }
    }

    handleKeydown(e) {
        if (e.key === 'Tab') {
            e.preventDefault(); // 阻止 Tab 預設行為
            this.handleTabCompletion();
            return;
        }

        if (e.key === 'Enter') {
            const command = this.input.value.trim();

            if (command) {
                // 顯示輸入的指令
                this.addCommand(`$ frank ${this.input.value}`);

                // 如果有等待確認的動作
                if (this.pendingAction) {
                    this.handleConfirmation(command.toLowerCase());
                } else {
                    // 執行指令
                    this.executeCommand(command.toLowerCase());

                    // 加入歷史記錄並限制長度
                    this.commandHistory.push(this.input.value);
                    if (this.commandHistory.length > this.maxHistoryLength) {
                        this.commandHistory.shift(); // 移除最舊記錄
                    }
                    this.historyIndex = this.commandHistory.length;
                }
            }

            this.input.value = '';
            this.scrollToBottom();
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (this.historyIndex > 0) {
                this.historyIndex--;
                this.input.value = this.commandHistory[this.historyIndex];
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (this.historyIndex < this.commandHistory.length - 1) {
                this.historyIndex++;
                this.input.value = this.commandHistory[this.historyIndex];
            } else {
                this.historyIndex = this.commandHistory.length;
                this.input.value = '';
            }
        }
    }

    executeCommand(command) {
        // 分割指令和參數
        const parts = command.split(' ');
        const mainCommand = parts[0];
        const args = parts.slice(1);



        // 處理 post [slug] 或 post [編號] 指令
        if (mainCommand === 'post' && args.length > 0) {
            const arg = args[0];
            if (!isNaN(arg)) {
                this.openPost(parseInt(arg));
            } else {
                this.openPostBySlug(arg);
            }
            return;
        }

        // 處理 pages 指令
        if (mainCommand === 'pages') {
            this.showPages();
            return;
        }

        // 處理 page [slug] 或 page [編號] 指令
        if (mainCommand === 'page' && args.length > 0) {
            const arg = args[0];
            if (!isNaN(arg)) {
                this.openPage(parseInt(arg));
            } else {
                this.openPageBySlug(arg);
            }
            return;
        }

        // 處理 open 指令或直接輸入數字
        if (mainCommand === 'open' || !isNaN(mainCommand)) {
            const postIndex = mainCommand === 'open' ? parseInt(args[0]) : parseInt(mainCommand);
            this.openPost(postIndex);
            return;
        }

        // 執行一般指令
        const cmd = this.commands[mainCommand];

        if (cmd) {
            cmd();
        } else {
            // Sanitize input to prevent XSS
            // Now addOutput defaults to textContent, so we can pass raw command safely
            this.addOutput(`指令不存在: ${command}`, 'error');
            this.addOutput(`輸入 'help' 查看可用指令`, 'output');
        }
    }

    safeOpen(url) {
        const newWindow = window.open(url, '_blank');
        if (newWindow) {
            newWindow.opener = null;
        }
    }

    addOutput(text, className = 'output', isHtml = false) {
        const div = document.createElement('div');
        div.className = className;
        if (isHtml) {
            div.innerHTML = text;
        } else {
            div.textContent = text;
        }
        this.output.appendChild(div);
    }

    addCommand(text) {
        const div = document.createElement('div');
        div.className = 'command';
        div.textContent = text;
        this.output.appendChild(div);
    }

    scrollToBottom() {
        this.output.scrollTop = this.output.scrollHeight;
    }

    handleConfirmation(input) {
        if (!this.pendingAction) {
            return;
        }

        if (input === 'y' || input === 'yes') {
            this.addOutput('確認開啟文章... <span class="success">✓</span>', 'output', true);
            // 在清除 pendingAction 前先儲存 URL
            const urlToOpen = this.pendingAction.url;
            this.pendingAction = null;
            this.resetNormalMode();

            setTimeout(() => {
                this.safeOpen(urlToOpen);
            }, 100);
        } else if (input === 'n' || input === 'no') {
            this.addOutput('<span class="terminal-text-muted">已取消開啟</span>', 'output', true);
            // 清除等待狀態並恢復正常模式
            this.pendingAction = null;
            this.resetNormalMode();
        } else {
            this.addOutput('<span class="error">請輸入 Y 或 n</span>', 'output', true);
            return; // 不清除 pendingAction，繼續等待輸入
        }
    }

    setConfirmationMode(question) {
        // 改變 prompt 顯示和樣式
        this.promptElement.textContent = `${question} [Y/n]:`;
        this.promptElement.classList.add('waiting-confirmation');

        // 改變輸入框
        this.input.placeholder = '輸入 Y 或 n';
        this.input.maxLength = 1;
    }

    resetNormalMode() {
        // 恢復 prompt
        this.promptElement.textContent = '$ frank';
        this.promptElement.classList.remove('waiting-confirmation');

        // 恢復輸入框
        this.input.placeholder = '輸入 help 查看指令';
        this.input.removeAttribute('maxLength');
    }

    handleTabCompletion() {
        const input = this.input.value.trim();
        const parts = input.split(' ');

        // 只處理 post 和 page 指令的補全
        if (parts[0] !== 'post' && parts[0] !== 'page') {
            return;
        }

        const commandType = parts[0];
        // 取得部分輸入的 slug
        const partialSlug = parts[1] || '';

        let matchingSlugs = [];

        if (commandType === 'post') {
            // 從 postsData 篩選匹配的 slug，限制最新 10 篇
            matchingSlugs = postsData.posts
                .slice(0, 10) // 只取前 10 篇（最新的）
                .map(post => post.slug)
                .filter(slug => slug.startsWith(partialSlug));
        } else if (commandType === 'page') {
            // 從 pagesData 篩選匹配的 slug
            matchingSlugs = pagesData.pages
                .map(page => page.slug)
                .filter(slug => slug.startsWith(partialSlug));
        }

        if (matchingSlugs.length === 0) {
            this.addOutput('<span class="terminal-text-muted">沒有匹配的文章</span>', 'output', true);
            this.scrollToBottom();
        } else if (matchingSlugs.length === 1) {
            // 只有一個匹配項，自動補全到輸入框
            this.input.value = `${commandType} ${matchingSlugs[0]}`;
        } else {
            // 多個匹配項，顯示列表
            this.showCompletionList(matchingSlugs);
            this.scrollToBottom();
        }
    }

    showCompletionList(items) {
        // 計算最長項目的長度
        const maxLength = Math.max(...items.map(item => item.length));
        const columnWidth = maxLength + 4; // 加上間距
        const itemsPerRow = Math.floor(70 / columnWidth) || 2; // 根據終端機寬度計算

        let output = '<div class="terminal-section-title">';

        for (let i = 0; i < items.length; i++) {
            // 填充空格使每個項目等寬
            const safeItem = escapeHtml(items[i]);
            const paddedItem = safeItem.padEnd(columnWidth, ' ');
            output += `<span class="terminal-completion-item">${paddedItem}</span>`;

            // 換行處理
            if ((i + 1) % itemsPerRow === 0) {
                output += '\n';
            }
        }

        output += '</div>';
        this.addOutput(output, 'output', true);
    }

    // 指令實作

    showWelcome() {
        this.addOutput('歡迎來到 Frank 的終端機！', 'welcome');
        this.addOutput('輸入 <span class="highlight">help</span> 查看可用指令', 'output', true);
    }

    showHelp() {
        const helpText = `<div class="highlight">可用指令：</div>
<div>
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
</div>`;
        this.addOutput(helpText, 'output', true);
    }

    showAbout() {
        const aboutText = `<div class="highlight">關於我</div>
<div class="terminal-list-item">
嗨！我是 Haunchen，一名系統整合工程師與技術愛好者。<br>
熱衷於探索新技術、自動化流程，以及打造有趣的專案。<br>
喜歡透過程式碼解決問題，並分享學習心得。
</div>`;
        this.addOutput(aboutText, 'output', true);
    }

    showSkills() {
        const skillsText = `<div class="highlight">技能標籤</div>
<div class="terminal-list-item">
<span class="success">▪</span> Python · JavaScript · HTML/CSS<br>
<span class="success">▪</span> Docker · Git · Linux<br>
<span class="success">▪</span> 系統整合 · 自動化 · API 開發<br>
<span class="success">▪</span> n8n · Workflow Automation
</div>`;
        this.addOutput(skillsText, 'output', true);
    }

    showExperience() {
        const expText = `<div class="highlight">工作經歷</div>
<div class="terminal-list-item">
<div><span class="success">▪</span> 系統整合工程師</div>
<div class="terminal-text-muted">
負責系統整合、自動化流程開發與維護
</div>
</div>`;
        this.addOutput(expText, 'output', true);
    }

    showProjects() {
        const projectsText = `<div class="highlight">專案作品</div>
<div class="terminal-list-item">
請向下滾動查看完整的專案作品集 ↓<br>
或輸入 <span class="highlight">blog</span> 查看更多技術文章
</div>`;
        this.addOutput(projectsText, 'output', true);

        // 滾動到專案區
        const projectsSection = document.querySelector('#portfolio');
        if (projectsSection) {
            projectsSection.scrollIntoView({ behavior: 'smooth' });
        }
    }

    showContact() {
        const contactText = `<div class="highlight">聯絡資訊</div>
<div class="terminal-list-item">
正在導航到聯絡區域... <span class="success">✓</span>
</div>`;
        this.addOutput(contactText, 'output', true);

        // 滾動到聯絡區
        const contactSection = document.querySelector('#contact');
        if (contactSection) {
            contactSection.scrollIntoView({ behavior: 'smooth' });
        }
    }

    openBlog() {
        this.addOutput('正在前往部落格... <span class="success">✓</span>', 'output', true);
        this.safeOpen('https://www.haunchen.tw');
    }

    openGithub() {
        this.addOutput('正在前往 GitHub... <span class="success">✓</span>', 'output', true);
        this.safeOpen('https://github.com/haunchen');
    }

    clearScreen() {
        this.output.innerHTML = '';
        this.showWelcome();
    }

    showPosts() {
        if (!postsData || !postsData.posts || postsData.posts.length === 0) {
            this.addOutput('目前沒有文章', 'error');
            return;
        }

        // 只取最新的 10 篇文章
        const recentPosts = postsData.posts.slice(0, 10);
        const totalPosts = recentPosts.length;

        // 顯示標題
        this.addOutput(`<div class="highlight">最新部落格文章列表 (顯示前 ${totalPosts} 篇)</div>`, 'output', true);
        this.addOutput('<div class="terminal-list-item">', 'output', true);

        // 顯示文章列表
        recentPosts.forEach((post, index) => {
            const globalIndex = index + 1;
            const safeTitle = escapeHtml(post.title);
            const safeSlug = escapeHtml(post.slug);
            const postLine = `<div><span class="highlight">[${globalIndex}]</span> ${safeTitle} - ${safeSlug} <span class="terminal-text-dim">(${post.published})</span></div>`;
            this.addOutput(postLine, 'output', true);
        });

        this.addOutput('</div>', 'output', true);
        this.addOutput('<div class="terminal-list-item terminal-text-muted">輸入 <span class="highlight">post [slug]</span> 或 <span class="highlight">post [編號]</span> 開啟文章</div>', 'output', true);
    }

    openPost(index) {
        if (!postsData || !postsData.posts || postsData.posts.length === 0) {
            this.addOutput('目前沒有文章', 'error');
            return;
        }

        // 驗證編號
        if (isNaN(index) || index < 1 || index > postsData.posts.length) {
            this.addOutput(`編號無效。請輸入 1 到 ${postsData.posts.length} 之間的數字`, 'error');
            return;
        }

        // 註：postsData.posts 已按 WordPress ID 降序排列
        // 編號 1 = 陣列索引 0 = ID 最大（最新文章）
        const post = postsData.posts[index - 1];
        const safeTitle = escapeHtml(post.title);
        this.addOutput(`正在開啟文章 [${index}] ${safeTitle}... <span class="success">✓</span>`, 'output', true);

        setTimeout(() => {
            this.safeOpen(post.url);
        }, 100);
    }

    openPostBySlug(slug) {
        if (!postsData || !postsData.posts || postsData.posts.length === 0) {
            this.addOutput('目前沒有文章', 'error');
            return;
        }

        // 根據 slug 查找文章
        const post = postsData.posts.find(p => p.slug === slug);

        if (!post) {
            const safeSlug = escapeHtml(slug);
            this.addOutput(`找不到 slug 為 "${safeSlug}" 的文章`, 'error');
            return;
        }

        // 顯示文章資訊
        const safeTitle = escapeHtml(post.title);
        this.addOutput(`<div class="highlight">找到文章：</div>`, 'output', true);
        this.addOutput(`<div class="terminal-list-item">標題: ${safeTitle}</div>`, 'output', true);
        this.addOutput(`<div>發布日期: ${post.published}</div>`, 'output', true);
        this.addOutput(`<div>連結: <span class="terminal-link">${post.url}</span></div>`, 'output', true);

        // 設定等待確認狀態
        this.pendingAction = {
            title: post.title,
            url: post.url
        };

        // 切換到確認模式
        this.setConfirmationMode(`是否開啟「${escapeHtml(post.title)}」？`);
    }

    showPages() {
        if (!pagesData || !pagesData.pages || pagesData.pages.length === 0) {
            this.addOutput('目前沒有頁面', 'error');
            return;
        }

        const totalPagesCount = pagesData.pages.length;

        // 顯示標題
        this.addOutput(`<div class="highlight">頁面列表 (共 ${totalPagesCount} 頁)</div>`, 'output', true);
        this.addOutput('<div class="terminal-list-item">', 'output', true);

        // 顯示頁面列表
        pagesData.pages.forEach((pageItem, index) => {
            const globalIndex = index + 1;
            const safeTitle = escapeHtml(pageItem.title);
            const safeSlug = escapeHtml(pageItem.slug);
            const pageLine = `<div><span class="highlight">[${globalIndex}]</span> ${safeTitle} - ${safeSlug} <span class="terminal-text-dim">(${pageItem.published})</span></div>`;
            this.addOutput(pageLine, 'output', true);
        });

        this.addOutput('</div>', 'output', true);
        this.addOutput('<div class="terminal-list-item terminal-text-muted">輸入 <span class="highlight">page [slug]</span> 或 <span class="highlight">page [編號]</span> 開啟頁面</div>', 'output', true);
    }

    openPage(index) {
        if (!pagesData || !pagesData.pages || pagesData.pages.length === 0) {
            this.addOutput('目前沒有頁面', 'error');
            return;
        }

        // 驗證編號
        if (isNaN(index) || index < 1 || index > pagesData.pages.length) {
            this.addOutput(`編號無效。請輸入 1 到 ${pagesData.pages.length} 之間的數字`, 'error');
            return;
        }

        const page = pagesData.pages[index - 1];
        const safeTitle = escapeHtml(page.title);
        this.addOutput(`正在開啟頁面 [${index}] ${safeTitle}... <span class="success">✓</span>`, 'output', true);

        setTimeout(() => {
            this.safeOpen(page.link);
        }, 100);
    }

    openPageBySlug(slug) {
        if (!pagesData || !pagesData.pages || pagesData.pages.length === 0) {
            this.addOutput('目前沒有頁面', 'error');
            return;
        }

        // 根據 slug 查找頁面
        const page = pagesData.pages.find(p => p.slug === slug);

        if (!page) {
            const safeSlug = escapeHtml(slug);
            this.addOutput(`找不到 slug 為 "${safeSlug}" 的頁面`, 'error');
            return;
        }

        // 顯示頁面資訊
        const safeTitle = escapeHtml(page.title);
        this.addOutput(`<div class="highlight">找到頁面：</div>`, 'output', true);
        this.addOutput(`<div class="terminal-list-item">標題: ${safeTitle}</div>`, 'output', true);
        this.addOutput(`<div>發布日期: ${page.published}</div>`, 'output', true);
        this.addOutput(`<div>連結: <span class="terminal-link">${page.link}</span></div>`, 'output', true);

        // 設定等待確認狀態
        this.pendingAction = {
            title: page.title,
            url: page.link
        };

        // 切換到確認模式
        this.setConfirmationMode(`是否開啟「${escapeHtml(page.title)}」？`);
    }
}

// 初始化終端機
document.addEventListener('DOMContentLoaded', () => {
    const outputElement = document.getElementById('terminal-output');
    const inputElement = document.getElementById('command-input');

    if (outputElement && inputElement) {
        new TerminalEmulator(outputElement, inputElement);

        // 自動聚焦輸入框
        inputElement.focus();
    }
});

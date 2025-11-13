/**
 * Terminal Emulator for Personal Website
 * Interactive command-line interface
 */

import { postsData } from '../data/posts.js';

class TerminalEmulator {
    constructor(outputElement, inputElement) {
        this.output = outputElement;
        this.input = inputElement;
        this.promptElement = document.getElementById('terminal-prompt');
        this.commandHistory = [];
        this.historyIndex = -1;

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
            'welcome': this.showWelcome.bind(this)
        };

        this.init();
    }

    init() {
        this.input.addEventListener('keydown', this.handleKeydown.bind(this));

        // 監聽輸入事件，實作單字元自動執行
        this.input.addEventListener('input', (e) => {
            if (this.pendingAction && e.target.value.length === 1) {
                // 等待確認狀態下，輸入單個字元後自動觸發 Enter
                setTimeout(() => {
                    const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
                    this.input.dispatchEvent(enterEvent);
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
                this.addOutput(`$ frank ${this.input.value}`, 'command');

                // 如果有等待確認的動作
                if (this.pendingAction) {
                    this.handleConfirmation(command.toLowerCase());
                } else {
                    // 執行指令
                    this.executeCommand(command.toLowerCase());

                    // 加入歷史記錄
                    this.commandHistory.push(this.input.value);
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

        // 處理 posts 指令
        if (mainCommand === 'posts') {
            const page = args[0] ? parseInt(args[0]) : 1;
            this.showPosts(page);
            return;
        }

        // 處理 post [slug] 指令
        if (mainCommand === 'post' && args.length > 0) {
            const slug = args[0];
            this.openPostBySlug(slug);
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
            this.addOutput(`指令不存在: ${command}`, 'error');
            this.addOutput(`輸入 'help' 查看可用指令`, 'output');
        }
    }

    addOutput(text, className = 'output') {
        const div = document.createElement('div');
        div.className = className;
        div.innerHTML = text;
        this.output.appendChild(div);
    }

    scrollToBottom() {
        this.output.scrollTop = this.output.scrollHeight;
    }

    handleConfirmation(input) {
        if (!this.pendingAction) return;

        if (input === 'y' || input === 'yes') {
            this.addOutput('確認開啟文章... <span class="success">✓</span>', 'output');
            setTimeout(() => {
                window.open(this.pendingAction.url, '_blank');
            }, 300);
        } else if (input === 'n' || input === 'no') {
            this.addOutput('<span style="color: rgba(255,255,255,0.6);">已取消開啟</span>', 'output');
        } else {
            this.addOutput('<span class="error">請輸入 Y 或 n</span>', 'output');
            return; // 不清除 pendingAction，繼續等待輸入
        }

        // 清除等待狀態並恢復正常模式
        this.pendingAction = null;
        this.resetNormalMode();
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

        // 只處理 post 指令的補全
        if (parts[0] !== 'post') {
            return;
        }

        // 取得部分輸入的 slug
        const partialSlug = parts[1] || '';

        // 從 postsData 篩選匹配的 slug，限制最新 10 篇
        const matchingSlugs = postsData.posts
            .slice(0, 10) // 只取前 10 篇（最新的）
            .map(post => post.slug)
            .filter(slug => slug.startsWith(partialSlug));

        if (matchingSlugs.length === 0) {
            this.addOutput('<span style="color: rgba(255,255,255,0.6);">沒有匹配的文章</span>', 'output');
            this.scrollToBottom();
        } else if (matchingSlugs.length === 1) {
            // 只有一個匹配項，自動補全到輸入框
            this.input.value = `post ${matchingSlugs[0]}`;
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

        let output = '<div style="margin-top: 0.5rem; font-family: \'Courier New\', monospace; white-space: pre; line-height: 1.8;">';

        for (let i = 0; i < items.length; i++) {
            // 填充空格使每個項目等寬
            const paddedItem = items[i].padEnd(columnWidth, ' ');
            output += `<span style="color: #fb923c;">${paddedItem}</span>`;

            // 換行處理
            if ((i + 1) % itemsPerRow === 0) {
                output += '\n';
            }
        }

        output += '</div>';
        this.addOutput(output, 'output');
    }

    // 指令實作

    showWelcome() {
        this.addOutput('歡迎來到 Frank 的終端機！', 'welcome');
        this.addOutput('輸入 <span class="highlight">help</span> 查看可用指令', 'output');
    }

    showHelp() {
        const helpText = `<div class="highlight">可用指令：</div>
<div>
<div><span class="highlight">about</span>      - 關於我</div>
<div><span class="highlight">skills</span>     - 技能清單</div>
<div><span class="highlight">experience</span> - 工作經歷</div>
<div><span class="highlight">projects</span>   - 專案作品</div>
<div><span class="highlight">contact</span>    - 聯絡資訊</div>
<div><span class="highlight">posts</span>      - 顯示部落格文章列表</div>
<div><span class="highlight">posts [頁碼]</span> - 顯示指定頁面的文章</div>
<div><span class="highlight">post [slug]</span> - 用 slug 開啟文章（會先詢問）</div>
<div><span class="highlight">blog</span>       - 前往部落格</div>
<div><span class="highlight">github</span>     - 前往 GitHub</div>
<div><span class="highlight">clear</span>      - 清除畫面</div>
</div>`;
        this.addOutput(helpText, 'output');
    }

    showAbout() {
        const aboutText = `<div class="highlight">關於我</div>
<div style="margin-top: 0.5rem;">
嗨！我是 Haunchen，一名系統整合工程師與技術愛好者。<br>
熱衷於探索新技術、自動化流程，以及打造有趣的專案。<br>
喜歡透過程式碼解決問題，並分享學習心得。
</div>`;
        this.addOutput(aboutText, 'output');
    }

    showSkills() {
        const skillsText = `<div class="highlight">技能標籤</div>
<div style="margin-top: 0.5rem;">
<span class="success">▪</span> Python · JavaScript · HTML/CSS<br>
<span class="success">▪</span> Docker · Git · Linux<br>
<span class="success">▪</span> 系統整合 · 自動化 · API 開發<br>
<span class="success">▪</span> n8n · Workflow Automation
</div>`;
        this.addOutput(skillsText, 'output');
    }

    showExperience() {
        const expText = `<div class="highlight">工作經歷</div>
<div style="margin-top: 0.5rem;">
<div><span class="success">▪</span> 系統整合工程師</div>
<div style="color: rgba(255,255,255,0.6);">
負責系統整合、自動化流程開發與維護
</div>
</div>`;
        this.addOutput(expText, 'output');
    }

    showProjects() {
        const projectsText = `<div class="highlight">專案作品</div>
<div style="margin-top: 0.5rem;">
請向下滾動查看完整的專案作品集 ↓<br>
或輸入 <span class="highlight">blog</span> 查看更多技術文章
</div>`;
        this.addOutput(projectsText, 'output');

        // 滾動到專案區
        setTimeout(() => {
            const projectsSection = document.querySelector('#portfolio');
            if (projectsSection) {
                projectsSection.scrollIntoView({ behavior: 'smooth' });
            }
        }, 500);
    }

    showContact() {
        const contactText = `<div class="highlight">聯絡資訊</div>
<div style="margin-top: 0.5rem;">
正在導航到聯絡區域... <span class="success">✓</span>
</div>`;
        this.addOutput(contactText, 'output');

        // 滾動到聯絡區
        setTimeout(() => {
            const contactSection = document.querySelector('#contact');
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
            }
        }, 500);
    }

    openBlog() {
        this.addOutput('正在前往部落格... <span class="success">✓</span>', 'output');
        setTimeout(() => {
            window.open('https://www.haunchen.tw', '_blank');
        }, 500);
    }

    openGithub() {
        this.addOutput('正在前往 GitHub... <span class="success">✓</span>', 'output');
        setTimeout(() => {
            window.open('https://github.com/haunchen', '_blank');
        }, 500);
    }

    clearScreen() {
        this.output.innerHTML = '';
        this.showWelcome();
    }

    showPosts(page = 1) {
        if (!postsData || !postsData.posts || postsData.posts.length === 0) {
            this.addOutput('目前沒有文章', 'error');
            return;
        }

        const totalPosts = postsData.posts.length;
        const totalPages = Math.ceil(totalPosts / this.postsPerPage);

        // 驗證頁碼
        if (page < 1 || page > totalPages) {
            this.addOutput(`頁碼超出範圍。共有 ${totalPages} 頁`, 'error');
            return;
        }

        const startIndex = (page - 1) * this.postsPerPage;
        const endIndex = Math.min(startIndex + this.postsPerPage, totalPosts);
        const postsToShow = postsData.posts.slice(startIndex, endIndex);

        // 顯示標題
        this.addOutput(`<div class="highlight">部落格文章列表 (第 ${page}/${totalPages} 頁，共 ${totalPosts} 篇)</div>`, 'output');
        this.addOutput('<div style="margin-top: 0.5rem;">', 'output');

        // 顯示文章列表
        postsToShow.forEach((post, index) => {
            const globalIndex = startIndex + index + 1;
            const postLine = `<div><span class="highlight">[${globalIndex}]</span> ${post.title} - ${post.slug} <span style="color: rgba(255,255,255,0.5);">(${post.published})</span></div>`;
            this.addOutput(postLine, 'output');
        });

        this.addOutput('</div>', 'output');

        // 顯示導航提示
        if (totalPages > 1) {
            let navText = '<div style="margin-top: 0.5rem; color: rgba(255,255,255,0.6);">';
            if (page > 1) {
                navText += `上一頁: <span class="highlight">posts ${page - 1}</span>`;
            }
            if (page < totalPages) {
                if (page > 1) navText += ' | ';
                navText += `下一頁: <span class="highlight">posts ${page + 1}</span>`;
            }
            navText += '</div>';
            this.addOutput(navText, 'output');
        }

        this.addOutput('<div style="margin-top: 0.5rem; color: rgba(255,255,255,0.6);">輸入 <span class="highlight">open [編號]</span> 或直接輸入 <span class="highlight">[編號]</span> 開啟文章</div>', 'output');

        this.currentPage = page;
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

        const post = postsData.posts[index - 1];
        this.addOutput(`正在開啟文章 [${index}] ${post.title}... <span class="success">✓</span>`, 'output');

        setTimeout(() => {
            window.open(post.url, '_blank');
        }, 500);
    }

    openPostBySlug(slug) {
        if (!postsData || !postsData.posts || postsData.posts.length === 0) {
            this.addOutput('目前沒有文章', 'error');
            return;
        }

        // 根據 slug 查找文章
        const post = postsData.posts.find(p => p.slug === slug);

        if (!post) {
            this.addOutput(`找不到 slug 為 "${slug}" 的文章`, 'error');
            return;
        }

        // 顯示文章資訊
        this.addOutput(`<div class="highlight">找到文章：</div>`, 'output');
        this.addOutput(`<div style="margin-top: 0.5rem;">標題: ${post.title}</div>`, 'output');
        this.addOutput(`<div>發布日期: ${post.published}</div>`, 'output');
        this.addOutput(`<div>連結: <span style="color: rgba(251,146,60,0.7);">${post.url}</span></div>`, 'output');

        // 設定等待確認狀態
        this.pendingAction = {
            title: post.title,
            url: post.url
        };

        // 切換到確認模式
        this.setConfirmationMode(`是否開啟「${post.title}」？`);
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

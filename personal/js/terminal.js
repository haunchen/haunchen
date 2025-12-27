/**
 * Terminal Emulator for Personal Website
 * Interactive command-line interface with i18n support
 */

import { postsData } from '../data/posts.js';
import { pagesData } from '../data/pages.js';

// 靜態載入所有翻譯檔
import { i18n as zhTW } from '../data/i18n/zh-TW.js';
import { i18n as en } from '../data/i18n/en.js';

// 偵測語言並選擇對應翻譯
const isEnglish = document.documentElement.lang.startsWith('en');
const t = isEnglish ? en.terminal : zhTW.terminal;

/**
 * 格式化翻譯字串，替換變數
 * @param {string} template - 模板字串，如 "Hello {name}"
 * @param {object} vars - 變數物件，如 { name: "Frank" }
 * @returns {string} 格式化後的字串
 */
function format(template, vars = {}) {
    return template.replace(/\{(\w+)\}/g, (match, key) => {
        return vars[key] !== undefined ? vars[key] : match;
    });
}

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
        this.maxHistoryLength = 100;

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
                setTimeout(() => {
                    const command = this.input.value.trim();
                    if (command) {
                        this.addCommand(`$ frank ${this.input.value}`);
                        this.handleConfirmation(command.toLowerCase());
                    }
                    this.input.value = '';
                    this.scrollToBottom();
                }, 200);
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
            this.typeLauncherText();
        }
    }

    typeLauncherText() {
        const textElement = document.getElementById('launcher-text');
        if (!textElement) return;

        const text = t.launcherText;
        let index = 0;
        textElement.textContent = '';

        const type = () => {
            if (index < text.length) {
                textElement.textContent += text.charAt(index);
                index++;
                setTimeout(type, 150);
            }
        };

        setTimeout(type, 300);
    }

    bindEvents() {
        const launcher = document.getElementById('terminal-launcher');
        const closeBtn = document.getElementById('terminal-close');

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

            setTimeout(() => {
                container.style.display = 'none';
                launcher.style.display = 'flex';
                container.classList.remove('closing');
            }, 300);
        }
    }

    handleKeydown(e) {
        if (e.key === 'Tab') {
            e.preventDefault();
            this.handleTabCompletion();
            return;
        }

        if (e.key === 'Enter') {
            const command = this.input.value.trim();

            if (command) {
                this.addCommand(`$ frank ${this.input.value}`);

                if (this.pendingAction) {
                    this.handleConfirmation(command.toLowerCase());
                } else {
                    this.executeCommand(command.toLowerCase());
                    this.commandHistory.push(this.input.value);
                    if (this.commandHistory.length > this.maxHistoryLength) {
                        this.commandHistory.shift();
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
            this.addOutput(`${t.commandNotFound} ${command}`, 'error');
            this.addOutput(t.typeHelp, 'output');
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
            this.addOutput(t.confirmOpening, 'output', true);
            const urlToOpen = this.pendingAction.url;
            this.pendingAction = null;
            this.resetNormalMode();

            setTimeout(() => {
                this.safeOpen(urlToOpen);
            }, 100);
        } else if (input === 'n' || input === 'no') {
            this.addOutput(t.cancelled, 'output', true);
            this.pendingAction = null;
            this.resetNormalMode();
        } else {
            this.addOutput(t.enterYN, 'output', true);
            return;
        }
    }

    setConfirmationMode(question) {
        this.promptElement.textContent = `${question} [Y/n]:`;
        this.promptElement.classList.add('waiting-confirmation');
        this.input.placeholder = t.confirmPlaceholder;
        this.input.maxLength = 1;
    }

    resetNormalMode() {
        this.promptElement.textContent = '$ frank';
        this.promptElement.classList.remove('waiting-confirmation');
        this.input.placeholder = t.inputPlaceholder;
        this.input.removeAttribute('maxLength');
    }

    handleTabCompletion() {
        const input = this.input.value.trim();
        const parts = input.split(' ');

        if (parts[0] !== 'post' && parts[0] !== 'page') {
            return;
        }

        const commandType = parts[0];
        const partialSlug = parts[1] || '';

        let matchingSlugs = [];

        if (commandType === 'post') {
            matchingSlugs = postsData.posts
                .slice(0, 10)
                .map(post => post.slug)
                .filter(slug => slug.startsWith(partialSlug));
        } else if (commandType === 'page') {
            matchingSlugs = pagesData.pages
                .map(page => page.slug)
                .filter(slug => slug.startsWith(partialSlug));
        }

        if (matchingSlugs.length === 0) {
            this.addOutput(`<span class="terminal-text-muted">${t.noMatch}</span>`, 'output', true);
            this.scrollToBottom();
        } else if (matchingSlugs.length === 1) {
            this.input.value = `${commandType} ${matchingSlugs[0]}`;
        } else {
            this.showCompletionList(matchingSlugs);
            this.scrollToBottom();
        }
    }

    showCompletionList(items) {
        const maxLength = Math.max(...items.map(item => item.length));
        const columnWidth = maxLength + 4;
        const itemsPerRow = Math.floor(70 / columnWidth) || 2;

        let output = '<div class="terminal-section-title">';

        for (let i = 0; i < items.length; i++) {
            const safeItem = escapeHtml(items[i]);
            const paddedItem = safeItem.padEnd(columnWidth, ' ');
            output += `<span class="terminal-completion-item">${paddedItem}</span>`;

            if ((i + 1) % itemsPerRow === 0) {
                output += '\n';
            }
        }

        output += '</div>';
        this.addOutput(output, 'output', true);
    }

    // 指令實作

    showWelcome() {
        this.addOutput(t.welcome, 'welcome');
        this.addOutput(t.welcomeHint, 'output', true);
    }

    showHelp() {
        const helpText = t.help.title + t.help.commands;
        this.addOutput(helpText, 'output', true);
    }

    showAbout() {
        const aboutText = t.about.title + t.about.content;
        this.addOutput(aboutText, 'output', true);
    }

    showSkills() {
        const skillsText = t.skills.title + t.skills.content;
        this.addOutput(skillsText, 'output', true);
    }

    showExperience() {
        const expText = t.experience.title + t.experience.content;
        this.addOutput(expText, 'output', true);
    }

    showProjects() {
        const projectsText = t.projects.title + t.projects.content;
        this.addOutput(projectsText, 'output', true);

        const projectsSection = document.querySelector('#portfolio');
        if (projectsSection) {
            projectsSection.scrollIntoView({ behavior: 'smooth' });
        }
    }

    showContact() {
        const contactText = t.contact.title + t.contact.content;
        this.addOutput(contactText, 'output', true);

        const contactSection = document.querySelector('#contact');
        if (contactSection) {
            contactSection.scrollIntoView({ behavior: 'smooth' });
        }
    }

    openBlog() {
        this.addOutput(t.navigatingBlog, 'output', true);
        this.safeOpen('https://www.frankchen.tw');
    }

    openGithub() {
        this.addOutput(t.navigatingGithub, 'output', true);
        this.safeOpen('https://github.com/haunchen');
    }

    clearScreen() {
        this.output.innerHTML = '';
        this.showWelcome();
    }

    showPosts() {
        if (!postsData || !postsData.posts || postsData.posts.length === 0) {
            this.addOutput(t.noPosts, 'error');
            return;
        }

        const recentPosts = postsData.posts.slice(0, 10);
        const totalPosts = recentPosts.length;

        this.addOutput(`<div class="highlight">${format(t.postsListTitle, { count: totalPosts })}</div>`, 'output', true);
        this.addOutput('<div class="terminal-list-item">', 'output', true);

        recentPosts.forEach((post, index) => {
            const globalIndex = index + 1;
            const safeTitle = escapeHtml(post.title);
            const safeSlug = escapeHtml(post.slug);
            const postLine = `<div><span class="highlight">[${globalIndex}]</span> ${safeTitle} - ${safeSlug} <span class="terminal-text-dim">(${post.published})</span></div>`;
            this.addOutput(postLine, 'output', true);
        });

        this.addOutput('</div>', 'output', true);
        this.addOutput(`<div class="terminal-list-item terminal-text-muted">${t.postsHint}</div>`, 'output', true);
    }

    openPost(index) {
        if (!postsData || !postsData.posts || postsData.posts.length === 0) {
            this.addOutput(t.noPosts, 'error');
            return;
        }

        if (isNaN(index) || index < 1 || index > postsData.posts.length) {
            this.addOutput(format(t.invalidPostNumber, { max: postsData.posts.length }), 'error');
            return;
        }

        const post = postsData.posts[index - 1];
        const safeTitle = escapeHtml(post.title);
        this.addOutput(format(t.openingPost, { index, title: safeTitle }), 'output', true);

        setTimeout(() => {
            this.safeOpen(post.url);
        }, 100);
    }

    openPostBySlug(slug) {
        if (!postsData || !postsData.posts || postsData.posts.length === 0) {
            this.addOutput(t.noPosts, 'error');
            return;
        }

        const post = postsData.posts.find(p => p.slug === slug);

        if (!post) {
            const safeSlug = escapeHtml(slug);
            this.addOutput(format(t.postNotFound, { slug: safeSlug }), 'error');
            return;
        }

        const safeTitle = escapeHtml(post.title);
        this.addOutput(t.foundPost, 'output', true);
        this.addOutput(`<div class="terminal-list-item">${t.titleLabel} ${safeTitle}</div>`, 'output', true);
        this.addOutput(`<div>${t.dateLabel} ${post.published}</div>`, 'output', true);
        this.addOutput(`<div>${t.linkLabel} <span class="terminal-link">${post.url}</span></div>`, 'output', true);

        this.pendingAction = {
            title: post.title,
            url: post.url
        };

        this.setConfirmationMode(format(t.confirmOpen, { title: escapeHtml(post.title) }));
    }

    showPages() {
        if (!pagesData || !pagesData.pages || pagesData.pages.length === 0) {
            this.addOutput(t.noPages, 'error');
            return;
        }

        const totalPagesCount = pagesData.pages.length;

        this.addOutput(`<div class="highlight">${format(t.pagesListTitle, { count: totalPagesCount })}</div>`, 'output', true);
        this.addOutput('<div class="terminal-list-item">', 'output', true);

        pagesData.pages.forEach((pageItem, index) => {
            const globalIndex = index + 1;
            const safeTitle = escapeHtml(pageItem.title);
            const safeSlug = escapeHtml(pageItem.slug);
            const pageLine = `<div><span class="highlight">[${globalIndex}]</span> ${safeTitle} - ${safeSlug} <span class="terminal-text-dim">(${pageItem.published})</span></div>`;
            this.addOutput(pageLine, 'output', true);
        });

        this.addOutput('</div>', 'output', true);
        this.addOutput(`<div class="terminal-list-item terminal-text-muted">${t.pagesHint}</div>`, 'output', true);
    }

    openPage(index) {
        if (!pagesData || !pagesData.pages || pagesData.pages.length === 0) {
            this.addOutput(t.noPages, 'error');
            return;
        }

        if (isNaN(index) || index < 1 || index > pagesData.pages.length) {
            this.addOutput(format(t.invalidPageNumber, { max: pagesData.pages.length }), 'error');
            return;
        }

        const page = pagesData.pages[index - 1];
        const safeTitle = escapeHtml(page.title);
        this.addOutput(format(t.openingPage, { index, title: safeTitle }), 'output', true);

        setTimeout(() => {
            this.safeOpen(page.link);
        }, 100);
    }

    openPageBySlug(slug) {
        if (!pagesData || !pagesData.pages || pagesData.pages.length === 0) {
            this.addOutput(t.noPages, 'error');
            return;
        }

        const page = pagesData.pages.find(p => p.slug === slug);

        if (!page) {
            const safeSlug = escapeHtml(slug);
            this.addOutput(format(t.pageNotFound, { slug: safeSlug }), 'error');
            return;
        }

        const safeTitle = escapeHtml(page.title);
        this.addOutput(t.foundPage, 'output', true);
        this.addOutput(`<div class="terminal-list-item">${t.titleLabel} ${safeTitle}</div>`, 'output', true);
        this.addOutput(`<div>${t.dateLabel} ${page.published}</div>`, 'output', true);
        this.addOutput(`<div>${t.linkLabel} <span class="terminal-link">${page.link}</span></div>`, 'output', true);

        this.pendingAction = {
            title: page.title,
            url: page.link
        };

        this.setConfirmationMode(format(t.confirmOpen, { title: escapeHtml(page.title) }));
    }
}

// 初始化終端機
document.addEventListener('DOMContentLoaded', () => {
    const outputElement = document.getElementById('terminal-output');
    const inputElement = document.getElementById('command-input');

    if (outputElement && inputElement) {
        new TerminalEmulator(outputElement, inputElement);
        inputElement.focus();
    }
});

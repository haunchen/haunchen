/**
 * Terminal Emulator for Personal Website
 * Interactive command-line interface
 */

class TerminalEmulator {
    constructor(outputElement, inputElement) {
        this.output = outputElement;
        this.input = inputElement;
        this.commandHistory = [];
        this.historyIndex = -1;

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

        // 保持輸入框焦點
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.terminal-container')) return;
            this.input.focus();
        });

        // 初始歡迎訊息
        this.showWelcome();
    }

    handleKeydown(e) {
        if (e.key === 'Enter') {
            const command = this.input.value.trim().toLowerCase();

            if (command) {
                // 顯示輸入的指令
                this.addOutput(`$ frank ${this.input.value}`, 'command');

                // 執行指令
                this.executeCommand(command);

                // 加入歷史記錄
                this.commandHistory.push(this.input.value);
                this.historyIndex = this.commandHistory.length;
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
        const cmd = this.commands[command];

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
            window.open('https://blog.haunchen.cc', '_blank');
        }, 500);
    }

    openGithub() {
        this.addOutput('正在前往 GitHub... <span class="success">✓</span>', 'output');
        setTimeout(() => {
            window.open('https://github.com/haun-chen', '_blank');
        }, 500);
    }

    clearScreen() {
        this.output.innerHTML = '';
        this.showWelcome();
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

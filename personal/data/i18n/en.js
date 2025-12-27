/**
 * English Translation File
 * Terminal Emulator i18n
 */

export const i18n = {
    terminal: {
        // Launcher
        launcherText: 'Open Terminal',

        // Welcome message
        welcome: "Welcome to Frank's Terminal!",
        welcomeHint: 'Type <span class="highlight">help</span> to see available commands',

        // Error messages
        commandNotFound: 'Command not found:',
        typeHelp: "Type 'help' to see available commands",
        noMatch: 'No matching articles',
        noPosts: 'No posts available',
        noPages: 'No pages available',
        invalidPostNumber: 'Invalid number. Please enter a number between 1 and {max}',
        invalidPageNumber: 'Invalid number. Please enter a number between 1 and {max}',
        postNotFound: 'Post with slug "{slug}" not found',
        pageNotFound: 'Page with slug "{slug}" not found',

        // Confirmation related
        confirmOpening: 'Opening article... <span class="success">✓</span>',
        cancelled: '<span class="terminal-text-muted">Cancelled</span>',
        enterYN: '<span class="error">Please enter Y or n</span>',
        confirmPlaceholder: 'Enter Y or n',
        inputPlaceholder: 'Type help for commands',
        confirmOpen: 'Open "{title}"?',

        // Action prompts
        openingPost: 'Opening post [{index}] {title}... <span class="success">✓</span>',
        openingPage: 'Opening page [{index}] {title}... <span class="success">✓</span>',
        navigatingBlog: 'Navigating to blog... <span class="success">✓</span>',
        navigatingGithub: 'Navigating to GitHub... <span class="success">✓</span>',

        // Post/Page info
        foundPost: '<div class="highlight">Post found:</div>',
        foundPage: '<div class="highlight">Page found:</div>',
        titleLabel: 'Title:',
        dateLabel: 'Published:',
        linkLabel: 'Link:',

        // List titles
        postsListTitle: 'Latest Blog Posts (showing {count} posts)',
        pagesListTitle: 'Pages List ({count} total)',
        postsHint: 'Type <span class="highlight">post [slug]</span> or <span class="highlight">post [number]</span> to open a post',
        pagesHint: 'Type <span class="highlight">page [slug]</span> or <span class="highlight">page [number]</span> to open a page',

        // Help command
        help: {
            title: '<div class="highlight">Available Commands:</div>',
            commands: `<div>
<div><span class="highlight">about</span>      - About me</div>
<div><span class="highlight">skills</span>     - Skills list</div>
<div><span class="highlight">experience</span> - Work experience</div>
<div><span class="highlight">projects</span>   - Project portfolio</div>
<div><span class="highlight">contact</span>    - Contact info</div>
<div><span class="highlight">posts</span>      - Show latest blog posts</div>
<div><span class="highlight">post [slug]</span> - Open post by slug (will confirm)</div>
<div><span class="highlight">blog</span>       - Go to blog</div>
<div><span class="highlight">github</span>     - Go to GitHub</div>
<div><span class="highlight">clear</span>      - Clear screen</div>
<div><span class="highlight">pages</span>      - Show pages list</div>
<div><span class="highlight">page [slug]</span>  - Open page by slug</div>
</div>`
        },

        // About command
        about: {
            title: '<div class="highlight">About Me</div>',
            content: `<div class="terminal-list-item">
Hi! I'm Haunchen, a System Integration Engineer and tech enthusiast.<br>
Passionate about exploring new technologies, automating workflows,<br>
and building interesting projects. I love solving problems through<br>
code and sharing what I learn.
</div>`
        },

        // Skills command
        skills: {
            title: '<div class="highlight">Skills</div>',
            content: `<div class="terminal-list-item">
<span class="success">▪</span> Python · JavaScript · HTML/CSS<br>
<span class="success">▪</span> Docker · Git · Linux<br>
<span class="success">▪</span> System Integration · Automation · API Development<br>
<span class="success">▪</span> n8n · Workflow Automation
</div>`
        },

        // Experience command
        experience: {
            title: '<div class="highlight">Work Experience</div>',
            content: `<div class="terminal-list-item">
<div><span class="success">▪</span> System Integration Engineer</div>
<div class="terminal-text-muted">
Responsible for system integration, automation workflow development and maintenance
</div>
</div>`
        },

        // Projects command
        projects: {
            title: '<div class="highlight">Projects</div>',
            content: `<div class="terminal-list-item">
Scroll down to see the complete portfolio ↓<br>
Or type <span class="highlight">blog</span> for more technical articles
</div>`
        },

        // Contact command
        contact: {
            title: '<div class="highlight">Contact</div>',
            content: `<div class="terminal-list-item">
Navigating to contact section... <span class="success">✓</span>
</div>`
        }
    }
};

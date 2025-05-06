document.addEventListener('DOMContentLoaded', function() {
    // Initialize terminal with custom theme
    const term = new Terminal({
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: 14,
        lineHeight: 1.5,
        cursorBlink: true,
        cursorStyle: 'block',
        theme: {
            background: '#1a1d21',
            foreground: '#ffffff',
            cursor: '#4ade80',
            selection: 'rgba(74, 222, 128, 0.3)',
            black: '#1a1d21',
            red: '#ef4444',
            green: '#4ade80',
            yellow: '#fbbf24',
            blue: '#60a5fa',
            magenta: '#c084fc',
            cyan: '#22d3ee',
            white: '#ffffff',
            brightBlack: '#4b5563',
            brightRed: '#f87171',
            brightGreen: '#86efac',
            brightYellow: '#fcd34d',
            brightBlue: '#93c5fd',
            brightMagenta: '#d8b4fe',
            brightCyan: '#67e8f9',
            brightWhite: '#ffffff'
        }
    });

    // Create and load addons
    const fitAddon = new FitAddon.FitAddon();
    const webLinksAddon = new WebLinksAddon.WebLinksAddon();
    const searchAddon = new SearchAddon.SearchAddon();

    term.loadAddon(fitAddon);
    term.loadAddon(webLinksAddon);
    term.loadAddon(searchAddon);

    // Open terminal in container
    term.open(document.getElementById('terminal-container'));
    fitAddon.fit();

    // Connect to backend WebSocket server
    const socket = io('http://localhost:3000');

    socket.on('connect', () => {
        term.writeln('\x1b[32mConnected to backend terminal server.\x1b[0m');
    });

    socket.on('terminal-output', (data) => {
        term.write(data);
    });

    socket.on('disconnect', () => {
        term.writeln('\x1b[31mDisconnected from backend terminal server.\x1b[0m');
    });

    // Send terminal input to backend
    term.onData(data => {
        socket.emit('terminal-input', data);
    });

    // Handle window resize
    window.addEventListener('resize', () => {
        fitAddon.fit();
    });

    // Handle OS selection change
    const osSelect = document.querySelector('select');
    osSelect.addEventListener('change', () => {
        term.writeln('');
        term.writeln(`\x1b[33mSwitching to ${osSelect.value}...\x1b[0m`);
        term.writeln('\x1b[31mNote: Pro features require a subscription\x1b[0m');
        term.writeln('');
        term.write('\x1b[32m$\x1b[0m ');
    });

    // Mobile menu toggle
    const mobileMenuButton = document.querySelector('button.md\\:hidden');
    const mobileMenu = document.createElement('div');
    mobileMenu.className = 'mobile-menu';
    mobileMenu.innerHTML = `
        <a href="/terminal.html">Terminal</a>
        <a href="https://desktop.interactiveshell.com">Desktop</a>
        <a href="/drive">IDE Drive</a>
        <a href="/pricing">Pricing</a>
        <a href="/training">Training</a>
        <a href="/blog">Blog</a>
        <a href="/about">About</a>
        <a href="/contact">Contact</a>
    `;
    document.body.appendChild(mobileMenu);

    mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (mobileMenu.classList.contains('active') && 
            !mobileMenu.contains(e.target) && 
            !mobileMenuButton.contains(e.target)) {
            mobileMenu.classList.remove('active');
        }
    });
});

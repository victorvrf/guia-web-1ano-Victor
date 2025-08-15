// Módulo de gerenciamento do tema
export function initTheme() {
    const themeToggle = document.querySelector('.theme-toggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Carrega o tema salvo ou usa a preferência do sistema
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.dataset.theme = savedTheme;
        updateThemeIcon(savedTheme === 'dark');
    } else if (prefersDarkScheme.matches) {
        document.documentElement.dataset.theme = 'dark';
        updateThemeIcon(true);
    }

    // Alterna o tema ao clicar no botão
    themeToggle.addEventListener('click', () => {
        const isDark = document.documentElement.dataset.theme === 'dark';
        document.documentElement.dataset.theme = isDark ? 'light' : 'dark';
        localStorage.setItem('theme', isDark ? 'light' : 'dark');
        updateThemeIcon(!isDark);
    });
}

// Atualiza o ícone do botão de tema
function updateThemeIcon(isDark) {
    const themeToggle = document.querySelector('.theme-toggle');
    themeToggle.textContent = isDark ? '☀️' : '🌙';
    themeToggle.setAttribute('aria-label', 
        isDark ? 'Mudar para tema claro' : 'Mudar para tema escuro');
}

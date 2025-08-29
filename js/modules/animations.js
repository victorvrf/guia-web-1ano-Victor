// Módulo de Animações e Funcionalidades Extras
export function initAnimations() {
    // Verifica se o usuário prefere movimento reduzido
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (!prefersReducedMotion) {
        setupScrollAnimations();
        setupHoverEffects();
        setupLoadingAnimations();
    }
    
    setupKeyboardShortcuts();
    setupScrollToTop();
    addAccessibilityEnhancements();
    
    console.log('🎨 Animações e extras inicializados!');
}

// Configura animações de scroll
function setupScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Observa elementos que devem animar
    const animateElements = document.querySelectorAll('.card, .tech-cards h2, .hero h2, .hero p');
    animateElements.forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });

    addScrollAnimationStyles();
}

// Adiciona estilos para animações de scroll
function addScrollAnimationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .animate-on-scroll {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .animate-on-scroll.animate-in {
            opacity: 1;
            transform: translateY(0);
        }
        
        /* Delay para criar efeito cascata */
        .card:nth-child(1) { transition-delay: 0ms; }
        .card:nth-child(2) { transition-delay: 100ms; }
        .card:nth-child(3) { transition-delay: 200ms; }
        .card:nth-child(4) { transition-delay: 300ms; }
        .card:nth-child(5) { transition-delay: 400ms; }
        .card:nth-child(6) { transition-delay: 500ms; }
        
        @media (prefers-reduced-motion: reduce) {
            .animate-on-scroll {
                opacity: 1;
                transform: none;
                transition: none;
            }
        }
    `;
    document.head.appendChild(style);
}

// Configura efeitos de hover avançados
function setupHoverEffects() {
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
            this.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.15)';
            this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
        });
    });

    // Efeito de onda nos botões
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary');
    buttons.forEach(button => {
        button.addEventListener('click', createRippleEffect);
    });
}

// Cria efeito de onda nos botões
function createRippleEffect(event) {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const ripple = document.createElement('span');
    ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple 0.6s linear;
        left: ${x}px;
        top: ${y}px;
        width: 10px;
        height: 10px;
        margin-left: -5px;
        margin-top: -5px;
        pointer-events: none;
    `;
    
    button.style.position = 'relative';
    button.style.overflow = 'hidden';
    button.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
    
    // Adiciona keyframes se não existir
    if (!document.querySelector('#ripple-keyframes')) {
        const style = document.createElement('style');
        style.id = 'ripple-keyframes';
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Animações de carregamento
function setupLoadingAnimations() {
    // Anima elementos do header
    const headerElements = document.querySelectorAll('.header h1, .header nav a');
    headerElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(-20px)';
        
        setTimeout(() => {
            el.style.transition = 'all 0.5s ease';
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, index * 100);
    });

    // Efeito de digitação no hero
    const heroTitle = document.querySelector('.hero h2');
    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        heroTitle.style.opacity = '1';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                heroTitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        };
        
        setTimeout(typeWriter, 500);
    }
}

// Configura atalhos de teclado
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (event) => {
        // Alt + M para focar no menu
        if (event.altKey && event.key.toLowerCase() === 'm') {
            event.preventDefault();
            const firstNavLink = document.querySelector('nav a');
            if (firstNavLink) {
                firstNavLink.focus();
                showShortcutFeedback('Menu focado');
            }
        }
        
        // Home para ir ao topo
        if (event.key === 'Home' && !event.target.matches('input, textarea')) {
            event.preventDefault();
            scrollToTop();
            showShortcutFeedback('Topo da página');
        }
        
        // End para ir ao rodapé
        if (event.key === 'End' && !event.target.matches('input, textarea')) {
            event.preventDefault();
            const footer = document.querySelector('footer');
            if (footer) {
                footer.scrollIntoView({ behavior: 'smooth' });
                showShortcutFeedback('Rodapé da página');
            }
        }
        
        // Ctrl + K para busca rápida (se existir)
        if (event.ctrlKey && event.key.toLowerCase() === 'k') {
            event.preventDefault();
            const searchInput = document.querySelector('#tech-search, input[type="search"]');
            if (searchInput) {
                searchInput.focus();
                showShortcutFeedback('Busca ativada');
            }
        }
        
        // ? para mostrar ajuda de atalhos
        if (event.key === '?' && !event.target.matches('input, textarea')) {
            event.preventDefault();
            showKeyboardHelp();
        }
    });
}

// Mostra feedback visual para atalhos
function showShortcutFeedback(message) {
    const feedback = document.createElement('div');
    feedback.textContent = `⌨️ ${message}`;
    feedback.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--color-primary);
        color: white;
        padding: 0.75rem 1rem;
        border-radius: 0.5rem;
        z-index: 1000;
        font-weight: 500;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(feedback);
    
    setTimeout(() => {
        feedback.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => feedback.remove(), 300);
    }, 2000);
    
    // Adiciona keyframes se necessário
    if (!document.querySelector('#shortcut-animations')) {
        const style = document.createElement('style');
        style.id = 'shortcut-animations';
        style.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            
            @keyframes slideOutRight {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
}

// Mostra ajuda de atalhos de teclado
function showKeyboardHelp() {
    const helpModal = document.createElement('div');
    helpModal.innerHTML = `
        <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
             background: rgba(0, 0, 0, 0.8); z-index: 1000; display: flex; 
             align-items: center; justify-content: center;" id="keyboard-help">
            <div style="background: var(--color-card); max-width: 500px; width: 90%; 
                 border-radius: 1rem; padding: 2rem; position: relative;">
                <button onclick="document.getElementById('keyboard-help').remove()" 
                        style="position: absolute; top: 1rem; right: 1rem; background: none; 
                               border: none; font-size: 1.5rem; cursor: pointer;">✕</button>
                
                <h2 style="color: var(--color-primary); margin-bottom: 1.5rem; text-align: center;">
                    ⌨️ Atalhos de Teclado
                </h2>
                
                <div style="display: grid; gap: 1rem;">
                    <div style="display: flex; justify-content: space-between; padding: 0.5rem; 
                         background: var(--color-background); border-radius: 0.25rem;">
                        <span><strong>/</strong></span>
                        <span>Focar na busca</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: 0.5rem; 
                         background: var(--color-background); border-radius: 0.25rem;">
                        <span><strong>Alt + M</strong></span>
                        <span>Focar no menu</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: 0.5rem; 
                         background: var(--color-background); border-radius: 0.25rem;">
                        <span><strong>Home</strong></span>
                        <span>Ir ao topo</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: 0.5rem; 
                         background: var(--color-background); border-radius: 0.25rem;">
                        <span><strong>End</strong></span>
                        <span>Ir ao rodapé</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: 0.5rem; 
                         background: var(--color-background); border-radius: 0.25rem;">
                        <span><strong>Ctrl + K</strong></span>
                        <span>Busca rápida</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: 0.5rem; 
                         background: var(--color-background); border-radius: 0.25rem;">
                        <span><strong>?</strong></span>
                        <span>Mostrar esta ajuda</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: 0.5rem; 
                         background: var(--color-background); border-radius: 0.25rem;">
                        <span><strong>Esc</strong></span>
                        <span>Fechar modais</span>
                    </div>
                </div>
                
                <div style="text-align: center; margin-top: 1.5rem;">
                    <button onclick="document.getElementById('keyboard-help').remove()" 
                            class="btn-primary">Entendi</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(helpModal);
    
    // ESC para fechar
    const handleEsc = (e) => {
        if (e.key === 'Escape') {
            helpModal.remove();
            document.removeEventListener('keydown', handleEsc);
        }
    };
    document.addEventListener('keydown', handleEsc);
}

// Configura botão de scroll para o topo
function setupScrollToTop() {
    const scrollButton = document.createElement('button');
    scrollButton.innerHTML = '↑';
    scrollButton.setAttribute('aria-label', 'Voltar ao topo');
    scrollButton.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        width: 3rem;
        height: 3rem;
        border-radius: 50%;
        background: var(--color-primary);
        color: white;
        border: none;
        font-size: 1.2rem;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 100;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    `;
    
    scrollButton.addEventListener('click', scrollToTop);
    document.body.appendChild(scrollButton);
    
    // Mostra/esconde baseado no scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollButton.style.opacity = '1';
            scrollButton.style.visibility = 'visible';
        } else {
            scrollButton.style.opacity = '0';
            scrollButton.style.visibility = 'hidden';
        }
    });
}

// Função para scrollar ao topo
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Melhorias de acessibilidade
function addAccessibilityEnhancements() {
    // Adiciona skip link
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Pular para o conteúdo principal';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: var(--color-primary);
        color: white;
        padding: 8px;
        text-decoration: none;
        border-radius: 0 0 4px 4px;
        z-index: 1000;
        transition: top 0.2s;
    `;
    
    skipLink.addEventListener('focus', () => {
        skipLink.style.top = '0';
    });
    
    skipLink.addEventListener('blur', () => {
        skipLink.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Adiciona ID ao main se não existir
    const main = document.querySelector('main');
    if (main && !main.id) {
        main.id = 'main-content';
    }
    
    // Melhora foco visível
    const style = document.createElement('style');
    style.textContent = `
        /* Foco visível melhorado */
        :focus {
            outline: 3px solid var(--color-primary);
            outline-offset: 2px;
        }
        
        /* Remove outline apenas para mouse */
        :focus:not(:focus-visible) {
            outline: none;
        }
        
        /* Garante foco visível para teclado */
        :focus-visible {
            outline: 3px solid var(--color-primary);
            outline-offset: 2px;
        }
        
        /* Melhora contraste para links */
        a:focus {
            background: rgba(37, 99, 235, 0.1);
            border-radius: 2px;
        }
    `;
    document.head.appendChild(style);
    
    // Anuncia mudanças para leitores de tela
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', 'polite');
    announcer.setAttribute('aria-atomic', 'true');
    announcer.style.cssText = `
        position: absolute;
        left: -10000px;
        width: 1px;
        height: 1px;
        overflow: hidden;
    `;
    document.body.appendChild(announcer);
    
    // Função global para anunciar mudanças
    window.announceToScreenReader = (message) => {
        announcer.textContent = message;
        setTimeout(() => {
            announcer.textContent = '';
        }, 1000);
    };
}

// Exporta todas as funções
export { 
    initAnimations,
    setupScrollAnimations,
    setupHoverEffects,
    setupKeyboardShortcuts,
    scrollToTop
};

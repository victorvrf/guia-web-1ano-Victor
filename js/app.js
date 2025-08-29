// Módulo principal da aplicação
import { initTheme } from './modules/theme.js';
import { initQuiz, showQuizStats } from './modules/quiz.js';
import { initTecnologias } from './modules/tecnologias.js';
import { initBoasPraticas } from './modules/boas-praticas.js';
import { initFluxo } from './modules/fluxo.js';
import { initAnimations } from './modules/animations.js';

// Detecta a página atual baseada no título ou URL
function getCurrentPage() {
    const title = document.title.toLowerCase();
    const path = window.location.pathname.toLowerCase();
    
    if (title.includes('tecnologias') || path.includes('tecnologias')) return 'tecnologias';
    if (title.includes('boas práticas') || path.includes('boas-praticas')) return 'boas-praticas';
    if (title.includes('fluxo') || path.includes('fluxo')) return 'fluxo';
    if (title.includes('quiz') || path.includes('quiz')) return 'quiz';
    return 'home';
}

// Inicializa funcionalidades específicas por página
function initPageSpecificFeatures() {
    const currentPage = getCurrentPage();
    
    console.log(`🚀 Inicializando página: ${currentPage}`);
    
    switch (currentPage) {
        case 'tecnologias':
            initTecnologias();
            break;
        case 'boas-praticas':
            initBoasPraticas();
            break;
        case 'fluxo':
            initFluxo();
            break;
        case 'quiz':
            initQuiz();
            showQuizStats();
            break;
        case 'home':
            // Funcionalidades específicas da home page
            initHomeFeatures();
            break;
    }
}

// Funcionalidades específicas da página inicial
function initHomeFeatures() {
    // Adiciona contador de visitas
    addVisitCounter();
    
    // Adiciona links rápidos para as melhores pontuações
    addQuickStats();
    
    // Melhora a navegação da home
    enhanceHomeNavigation();
}

// Contador de visitas
function addVisitCounter() {
    const visits = parseInt(localStorage.getItem('siteVisits')) || 0;
    const newVisits = visits + 1;
    localStorage.setItem('siteVisits', newVisits);
    
    // Adiciona ao hero se existir
    const hero = document.querySelector('.hero p');
    if (hero && newVisits > 1) {
        hero.innerHTML += `<br><small style="opacity: 0.7;">🎯 Sua ${newVisits}ª visita ao guia</small>`;
    }
}

// Adiciona estatísticas rápidas
function addQuickStats() {
    const bestScore = localStorage.getItem('bestScore');
    const checklistProgress = JSON.parse(localStorage.getItem('checklistProgress')) || {};
    const completedItems = Object.keys(checklistProgress).length;
    
    if (bestScore || completedItems > 0) {
        const hero = document.querySelector('.hero');
        if (hero) {
            const statsHTML = `
                <div style="margin-top: 2rem; padding: 1rem; background: rgba(37, 99, 235, 0.1); 
                     border-radius: 0.5rem; display: inline-block;">
                    <h4 style="margin-bottom: 0.5rem; color: var(--color-primary);">📊 Seu Progresso</h4>
                    ${bestScore ? `<p>🏆 Melhor pontuação no quiz: ${bestScore}/10</p>` : ''}
                    ${completedItems > 0 ? `<p>✅ Boas práticas concluídas: ${completedItems}/18</p>` : ''}
                    <a href="quiz.html" class="btn-secondary" style="margin-right: 0.5rem;">Fazer Quiz</a>
                    <a href="boas-praticas.html" class="btn-secondary">Ver Checklist</a>
                </div>
            `;
            hero.insertAdjacentHTML('beforeend', statsHTML);
        }
    }
}

// Melhora navegação da home
function enhanceHomeNavigation() {
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        
        // Adiciona links diretos baseado no conteúdo
        let targetPage = '';
        if (title.includes('html')) targetPage = 'tecnologias.html#frontend';
        else if (title.includes('css')) targetPage = 'boas-praticas.html#css';
        else if (title.includes('javascript')) targetPage = 'tecnologias.html#frontend';
        
        if (targetPage) {
            card.style.cursor = 'pointer';
            card.addEventListener('click', () => {
                window.location.href = targetPage;
            });
            
            // Adiciona indicador visual
            card.style.borderLeft = '4px solid var(--color-primary)';
        }
    });
}

// Adiciona indicadores de progresso global
function addGlobalProgressIndicators() {
    const header = document.querySelector('.header .container');
    if (!header) return;
    
    const bestScore = localStorage.getItem('bestScore');
    const checklistProgress = JSON.parse(localStorage.getItem('checklistProgress')) || {};
    const techFilter = localStorage.getItem('techFilter');
    
    // Cria indicador de progresso
    const progressIndicator = document.createElement('div');
    progressIndicator.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 3px;
        background: var(--color-border);
        z-index: 1000;
    `;
    
    const progressFill = document.createElement('div');
    progressFill.style.cssText = `
        height: 100%;
        background: linear-gradient(45deg, var(--color-primary), var(--color-secondary));
        width: 0%;
        transition: width 0.5s ease;
    `;
    
    progressIndicator.appendChild(progressFill);
    document.body.appendChild(progressIndicator);
    
    // Calcula progresso total
    let totalProgress = 0;
    let maxProgress = 3; // 3 áreas principais
    
    if (bestScore && bestScore >= 7) totalProgress++; // Quiz com boa pontuação
    if (Object.keys(checklistProgress).length >= 10) totalProgress++; // Checklist parcialmente completa
    if (techFilter && techFilter !== 'all') totalProgress++; // Explorou tecnologias
    
    const percentage = (totalProgress / maxProgress) * 100;
    setTimeout(() => {
        progressFill.style.width = `${percentage}%`;
    }, 500);
}

// Configura transições suaves entre páginas
function setupPageTransitions() {
    // Adiciona loading state para links de navegação
    const navLinks = document.querySelectorAll('nav a, .btn-primary, .btn-secondary');
    
    navLinks.forEach(link => {
        if (link.href && !link.href.startsWith('#') && !link.href.includes('mailto:')) {
            link.addEventListener('click', (e) => {
                // Adiciona indicador de carregamento
                const loader = document.createElement('div');
                loader.style.cssText = `
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: var(--color-card);
                    padding: 2rem;
                    border-radius: 1rem;
                    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
                    z-index: 1000;
                    text-align: center;
                `;
                loader.innerHTML = `
                    <div style="font-size: 2rem; margin-bottom: 1rem;">🔄</div>
                    <p>Carregando...</p>
                `;
                
                document.body.appendChild(loader);
                
                // Remove o loader se a página não carregar em 3 segundos
                setTimeout(() => {
                    if (loader.parentNode) {
                        loader.remove();
                    }
                }, 3000);
            });
        }
    });
}

// Adiciona meta informações úteis para debugging
function addDebugInfo() {
    if (localStorage.getItem('debugMode') === 'true') {
        const debugPanel = document.createElement('div');
        debugPanel.style.cssText = `
            position: fixed;
            bottom: 0;
            left: 0;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 0.5rem;
            font-family: monospace;
            font-size: 0.8rem;
            z-index: 999;
            max-width: 300px;
        `;
        
        const currentPage = getCurrentPage();
        const loadTime = performance.now();
        
        debugPanel.innerHTML = `
            Página: ${currentPage}<br>
            Tempo de carregamento: ${loadTime.toFixed(2)}ms<br>
            Largura da tela: ${window.innerWidth}px<br>
            Tema: ${document.documentElement.dataset.theme || 'light'}
        `;
        
        document.body.appendChild(debugPanel);
        
        // Remove debug panel após 5 segundos
        setTimeout(() => debugPanel.remove(), 5000);
    }
}

// Inicialização principal
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Iniciando Guia Profissional de Desenvolvimento Web...');
    
    // Funcionalidades globais (todas as páginas)
    initTheme();
    initAnimations();
    addGlobalProgressIndicators();
    setupPageTransitions();
    
    // Funcionalidades específicas por página
    initPageSpecificFeatures();
    
    // Debug e estatísticas
    addDebugInfo();
    
    console.log('✅ Todas as funcionalidades inicializadas com sucesso!');
    
    // Anuncia carregamento completo para leitores de tela
    if (window.announceToScreenReader) {
        setTimeout(() => {
            window.announceToScreenReader('Página carregada completamente');
        }, 1000);
    }
});

// Adiciona listener para mudanças de tema
window.addEventListener('storage', (e) => {
    if (e.key === 'theme') {
        // Sincroniza tema entre abas
        document.documentElement.dataset.theme = e.newValue;
    }
});

// Exporta função principal para uso em outros contextos
window.GuiaWebApp = {
    getCurrentPage,
    initPageSpecificFeatures,
    version: '1.0.0'
};

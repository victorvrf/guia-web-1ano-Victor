// Módulo de Boas Práticas - Accordion e Checklist com progresso
export function initBoasPraticas() {
    // Verifica se estamos na página de boas práticas
    if (!document.title.includes('Boas Práticas')) return;

    // Estado da aplicação
    let checklistProgress = JSON.parse(localStorage.getItem('checklistProgress')) || {};

    // Lista de itens do checklist
    const checklistItems = [
        { id: 'html-semantic', text: 'Usar elementos HTML semânticos (header, nav, main, article, section)' },
        { id: 'html-headings', text: 'Manter hierarquia correta de headings (h1 → h2 → h3)' },
        { id: 'html-alt', text: 'Adicionar atributo alt em todas as imagens' },
        { id: 'html-forms', text: 'Conectar labels aos inputs com atributo for' },
        { id: 'css-mobile', text: 'Implementar design Mobile First' },
        { id: 'css-units', text: 'Usar unidades relativas (rem, em, %) em vez de pixels fixos' },
        { id: 'css-flexgrid', text: 'Utilizar Flexbox ou Grid para layouts' },
        { id: 'css-variables', text: 'Usar CSS Custom Properties (variáveis CSS)' },
        { id: 'js-naming', text: 'Usar nomes descritivos para variáveis e funções' },
        { id: 'js-functions', text: 'Criar funções pequenas com responsabilidade única' },
        { id: 'js-errors', text: 'Implementar tratamento adequado de erros' },
        { id: 'js-async', text: 'Usar async/await para operações assíncronas' },
        { id: 'perf-images', text: 'Otimizar imagens (formato WebP, lazy loading)' },
        { id: 'perf-meta', text: 'Configurar meta tags para SEO' },
        { id: 'perf-async', text: 'Carregar recursos não-críticos de forma assíncrona' },
        { id: 'a11y-focus', text: 'Garantir que todos os elementos interativos sejam focáveis' },
        { id: 'a11y-contrast', text: 'Verificar contraste adequado das cores' },
        { id: 'a11y-aria', text: 'Usar atributos ARIA quando necessário' }
    ];

    // Inicialização
    function init() {
        setupAccordion();
        createChecklist();
        setupEventListeners();
        restoreProgress();
        updateProgressBar();
        console.log('📚 Boas Práticas inicializadas com accordion e checklist!');
    }

    // Configura accordion
    function setupAccordion() {
        const sections = document.querySelectorAll('.tech-cards');
        
        sections.forEach((section, index) => {
            const heading = section.querySelector('h2');
            if (!heading) return;

            // Cria estrutura do accordion
            const accordionId = `accordion-${index}`;
            const content = section.querySelector('.cards');
            
            if (!content) return;

            // Adiciona atributos de acessibilidade
            heading.setAttribute('role', 'button');
            heading.setAttribute('aria-expanded', 'true');
            heading.setAttribute('aria-controls', accordionId);
            heading.setAttribute('tabindex', '0');
            heading.style.cursor = 'pointer';
            heading.style.userSelect = 'none';

            content.setAttribute('id', accordionId);
            content.setAttribute('role', 'region');
            content.setAttribute('aria-labelledby', heading.id || `heading-${index}`);

            // Adiciona ícone de estado
            const icon = document.createElement('span');
            icon.innerHTML = ' ▼';
            icon.style.transition = 'transform 0.3s ease';
            icon.className = 'accordion-icon';
            heading.appendChild(icon);

            // Event listeners
            heading.addEventListener('click', () => toggleAccordion(heading, content, icon));
            heading.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleAccordion(heading, content, icon);
                }
            });
        });

        addAccordionStyles();
    }

    // Adiciona estilos do accordion
    function addAccordionStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .tech-cards h2 {
                transition: color 0.2s ease;
                position: relative;
                padding: 1rem;
                margin: 0;
                background: var(--color-card);
                border: 2px solid var(--color-border);
                border-radius: 0.5rem;
                margin-bottom: 0.5rem;
            }
            
            .tech-cards h2:hover {
                color: var(--color-primary);
                border-color: var(--color-primary);
            }
            
            .tech-cards h2:focus {
                outline: 3px solid var(--color-primary);
                outline-offset: 2px;
            }
            
            .accordion-icon {
                float: right;
                transition: transform 0.3s ease;
            }
            
            .accordion-icon.rotated {
                transform: rotate(-180deg);
            }
            
            .cards {
                transition: all 0.3s ease;
                overflow: hidden;
                margin-top: 1rem;
            }
            
            .cards.collapsed {
                max-height: 0;
                margin-top: 0;
                margin-bottom: 0;
                opacity: 0;
            }
            
            .checklist {
                background: var(--color-card);
                border-radius: 1rem;
                padding: 2rem;
                margin: 2rem 0;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            
            .progress-section {
                text-align: center;
                margin-bottom: 2rem;
                padding: 1.5rem;
                background: var(--color-background);
                border-radius: 0.5rem;
            }
            
            .progress-bar {
                width: 100%;
                height: 12px;
                background: var(--color-border);
                border-radius: 6px;
                overflow: hidden;
                margin: 1rem 0;
            }
            
            .progress-fill {
                height: 100%;
                background: linear-gradient(45deg, var(--color-primary), var(--color-secondary));
                width: 0%;
                transition: width 0.5s ease;
            }
            
            .checklist-item {
                display: flex;
                align-items: flex-start;
                gap: 0.75rem;
                padding: 0.75rem;
                margin-bottom: 0.5rem;
                border-radius: 0.5rem;
                transition: background 0.2s ease;
            }
            
            .checklist-item:hover {
                background: var(--color-background);
            }
            
            .checklist-item.completed {
                background: rgba(16, 185, 129, 0.1);
                border-left: 4px solid var(--color-secondary);
            }
            
            .checklist-checkbox {
                width: 20px;
                height: 20px;
                accent-color: var(--color-primary);
                cursor: pointer;
            }
            
            .checklist-text {
                flex: 1;
                line-height: 1.5;
                cursor: pointer;
            }
            
            .checklist-text.completed {
                text-decoration: line-through;
                opacity: 0.7;
            }
            
            .stats-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                gap: 1rem;
                margin-top: 1rem;
            }
            
            .stat-item {
                text-align: center;
                padding: 1rem;
                background: var(--color-card);
                border-radius: 0.5rem;
                border: 1px solid var(--color-border);
            }
            
            .stat-number {
                font-size: 1.5rem;
                font-weight: bold;
                color: var(--color-primary);
            }
            
            .reset-progress {
                margin-top: 1rem;
                padding: 0.5rem 1rem;
                background: #ef4444;
                color: white;
                border: none;
                border-radius: 0.5rem;
                cursor: pointer;
                font-size: 0.9rem;
            }
            
            .reset-progress:hover {
                background: #dc2626;
            }
        `;
        document.head.appendChild(style);
    }

    // Toggle accordion
    function toggleAccordion(heading, content, icon) {
        const isExpanded = heading.getAttribute('aria-expanded') === 'true';
        
        heading.setAttribute('aria-expanded', !isExpanded);
        icon.classList.toggle('rotated');
        
        if (isExpanded) {
            content.style.maxHeight = content.scrollHeight + 'px';
            setTimeout(() => {
                content.classList.add('collapsed');
            }, 10);
        } else {
            content.classList.remove('collapsed');
            content.style.maxHeight = content.scrollHeight + 'px';
            setTimeout(() => {
                content.style.maxHeight = 'none';
            }, 300);
        }
    }

    // Cria checklist interativo
    function createChecklist() {
        const mainElement = document.querySelector('main');
        if (!mainElement) return;

        const checklistHTML = `
            <section class="container">
                <div class="checklist">
                    <h2 style="text-align: center; margin-bottom: 2rem; color: var(--color-primary);">
                        ✅ Checklist de Boas Práticas
                    </h2>
                    
                    <div class="progress-section">
                        <h3 style="margin-bottom: 1rem;">📊 Seu Progresso</h3>
                        <div class="progress-bar">
                            <div class="progress-fill" id="progress-fill"></div>
                        </div>
                        <p id="progress-text">0% concluído</p>
                        
                        <div class="stats-grid">
                            <div class="stat-item">
                                <div class="stat-number" id="completed-count">0</div>
                                <div>Concluídos</div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-number" id="remaining-count">${checklistItems.length}</div>
                                <div>Restantes</div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-number" id="total-count">${checklistItems.length}</div>
                                <div>Total</div>
                            </div>
                        </div>
                        
                        <button class="reset-progress" id="reset-progress">🔄 Resetar Progresso</button>
                    </div>
                    
                    <div id="checklist-items">
                        ${checklistItems.map(item => `
                            <div class="checklist-item" data-id="${item.id}">
                                <input type="checkbox" class="checklist-checkbox" id="${item.id}" data-id="${item.id}">
                                <label class="checklist-text" for="${item.id}">${item.text}</label>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </section>
        `;

        mainElement.insertAdjacentHTML('beforeend', checklistHTML);
    }

    // Configura event listeners
    function setupEventListeners() {
        // Checkboxes do checklist
        const checkboxes = document.querySelectorAll('.checklist-checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', handleCheckboxChange);
        });

        // Labels clicáveis
        const labels = document.querySelectorAll('.checklist-text');
        labels.forEach(label => {
            label.addEventListener('click', () => {
                const checkbox = document.getElementById(label.getAttribute('for'));
                if (checkbox) {
                    checkbox.checked = !checkbox.checked;
                    handleCheckboxChange({ target: checkbox });
                }
            });
        });

        // Reset progress
        const resetBtn = document.getElementById('reset-progress');
        if (resetBtn) {
            resetBtn.addEventListener('click', resetProgress);
        }

        // Atalhos de teclado
        document.addEventListener('keydown', handleKeyboardShortcuts);
    }

    // Manipula mudanças nos checkboxes
    function handleCheckboxChange(event) {
        const checkbox = event.target;
        const itemId = checkbox.dataset.id;
        const item = document.querySelector(`[data-id="${itemId}"]`);
        const label = item.querySelector('.checklist-text');

        // Atualiza estado visual
        if (checkbox.checked) {
            item.classList.add('completed');
            label.classList.add('completed');
            checklistProgress[itemId] = true;
        } else {
            item.classList.remove('completed');
            label.classList.remove('completed');
            delete checklistProgress[itemId];
        }

        // Salva progresso
        localStorage.setItem('checklistProgress', JSON.stringify(checklistProgress));
        
        // Atualiza barra de progresso
        updateProgressBar();

        // Animação de feedback
        animateCheckbox(checkbox);
    }

    // Anima checkbox
    function animateCheckbox(checkbox) {
        checkbox.style.transform = 'scale(1.2)';
        setTimeout(() => {
            checkbox.style.transform = 'scale(1)';
        }, 150);
    }

    // Atualiza barra de progresso
    function updateProgressBar() {
        const completed = Object.keys(checklistProgress).length;
        const total = checklistItems.length;
        const percentage = Math.round((completed / total) * 100);

        // Atualiza elementos
        const progressFill = document.getElementById('progress-fill');
        const progressText = document.getElementById('progress-text');
        const completedCount = document.getElementById('completed-count');
        const remainingCount = document.getElementById('remaining-count');

        if (progressFill) progressFill.style.width = `${percentage}%`;
        if (progressText) progressText.textContent = `${percentage}% concluído`;
        if (completedCount) completedCount.textContent = completed;
        if (remainingCount) remainingCount.textContent = total - completed;

        // Celebração quando completar tudo
        if (percentage === 100) {
            showCelebration();
        }
    }

    // Mostra celebração
    function showCelebration() {
        const celebration = document.createElement('div');
        celebration.innerHTML = `
            <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); 
                        background: var(--color-card); padding: 2rem; border-radius: 1rem; 
                        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2); z-index: 1000; text-align: center;
                        border: 3px solid var(--color-secondary);">
                <h2 style="color: var(--color-primary); margin-bottom: 1rem;">🎉 Parabéns!</h2>
                <p>Você completou todas as boas práticas!</p>
                <p style="font-size: 3rem; margin: 1rem 0;">🏆</p>
                <button onclick="this.parentElement.parentElement.remove()" class="btn-primary">
                    Continuar
                </button>
            </div>
            <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
                        background: rgba(0, 0, 0, 0.5); z-index: 999;"></div>
        `;
        
        document.body.appendChild(celebration);
        
        // Auto remove após 5 segundos
        setTimeout(() => {
            if (celebration.parentNode) {
                celebration.remove();
            }
        }, 5000);
    }

    // Restaura progresso salvo
    function restoreProgress() {
        Object.keys(checklistProgress).forEach(itemId => {
            const checkbox = document.getElementById(itemId);
            if (checkbox) {
                checkbox.checked = true;
                handleCheckboxChange({ target: checkbox });
            }
        });
    }

    // Reset do progresso
    function resetProgress() {
        if (confirm('Tem certeza que deseja resetar todo o progresso?')) {
            checklistProgress = {};
            localStorage.removeItem('checklistProgress');
            
            // Desmarca todos os checkboxes
            const checkboxes = document.querySelectorAll('.checklist-checkbox');
            checkboxes.forEach(checkbox => {
                checkbox.checked = false;
                const item = document.querySelector(`[data-id="${checkbox.dataset.id}"]`);
                const label = item.querySelector('.checklist-text');
                item.classList.remove('completed');
                label.classList.remove('completed');
            });
            
            updateProgressBar();
        }
    }

    // Atalhos de teclado
    function handleKeyboardShortcuts(event) {
        // Alt + R para resetar
        if (event.altKey && event.key.toLowerCase() === 'r') {
            event.preventDefault();
            resetProgress();
        }
        
        // Alt + A para abrir/fechar todos os accordions
        if (event.altKey && event.key.toLowerCase() === 'a') {
            event.preventDefault();
            toggleAllAccordions();
        }
    }

    // Toggle todos os accordions
    function toggleAllAccordions() {
        const headings = document.querySelectorAll('.tech-cards h2[role="button"]');
        const firstExpanded = headings[0]?.getAttribute('aria-expanded') === 'true';
        
        headings.forEach(heading => {
            const content = document.getElementById(heading.getAttribute('aria-controls'));
            const icon = heading.querySelector('.accordion-icon');
            
            if (content && icon) {
                if (firstExpanded) {
                    // Fechar todos
                    heading.setAttribute('aria-expanded', 'false');
                    icon.classList.add('rotated');
                    content.classList.add('collapsed');
                } else {
                    // Abrir todos
                    heading.setAttribute('aria-expanded', 'true');
                    icon.classList.remove('rotated');
                    content.classList.remove('collapsed');
                    content.style.maxHeight = 'none';
                }
            }
        });
    }

    // Inicializa o módulo
    init();
}

// Exporta função
export { initBoasPraticas };

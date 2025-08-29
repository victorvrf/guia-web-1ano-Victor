// Módulo de Fluxo - Fluxograma interativo com tooltips
export function initFluxo() {
    // Verifica se estamos na página de fluxo
    if (!document.title.includes('Fluxo')) return;

    // Dados das fases com detalhes
    const fases = {
        'planejamento': {
            title: '📋 Planejamento',
            duration: '1-2 semanas',
            deliverables: ['Documento de requisitos', 'Sitemap', 'Wireframes'],
            risks: ['Requisitos mal definidos', 'Escopo muito amplo', 'Falta de alinhamento com cliente'],
            tips: ['Faça perguntas específicas', 'Documente tudo', 'Valide com stakeholders']
        },
        'design': {
            title: '🎨 Design',
            duration: '1-3 semanas',
            deliverables: ['Design System', 'Protótipo interativo', 'Aprovação do cliente'],
            risks: ['Muitas revisões', 'Feedback tardio', 'Inconsistência visual'],
            tips: ['Crie componentes reutilizáveis', 'Valide cedo e frequentemente', 'Mantenha consistência']
        },
        'desenvolvimento': {
            title: '⚡ Desenvolvimento',
            duration: '2-6 semanas',
            deliverables: ['HTML semântico', 'CSS responsivo', 'JavaScript funcional', 'Testes'],
            risks: ['Bugs complexos', 'Performance ruim', 'Incompatibilidade entre navegadores'],
            tips: ['Code review frequente', 'Teste em diferentes dispositivos', 'Otimize desde o início']
        },
        'deploy': {
            title: '🚀 Deploy',
            duration: '3-5 dias',
            deliverables: ['Build otimizado', 'Site no ar', 'Monitoramento ativo'],
            risks: ['Problemas de servidor', 'Configuração incorreta', 'Downtime'],
            tips: ['Teste em ambiente de staging', 'Faça backup antes do deploy', 'Configure monitoramento']
        }
    };

    // Inicialização
    function init() {
        createInteractiveFlowchart();
        addTooltipStyles();
        setupEventListeners();
        setupKeyboardNavigation();
        console.log('🔄 Fluxo inicializado com tooltips interativos!');
    }

    // Cria fluxograma interativo
    function createInteractiveFlowchart() {
        const lastSection = document.querySelector('main section:last-child');
        if (!lastSection) return;

        const flowchartHTML = `
            <section class="container">
                <div class="interactive-flowchart">
                    <h2 style="text-align: center; margin-bottom: 3rem; color: var(--color-primary);">
                        🔄 Fluxograma Interativo
                    </h2>
                    
                    <div class="flowchart-container">
                        <div class="flow-step" data-phase="planejamento" tabindex="0">
                            <div class="step-icon">📋</div>
                            <div class="step-title">Planejamento</div>
                            <div class="step-subtitle">Análise & Wireframes</div>
                        </div>
                        
                        <div class="flow-arrow">→</div>
                        
                        <div class="flow-step" data-phase="design" tabindex="0">
                            <div class="step-icon">🎨</div>
                            <div class="step-title">Design</div>
                            <div class="step-subtitle">Protótipo & Validação</div>
                        </div>
                        
                        <div class="flow-arrow">→</div>
                        
                        <div class="flow-step" data-phase="desenvolvimento" tabindex="0">
                            <div class="step-icon">⚡</div>
                            <div class="step-title">Desenvolvimento</div>
                            <div class="step-subtitle">Código & Testes</div>
                        </div>
                        
                        <div class="flow-arrow">→</div>
                        
                        <div class="flow-step" data-phase="deploy" tabindex="0">
                            <div class="step-icon">🚀</div>
                            <div class="step-title">Deploy</div>
                            <div class="step-subtitle">Publicação & Monitoramento</div>
                        </div>
                    </div>
                    
                    <div class="timeline-details">
                        <h3 style="text-align: center; margin: 3rem 0 2rem; color: var(--color-primary);">
                            📅 Linha do Tempo Detalhada
                        </h3>
                        
                        <div class="timeline">
                            ${Object.entries(fases).map(([key, fase], index) => `
                                <div class="timeline-item" data-phase="${key}">
                                    <div class="timeline-marker">${index + 1}</div>
                                    <div class="timeline-content">
                                        <h4>${fase.title}</h4>
                                        <p class="timeline-duration">⏱️ ${fase.duration}</p>
                                        <p class="timeline-description">Clique nos cards acima para mais detalhes</p>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div class="interaction-help">
                        <p style="text-align: center; color: var(--color-text); opacity: 0.7; margin-top: 2rem;">
                            💡 <strong>Dica:</strong> Clique ou use Tab para navegar entre as fases e ver detalhes
                        </p>
                    </div>
                </div>
            </section>
        `;

        lastSection.insertAdjacentHTML('afterend', flowchartHTML);
    }

    // Adiciona estilos para tooltips e fluxograma
    function addTooltipStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .interactive-flowchart {
                padding: 2rem 0;
            }
            
            .flowchart-container {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 1rem;
                margin: 2rem 0;
                flex-wrap: wrap;
            }
            
            .flow-step {
                background: var(--color-card);
                border: 3px solid var(--color-border);
                border-radius: 1rem;
                padding: 1.5rem;
                text-align: center;
                cursor: pointer;
                transition: all 0.3s ease;
                position: relative;
                min-width: 150px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }
            
            .flow-step:hover,
            .flow-step:focus {
                border-color: var(--color-primary);
                transform: translateY(-4px);
                box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
                outline: none;
            }
            
            .flow-step.active {
                border-color: var(--color-primary);
                background: rgba(37, 99, 235, 0.1);
            }
            
            .step-icon {
                font-size: 2rem;
                margin-bottom: 0.5rem;
            }
            
            .step-title {
                font-weight: 600;
                color: var(--color-primary);
                margin-bottom: 0.25rem;
            }
            
            .step-subtitle {
                font-size: 0.9rem;
                color: var(--color-text);
                opacity: 0.7;
            }
            
            .flow-arrow {
                font-size: 1.5rem;
                color: var(--color-primary);
                font-weight: bold;
                margin: 0 0.5rem;
            }
            
            .tooltip {
                position: absolute;
                top: 100%;
                left: 50%;
                transform: translateX(-50%);
                background: var(--color-card);
                border: 2px solid var(--color-primary);
                border-radius: 0.5rem;
                padding: 1rem;
                min-width: 300px;
                max-width: 400px;
                box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
                z-index: 1000;
                margin-top: 0.5rem;
                opacity: 0;
                pointer-events: none;
                transition: all 0.3s ease;
            }
            
            .tooltip.visible {
                opacity: 1;
                pointer-events: auto;
            }
            
            .tooltip::before {
                content: '';
                position: absolute;
                top: -6px;
                left: 50%;
                transform: translateX(-50%);
                width: 0;
                height: 0;
                border-left: 6px solid transparent;
                border-right: 6px solid transparent;
                border-bottom: 6px solid var(--color-primary);
            }
            
            .tooltip h4 {
                color: var(--color-primary);
                margin-bottom: 1rem;
                font-size: 1.1rem;
            }
            
            .tooltip-section {
                margin-bottom: 1rem;
            }
            
            .tooltip-section:last-child {
                margin-bottom: 0;
            }
            
            .tooltip-section h5 {
                font-weight: 600;
                margin-bottom: 0.5rem;
                color: var(--color-text);
            }
            
            .tooltip-list {
                list-style: none;
                padding: 0;
                margin: 0;
            }
            
            .tooltip-list li {
                padding: 0.25rem 0;
                padding-left: 1.5rem;
                position: relative;
            }
            
            .tooltip-list li::before {
                content: '•';
                position: absolute;
                left: 0;
                color: var(--color-primary);
                font-weight: bold;
            }
            
            .timeline {
                display: flex;
                flex-direction: column;
                gap: 1.5rem;
                margin: 2rem 0;
            }
            
            .timeline-item {
                display: flex;
                align-items: flex-start;
                gap: 1rem;
                padding: 1rem;
                background: var(--color-card);
                border-radius: 0.5rem;
                border-left: 4px solid var(--color-border);
                transition: all 0.3s ease;
            }
            
            .timeline-item.highlighted {
                border-left-color: var(--color-primary);
                background: rgba(37, 99, 235, 0.05);
            }
            
            .timeline-marker {
                background: var(--color-primary);
                color: white;
                width: 2rem;
                height: 2rem;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                flex-shrink: 0;
            }
            
            .timeline-content h4 {
                margin: 0 0 0.5rem 0;
                color: var(--color-primary);
            }
            
            .timeline-duration {
                color: var(--color-secondary);
                font-weight: 500;
                margin: 0.25rem 0;
            }
            
            .timeline-description {
                margin: 0;
                opacity: 0.8;
            }
            
            .interaction-help {
                text-align: center;
                margin-top: 2rem;
                padding: 1rem;
                background: var(--color-background);
                border-radius: 0.5rem;
            }
            
            @media (max-width: 768px) {
                .flowchart-container {
                    flex-direction: column;
                }
                
                .flow-arrow {
                    transform: rotate(90deg);
                    margin: 0.5rem 0;
                }
                
                .tooltip {
                    min-width: 280px;
                    max-width: 90vw;
                }
                
                .flow-step {
                    min-width: 120px;
                }
            }
            
            @media (prefers-reduced-motion: reduce) {
                .flow-step,
                .tooltip,
                .timeline-item {
                    transition: none;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Configura event listeners
    function setupEventListeners() {
        const steps = document.querySelectorAll('.flow-step');
        
        steps.forEach(step => {
            step.addEventListener('click', () => showTooltip(step));
            step.addEventListener('mouseenter', () => showTooltip(step));
            step.addEventListener('mouseleave', hideTooltip);
            step.addEventListener('focus', () => showTooltip(step));
            step.addEventListener('blur', hideTooltip);
        });

        // Clique fora fecha tooltip
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.flow-step') && !e.target.closest('.tooltip')) {
                hideTooltip();
            }
        });
    }

    // Configura navegação por teclado
    function setupKeyboardNavigation() {
        const steps = document.querySelectorAll('.flow-step');
        
        steps.forEach((step, index) => {
            step.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    showTooltip(step);
                } else if (e.key === 'Escape') {
                    hideTooltip();
                    step.blur();
                } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                    e.preventDefault();
                    const nextIndex = (index + 1) % steps.length;
                    steps[nextIndex].focus();
                } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                    e.preventDefault();
                    const prevIndex = (index - 1 + steps.length) % steps.length;
                    steps[prevIndex].focus();
                }
            });
        });
    }

    // Mostra tooltip
    function showTooltip(step) {
        // Remove tooltips existentes
        hideTooltip();
        
        const phase = step.dataset.phase;
        const faseData = fases[phase];
        
        if (!faseData) return;

        // Adiciona classe ativa
        document.querySelectorAll('.flow-step').forEach(s => s.classList.remove('active'));
        step.classList.add('active');

        // Destaca item da timeline
        highlightTimelineItem(phase);

        // Cria tooltip
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.innerHTML = `
            <h4>${faseData.title}</h4>
            <p style="margin-bottom: 1rem;"><strong>⏱️ Duração:</strong> ${faseData.duration}</p>
            
            <div class="tooltip-section">
                <h5>📋 Entregáveis:</h5>
                <ul class="tooltip-list">
                    ${faseData.deliverables.map(item => `<li>${item}</li>`).join('')}
                </ul>
            </div>
            
            <div class="tooltip-section">
                <h5>⚠️ Riscos Comuns:</h5>
                <ul class="tooltip-list">
                    ${faseData.risks.map(item => `<li>${item}</li>`).join('')}
                </ul>
            </div>
            
            <div class="tooltip-section">
                <h5>💡 Dicas:</h5>
                <ul class="tooltip-list">
                    ${faseData.tips.map(item => `<li>${item}</li>`).join('')}
                </ul>
            </div>
        `;

        step.appendChild(tooltip);
        
        // Anima entrada
        setTimeout(() => {
            tooltip.classList.add('visible');
        }, 10);

        // Ajusta posição se sair da tela
        setTimeout(() => {
            adjustTooltipPosition(tooltip, step);
        }, 50);
    }

    // Esconde tooltip
    function hideTooltip() {
        const tooltips = document.querySelectorAll('.tooltip');
        tooltips.forEach(tooltip => {
            tooltip.classList.remove('visible');
            setTimeout(() => {
                if (tooltip.parentNode) {
                    tooltip.remove();
                }
            }, 300);
        });

        // Remove classes ativas
        document.querySelectorAll('.flow-step').forEach(s => s.classList.remove('active'));
        document.querySelectorAll('.timeline-item').forEach(item => item.classList.remove('highlighted'));
    }

    // Destaca item da timeline
    function highlightTimelineItem(phase) {
        document.querySelectorAll('.timeline-item').forEach(item => {
            item.classList.remove('highlighted');
        });
        
        const timelineItem = document.querySelector(`.timeline-item[data-phase="${phase}"]`);
        if (timelineItem) {
            timelineItem.classList.add('highlighted');
            
            // Atualiza conteúdo da timeline
            const faseData = fases[phase];
            const content = timelineItem.querySelector('.timeline-content');
            const description = content.querySelector('.timeline-description');
            
            description.innerHTML = `
                <strong>📋 Entregáveis:</strong> ${faseData.deliverables.join(', ')}<br>
                <strong>⚠️ Principal risco:</strong> ${faseData.risks[0]}
            `;
        }
    }

    // Ajusta posição do tooltip se necessário
    function adjustTooltipPosition(tooltip, step) {
        const rect = tooltip.getBoundingClientRect();
        const stepRect = step.getBoundingClientRect();
        const viewport = {
            width: window.innerWidth,
            height: window.innerHeight
        };

        // Se tooltip sai pela direita
        if (rect.right > viewport.width - 20) {
            tooltip.style.left = 'auto';
            tooltip.style.right = '0';
            tooltip.style.transform = 'none';
        }
        
        // Se tooltip sai pela esquerda
        if (rect.left < 20) {
            tooltip.style.left = '0';
            tooltip.style.right = 'auto';
            tooltip.style.transform = 'none';
        }

        // Se tooltip sai pela parte inferior
        if (rect.bottom > viewport.height - 20) {
            tooltip.style.top = 'auto';
            tooltip.style.bottom = '100%';
            tooltip.style.marginTop = '0';
            tooltip.style.marginBottom = '0.5rem';
            
            // Inverte a seta
            tooltip.style.setProperty('--arrow-direction', 'up');
        }
    }

    // Inicializa o módulo
    init();
}

// Exporta função
export { initFluxo };

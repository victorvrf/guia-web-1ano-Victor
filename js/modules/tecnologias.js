// Módulo de Tecnologias - Busca, Filtros, Modal e Exportação
export function initTecnologias() {
    // Verifica se estamos na página de tecnologias
    if (!document.title.includes('Tecnologias')) return;

    // Estado da aplicação
    let currentFilter = localStorage.getItem('techFilter') || 'all';
    let allCards = [];
    let filteredCards = [];

    // Dados das categorias para facilitar o filtro
    const categories = {
        'frontend': ['HTML5', 'CSS3', 'JavaScript ES6+', 'React', 'Vue.js', 'Tailwind CSS'],
        'backend': ['Node.js'],
        'database': ['MongoDB', 'PostgreSQL'],
        'tools': ['Git & GitHub', 'VS Code', 'Vite']
    };

    // Inicialização
    function init() {
        createSearchAndFilters();
        loadCards();
        setupEventListeners();
        restoreFilter();
        console.log('🔧 Tecnologias inicializadas com filtros e busca!');
    }

    // Cria interface de busca e filtros
    function createSearchAndFilters() {
        const firstSection = document.querySelector('.tech-cards');
        if (!firstSection) return;

        const controlsHTML = `
            <div id="tech-controls" style="margin-bottom: 3rem; text-align: center;">
                <div style="margin-bottom: 2rem;">
                    <input type="text" id="tech-search" placeholder="🔍 Buscar tecnologia..." 
                           style="width: 100%; max-width: 400px; padding: 0.75rem; border: 2px solid var(--color-border); 
                                  border-radius: 0.5rem; font-size: 1rem; background: var(--color-card);">
                </div>
                
                <div id="tech-filters" style="display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap; margin-bottom: 1rem;">
                    <button class="filter-btn active" data-filter="all">🌟 Todas</button>
                    <button class="filter-btn" data-filter="frontend">🎨 Frontend</button>
                    <button class="filter-btn" data-filter="backend">⚡ Backend</button>
                    <button class="filter-btn" data-filter="database">🗄️ Banco de Dados</button>
                    <button class="filter-btn" data-filter="tools">🛠️ Ferramentas</button>
                </div>
                
                <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
                    <button id="export-csv" class="btn-secondary">📊 Exportar CSV</button>
                    <button id="clear-filters" class="btn-secondary">🔄 Limpar Filtros</button>
                </div>
                
                <div id="results-count" style="margin-top: 1rem; font-weight: 500; color: var(--color-primary);"></div>
            </div>
        `;

        firstSection.insertAdjacentHTML('afterbegin', controlsHTML);
        addFilterStyles();
    }

    // Adiciona estilos para os filtros
    function addFilterStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .filter-btn {
                padding: 0.5rem 1rem;
                border: 2px solid var(--color-border);
                background: var(--color-card);
                color: var(--color-text);
                border-radius: 2rem;
                cursor: pointer;
                font-weight: 500;
                transition: all 0.2s ease;
            }
            
            .filter-btn:hover {
                border-color: var(--color-primary);
                background: var(--color-primary);
                color: white;
            }
            
            .filter-btn.active {
                background: var(--color-primary);
                border-color: var(--color-primary);
                color: white;
            }
            
            .tech-card {
                transition: all 0.3s ease;
                transform: scale(1);
            }
            
            .tech-card.hidden {
                display: none;
            }
            
            .tech-card:hover {
                transform: translateY(-4px);
                box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
            }
            
            #tech-search:focus {
                outline: none;
                border-color: var(--color-primary);
                box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
            }
            
            .search-highlight {
                background: yellow;
                padding: 0.1rem 0.2rem;
                border-radius: 0.2rem;
            }
        `;
        document.head.appendChild(style);
    }

    // Carrega todos os cards
    function loadCards() {
        allCards = Array.from(document.querySelectorAll('.card'));
        
        // Adiciona categoria aos cards baseado no título
        allCards.forEach(card => {
            const title = card.querySelector('h3').textContent;
            let category = 'other';
            
            for (const [cat, techs] of Object.entries(categories)) {
                if (techs.includes(title)) {
                    category = cat;
                    break;
                }
            }
            
            card.dataset.category = category;
            card.dataset.title = title.toLowerCase();
            card.classList.add('tech-card');
            
            // Adiciona evento de clique para modal
            card.addEventListener('click', () => openModal(card));
            card.style.cursor = 'pointer';
        });
        
        filteredCards = [...allCards];
        updateResultsCount();
    }

    // Configura event listeners
    function setupEventListeners() {
        // Busca em tempo real
        const searchInput = document.getElementById('tech-search');
        if (searchInput) {
            searchInput.addEventListener('input', handleSearch);
            
            // Atalho de teclado
            document.addEventListener('keydown', (e) => {
                if (e.key === '/' && !e.target.matches('input, textarea')) {
                    e.preventDefault();
                    searchInput.focus();
                }
            });
        }

        // Filtros
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', handleFilter);
        });

        // Exportar CSV
        const exportBtn = document.getElementById('export-csv');
        if (exportBtn) {
            exportBtn.addEventListener('click', exportToCSV);
        }

        // Limpar filtros
        const clearBtn = document.getElementById('clear-filters');
        if (clearBtn) {
            clearBtn.addEventListener('click', clearFilters);
        }
    }

    // Manipula busca
    function handleSearch(event) {
        const searchTerm = event.target.value.toLowerCase();
        
        filteredCards = allCards.filter(card => {
            const title = card.dataset.title;
            const content = card.textContent.toLowerCase();
            return content.includes(searchTerm);
        });
        
        applyFilters();
        highlightSearchTerm(searchTerm);
    }

    // Destaca termo de busca
    function highlightSearchTerm(term) {
        if (!term) return;
        
        filteredCards.forEach(card => {
            const textNodes = getTextNodes(card);
            textNodes.forEach(node => {
                if (node.textContent.toLowerCase().includes(term)) {
                    const highlightedText = node.textContent.replace(
                        new RegExp(`(${term})`, 'gi'),
                        '<span class="search-highlight">$1</span>'
                    );
                    const span = document.createElement('span');
                    span.innerHTML = highlightedText;
                    node.parentNode.replaceChild(span, node);
                }
            });
        });
    }

    // Obtém nós de texto
    function getTextNodes(element) {
        const textNodes = [];
        const walker = document.createTreeWalker(
            element,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );
        
        let node;
        while (node = walker.nextNode()) {
            if (node.textContent.trim()) {
                textNodes.push(node);
            }
        }
        return textNodes;
    }

    // Manipula filtros
    function handleFilter(event) {
        const filter = event.target.dataset.filter;
        currentFilter = filter;
        
        // Atualiza botões
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        event.target.classList.add('active');
        
        // Salva no localStorage
        localStorage.setItem('techFilter', filter);
        
        // Aplica filtro
        if (filter === 'all') {
            filteredCards = [...allCards];
        } else {
            filteredCards = allCards.filter(card => card.dataset.category === filter);
        }
        
        applyFilters();
    }

    // Aplica filtros visuais
    function applyFilters() {
        allCards.forEach(card => {
            if (filteredCards.includes(card)) {
                card.classList.remove('hidden');
                card.style.display = 'block';
            } else {
                card.classList.add('hidden');
                card.style.display = 'none';
            }
        });
        
        updateResultsCount();
        animateCards();
    }

    // Anima cards filtrados
    function animateCards() {
        filteredCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.4s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 50);
        });
    }

    // Atualiza contador de resultados
    function updateResultsCount() {
        const counter = document.getElementById('results-count');
        if (counter) {
            const count = filteredCards.length;
            const total = allCards.length;
            counter.textContent = `📊 Mostrando ${count} de ${total} tecnologias`;
        }
    }

    // Restaura filtro salvo
    function restoreFilter() {
        const filterBtn = document.querySelector(`[data-filter="${currentFilter}"]`);
        if (filterBtn) {
            filterBtn.click();
        }
    }

    // Limpa filtros
    function clearFilters() {
        document.getElementById('tech-search').value = '';
        document.querySelector('[data-filter="all"]').click();
        
        // Remove highlights
        document.querySelectorAll('.search-highlight').forEach(span => {
            span.outerHTML = span.innerHTML;
        });
    }

    // Abre modal com detalhes
    function openModal(card) {
        const title = card.querySelector('h3').textContent;
        const description = card.querySelector('p').textContent;
        const code = card.querySelector('pre code') ? card.querySelector('pre code').textContent : '';
        
        const modalHTML = `
            <div id="tech-modal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
                 background: rgba(0, 0, 0, 0.8); z-index: 1000; display: flex; align-items: center; justify-content: center;">
                <div style="background: var(--color-card); max-width: 600px; width: 90%; max-height: 80vh; 
                     overflow-y: auto; border-radius: 1rem; padding: 2rem; position: relative;">
                    <button id="close-modal" style="position: absolute; top: 1rem; right: 1rem; 
                            background: none; border: none; font-size: 1.5rem; cursor: pointer;">✕</button>
                    
                    <h2 style="color: var(--color-primary); margin-bottom: 1rem;">${title}</h2>
                    <p style="margin-bottom: 1.5rem; line-height: 1.6;">${description}</p>
                    
                    ${code ? `<pre style="background: var(--color-background); padding: 1rem; border-radius: 0.5rem; overflow-x: auto; margin-bottom: 1.5rem;"><code>${code}</code></pre>` : ''}
                    
                    <div style="border-top: 1px solid var(--color-border); padding-top: 1.5rem;">
                        <h4 style="color: var(--color-primary); margin-bottom: 1rem;">💡 Quando escolher ${title}?</h4>
                        <div style="background: var(--color-background); padding: 1rem; border-radius: 0.5rem;">
                            ${getWhenToUse(title)}
                        </div>
                    </div>
                    
                    <div style="margin-top: 1.5rem; text-align: center;">
                        <button class="btn-primary" onclick="window.open('https://developer.mozilla.org/search?q=${encodeURIComponent(title)}', '_blank')">
                            📚 Documentação
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Event listeners do modal
        document.getElementById('close-modal').addEventListener('click', closeModal);
        document.getElementById('tech-modal').addEventListener('click', (e) => {
            if (e.target.id === 'tech-modal') closeModal();
        });
        
        // Esc para fechar
        document.addEventListener('keydown', handleModalEsc);
    }

    // Fecha modal
    function closeModal() {
        const modal = document.getElementById('tech-modal');
        if (modal) {
            modal.remove();
            document.removeEventListener('keydown', handleModalEsc);
        }
    }

    // Handle ESC key
    function handleModalEsc(e) {
        if (e.key === 'Escape') closeModal();
    }

    // Retorna informações sobre quando usar cada tecnologia
    function getWhenToUse(tech) {
        const useCases = {
            'HTML5': '• Estruturar qualquer página web<br>• Definir semântica e acessibilidade<br>• Criar formulários e conteúdo',
            'CSS3': '• Estilizar interfaces modernas<br>• Criar layouts responsivos<br>• Adicionar animações e transições',
            'JavaScript ES6+': '• Adicionar interatividade<br>• Manipular dados e APIs<br>• Criar aplicações dinâmicas',
            'React': '• SPAs complexas<br>• Componentes reutilizáveis<br>• Estado complexo da aplicação',
            'Vue.js': '• Projetos de médio porte<br>• Curva de aprendizado suave<br>• Integração progressiva',
            'Node.js': '• APIs REST/GraphQL<br>• Microserviços<br>• Aplicações real-time',
            'Git & GitHub': '• Qualquer projeto de código<br>• Colaboração em equipe<br>• Controle de versões'
        };
        
        return useCases[tech] || '• Consulte a documentação para casos de uso específicos<br>• Avalie as necessidades do seu projeto<br>• Considere a curva de aprendizado';
    }

    // Exporta para CSV
    function exportToCSV() {
        const headers = ['Tecnologia', 'Categoria', 'Descrição', 'Uso Principal'];
        const rows = [headers];
        
        filteredCards.forEach(card => {
            const title = card.querySelector('h3').textContent;
            const category = card.dataset.category;
            const description = card.querySelector('p').textContent.substring(0, 100) + '...';
            const useCase = card.querySelector('p:last-of-type') ? card.querySelector('p:last-of-type').textContent : 'Vários usos';
            
            rows.push([title, category, description, useCase]);
        });
        
        const csvContent = rows.map(row => 
            row.map(field => `"${field.replace(/"/g, '""')}"`).join(',')
        ).join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `tecnologias_web_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
        
        // Feedback visual
        const exportBtn = document.getElementById('export-csv');
        const originalText = exportBtn.textContent;
        exportBtn.textContent = '✅ Exportado!';
        exportBtn.style.background = 'var(--color-secondary)';
        
        setTimeout(() => {
            exportBtn.textContent = originalText;
            exportBtn.style.background = '';
        }, 2000);
    }

    // Inicializa o módulo
    init();
}

// Exporta função para ser usada em outros módulos
export { initTecnologias };

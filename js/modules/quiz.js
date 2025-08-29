// Módulo do Quiz - Implementação completa conforme especificações
export function initQuiz() {
    // Verifica se estamos na página do quiz
    const quizForm = document.getElementById('quiz-form');
    if (!quizForm) return;

    // Array com explicações para cada questão
    const feedbacks = [
        "HTML estrutura o conteúdo da página web, definindo elementos semânticos como cabeçalhos, parágrafos, listas, etc.",
        "Unidades relativas como rem/em se adaptam ao tamanho da fonte do usuário, criando designs mais acessíveis e responsivos.",
        "addEventListener é o método moderno e recomendado para adicionar eventos em JavaScript, oferecendo mais controle e flexibilidade.",
        "HTML semântico usa elementos que descrevem o significado do conteúdo (header, nav, main, article), melhorando acessibilidade e SEO.",
        "PostgreSQL é um banco de dados relacional robusto, assim como MySQL e SQLite. MongoDB é um banco NoSQL (não-relacional).",
        "O atributo 'for' no label deve corresponder ao 'id' do input, criando uma associação importante para acessibilidade.",
        "O comando 'git commit -m \"mensagem\"' salva as mudanças no repositório local com uma descrição do que foi alterado.",
        "O planejamento e design precedem a implementação, incluindo análise de requisitos, wireframes e protótipos.",
        "Lazy loading carrega imagens apenas quando necessário, reduzindo o tempo de carregamento inicial e economizando banda.",
        "localStorage.setItem() armazena dados no navegador do usuário, persistindo mesmo após fechar e reabrir o navegador."
    ];

    // Função principal do quiz
    function handleQuizSubmit(event) {
        event.preventDefault(); // Impede o reload da página

        let score = 0;
        const questions = document.querySelectorAll('.quiz-question');
        const totalQuestions = questions.length;

        // Verifica cada resposta
        questions.forEach((question, index) => {
            const checkedInput = question.querySelector('input:checked');
            if (checkedInput && checkedInput.dataset.correct === 'true') {
                score++;
            }
        });

        // Gerencia melhor pontuação no localStorage
        const currentBest = localStorage.getItem('bestScore') || 0;
        const newBest = Math.max(score, parseInt(currentBest));
        localStorage.setItem('bestScore', newBest);

        // Exibe o resultado
        showQuizResult(score, totalQuestions, newBest);

        // Scrolla para o resultado
        document.getElementById('quiz-result').scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }

    // Função para exibir o resultado
    function showQuizResult(score, total, bestScore) {
        const resultDiv = document.getElementById('quiz-result');
        const percentage = Math.round((score / total) * 100);
        
        // Determina a mensagem baseada na pontuação
        let message = '';
        let emoji = '';
        
        if (percentage >= 90) {
            message = 'Excelente! Você domina desenvolvimento web!';
            emoji = '🏆';
        } else if (percentage >= 70) {
            message = 'Muito bom! Você tem um conhecimento sólido!';
            emoji = '🎉';
        } else if (percentage >= 50) {
            message = 'Bom trabalho! Continue estudando para melhorar!';
            emoji = '👍';
        } else {
            message = 'Continue praticando! O aprendizado é uma jornada!';
            emoji = '📚';
        }

        // HTML do resultado
        resultDiv.innerHTML = `
            <h3>${emoji} Quiz Finalizado!</h3>
            
            <div class="score-display">
                Sua pontuação: ${score}/${total} (${percentage}%)
            </div>
            
            <div class="best-score">
                🥇 Melhor pontuação: ${bestScore}/${total}
            </div>
            
            <p style="text-align: center; font-size: 1.1rem; margin-bottom: 2rem; color: var(--color-primary);">
                ${message}
            </p>
            
            <div class="explanations">
                <h4>📖 Explicações das Respostas:</h4>
                <ul>
                    ${feedbacks.map((feedback, index) => `
                        <li><strong>Questão ${index + 1}:</strong> ${feedback}</li>
                    `).join('')}
                </ul>
            </div>
            
            <div class="quiz-actions">
                <button id="retake-quiz" class="btn-primary">🔄 Refazer Quiz</button>
                <a href="tecnologias.html" class="btn-secondary">📚 Estudar Mais</a>
                <a href="boas-praticas.html" class="btn-secondary">✨ Boas Práticas</a>
            </div>
        `;

        // Mostra o resultado
        resultDiv.style.display = 'block';

        // Adiciona evento para refazer o quiz
        document.getElementById('retake-quiz').addEventListener('click', retakeQuiz);
    }

    // Função para refazer o quiz
    function retakeQuiz() {
        // Limpa todas as seleções
        const radioInputs = document.querySelectorAll('input[type="radio"]');
        radioInputs.forEach(input => {
            input.checked = false;
        });

        // Esconde o resultado
        document.getElementById('quiz-result').style.display = 'none';

        // Scrolla para o topo do formulário
        document.getElementById('quiz-form').scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }

    // Adiciona validação em tempo real
    function addRealTimeValidation() {
        const radioInputs = document.querySelectorAll('input[type="radio"]');
        const submitButton = document.querySelector('#quiz-form button[type="submit"]');

        function checkCompletion() {
            const questions = document.querySelectorAll('.quiz-question');
            let answeredQuestions = 0;

            questions.forEach(question => {
                const hasAnswer = question.querySelector('input:checked');
                if (hasAnswer) {
                    answeredQuestions++;
                }
            });

            // Habilita/desabilita o botão baseado na completude
            if (answeredQuestions === questions.length) {
                submitButton.disabled = false;
                submitButton.textContent = '✅ Finalizar Quiz';
                submitButton.style.opacity = '1';
            } else {
                submitButton.disabled = true;
                submitButton.textContent = `📝 Responda todas as questões (${answeredQuestions}/${questions.length})`;
                submitButton.style.opacity = '0.6';
            }
        }

        // Adiciona listeners para todos os radio buttons
        radioInputs.forEach(input => {
            input.addEventListener('change', checkCompletion);
        });

        // Verifica inicialmente
        checkCompletion();
    }

    // Adiciona animação suave para as questões
    function addQuestionAnimations() {
        const questions = document.querySelectorAll('.quiz-question');
        
        questions.forEach((question, index) => {
            question.style.opacity = '0';
            question.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                question.style.transition = 'all 0.5s ease';
                question.style.opacity = '1';
                question.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    // Adiciona indicador de progresso
    function addProgressIndicator() {
        const form = document.getElementById('quiz-form');
        const progressDiv = document.createElement('div');
        progressDiv.id = 'quiz-progress';
        progressDiv.innerHTML = `
            <div style="background: var(--color-border); height: 8px; border-radius: 4px; margin-bottom: 2rem; overflow: hidden;">
                <div id="progress-bar" style="height: 100%; background: var(--color-primary); width: 0%; transition: width 0.3s ease;"></div>
            </div>
            <p style="text-align: center; margin-bottom: 2rem; color: var(--color-text);">
                <span id="answered-count">0</span> de <span id="total-count">10</span> questões respondidas
            </p>
        `;
        
        form.insertBefore(progressDiv, form.firstChild);

        // Atualiza progresso em tempo real
        const radioInputs = document.querySelectorAll('input[type="radio"]');
        const progressBar = document.getElementById('progress-bar');
        const answeredCount = document.getElementById('answered-count');
        
        function updateProgress() {
            const questions = document.querySelectorAll('.quiz-question');
            let answered = 0;
            
            questions.forEach(question => {
                if (question.querySelector('input:checked')) {
                    answered++;
                }
            });
            
            const percentage = (answered / questions.length) * 100;
            progressBar.style.width = `${percentage}%`;
            answeredCount.textContent = answered;
        }

        radioInputs.forEach(input => {
            input.addEventListener('change', updateProgress);
        });
    }

    // Inicialização do quiz
    function init() {
        // Event listener principal
        quizForm.addEventListener('submit', handleQuizSubmit);
        
        // Funcionalidades adicionais
        addRealTimeValidation();
        addQuestionAnimations();
        addProgressIndicator();

        console.log('📝 Quiz inicializado com sucesso!');
    }

    // Inicia o quiz
    init();
}

// Função adicional para mostrar estatísticas do localStorage
export function showQuizStats() {
    const bestScore = localStorage.getItem('bestScore');
    if (bestScore && document.getElementById('quiz-info')) {
        const infoElement = document.getElementById('quiz-info');
        infoElement.innerHTML += `<p><strong>🏆 Sua melhor pontuação: ${bestScore}/10</strong></p>`;
    }
}

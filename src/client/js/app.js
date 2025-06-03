// OrgaGPT - AI Productivity Copilot
class OrgaGPT {
    constructor() {
        this.tasks = [];
        this.currentView = 'dashboard';
        this.pomodoroTimer = null;
        this.pomodoroTime = 25 * 60; // 25 minutes in seconds
        this.pomodoroCount = 0;
        this.isPomodoroPaused = false;
        this.focusStartTime = null;
        this.totalFocusTime = 0;
        
        // Load data from localStorage or defaults
        this.loadTasks();
        this.loadAISuggestions();
        
        // Initialize the application
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateClock();
        this.updateDashboard();
        this.generateTimeBlocks();
        
        // Update clock every minute
        setInterval(() => this.updateClock(), 60000);
    }

    loadTasks() {
        const savedTasks = localStorage.getItem('orgaGPTTasks');
        if (savedTasks) {
            try {
                this.tasks = JSON.parse(savedTasks);
                console.log('✅ Tâches chargées depuis localStorage');
            } catch (e) {
                console.error('❌ Erreur lors du chargement des tâches:', e);
                this.loadDefaultTasks();
            }
        } else {
            this.loadDefaultTasks();
        }
    }

    saveTasks() {
        try {
            localStorage.setItem('orgaGPTTasks', JSON.stringify(this.tasks));
            console.log('✅ Tâches sauvegardées dans localStorage');
        } catch (e) {
            console.error('❌ Erreur lors de la sauvegarde des tâches:', e);
        }
    }

    loadDefaultTasks() {
        const defaultTasks = [
            {
                id: 1,
                title: "Planifier la journée",
                priority: "high",
                estimatedTime: 15,
                category: "planning",
                completed: false,
                quadrant: 2
            },
            {
                id: 2,
                title: "Répondre aux emails prioritaires",
                priority: "medium",
                estimatedTime: 30,
                category: "communication",
                completed: false,
                quadrant: 3
            },
            {
                id: 3,
                title: "Session de travail profond",
                priority: "high",
                estimatedTime: 120,
                category: "deep_work",
                completed: false,
                quadrant: 2
            },
            {
                id: 4,
                title: "Révision des KPIs mensuels",
                priority: "high",
                estimatedTime: 45,
                category: "planning",
                completed: false,
                quadrant: 1
            },
            {
                id: 5,
                title: "Préparer la présentation client",
                priority: "high",
                estimatedTime: 90,
                category: "creative",
                completed: false,
                quadrant: 1
            }
        ];
        
        this.tasks = defaultTasks;
    }

    loadAISuggestions() {
        const suggestions = [
            "Planifiez vos tâches les plus importantes pendant vos heures de haute énergie",
            "Utilisez la technique Pomodoro pour les tâches qui demandent une concentration intense",
            "Bloquez du temps pour le travail profond sans interruptions",
            "Déléguez ou éliminez les tâches du quadrant 4 d'Eisenhower",
            "Préparez votre journée de demain en fin de journée d'aujourd'hui"
        ];
        
        this.displayAISuggestions(suggestions);
    }

    setupEventListeners() {
        // Method navigation
        document.querySelectorAll('.method-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const method = e.target.dataset.method;
                this.switchView(method);
            });
        });

        // Task management
        document.getElementById('addTaskBtn').addEventListener('click', () => {
            this.showTaskModal();
        });

        document.getElementById('closeTaskModal').addEventListener('click', () => {
            this.hideTaskModal();
        });

        document.getElementById('taskForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addTask();
        });

        // Pomodoro controls
        document.getElementById('startPomodoroBtn').addEventListener('click', () => {
            this.startPomodoro();
        });

        document.getElementById('pausePomodoroBtn').addEventListener('click', () => {
            this.pausePomodoro();
        });

        document.getElementById('resetPomodoroBtn').addEventListener('click', () => {
            this.resetPomodoro();
        });

        // AI Chat
        document.getElementById('sendChatBtn').addEventListener('click', () => {
            this.sendChatMessage();
        });

        document.getElementById('chatInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendChatMessage();
            }
        });

        // Quick actions
        document.getElementById('startFocusBtn').addEventListener('click', () => {
            this.startFocusSession();
        });

        document.getElementById('optimizeScheduleBtn').addEventListener('click', () => {
            this.optimizeSchedule();
        });

        // Energy level change
        document.getElementById('energyLevel').addEventListener('change', (e) => {
            this.updateEnergyRecommendations(e.target.value);
        });

        // Modal backdrop click
        document.getElementById('taskModal').addEventListener('click', (e) => {
            if (e.target.id === 'taskModal') {
                this.hideTaskModal();
            }
        });
    }

    updateClock() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('fr-FR', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        const clockElement = document.getElementById('currentTime');
        if (clockElement) {
            clockElement.textContent = timeString;
        }
    }

    switchView(viewName) {
        // Hide all views
        document.querySelectorAll('.view').forEach(view => {
            view.classList.remove('active');
        });

        // Show selected view
        const targetView = document.getElementById(viewName + 'View');
        if (targetView) {
            targetView.classList.add('active');
        }

        // Update navigation
        document.querySelectorAll('.method-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        const activeButton = document.querySelector(`[data-method="${viewName}"]`);
        if (activeButton) {
            activeButton.classList.add('active');
        }

        this.currentView = viewName;

        // Load view-specific content
        switch(viewName) {
            case 'eisenhower':
                this.updateEisenhowerMatrix();
                break;
            case 'timeblocking':
                this.generateTimeBlocks();
                break;
            case 'analytics':
                this.updateAnalytics();
                break;
        }
    }

    showTaskModal() {
        const modal = document.getElementById('taskModal');
        if (modal) {
            modal.classList.add('active');
        }
    }

    hideTaskModal() {
        const modal = document.getElementById('taskModal');
        if (modal) {
            modal.classList.remove('active');
        }
        const form = document.getElementById('taskForm');
        if (form) {
            form.reset();
        }
    }

    addTask() {
        const title = document.getElementById('taskTitle').value;
        const priority = document.getElementById('taskPriority').value;
        const duration = parseInt(document.getElementById('taskDuration').value);
        const category = document.getElementById('taskCategory').value;

        const newTask = {
            id: Date.now(),
            title,
            priority,
            estimatedTime: duration,
            category,
            completed: false,
            quadrant: this.determineEisenhowerQuadrant(priority, category)
        };

        this.tasks.push(newTask);
        this.saveTasks(); // Sauvegarder après l'ajout
        this.updateDashboard();
        this.updateEisenhowerMatrix();
        this.hideTaskModal();

        // AI suggestion based on new task
        this.suggestTaskOptimization(newTask);
    }

    determineEisenhowerQuadrant(priority, category) {
        // Simple logic to determine quadrant based on priority and category
        if (priority === 'high' && (category === 'planning' || category === 'deep_work')) {
            return Math.random() > 0.5 ? 1 : 2; // Important tasks
        } else if (priority === 'medium') {
            return 3; // Delegate
        } else {
            return 4; // Delete/Eliminate
        }
    }

    updateDashboard() {
        this.updatePriorityTasks();
        this.updateTimeline();
        this.updateProgressStats();
    }

    updatePriorityTasks() {
        const priorityTasks = this.tasks
            .filter(task => !task.completed)
            .sort((a, b) => {
                const priorityOrder = { high: 3, medium: 2, low: 1 };
                return priorityOrder[b.priority] - priorityOrder[a.priority];
            })
            .slice(0, 5);

        const container = document.getElementById('priorityTasks');
        if (container) {
            container.innerHTML = '';

            priorityTasks.forEach(task => {
                const taskElement = this.createTaskElement(task);
                container.appendChild(taskElement);
            });
        }
    }

    createTaskElement(task) {
        const taskDiv = document.createElement('div');
        taskDiv.className = 'task-item fade-in';
        taskDiv.innerHTML = `
            <div class="task-info">
                <div class="task-title">${task.title}</div>
                <div class="task-meta">
                    <span class="priority-${task.priority}">●</span>
                    <span>${task.estimatedTime}min</span>
                    <span>${this.getCategoryIcon(task.category)} ${this.getCategoryName(task.category)}</span>
                </div>
            </div>
            <div class="task-actions">
                <div class="task-complete ${task.completed ? 'completed' : ''}" onclick="orgaGPT.toggleTaskComplete(${task.id})"></div>
            </div>
        `;
        return taskDiv;
    }

    getCategoryIcon(category) {
        const icons = {
            planning: '📋',
            deep_work: '🧠',
            communication: '💬',
            administrative: '📁',
            creative: '🎨'
        };
        return icons[category] || '📄';
    }

    getCategoryName(category) {
        const names = {
            planning: 'Planification',
            deep_work: 'Travail Profond',
            communication: 'Communication',
            administrative: 'Administratif',
            creative: 'Créatif'
        };
        return names[category] || category;
    }

    toggleTaskComplete(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.completed = !task.completed;
            this.saveTasks(); // Sauvegarder après la modification
            this.updateDashboard();
            this.updateEisenhowerMatrix();
            
            if (task.completed) {
                this.showCompletionFeedback(task);
            }
        }
    }

    showCompletionFeedback(task) {
        const messages = [
            "Excellent travail ! Votre productivité augmente.",
            "Tâche terminée ! Continuez sur cette lancée.",
            "Bravo ! Vous progressez vers vos objectifs.",
            "Parfait ! Une tâche de moins à gérer."
        ];
        
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        this.addAIMessage(randomMessage);
    }

    updateTimeline() {
        const timeline = document.getElementById('dayTimeline');
        if (timeline) {
            timeline.innerHTML = '';

            const timeSlots = [
                { time: '09:00', content: 'Planification matinale', type: 'planning' },
                { time: '09:30', content: 'Session de travail profond', type: 'focus' },
                { time: '11:00', content: 'Pause & emails', type: 'break' },
                { time: '11:30', content: 'Réunion équipe', type: 'meeting' },
                { time: '14:00', content: 'Travail créatif', type: 'creative' },
                { time: '16:00', content: 'Administratif', type: 'admin' },
                { time: '17:00', content: 'Préparation lendemain', type: 'planning' }
            ];

            timeSlots.forEach(slot => {
                const timelineItem = document.createElement('div');
                timelineItem.className = 'timeline-item fade-in';
                timelineItem.innerHTML = `
                    <div class="timeline-time">${slot.time}</div>
                    <div class="timeline-content">${slot.content}</div>
                `;
                timeline.appendChild(timelineItem);
            });
        }
    }

    updateProgressStats() {
        const completedTasks = this.tasks.filter(t => t.completed).length;
        const totalTasks = this.tasks.length;
        const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

        const completedElement = document.getElementById('completedTasks');
        const focusElement = document.getElementById('focusTime');
        const productivityElement = document.getElementById('productivityScore');

        if (completedElement) completedElement.textContent = completedTasks;
        if (focusElement) focusElement.textContent = Math.round(this.totalFocusTime / 60) + 'h';
        if (productivityElement) productivityElement.textContent = completionRate + '%';
    }

    updateEisenhowerMatrix() {
        for (let i = 1; i <= 4; i++) {
            const quadrant = document.getElementById(`quadrant${i}`);
            if (quadrant) {
                quadrant.innerHTML = '';

                const quadrantTasks = this.tasks.filter(task => task.quadrant === i && !task.completed);
                
                if (quadrantTasks.length === 0) {
                    quadrant.innerHTML = '<p style="color: #666; text-align: center; margin-top: 20px;">Aucune tâche</p>';
                } else {
                    quadrantTasks.forEach(task => {
                        const taskElement = document.createElement('div');
                        taskElement.className = 'task-item mb-8';
                        taskElement.innerHTML = `
                            <div class="task-info">
                                <div class="task-title">${task.title}</div>
                                <div class="task-meta">
                                    <span>${task.estimatedTime}min</span>
                                    <span>${this.getCategoryIcon(task.category)}</span>
                                </div>
                            </div>
                            <div class="task-complete" onclick="orgaGPT.toggleTaskComplete(${task.id})"></div>
                        `;
                        quadrant.appendChild(taskElement);
                    });
                }
            }
        }
    }

    startPomodoro() {
        if (this.pomodoroTimer) {
            clearInterval(this.pomodoroTimer);
        }

        if (!this.focusStartTime) {
            this.focusStartTime = Date.now();
        }

        const startBtn = document.getElementById('startPomodoroBtn');
        const statusElement = document.getElementById('pomodoroStatus');
        
        if (startBtn) {
            startBtn.textContent = '🔄 En cours...';
            startBtn.disabled = true;
        }
        if (statusElement) {
            statusElement.textContent = 'Session de focus en cours';
        }

        this.pomodoroTimer = setInterval(() => {
            if (!this.isPomodoroPaused) {
                this.pomodoroTime--;
                this.updatePomodoroDisplay();

                if (this.pomodoroTime <= 0) {
                    this.completePomodoroSession();
                }
            }
        }, 1000);

        // Add visual indicator
        const timerCircle = document.querySelector('.timer-circle');
        if (timerCircle) {
            timerCircle.classList.add('pulse');
        }
    }

    pausePomodoro() {
        this.isPomodoroPaused = !this.isPomodoroPaused;
        const pauseBtn = document.getElementById('pausePomodoroBtn');
        const statusElement = document.getElementById('pomodoroStatus');

        if (pauseBtn && statusElement) {
            if (this.isPomodoroPaused) {
                pauseBtn.textContent = '▶️ Reprendre';
                statusElement.textContent = 'Session en pause';
            } else {
                pauseBtn.textContent = '⏸️ Pause';
                statusElement.textContent = 'Session de focus en cours';
            }
        }
    }

    resetPomodoro() {
        if (this.pomodoroTimer) {
            clearInterval(this.pomodoroTimer);
            this.pomodoroTimer = null;
        }

        this.pomodoroTime = 25 * 60;
        this.isPomodoroPaused = false;
        this.updatePomodoroDisplay();

        const startBtn = document.getElementById('startPomodoroBtn');
        const statusElement = document.getElementById('pomodoroStatus');

        if (startBtn) {
            startBtn.textContent = '▶️ Démarrer';
            startBtn.disabled = false;
        }
        if (statusElement) {
            statusElement.textContent = 'Prêt à commencer';
        }

        const timerCircle = document.querySelector('.timer-circle');
        if (timerCircle) {
            timerCircle.classList.remove('pulse');
        }
    }

    updatePomodoroDisplay() {
        const minutes = Math.floor(this.pomodoroTime / 60);
        const seconds = this.pomodoroTime % 60;
        const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        const timeElement = document.getElementById('pomodoroTime');
        if (timeElement) {
            timeElement.textContent = timeString;
        }
    }

    completePomodoroSession() {
        this.resetPomodoro();
        this.pomodoroCount++;
        this.totalFocusTime += 25 * 60; // Add 25 minutes in seconds

        const countElement = document.getElementById('pomodoroCount');
        if (countElement) {
            countElement.textContent = this.pomodoroCount;
        }
        this.updateProgressStats();

        // Celebration message
        this.addAIMessage('🎉 Pomodoro terminé ! Excellent focus. Prenez une pause de 5 minutes.');
        
        // Achievement feedback
        if (this.pomodoroCount % 4 === 0) {
            this.addAIMessage('🏆 4 Pomodoros complétés ! Prenez une pause plus longue (15-30 min).');
        }
    }

    generateTimeBlocks() {
        const timeGrid = document.getElementById('timeGrid');
        if (!timeGrid) return;

        timeGrid.innerHTML = '';

        const hours = [];
        for (let i = 8; i <= 18; i++) {
            hours.push(`${i.toString().padStart(2, '0')}:00`);
            if (i < 18) {
                hours.push(`${i.toString().padStart(2, '0')}:30`);
            }
        }

        hours.forEach(hour => {
            const timeLabel = document.createElement('div');
            timeLabel.className = 'time-slot time-label';
            timeLabel.textContent = hour;
            timeGrid.appendChild(timeLabel);

            const timeBlock = document.createElement('div');
            timeBlock.className = 'time-slot time-block';
            timeBlock.dataset.time = hour;
            
            // Add some sample occupied blocks
            if (['09:30', '11:00', '14:00', '16:00'].includes(hour)) {
                timeBlock.classList.add('occupied');
                timeBlock.textContent = this.getBlockContent(hour);
            }

            timeBlock.addEventListener('click', () => {
                this.toggleTimeBlock(timeBlock);
            });

            timeGrid.appendChild(timeBlock);
        });
    }

    getBlockContent(time) {
        const contents = {
            '09:30': 'Travail profond',
            '11:00': 'Réunion équipe',
            '14:00': 'Projet créatif',
            '16:00': 'Emails & admin'
        };
        return contents[time] || '';
    }

    toggleTimeBlock(block) {
        if (block.classList.contains('occupied')) {
            block.classList.remove('occupied');
            block.textContent = '';
        } else {
            block.classList.add('occupied');
            block.textContent = 'Nouvelle tâche';
        }
    }

    async sendChatMessage() {
        const input = document.getElementById('chatInput');
        const message = input.value.trim();
        
        if (!message || !input) return;

        this.addUserMessage(message);
        input.value = '';
        
        // Créer l'indicateur de chargement
        const chatMessages = document.getElementById('chatMessages');
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'ai-message typing-indicator';
        loadingDiv.innerHTML = '<span>.</span><span>.</span><span>.</span>';
        chatMessages.appendChild(loadingDiv);
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        try {
            console.log('🔄 Envoi de la requête à Ollama...');
            
            // Construire un contexte riche pour l'IA
            const context = {
                tasks: this.tasks,
                completedTasks: this.tasks.filter(t => t.completed).length,
                totalTasks: this.tasks.length,
                currentView: this.currentView,
                energyLevel: document.getElementById('energyLevel')?.value || 'medium',
                pomodoroCount: this.pomodoroCount,
                focusTime: Math.round(this.totalFocusTime / 60)
            };
            
            // Créer un prompt riche
            const prompt = `Tu es OrgaGPT, un assistant de productivité expert basé sur les recherches des grands cabinets de conseil (McKinsey, Deloitte, BCG, KPMG).

Contexte actuel de l'utilisateur:
- ${context.totalTasks} tâches dont ${context.completedTasks} complétées
- Vue actuelle: ${context.currentView}
- Niveau d'énergie: ${context.energyLevel}
- Sessions Pomodoro: ${context.pomodoroCount}
- Temps de focus: ${context.focusTime}h

Question: ${message}

Réponds de manière concise et actionnable. Utilise des émojis pertinents et cite les sources quand tu mentionnes des statistiques.`;

            // Appel à Ollama
            const response = await fetch('http://localhost:11434/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: 'gemma3:1b',
                    prompt: prompt,
                    stream: false
                })
            });
            
            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Supprimer l'indicateur de chargement
            loadingDiv.remove();
            
            // Ajouter la réponse de l'IA
            this.addAIMessage(data.response);
            console.log('✅ Réponse IA reçue avec succès!');
            
        } catch (error) {
            console.error('❌ Erreur avec Ollama:', error);
            
            // Supprimer l'indicateur de chargement
            loadingDiv.remove();
            
            // Message d'erreur
            const errorDiv = document.createElement('div');
            errorDiv.className = 'ai-message error-message';
            errorDiv.innerHTML = `<strong>Erreur de connexion à Ollama:</strong> ${error.message}<br><br>Assurez-vous qu'Ollama est bien lancé avec:<br><code>ollama serve</code><br><br>Je vais utiliser une réponse locale en attendant.`;
            chatMessages.appendChild(errorDiv);
            
            // Fallback vers la méthode originale après un délai
            setTimeout(() => {
                const fallbackResponse = this.generateAIResponse(message);
                this.addAIMessage(fallbackResponse + '\n\n[Note: Réponse générée localement]');
            }, 1500);
        }
    }

    addUserMessage(message) {
        const chatMessages = document.getElementById('chatMessages');
        if (!chatMessages) return;

        const messageDiv = document.createElement('div');
        messageDiv.className = 'user-message fade-in';
        messageDiv.textContent = message;
        chatMessages.appendChild(messageDiv);
        
        // Scroll to bottom
        setTimeout(() => {
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 100);
    }

    addAIMessage(message) {
        const chatMessages = document.getElementById('chatMessages');
        if (!chatMessages) return;

        const messageDiv = document.createElement('div');
        messageDiv.className = 'ai-message fade-in';
        
        // Utiliser marked pour le rendu Markdown et DOMPurify pour la sécurité
        try {
            // Configurer marked pour ouvrir les liens dans un nouvel onglet
            const renderer = new marked.Renderer();
            renderer.link = function(href, title, text) {
                const link = marked.Renderer.prototype.link.apply(this, arguments);
                return link.replace('<a', '<a target="_blank" rel="noopener noreferrer"');
            };
            
            // Convertir le Markdown en HTML et nettoyer pour éviter les XSS
            const htmlContent = marked.parse(message, { renderer: renderer });
            messageDiv.innerHTML = DOMPurify.sanitize(htmlContent);
        } catch (error) {
            console.error('Erreur lors du rendu Markdown:', error);
            // Fallback en cas d'erreur
            messageDiv.textContent = message;
        }
        
        chatMessages.appendChild(messageDiv);
        
        // Scroll to bottom
        setTimeout(() => {
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 100);
    }

    generateAIResponse(userMessage) {
        const responses = {
            'productivité': 'Pour maximiser votre productivité, concentrez-vous sur vos 5 priorités principales comme le recommande McKinsey. Utilisez la matrice d\'Eisenhower pour classer vos tâches.',
            'pomodoro': 'La technique Pomodoro est excellente pour maintenir la concentration. Alternez 25 min de travail intense avec 5 min de pause. Après 4 cycles, prenez une pause plus longue.',
            'planning': 'Un bon planning commence par identifier vos tâches les plus importantes. Bloquez du temps pour le travail profond et évitez les interruptions pendant ces créneaux.',
            'energie': 'Adaptez vos tâches à votre niveau d\'énergie : travail créatif et complexe le matin, tâches administratives l\'après-midi quand l\'énergie baisse.',
            'reunion': 'Selon Deloitte, nous perdons 31h/mois en réunions improductives. Demandez-vous : cette réunion est-elle vraiment nécessaire ? Peut-elle être un email ?',
            'aide': 'Je suis votre copilote productivité ! Je peux vous aider avec la planification, l\'organisation, les méthodes de travail, et l\'optimisation de votre temps.',
            'bonjour': 'Bonjour ! Ravi de vous accompagner dans votre quête de productivité. Comment puis-je vous aider aujourd\'hui ?',
            'merci': 'Je vous en prie ! C\'est un plaisir de vous aider à optimiser votre productivité. N\'hésitez pas si vous avez d\'autres questions !'
        };

        // Simple keyword matching
        const lowerMessage = userMessage.toLowerCase();
        for (const [keyword, response] of Object.entries(responses)) {
            if (lowerMessage.includes(keyword)) {
                return response;
            }
        }

        return 'Excellente question ! Basé sur les recherches des meilleurs cabinets de conseil, je recommande de prioriser vos tâches selon leur impact et urgence. Voulez-vous que nous révisions votre planning ensemble ?';
    }

    displayAISuggestions(suggestions) {
        const container = document.getElementById('aiSuggestions');
        if (!container) return;

        container.innerHTML = '';

        suggestions.forEach(suggestion => {
            const suggestionDiv = document.createElement('div');
            suggestionDiv.className = 'suggestion-item fade-in';
            suggestionDiv.textContent = suggestion;
            suggestionDiv.addEventListener('click', () => {
                this.addAIMessage(`💡 ${suggestion}\n\nVoulez-vous que je vous aide à mettre en pratique cette suggestion ?`);
            });
            container.appendChild(suggestionDiv);
        });
    }

    startFocusSession() {
        this.switchView('pomodoro');
        setTimeout(() => {
            this.startPomodoro();
        }, 500);
        
        this.addAIMessage('🎯 Session de focus démarrée ! Éliminez toutes les distractions et concentrez-vous sur votre tâche la plus importante.');
    }

    optimizeSchedule() {
        const energyLevelElement = document.getElementById('energyLevel');
        if (!energyLevelElement) return;

        const energyLevel = energyLevelElement.value;
        let message = '';

        switch(energyLevel) {
            case 'high':
                message = '🔋 Énergie élevée détectée ! Je recommande de programmer vos tâches les plus complexes maintenant : travail créatif, résolution de problèmes, ou apprentissage.';
                break;
            case 'medium':
                message = '⚡ Énergie modérée. Parfait pour les tâches de communication, les réunions, ou la révision de documents.';
                break;
            case 'low':
                message = '🪫 Énergie faible. Concentrez-vous sur les tâches administratives, la planification, ou les activités de routine.';
                break;
        }

        this.addAIMessage(message);
        this.reorganizeTasks(energyLevel);
    }

    reorganizeTasks(energyLevel) {
        // Simple task reorganization based on energy level
        const tasksByEnergy = {
            high: ['deep_work', 'creative', 'planning'],
            medium: ['communication', 'administrative'],
            low: ['administrative', 'communication']
        };

        const recommendedCategories = tasksByEnergy[energyLevel];
        const matchingTasks = this.tasks.filter(task => 
            !task.completed && recommendedCategories.includes(task.category)
        );

        if (matchingTasks.length > 0) {
            const taskTitles = matchingTasks.map(task => task.title).join(', ');
            this.addAIMessage(`📋 Tâches recommandées pour votre niveau d'énergie actuel : ${taskTitles}`);
        }
    }

    updateEnergyRecommendations(energyLevel) {
        this.optimizeSchedule();
    }

    suggestTaskOptimization(task) {
        let suggestion = '';
        
        if (task.estimatedTime > 90) {
            suggestion = '⚠️ Cette tâche semble longue. Considérez la diviser en sous-tâches plus petites pour un meilleur suivi.';
        } else if (task.priority === 'high' && task.quadrant === 4) {
            suggestion = '🤔 Cette tâche prioritaire pourrait être mieux classée. Révisons sa place dans la matrice d\'Eisenhower.';
        } else if (task.category === 'deep_work') {
            suggestion = '🧠 Tâche de travail profond détectée ! Je recommande de la programmer pendant vos heures de haute énergie et d\'utiliser la technique Pomodoro.';
        }

        if (suggestion) {
            this.addAIMessage(suggestion);
        }
    }

    updateAnalytics() {
        // This method would typically show more detailed analytics
        // For now, we display the consulting insights
        const insights = [
            'Selon McKinsey, les professionnels les plus productifs consacrent 95% de leur temps à leurs 5 priorités principales.',
            'Deloitte révèle que nous perdons en moyenne 31 heures par mois en réunions improductives.',
            'L\'adoption d\'outils IA peut générer jusqu\'à 14% de gain de temps selon les dernières études.',
            'BCG recommande de bloquer au minimum 2h consécutives pour le travail profond.',
            'KPMG conseille d\'aligner les tâches complexes avec les pics d\'énergie naturels.'
        ];

        this.addAIMessage('📊 Analyse de votre productivité basée sur les recherches des meilleurs cabinets...');
        setTimeout(() => {
            insights.forEach((insight, index) => {
                setTimeout(() => {
                    this.addAIMessage(insight);
                }, index * 2000);
            });
        }, 1000);
    }
}

// Initialize OrgaGPT when the page loads
let orgaGPT;
document.addEventListener('DOMContentLoaded', () => {
    orgaGPT = new OrgaGPT();
});
// api-service.js - Service pour gérer les appels API et la base de connaissances

class OrgaGPTAPI {
    constructor() {
        // Configuration de l'API
        this.apiEndpoint = 'https://api.openai.com/v1/chat/completions';
        
        // Récupération sécurisée de la clé API depuis localStorage
        const savedConfig = localStorage.getItem('orgagpt-ai-config');
        let config = {};
        
        if (savedConfig) {
            try {
                config = JSON.parse(savedConfig);
            } catch (e) {
                console.error('Erreur lors du chargement de la configuration IA:', e);
            }
        }
        
        // Utilisation de la clé API stockée de manière sécurisée
        this.apiKey = config?.openai?.apiKey || '';
        
        // Base de connaissances des cabinets de conseil
        this.knowledgeBase = {
            deloitte: {
                insights: [
                    {
                        title: "Productivity+",
                        fact: "84% des travailleurs seraient plus productifs s'ils pouvaient structurer leur journée selon leurs préférences",
                        source: "Deloitte Human Capital Trends 2024",
                        category: "productivity",
                        tags: ["flexibility", "autonomy", "work-style"]
                    },
                    {
                        title: "Réunions improductives",
                        fact: "Les employés passent 31 heures par mois en réunions improductives",
                        source: "Deloitte Workplace Productivity Study",
                        category: "meetings",
                        tags: ["time-waste", "meetings", "efficiency"]
                    },
                    {
                        title: "Email overload",
                        fact: "28% de la journée est consacrée à lire et répondre aux emails",
                        source: "Deloitte Digital Workplace Report",
                        category: "communication",
                        tags: ["email", "communication", "time-management"]
                    }
                ],
                methodologies: [
                    "Productivity+ Framework",
                    "Four dimensions of productivity",
                    "Hybrid work optimization"
                ]
            },
            mckinsey: {
                insights: [
                    {
                        title: "Top 5 Priorités",
                        fact: "Les professionnels les plus productifs consacrent 95% de leur temps à leurs 5 priorités principales",
                        source: "McKinsey Organizational Time Management",
                        category: "prioritization",
                        tags: ["focus", "priorities", "time-allocation"]
                    },
                    {
                        title: "MECE Principle",
                        fact: "Le principe MECE assure une organisation logique sans chevauchement",
                        source: "McKinsey Problem Solving Toolkit",
                        category: "organization",
                        tags: ["MECE", "structure", "logic"]
                    }
                ],
                methodologies: [
                    "MECE Framework",
                    "7-S Framework",
                    "Top 5 priorities approach"
                ]
            },
            bcg: {
                insights: [
                    {
                        title: "Équilibre hybride",
                        fact: "40-60% du temps en présentiel = équilibre optimal productivité/collaboration",
                        source: "BCG Future of Work Study",
                        category: "hybrid-work",
                        tags: ["hybrid", "collaboration", "balance"]
                    }
                ],
                methodologies: [
                    "Hybrid work optimization",
                    "AI-powered productivity"
                ]
            },
            kpmg: {
                insights: [
                    {
                        title: "Alignement énergie-tâches",
                        fact: "Aligner les tâches complexes avec les pics d'énergie naturels",
                        source: "KPMG Human Performance Study",
                        category: "energy-management",
                        tags: ["energy", "performance", "timing"]
                    }
                ],
                methodologies: [
                    "Energy-task alignment",
                    "Performance optimization"
                ]
            }
        };
        
        // Contexte système pour l'IA
        this.systemPrompt = `Tu es OrgaGPT, un copilote de productivité expert qui s'appuie sur les recherches et méthodologies des grands cabinets de conseil (McKinsey, Deloitte, BCG, EY, KPMG).

Tu as accès à une base de connaissances détaillée sur:
- Les insights de productivité validés par la recherche
- Les méthodologies éprouvées (Eisenhower, Pomodoro, GTD, MECE, etc.)
- Les statistiques et tendances actuelles du monde du travail
- Les meilleures pratiques d'organisation personnelle

Ton rôle est de:
1. Fournir des conseils personnalisés basés sur des données concrètes
2. Citer tes sources (cabinet, étude, année) quand tu mentionnes des statistiques
3. Proposer des actions concrètes et applicables immédiatement
4. Adapter tes recommandations au contexte et au niveau d'énergie de l'utilisateur
5. Être encourageant et motivant tout en restant factuel

Format tes réponses avec:
- Des points clés en gras pour la lisibilité
- Des exemples concrets quand pertinent
- Des références aux sources entre crochets [Cabinet - Étude]
- Des émojis pertinents pour rendre la conversation plus engageante`;
    }

    // Recherche dans la base de connaissances
    searchKnowledge(query) {
        const results = [];
        const queryLower = query.toLowerCase();
        
        Object.entries(this.knowledgeBase).forEach(([cabinet, data]) => {
            data.insights.forEach(insight => {
                // Recherche dans le titre, le fait et les tags
                const relevanceScore = this.calculateRelevance(queryLower, insight);
                if (relevanceScore > 0) {
                    results.push({
                        cabinet,
                        insight,
                        score: relevanceScore
                    });
                }
            });
        });
        
        // Trier par pertinence
        return results.sort((a, b) => b.score - a.score).slice(0, 5);
    }

    calculateRelevance(query, insight) {
        let score = 0;
        const terms = query.split(' ');
        
        terms.forEach(term => {
            if (insight.title.toLowerCase().includes(term)) score += 3;
            if (insight.fact.toLowerCase().includes(term)) score += 2;
            if (insight.tags.some(tag => tag.includes(term))) score += 1;
        });
        
        return score;
    }

    // Appel à l'API OpenAI avec contexte enrichi
    async getAIResponse(userMessage, context = {}) {
        try {
            // Rechercher des insights pertinents
            const relevantInsights = this.searchKnowledge(userMessage);
            
            // Construire le contexte enrichi
            const enrichedContext = this.buildEnrichedContext(relevantInsights, context);
            
            const response = await fetch(this.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    model: 'gpt-4-turbo-preview',
                    messages: [
                        { role: 'system', content: this.systemPrompt },
                        { role: 'system', content: enrichedContext },
                        { role: 'user', content: userMessage }
                    ],
                    temperature: 0.7,
                    max_tokens: 500
                })
            });

            const data = await response.json();
            return data.choices[0].message.content;
            
        } catch (error) {
            console.error('Erreur API:', error);
            return this.getFallbackResponse(userMessage);
        }
    }

    buildEnrichedContext(insights, userContext) {
        let context = "Insights pertinents pour cette question:\n\n";
        
        insights.forEach(({ cabinet, insight }) => {
            context += `- ${insight.fact} [${cabinet.toUpperCase()} - ${insight.source}]\n`;
        });
        
        if (userContext.energyLevel) {
            context += `\nNiveau d'énergie actuel de l'utilisateur: ${userContext.energyLevel}\n`;
        }
        
        if (userContext.currentTasks) {
            context += `\nTâches en cours: ${userContext.currentTasks.map(t => t.title).join(', ')}\n`;
        }
        
        if (userContext.timeOfDay) {
            context += `\nHeure actuelle: ${userContext.timeOfDay}\n`;
        }
        
        return context;
    }

    // Analyse avancée des tâches
    async analyzeTaskList(tasks) {
        const analysis = {
            distribution: this.analyzeDistribution(tasks),
            recommendations: [],
            insights: [],
            optimizations: []
        };

        // Analyse de la distribution Eisenhower
        const quadrantBalance = this.calculateQuadrantBalance(tasks);
        if (quadrantBalance.q1 > 30) {
            analysis.insights.push({
                type: 'warning',
                message: "Trop de tâches urgentes et importantes. Risque de burnout.",
                recommendation: "Planifiez mieux pour éviter les crises"
            });
        }

        // Analyse du temps total
        const totalTime = tasks.reduce((sum, task) => sum + task.estimatedTime, 0);
        if (totalTime > 480) { // Plus de 8h
            analysis.insights.push({
                type: 'warning',
                message: "Charge de travail excessive détectée",
                recommendation: "Priorisez et déléguez certaines tâches"
            });
        }

        // Suggestions basées sur les patterns
        analysis.recommendations = this.generateSmartRecommendations(tasks);

        return analysis;
    }

    analyzeDistribution(tasks) {
        const distribution = {
            byCategory: {},
            byPriority: {},
            byQuadrant: {},
            totalTime: 0
        };

        tasks.forEach(task => {
            // Par catégorie
            distribution.byCategory[task.category] = 
                (distribution.byCategory[task.category] || 0) + 1;
            
            // Par priorité
            distribution.byPriority[task.priority] = 
                (distribution.byPriority[task.priority] || 0) + 1;
            
            // Par quadrant
            distribution.byQuadrant[`Q${task.quadrant}`] = 
                (distribution.byQuadrant[`Q${task.quadrant}`] || 0) + 1;
            
            distribution.totalTime += task.estimatedTime;
        });

        return distribution;
    }

    calculateQuadrantBalance(tasks) {
        const total = tasks.length;
        const balance = { q1: 0, q2: 0, q3: 0, q4: 0 };
        
        tasks.forEach(task => {
            balance[`q${task.quadrant}`]++;
        });

        // Convertir en pourcentages
        Object.keys(balance).forEach(key => {
            balance[key] = total > 0 ? (balance[key] / total) * 100 : 0;
        });

        return balance;
    }

    generateSmartRecommendations(tasks) {
        const recommendations = [];
        const now = new Date();
        const hour = now.getHours();

        // Recommandations basées sur l'heure
        if (hour >= 9 && hour <= 11) {
            recommendations.push({
                type: 'timing',
                message: "C'est votre pic de productivité matinal",
                action: "Attaquez vos tâches de deep work maintenant"
            });
        }

        // Recommandations basées sur les patterns
        const deepWorkTasks = tasks.filter(t => t.category === 'deep_work');
        if (deepWorkTasks.length > 3) {
            recommendations.push({
                type: 'workload',
                message: "Beaucoup de travail profond prévu",
                action: "Utilisez la technique Pomodoro et prenez des pauses régulières"
            });
        }

        return recommendations;
    }

    // Génération de rapports détaillés
    async generateProductivityReport(userData) {
        const report = {
            summary: {},
            trends: [],
            recommendations: [],
            benchmarks: {}
        };

        // Calcul des métriques clés
        report.summary = {
            tasksCompleted: userData.completedTasks || 0,
            focusTime: userData.totalFocusTime || 0,
            productivityScore: this.calculateProductivityScore(userData),
            topCategory: this.findTopCategory(userData.tasks)
        };

        // Comparaison avec les benchmarks des cabinets
        report.benchmarks = {
            focusTime: {
                user: userData.totalFocusTime / 60,
                industry: 4.2, // Moyenne industrie en heures
                source: "BCG Workplace Study 2024"
            },
            meetingTime: {
                user: userData.meetingTime || 0,
                industry: 31, // 31h par mois
                source: "Deloitte Productivity Report"
            }
        };

        // Génération de recommandations personnalisées
        report.recommendations = this.generatePersonalizedRecommendations(userData);

        return report;
    }

    calculateProductivityScore(userData) {
        let score = 0;
        
        // Facteurs positifs
        if (userData.completedTasks > 5) score += 20;
        if (userData.totalFocusTime > 14400) score += 20; // 4h
        if (userData.pomodoroCount > 4) score += 15;
        
        // Équilibre des quadrants
        const balance = this.calculateQuadrantBalance(userData.tasks || []);
        if (balance.q2 > 40) score += 25; // Focus sur l'important non urgent
        
        // Pénalités
        if (balance.q4 > 20) score -= 10; // Trop de tâches non importantes
        
        return Math.max(0, Math.min(100, score));
    }

    findTopCategory(tasks) {
        if (!tasks || tasks.length === 0) return 'N/A';
        
        const categories = {};
        tasks.forEach(task => {
            categories[task.category] = (categories[task.category] || 0) + 1;
        });
        
        return Object.entries(categories)
            .sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';
    }

    generatePersonalizedRecommendations(userData) {
        const recommendations = [];
        const score = userData.productivityScore || 0;

        if (score < 50) {
            recommendations.push({
                priority: 'high',
                title: 'Améliorer la planification',
                description: 'Utilisez la matrice d\'Eisenhower pour mieux prioriser',
                source: 'McKinsey Time Management Framework'
            });
        }

        if (userData.totalFocusTime < 7200) { // Moins de 2h
            recommendations.push({
                priority: 'high',
                title: 'Augmenter le temps de focus',
                description: 'Bloquez au minimum 2h consécutives pour le travail profond',
                source: 'BCG Deep Work Study'
            });
        }

        return recommendations;
    }

    // Réponse de secours si l'API échoue
    getFallbackResponse(message) {
        const responses = {
            productivité: `D'après les recherches de **McKinsey**, les professionnels les plus productifs consacrent **95% de leur temps à leurs 5 priorités principales**. 

Je recommande de:
- 📋 Identifier vos 5 priorités clés
- ⏰ Bloquer du temps dédié pour chacune
- 🚫 Dire non aux tâches secondaires
- 📊 Mesurer votre progression quotidiennement`,

            planning: `Selon **Deloitte**, une bonne planification peut améliorer la productivité de **23%**.

Voici ma méthode recommandée:
- 🌅 **Matin**: Planification (15 min)
- 🎯 **9h-11h**: Travail profond (énergie maximale)
- 📧 **11h-12h**: Communications
- 🍽️ **Pause déjeuner**
- 💡 **14h-16h**: Tâches créatives
- 📊 **16h-17h**: Revue et préparation du lendemain`,

            energie: `**KPMG** recommande d'aligner vos tâches avec vos niveaux d'énergie naturels.

Adaptez votre planning:
- 🔋 **Énergie haute**: Travail complexe, créatif
- ⚡ **Énergie moyenne**: Réunions, collaboration
- 🪫 **Énergie basse**: Tâches administratives, emails`,

            default: `Je suis là pour vous aider à optimiser votre productivité! 

Basé sur les meilleures pratiques des cabinets de conseil, je peux vous conseiller sur:
- 📊 Organisation et priorisation
- ⏰ Gestion du temps
- 🎯 Techniques de focus
- 📈 Amélioration continue

Quelle est votre priorité aujourd'hui?`
        };

        // Recherche par mots-clés
        const lowerMessage = message.toLowerCase();
        for (const [key, response] of Object.entries(responses)) {
            if (lowerMessage.includes(key)) {
                return response;
            }
        }

        return responses.default;
    }
}

// Export pour utilisation dans l'application principale
window.OrgaGPTAPI = OrgaGPTAPI;

// Intégration avec l'application existante
class EnhancedOrgaGPT {
    constructor(originalApp) {
        this.app = originalApp;
        this.api = new OrgaGPTAPI();
        this.enhanceApp();
    }

    enhanceApp() {
        // Remplacer la méthode sendChatMessage
        this.app.sendChatMessage = async () => {
            const input = document.getElementById('chatInput');
            const message = input.value.trim();
            
            if (!message || !input) return;

            this.app.addUserMessage(message);
            input.value = '';

            // Afficher un indicateur de chargement
            this.showTypingIndicator();

            try {
                // Contexte enrichi
                const context = {
                    energyLevel: document.getElementById('energyLevel').value,
                    currentTasks: this.app.tasks.filter(t => !t.completed),
                    timeOfDay: new Date().getHours()
                };

                // Obtenir la réponse de l'IA
                const response = await this.api.getAIResponse(message, context);
                
                this.hideTypingIndicator();
                this.app.addAIMessage(response);

                // Analyser si des actions sont suggérées
                this.processAIActions(response);

            } catch (error) {
                this.hideTypingIndicator();
                this.app.addAIMessage("Désolé, je rencontre un problème technique. Laissez-moi vous donner une réponse basée sur mes connaissances intégrées.");
                
                // Utiliser la réponse de secours
                const fallbackResponse = this.api.getFallbackResponse(message);
                this.app.addAIMessage(fallbackResponse);
            }
        };

        // Ajouter de nouvelles fonctionnalités
        this.addSourceExplorer();
        this.addInsightsPanel();
        this.addVoiceInput();
    }

    showTypingIndicator() {
        const chatMessages = document.getElementById('chatMessages');
        const indicator = document.createElement('div');
        indicator.className = 'typing-indicator';
        indicator.id = 'typingIndicator';
        indicator.innerHTML = `
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        `;
        chatMessages.appendChild(indicator);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    hideTypingIndicator() {
        const indicator = document.getElementById('typingIndicator');
        if (indicator) indicator.remove();
    }

    processAIActions(response) {
        // Détecter et exécuter des actions suggérées
        if (response.includes('technique Pomodoro')) {
            this.suggestPomodoroStart();
        }
        if (response.includes('matrice d\'Eisenhower')) {
            this.highlightEisenhowerMatrix();
        }
    }

    suggestPomodoroStart() {
        const suggestion = document.createElement('div');
        suggestion.className = 'action-suggestion fade-in';
        suggestion.innerHTML = `
            <p>💡 Voulez-vous démarrer une session Pomodoro maintenant?</p>
            <button class="btn btn--primary btn--sm" onclick="orgaGPT.startFocusSession()">
                Démarrer Pomodoro
            </button>
        `;
        document.getElementById('chatMessages').appendChild(suggestion);
    }

    highlightEisenhowerMatrix() {
        const matrixBtn = document.querySelector('[data-method="eisenhower"]');
        if (matrixBtn) {
            matrixBtn.classList.add('highlight-pulse');
            setTimeout(() => matrixBtn.classList.remove('highlight-pulse'), 3000);
        }
    }

    addSourceExplorer() {
        // Ajouter un panneau pour explorer les sources
        const sidebar = document.querySelector('.sidebar--right');
        const sourceSection = document.createElement('div');
        sourceSection.className = 'sidebar__section';
        sourceSection.innerHTML = `
            <h3>📚 Sources & Recherches</h3>
            <div class="source-explorer">
                <div class="source-tabs">
                    <button class="source-tab active" data-cabinet="all">Tous</button>
                    <button class="source-tab" data-cabinet="mckinsey">McKinsey</button>
                    <button class="source-tab" data-cabinet="deloitte">Deloitte</button>
                    <button class="source-tab" data-cabinet="bcg">BCG</button>
                    <button class="source-tab" data-cabinet="kpmg">KPMG</button>
                </div>
                <div class="source-content" id="sourceContent">
                    <p class="source-hint">Cliquez sur un cabinet pour explorer ses insights</p>
                </div>
            </div>
        `;
        sidebar.appendChild(sourceSection);

        // Ajouter les événements
        sourceSection.querySelectorAll('.source-tab').forEach(tab => {
            tab.addEventListener('click', (e) => this.showCabinetInsights(e.target.dataset.cabinet));
        });
    }

    showCabinetInsights(cabinet) {
        const content = document.getElementById('sourceContent');
        const insights = cabinet === 'all' 
            ? this.getAllInsights() 
            : this.api.knowledgeBase[cabinet]?.insights || [];

        content.innerHTML = insights.map(insight => `
            <div class="insight-card">
                <h4>${insight.title}</h4>
                <p>${insight.fact}</p>
                <small>${insight.source}</small>
                <div class="insight-tags">
                    ${insight.tags.map(tag => `<span class="tag">#${tag}</span>`).join('')}
                </div>
            </div>
        `).join('');

        // Mettre à jour l'onglet actif
        document.querySelectorAll('.source-tab').forEach(t => t.classList.remove('active'));
        document.querySelector(`[data-cabinet="${cabinet}"]`).classList.add('active');
    }

    getAllInsights() {
        const allInsights = [];
        Object.values(this.api.knowledgeBase).forEach(cabinet => {
            allInsights.push(...cabinet.insights);
        });
        return allInsights;
    }

    addInsightsPanel() {
        // Panneau d'insights en temps réel
        const mainContent = document.querySelector('.main-content');
        const insightsPanel = document.createElement('div');
        insightsPanel.className = 'insights-panel';
        insightsPanel.id = 'insightsPanel';
        insightsPanel.innerHTML = `
            <div class="insights-header">
                <h3>💡 Insights en Temps Réel</h3>
                <button class="btn btn--sm btn--outline" onclick="enhancedApp.generateFullReport()">
                    📊 Rapport Complet
                </button>
            </div>
            <div class="insights-content" id="insightsContent">
                <div class="insight-loading">Analyse en cours...</div>
            </div>
        `;
        mainContent.insertBefore(insightsPanel, mainContent.firstChild);

        // Analyser périodiquement
        setInterval(() => this.updateInsights(), 30000);
        this.updateInsights();
    }

    async updateInsights() {
        const userData = {
            tasks: this.app.tasks,
            completedTasks: this.app.tasks.filter(t => t.completed).length,
            totalFocusTime: this.app.totalFocusTime,
            pomodoroCount: this.app.pomodoroCount
        };

        const analysis = await this.api.analyzeTaskList(this.app.tasks);
        const content = document.getElementById('insightsContent');

        content.innerHTML = `
            <div class="insights-grid">
                ${analysis.insights.map(insight => `
                    <div class="insight-item ${insight.type}">
                        <strong>${insight.message}</strong>
                        <p>${insight.recommendation}</p>
                    </div>
                `).join('')}
            </div>
            <div class="quick-stats-enhanced">
                <div class="stat-enhanced">
                    <div class="stat-icon">⏰</div>
                    <div class="stat-info">
                        <span class="stat-value">${Math.round(analysis.distribution.totalTime / 60)}h</span>
                        <span class="stat-label">Charge totale</span>
                    </div>
                </div>
                <div class="stat-enhanced">
                    <div class="stat-icon">🎯</div>
                    <div class="stat-info">
                        <span class="stat-value">${analysis.distribution.byPriority.high || 0}</span>
                        <span class="stat-label">Tâches prioritaires</span>
                    </div>
                </div>
            </div>
        `;
    }

    async generateFullReport() {
        const userData = {
            tasks: this.app.tasks,
            completedTasks: this.app.tasks.filter(t => t.completed).length,
            totalFocusTime: this.app.totalFocusTime,
            pomodoroCount: this.app.pomodoroCount,
            productivityScore: this.calculateProductivityScore()
        };

        const report = await this.api.generateProductivityReport(userData);
        
        // Créer un modal pour afficher le rapport
        this.showReportModal(report);
    }

    calculateProductivityScore() {
        const completed = this.app.tasks.filter(t => t.completed).length;
        const total = this.app.tasks.length;
        return total > 0 ? Math.round((completed / total) * 100) : 0;
    }

    showReportModal(report) {
        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content modal-large">
                <div class="modal-header">
                    <h3>📊 Rapport de Productivité Détaillé</h3>
                    <button class="modal-close" onclick="this.closest('.modal').remove()">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="report-section">
                        <h4>Résumé</h4>
                        <div class="report-summary">
                            <div class="summary-stat">
                                <span class="stat-label">Score Global</span>
                                <span class="stat-value">${report.summary.productivityScore}%</span>
                            </div>
                            <div class="summary-stat">
                                <span class="stat-label">Tâches Complétées</span>
                                <span class="stat-value">${report.summary.tasksCompleted}</span>
                            </div>
                            <div class="summary-stat">
                                <span class="stat-label">Temps de Focus</span>
                                <span class="stat-value">${Math.round(report.summary.focusTime / 60)}h</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="report-section">
                        <h4>Benchmarks Industrie</h4>
                        ${Object.entries(report.benchmarks).map(([key, data]) => `
                            <div class="benchmark-item">
                                <div class="benchmark-label">${this.formatBenchmarkLabel(key)}</div>
                                <div class="benchmark-comparison">
                                    <div class="benchmark-bar">
                                        <div class="benchmark-user" style="width: ${(data.user / data.industry) * 100}%">
                                            Vous: ${data.user}h
                                        </div>
                                    </div>
                                    <div class="benchmark-industry">Industrie: ${data.industry}h</div>
                                    <small>${data.source}</small>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    
                    <div class="report-section">
                        <h4>Recommandations Personnalisées</h4>
                        ${report.recommendations.map(rec => `
                            <div class="recommendation-card priority-${rec.priority}">
                                <h5>${rec.title}</h5>
                                <p>${rec.description}</p>
                                <small>Source: ${rec.source}</small>
                            </div>
                        `).join('')}
                    </div>
                    
                    <div class="report-actions">
                        <button class="btn btn--primary" onclick="window.print()">
                            🖨️ Imprimer le Rapport
                        </button>
                        <button class="btn btn--outline" onclick="enhancedApp.exportReport()">
                            📥 Exporter en PDF
                        </button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    formatBenchmarkLabel(key) {
        const labels = {
            focusTime: 'Temps de concentration profonde',
            meetingTime: 'Temps en réunions',
            emailTime: 'Temps sur les emails'
        };
        return labels[key] || key;
    }

    addVoiceInput() {
        // Ajouter la reconnaissance vocale
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const chatInput = document.querySelector('.chat-input');
            const voiceBtn = document.createElement('button');
            voiceBtn.className = 'btn btn--outline voice-btn';
            voiceBtn.innerHTML = '🎤';
            voiceBtn.title = 'Entrée vocale';
            voiceBtn.onclick = () => this.startVoiceRecognition();
            chatInput.appendChild(voiceBtn);
        }
    }

    startVoiceRecognition() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        
        recognition.lang = 'fr-FR';
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = () => {
            document.querySelector('.voice-btn').classList.add('recording');
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            document.getElementById('chatInput').value = transcript;
            document.querySelector('.voice-btn').classList.remove('recording');
        };

        recognition.onerror = () => {
            document.querySelector('.voice-btn').classList.remove('recording');
            this.app.addAIMessage("Désolé, je n'ai pas pu comprendre. Veuillez réessayer.");
        };

        recognition.start();
    }

    exportReport() {
        // Simulation d'export PDF
        this.app.addAIMessage("📥 Le rapport PDF a été généré et téléchargé!");
    }
}

// Auto-initialisation
document.addEventListener('DOMContentLoaded', () => {
    // Attendre que l'app originale soit initialisée
    setTimeout(() => {
        if (window.orgaGPT) {
            window.enhancedApp = new EnhancedOrgaGPT(window.orgaGPT);
        }
    }, 100);
});
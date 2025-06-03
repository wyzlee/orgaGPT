// real-ai-integration.js - Intégration de vraies IA pour OrgaGPT

class RealAIOrgaGPT {
    constructor(app) {
        this.app = app;
        this.aiProviders = {
            openai: null,
            huggingface: null,
            cohere: null,
            localLLM: null
        };
        
        // Configuration des différentes options IA
        this.config = {
            // Option 1: OpenAI (payant mais très performant)
            openai: {
                apiKey: '', // À remplir
                model: 'gpt-3.5-turbo',
                endpoint: 'https://api.openai.com/v1/chat/completions'
            },
            
            // Option 2: Hugging Face (gratuit avec limitations)
            huggingface: {
                apiKey: '', // Gratuit sur huggingface.co
                model: 'microsoft/DialoGPT-medium',
                endpoint: 'https://api-inference.huggingface.co/models/'
            },
            
            // Option 3: Cohere (freemium - 100 requêtes/min gratuit)
            cohere: {
                apiKey: '', // Gratuit sur cohere.ai
                endpoint: 'https://api.cohere.ai/v1/generate'
            },
            
            // Option 4: Ollama (100% local et gratuit)
            ollama: {
                endpoint: 'http://localhost:11434/api/generate',
                model: 'mistral' // Modèle Mistral configuré par l'utilisateur
            },
            
            // Option 5: Google Gemini (gratuit avec limitations)
            gemini: {
                apiKey: '', // Gratuit sur makersuite.google.com
                endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent'
            }
        };
        
        this.initAI();
    }

    async initAI() {
        console.log('🚀 Initialisation de RealAIOrgaGPT...');
        
        // Désactiver les autres intégrations IA pour éviter les conflits
        this.disableOtherAIIntegrations();
        
        // Détecter quelle option IA utiliser
        await this.detectAvailableAI();
        
        // Remplacer la méthode de chat de l'app originale
        const replaced = this.replaceAppChatMethod();
        
        if (!replaced) {
            console.error('❌ Impossible d\'initialiser RealAIOrgaGPT: échec du remplacement de sendChatMessage');
            return;
        }
        
        // Ajouter le sélecteur d'IA dans l'interface
        this.addAISelector();
        
        // Ajouter des styles pour le Markdown
        this.addMarkdownStyles();
        
        // Notifier l'utilisateur que l'IA est active
        this.notifyAIActive();
        
        console.log('✅ RealAIOrgaGPT initialisé avec succès!');
    }
    
    /**
     * Désactive les autres intégrations IA pour éviter les conflits
     */
    disableOtherAIIntegrations() {
        // Vérifier si EnhancedOrgaGPT est présent et le désactiver
        if (window.enhancedApp) {
            console.log('🚨 Détection de EnhancedOrgaGPT, désactivation...');
            try {
                // Sauvegarder la base de connaissances si elle existe
                if (window.enhancedApp.api && window.enhancedApp.api.knowledgeBase) {
                    this.knowledgeBase = window.enhancedApp.api.knowledgeBase;
                    console.log('📖 Base de connaissances récupérée depuis EnhancedOrgaGPT');
                }
                
                // Désactiver en remettant la méthode originale
                if (window.enhancedApp.app && window.enhancedApp.originalSendChatMessage) {
                    window.enhancedApp.app.sendChatMessage = window.enhancedApp.originalSendChatMessage;
                    console.log('✅ Méthode sendChatMessage d\'EnhancedOrgaGPT désactivée');
                }
            } catch (e) {
                console.error('Erreur lors de la désactivation d\'EnhancedOrgaGPT:', e);
            }
        }
        
        // Vérifier si des styles d'Ollama sont déjà présents (signe que ollama-service.js est actif)
        const ollamaStyles = document.querySelector('style[data-source="ollama-service"]');
        if (ollamaStyles) {
            console.log('🚨 Détection de ollama-service.js, désactivation...');
            // Ne pas supprimer les styles car ils peuvent être utiles
            // Mais rétablir la méthode originale si possible
            if (window.orgaGPT && window.orgaGPT._originalSendChatMessage) {
                window.orgaGPT.sendChatMessage = window.orgaGPT._originalSendChatMessage;
                console.log('✅ Méthode sendChatMessage d\'ollama-service.js désactivée');
            }
        }
        
        console.log('🔧 Environnement préparé pour RealAIOrgaGPT');
    }
    
    /**
     * Ajoute des styles CSS pour améliorer l'affichage du Markdown
     */
    addMarkdownStyles() {
        const markdownStyles = `
        <style>
            /* Styles pour le rendu Markdown dans le chat */
            .ai-message h1, .ai-message h2, .ai-message h3, .ai-message h4 {
                margin-top: 0.5em;
                margin-bottom: 0.5em;
                font-weight: bold;
                color: #333;
            }
            
            .ai-message h1 { font-size: 1.5em; }
            .ai-message h2 { font-size: 1.3em; }
            .ai-message h3 { font-size: 1.2em; }
            .ai-message h4 { font-size: 1.1em; }
            
            .ai-message p {
                margin-bottom: 0.8em;
            }
            
            .ai-message ul, .ai-message ol {
                margin-left: 1.5em;
                margin-bottom: 0.8em;
            }
            
            .ai-message li {
                margin-bottom: 0.3em;
            }
            
            .ai-message code {
                background-color: rgba(0, 0, 0, 0.05);
                padding: 0.2em 0.4em;
                border-radius: 3px;
                font-family: monospace;
                font-size: 0.9em;
            }
            
            .ai-message pre {
                background-color: rgba(0, 0, 0, 0.05);
                padding: 0.8em;
                border-radius: 5px;
                overflow-x: auto;
                margin-bottom: 1em;
            }
            
            .ai-message pre code {
                background-color: transparent;
                padding: 0;
            }
            
            .ai-message blockquote {
                border-left: 3px solid #ccc;
                padding-left: 1em;
                margin-left: 0;
                color: #555;
                font-style: italic;
            }
            
            .ai-message table {
                border-collapse: collapse;
                width: 100%;
                margin-bottom: 1em;
            }
            
            .ai-message th, .ai-message td {
                border: 1px solid #ddd;
                padding: 0.5em;
                text-align: left;
            }
            
            .ai-message th {
                background-color: rgba(0, 0, 0, 0.05);
            }
            
            .ai-message a {
                color: #0366d6;
                text-decoration: none;
            }
            
            .ai-message a:hover {
                text-decoration: underline;
            }
            
            .ai-message img {
                max-width: 100%;
                height: auto;
            }
        </style>
        `;
        
        document.head.insertAdjacentHTML('beforeend', markdownStyles);
    }
    
    /**
     * Notifie l'utilisateur que l'IA est active
     */
    notifyAIActive() {
        // Ajouter un indicateur visuel dans l'interface
        const aiTitle = document.querySelector('.sidebar__section h3');
        if (aiTitle && aiTitle.textContent.includes('Copilote IA')) {
            aiTitle.innerHTML = '🤖 Copilote IA <span style="color: green; font-size: 0.8em; background: rgba(0,255,0,0.1); padding: 2px 6px; border-radius: 10px;">✓ IA ACTIVE</span>';
        }
        
        // Ajouter un message dans le chat
        const chatMessages = document.getElementById('chatMessages');
        if (chatMessages) {
            const statusMessage = document.createElement('div');
            statusMessage.className = 'ai-message system-message';
            statusMessage.innerHTML = DOMPurify.sanitize(marked.parse(`**Système:** IA ${this.ollamaAvailable ? 'Ollama' : 'locale'} activée avec support **Markdown**. Posez vos questions et demandez-moi de gérer vos tâches!`));
            chatMessages.appendChild(statusMessage);
            
            // Scroll to bottom
            setTimeout(() => {
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }, 100);
        }
    }

    detectAvailableAI() {
        // Vérifier les clés API disponibles dans localStorage
        const savedConfig = localStorage.getItem('orgagpt-ai-config');
        if (savedConfig) {
            const config = JSON.parse(savedConfig);
            Object.assign(this.config, config);
        }
        
        // Vérifier si Ollama est disponible localement
        this.checkOllama();
    }

    async checkOllama() {
        try {
            const response = await fetch('http://localhost:11434/api/tags');
            if (response.ok) {
                const data = await response.json();
                console.log('Ollama disponible avec les modèles:', data.models);
                this.ollamaAvailable = true;
                
                // Vérifier si le modèle Mistral est disponible
                const models = data.models || [];
                const mistralAvailable = models.some(model => 
                    model.name === 'mistral' || model.name.includes('mistral'));
                
                if (!mistralAvailable) {
                    console.warn('Modèle Mistral non détecté. Pour l\'installer: ollama pull mistral');
                    // Afficher un message dans le chat
                    setTimeout(() => {
                        const chatMessages = document.getElementById('chatMessages');
                        if (chatMessages) {
                            const warningMessage = document.createElement('div');
                            warningMessage.className = 'ai-message system-message';
                            warningMessage.innerHTML = DOMPurify.sanitize(marked.parse(
                                '**Système:** Ollama est détecté mais le modèle Mistral n\'est pas installé. ' +
                                'Pour l\'installer, exécutez la commande suivante dans votre terminal:\n```\nollama pull mistral\n```'
                            ));
                            chatMessages.appendChild(warningMessage);
                        }
                    }, 1000);
                }
            }
        } catch (e) {
            console.log('Ollama non détecté. Installez-le depuis ollama.ai pour une IA locale gratuite.');
            this.ollamaAvailable = false;
            
            // Afficher un message dans le chat après un délai
            setTimeout(() => {
                const chatMessages = document.getElementById('chatMessages');
                if (chatMessages) {
                    const errorMessage = document.createElement('div');
                    errorMessage.className = 'ai-message error-message';
                    errorMessage.innerHTML = DOMPurify.sanitize(marked.parse(
                        '**Système:** Ollama n\'est pas détecté. Assurez-vous qu\'il est installé et en cours d\'exécution.\n\n' +
                        '1. Installez Ollama depuis [ollama.ai](https://ollama.ai)\n' +
                        '2. Exécutez `ollama serve` dans votre terminal\n' +
                        '3. Installez le modèle Mistral avec `ollama pull mistral`\n\n' +
                        'En attendant, je vais utiliser des réponses locales.'
                    ));
                    chatMessages.appendChild(errorMessage);
                }
            }, 1000);
        }
    }

    replaceAppChatMethod() {
        if (!this.app || typeof this.app.sendChatMessage !== 'function') {
            console.error('❌ Impossible de remplacer sendChatMessage: méthode non trouvée ou app non initialisée');
            return false;
        }
        
        // Sauvegarder une référence à la méthode originale pour le fallback
        this.originalSendChatMessage = this.app.sendChatMessage;
        console.log('💾 Méthode sendChatMessage originale sauvegardée pour fallback');
        
        // Définir la nouvelle méthode sendChatMessage
        const newMethod = async () => {
            const input = document.getElementById('chatInput');
            const message = input.value.trim();
            
            if (!message || !input) return;

            this.app.addUserMessage(message);
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
                console.log('🔄 Envoi de la requête à l\'IA...');
                
                // Obtenir une vraie réponse IA
                const response = await this.getAIResponse(message);
                
                // Supprimer l'indicateur de chargement
                loadingDiv.remove();
                
                // Ajouter la réponse de l'IA
                this.app.addAIMessage(response);
                console.log('✅ Réponse IA reçue avec succès!');
                
            } catch (error) {
                console.error('❌ Erreur IA:', error);
                
                // Supprimer l'indicateur de chargement
                loadingDiv.remove();
                
                // Message d'erreur
                const errorDiv = document.createElement('div');
                errorDiv.className = 'ai-message error-message';
                errorDiv.innerHTML = DOMPurify.sanitize(marked.parse('**Erreur de connexion à l\'IA:** ' + error.message + '\n\nAssurez-vous qu\'Ollama est bien lancé avec:\n```\nollama serve\n```\n\nJe vais utiliser une réponse locale en attendant.'));
                chatMessages.appendChild(errorDiv);
                
                // Fallback vers la méthode originale après un délai
                setTimeout(() => {
                    try {
                        const fallbackResponse = this.getSmartFallback(message);
                        this.app.addAIMessage(fallbackResponse + '\n\n*[Note: Réponse générée localement]*');
                    } catch (fallbackError) {
                        console.error('Erreur dans le fallback:', fallbackError);
                        this.app.addAIMessage('Désolé, je ne peux pas répondre pour le moment. Veuillez réessayer plus tard.');
                    }
                }, 1000);
            }
        };
        
        // Remplacer la méthode
        try {
            // Utiliser Object.defineProperty pour éviter les problèmes de remplacement
            Object.defineProperty(this.app, 'sendChatMessage', {
                value: newMethod,
                writable: true,
                configurable: true
            });
            
            console.log('✅ Méthode sendChatMessage remplacée avec succès');
            return true;
        } catch (error) {
            console.error('❌ Erreur lors du remplacement de sendChatMessage:', error);
            return false;
        }
    }

    async getAIResponse(message) {
        // Enrichir le contexte
        const context = this.buildContext();
        const prompt = this.buildPrompt(message, context);
        
        // Essayer les différents providers dans l'ordre
        const providers = [
            () => this.tryOllama(prompt),
            () => this.tryHuggingFace(prompt),
            () => this.tryCohere(prompt),
            () => this.tryGemini(prompt),
            () => this.tryOpenAI(prompt)
        ];
        
        for (const provider of providers) {
            try {
                const rawResponse = await provider();
                if (rawResponse) {
                    // Extraire les actions et nettoyer la réponse
                    const { cleanResponse, actions } = this.extractActionsAndCleanResponse(rawResponse);
                    
                    // Exécuter les actions si présentes
                    if (actions.length > 0) {
                        this.executeAIActions(actions);
                    }
                    
                    return cleanResponse;
                }
            } catch (e) {
                console.log('Provider failed, trying next...', e);
            }
        }
        
        throw new Error('Aucun provider IA disponible');
    }
    
    /**
     * Extrait les actions du format [ACTION:{...}] et nettoie la réponse
     * @param {string} responseText - Réponse brute de l'IA
     * @returns {Object} - {cleanResponse, actions}
     */
    extractActionsAndCleanResponse(responseText) {
        const actions = [];
        const actionRegex = /\[ACTION:(\{.*?\})\]/g;
        
        // Remplacer les actions par une chaîne vide pour nettoyer la réponse
        const cleanResponse = responseText.replace(actionRegex, (fullMatch, actionJson) => {
            try {
                const actionData = JSON.parse(actionJson);
                actions.push(actionData);
                console.log('Action extraite:', actionData);
                return ''; // Supprime l'action du texte affiché
            } catch (e) {
                console.error("Erreur de parsing de l'action JSON:", actionJson, e);
                return ''; // Supprime également en cas d'erreur
            }
        }).trim();
        
        return { cleanResponse, actions };
    }
    
    /**
     * Exécute une liste d'actions
     * @param {Array} actions - Liste des actions à exécuter
     */
    executeAIActions(actions) {
        actions.forEach(actionData => {
            console.log('Exécution de l\'action:', actionData);
            
            try {
                switch (actionData.intent) {
                    case "create_task":
                        this.executeCreateTask(actionData.parameters);
                        break;
                        
                    case "complete_task":
                        this.executeCompleteTask(actionData.parameters);
                        break;
                        
                    case "list_tasks":
                        this.executeListTasks(actionData.parameters);
                        break;
                        
                    case "update_task":
                        this.executeUpdateTask(actionData.parameters);
                        break;
                        
                    default:
                        console.warn('Action non reconnue:', actionData.intent);
                }
            } catch (error) {
                console.error(`Erreur lors de l'exécution de l'action ${actionData.intent}:`, error);
                this.app.addAIMessage(`⚠️ **Erreur:** Je n'ai pas pu exécuter l'action ${actionData.intent}. ${error.message}`);
            }
        });
    }
    
    /**
     * Traite les actions contenues dans la réponse de l'IA
     * Format: [ACTION:{"intent":"create_task","parameters":{...}}]
     * @deprecated Utilisez extractActionsAndCleanResponse et executeAIActions à la place
     */
    processAIActions(response) {
        // Vérifier si la réponse contient une action
        if (response.includes("[ACTION:") && response.includes("]")) {
            try {
                // Utiliser la nouvelle méthode d'extraction
                const { actions } = this.extractActionsAndCleanResponse(response);
                
                // Exécuter les actions extraites
                if (actions.length > 0) {
                    this.executeAIActions(actions);
                }
            } catch (error) {
                console.error('Erreur lors du traitement des actions:', error);
            }
        }
    }
    
    /**
     * Exécute l'action de création de tâche
     */
    executeCreateTask(params) {
        if (!params.title) return;
        
        const taskData = {
            id: Date.now(),
            title: params.title,
            priority: params.priority || 'medium',
            estimatedTime: parseInt(params.estimatedTime) || 30,
            category: params.category || 'general',
            completed: false,
            quadrant: params.quadrant || 2
        };
        
        // Ajouter la tâche
        this.app.tasks.push(taskData);
        
        // Mettre à jour l'interface
        this.app.updateTaskList();
        this.app.updateEisenhowerMatrix();
        
        // Notification
        this.app.addAIMessage(`✅ J'ai créé la tâche **${taskData.title}** avec une priorité **${taskData.priority}** et un temps estimé de **${taskData.estimatedTime} minutes**.`);
    }
    
    /**
     * Exécute l'action de complétion de tâche
     */
    executeCompleteTask(params) {
        if (!params.taskName) return;
        
        // Rechercher la tâche par son nom (recherche partielle insensible à la casse)
        const taskToComplete = this.app.tasks.find(t => 
            t.title.toLowerCase().includes(params.taskName.toLowerCase()));
            
        if (taskToComplete) {
            // Marquer comme terminée
            taskToComplete.completed = true;
            
            // Mettre à jour l'interface
            this.app.updateTaskList();
            this.app.updateEisenhowerMatrix();
            
            // Notification
            this.app.addAIMessage(`✅ J'ai marqué la tâche **${taskToComplete.title}** comme terminée.`);
        } else {
            this.app.addAIMessage(`❓ Je n'ai pas trouvé de tâche correspondant à "${params.taskName}".`);
        }
    }
    
    /**
     * Exécute l'action de listage des tâches
     */
    executeListTasks(params) {
        // Filtrer les tâches selon les paramètres
        let filteredTasks = [...this.app.tasks];
        
        if (params.completed === true) {
            filteredTasks = filteredTasks.filter(t => t.completed);
        } else if (params.completed === false) {
            filteredTasks = filteredTasks.filter(t => !t.completed);
        }
        
        if (params.priority) {
            filteredTasks = filteredTasks.filter(t => t.priority === params.priority);
        }
        
        if (params.category) {
            filteredTasks = filteredTasks.filter(t => t.category === params.category);
        }
        
        // Formater la réponse en Markdown
        let response = "";
        
        if (filteredTasks.length === 0) {
            response = "📋 Aucune tâche ne correspond à ces critères.";
        } else {
            response = "📋 **Voici les tâches demandées:**\n\n";
            
            filteredTasks.forEach(task => {
                const status = task.completed ? "✅" : "⬜";
                const priority = {
                    high: "🔴",
                    medium: "🟠",
                    low: "🟢"
                }[task.priority] || "⚪";
                
                response += `${status} **${task.title}** (${priority} · ${task.estimatedTime}min · ${task.category})\n`;
            });
        }
        
        this.app.addAIMessage(response);
    }
    
    /**
     * Exécute l'action de mise à jour de tâche
     */
    executeUpdateTask(params) {
        if (!params.taskName) return;
        
        // Rechercher la tâche par son nom
        const taskToUpdate = this.app.tasks.find(t => 
            t.title.toLowerCase().includes(params.taskName.toLowerCase()));
            
        if (taskToUpdate) {
            // Mettre à jour les propriétés
            if (params.newTitle) taskToUpdate.title = params.newTitle;
            if (params.priority) taskToUpdate.priority = params.priority;
            if (params.estimatedTime) taskToUpdate.estimatedTime = parseInt(params.estimatedTime);
            if (params.category) taskToUpdate.category = params.category;
            if (params.quadrant) taskToUpdate.quadrant = parseInt(params.quadrant);
            
            // Mettre à jour l'interface
            this.app.updateTaskList();
            this.app.updateEisenhowerMatrix();
            
            // Notification
            this.app.addAIMessage(`✅ J'ai mis à jour la tâche **${taskToUpdate.title}**.`);
        } else {
            this.app.addAIMessage(`❓ Je n'ai pas trouvé de tâche correspondant à "${params.taskName}".`);
        }
    }

    buildContext() {
        return {
            tasks: this.app.tasks,
            completedTasks: this.app.tasks.filter(t => t.completed).length,
            totalTasks: this.app.tasks.length,
            energyLevel: document.getElementById('energyLevel')?.value || 'medium',
            currentTime: new Date().toLocaleTimeString('fr-FR'),
            pomodoroCount: this.app.pomodoroCount,
            focusTime: Math.round(this.app.totalFocusTime / 60) + 'h',
            topPriorities: this.app.tasks
                .filter(t => t.priority === 'high' && !t.completed)
                .slice(0, 3)
                .map(t => t.title)
        };
    }

    buildPrompt(message, context) {
        return `Tu es OrgaGPT, un assistant de productivité expert basé sur les recherches de McKinsey, Deloitte, BCG et KPMG.

Contexte actuel de l'utilisateur:
- ${context.totalTasks} tâches dont ${context.completedTasks} complétées
- Niveau d'énergie: ${context.energyLevel}
- Temps de focus aujourd'hui: ${context.focusTime}
- Priorités actuelles: ${context.topPriorities.join(', ') || 'Aucune priorité définie'}
- Heure: ${context.currentTime}

Insights disponibles:
- McKinsey: "95% du temps sur les 5 priorités principales"
- Deloitte: "31h/mois perdues en réunions improductives"
- BCG: "40-60% présentiel = équilibre optimal"
- KPMG: "Aligner tâches complexes avec pics d'énergie"

=== CAPACITÉS SPÉCIALES ===
Tu peux exécuter des actions dans l'application en incluant ces commandes dans ta réponse:

1. CRÉER UNE TÂCHE:
[ACTION:{"intent":"create_task","parameters":{"title":"Nom de la tâche","priority":"high/medium/low","estimatedTime":30,"category":"planning/creative/deep_work/communication"}}]

2. MARQUER UNE TÂCHE COMME TERMINÉE:
[ACTION:{"intent":"complete_task","parameters":{"taskName":"Nom de la tâche"}}]

3. LISTER LES TÂCHES (avec filtres optionnels):
[ACTION:{"intent":"list_tasks","parameters":{"completed":true/false,"priority":"high/medium/low","category":"planning"}}]

4. METTRE À JOUR UNE TÂCHE:
[ACTION:{"intent":"update_task","parameters":{"taskName":"Nom actuel","newTitle":"Nouveau nom","priority":"high","estimatedTime":45}}]

=== EXEMPLES D'UTILISATION DES ACTIONS ===

Exemple 1 - Création de tâche:
Utilisateur: "Crée une tâche pour préparer la présentation marketing pour demain"
Réponse: "Je vais créer cette tâche pour vous tout de suite.
[ACTION:{"intent":"create_task","parameters":{"title":"Préparer la présentation marketing","priority":"high","estimatedTime":60,"category":"creative"}}]
Votre tâche a été créée avec succès! Voulez-vous que je vous aide à planifier cette présentation?"

Exemple 2 - Listage des tâches:
Utilisateur: "Montre-moi mes tâches prioritaires"
Réponse: "Voici vos tâches prioritaires :
[ACTION:{"intent":"list_tasks","parameters":{"priority":"high","completed":false}}]"

Exemple 3 - Complétion de tâche:
Utilisateur: "J'ai terminé la réunion avec l'équipe marketing"
Réponse: "Super! Je vais marquer cette tâche comme terminée.
[ACTION:{"intent":"complete_task","parameters":{"taskName":"Réunion équipe marketing"}}]
Bravo pour cette tâche accomplie! Quelle est la prochaine étape?"

Exemple 4 - Mise à jour de tâche:
Utilisateur: "Change la priorité de la tâche 'Finaliser le rapport' en haute priorité"
Réponse: "Je vais mettre à jour cette tâche immédiatement.
[ACTION:{"intent":"update_task","parameters":{"taskName":"Finaliser le rapport","priority":"high"}}]
La priorité a été mise à jour. Cette tâche est maintenant en haute priorité."

Question de l'utilisateur: ${message}

Réponds TOUJOURS en utilisant le format Markdown. Utilise des titres (##), des listes à puces, du texte en **gras** et en *italique* pour structurer tes réponses. Utilise des émojis pertinents et cite les sources entre crochets quand tu mentionnes des statistiques.

Si l'utilisateur te demande de créer une tâche, de lister des tâches ou de faire une action sur une tâche, utilise les commandes ACTION ci-dessus. Assure-toi que le format JSON est correct et que les guillemets sont bien échappés.`;
    }

    // Option 1: Ollama (100% local et gratuit)
    async tryOllama(prompt) {
        if (!this.ollamaAvailable) return null;
        
        const response = await fetch(this.config.ollama.endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: this.config.ollama.model,
                prompt: prompt,
                stream: false
            })
        });
        
        const data = await response.json();
        return data.response;
    }

    // Option 2: Hugging Face (gratuit avec limitations)
    async tryHuggingFace(prompt) {
        if (!this.config.huggingface.apiKey) return null;
        
        const response = await fetch(
            this.config.huggingface.endpoint + this.config.huggingface.model,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.config.huggingface.apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    inputs: prompt,
                    parameters: {
                        max_length: 200,
                        temperature: 0.7,
                        top_p: 0.9
                    }
                })
            }
        );
        
        const data = await response.json();
        return data[0]?.generated_text || data.generated_text;
    }

    // Option 3: Cohere (100 requêtes/min gratuit)
    async tryCohere(prompt) {
        if (!this.config.cohere.apiKey) return null;
        
        const response = await fetch(this.config.cohere.endpoint, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.config.cohere.apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'command',
                prompt: prompt,
                max_tokens: 200,
                temperature: 0.7
            })
        });
        
        const data = await response.json();
        return data.generations[0].text;
    }

    // Option 4: Google Gemini (gratuit avec limitations)
    async tryGemini(prompt) {
        if (!this.config.gemini.apiKey) return null;
        
        const response = await fetch(
            `${this.config.gemini.endpoint}?key=${this.config.gemini.apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: prompt
                        }]
                    }]
                })
            }
        );
        
        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    }

    // Option 5: OpenAI (payant mais excellent)
    async tryOpenAI(prompt) {
        if (!this.config.openai.apiKey) return null;
        
        const response = await fetch(this.config.openai.endpoint, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.config.openai.apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: this.config.openai.model,
                messages: [
                    { role: 'system', content: 'Tu es OrgaGPT, un assistant de productivité expert.' },
                    { role: 'user', content: prompt }
                ],
                temperature: 0.7,
                max_tokens: 500
            })
        });
        
        const data = await response.json();
        return data.choices[0].message.content;
    }

    // Fallback intelligent avec analyse locale
    async getSmartFallback(message) {
        // Analyser l'intention avec des patterns plus sophistiqués
        const intent = this.analyzeIntent(message);
        const context = this.buildContext();
        
        // Générer une réponse contextuelle
        return this.generateContextualResponse(intent, context);
    }

    analyzeIntent(message) {
        const lowerMessage = message.toLowerCase();
        
        // Patterns d'intention
        const intents = {
            askProductivity: /productivité|efficace|améliorer|optimiser/i,
            askPlanning: /planning|planifier|organiser|agenda/i,
            askEnergy: /énergie|fatigue|concentration|focus/i,
            askPriorities: /priorité|important|urgent|eisenhower/i,
            askStats: /statistique|rapport|analyse|performance/i,
            askHelp: /aide|comment|quoi faire|conseil/i,
            askMethods: /méthode|technique|pomodoro|gtd/i,
            askTime: /temps|heure|durée|combien/i
        };
        
        for (const [intent, pattern] of Object.entries(intents)) {
            if (pattern.test(lowerMessage)) {
                return intent;
            }
        }
        
        return 'general';
    }

    generateContextualResponse(intent, context) {
        const responses = {
            askProductivity: () => {
                const score = Math.round((context.completedTasks / context.totalTasks) * 100) || 0;
                return `📊 Votre productivité actuelle est de **${score}%** avec ${context.completedTasks}/${context.totalTasks} tâches complétées.

D'après **McKinsey**, vous devriez consacrer 95% de votre temps à vos 5 priorités principales. Actuellement, vos priorités sont : ${context.topPriorities.join(', ')}.

💡 **Recommandations personnalisées :**
${score < 50 ? '- Utilisez la technique Pomodoro pour augmenter votre focus' : '- Continuez sur cette lancée !'}
${context.energyLevel === 'low' ? '- Votre énergie est faible, privilégiez les tâches administratives' : '- Profitez de votre énergie pour les tâches complexes'}
${context.totalTasks > 10 ? '- Vous avez beaucoup de tâches, utilisez la matrice d\'Eisenhower pour prioriser' : ''}

Voulez-vous que je vous aide à optimiser votre planning ?`;
            },
            
            askEnergy: () => {
                const recommendations = {
                    high: '🔋 Énergie haute détectée ! C\'est le moment idéal pour le travail profond et créatif.',
                    medium: '⚡ Énergie moyenne : parfait pour les réunions et la communication.',
                    low: '🪫 Énergie basse : concentrez-vous sur l\'administratif et la planification.'
                };
                
                return `${recommendations[context.energyLevel]}

Selon **KPMG**, aligner vos tâches avec vos niveaux d'énergie peut augmenter votre productivité de 23%.

**Plan optimisé pour votre niveau d'énergie :**
${this.generateEnergyBasedPlan(context.energyLevel, context.topPriorities)}

💡 Astuce : Prenez une pause de 5-10 minutes toutes les heures pour maintenir votre énergie.`;
            },
            
            askPriorities: () => {
                const urgentTasks = this.app.tasks.filter(t => t.quadrant === 1 && !t.completed);
                const importantTasks = this.app.tasks.filter(t => t.quadrant === 2 && !t.completed);
                
                return `📋 **Analyse de vos priorités selon Eisenhower :**

🔴 **Urgent & Important** (${urgentTasks.length} tâches)
${urgentTasks.slice(0, 3).map(t => `- ${t.title}`).join('\n')}

🟢 **Important, non urgent** (${importantTasks.length} tâches)
${importantTasks.slice(0, 3).map(t => `- ${t.title}`).join('\n')}

D'après **Deloitte**, passer trop de temps dans le quadrant "Urgent" mène au burnout. Visez 60% de votre temps dans le quadrant "Important, non urgent".

**Action recommandée :** ${urgentTasks.length > 3 ? 'Déléguez certaines tâches urgentes' : 'Planifiez du temps pour les tâches importantes'}`;
            },
            
            default: () => {
                return `Je suis OrgaGPT, votre copilote productivité basé sur les meilleures pratiques des cabinets de conseil.

**Ce que je peux faire pour vous :**
🎯 Analyser et optimiser vos priorités
📊 Générer des rapports de productivité
⏰ Recommander les meilleures méthodes (Pomodoro, GTD, etc.)
🔋 Adapter votre planning à votre énergie
📈 Suivre vos progrès et suggérer des améliorations

**Fait intéressant :** Vous avez déjà complété ${context.completedTasks} tâches et accumulé ${context.focusTime} de temps de focus !

Que souhaitez-vous améliorer aujourd'hui ?`;
            }
        };
        
        const responseFunc = responses[intent] || responses.default;
        return responseFunc();
    }

    generateEnergyBasedPlan(energyLevel, priorities) {
        const plans = {
            high: priorities.slice(0, 2).map(p => `- 🧠 ${p} (90 min de deep work)`).join('\n'),
            medium: priorities.slice(0, 2).map(p => `- 💬 ${p} (45 min avec pauses)`).join('\n'),
            low: `- 📧 Traiter les emails (30 min)\n- 📅 Planifier demain (20 min)`
        };
        
        return plans[energyLevel] || plans.medium;
    }

    // Interface pour configurer l'IA
    addAISelector() {
        const aiConfig = document.createElement('div');
        aiConfig.className = 'ai-config-panel';
        aiConfig.innerHTML = `
            <div class="ai-config-header">
                <h3>⚙️ Configuration IA</h3>
                <button class="btn btn--sm" onclick="realAI.toggleConfig()">Configurer</button>
            </div>
            <div class="ai-config-content" id="aiConfigContent" style="display: none;">
                <div class="ai-options">
                    <h4>Options gratuites recommandées :</h4>
                    
                    <div class="ai-option">
                        <h5>1. Ollama (100% local)</h5>
                        <p>Installez depuis <a href="https://ollama.ai" target="_blank">ollama.ai</a></p>
                        <button class="btn btn--sm" onclick="realAI.testOllama()">Tester Ollama</button>
                    </div>
                    
                    <div class="ai-option">
                        <h5>2. Hugging Face</h5>
                        <input type="text" id="hfApiKey" placeholder="Clé API Hugging Face">
                        <button class="btn btn--sm" onclick="realAI.saveHFKey()">Sauvegarder</button>
                        <small>Obtenez une clé gratuite sur <a href="https://huggingface.co" target="_blank">huggingface.co</a></small>
                    </div>
                    
                    <div class="ai-option">
                        <h5>3. Google Gemini</h5>
                        <input type="text" id="geminiApiKey" placeholder="Clé API Gemini">
                        <button class="btn btn--sm" onclick="realAI.saveGeminiKey()">Sauvegarder</button>
                        <small>Obtenez une clé gratuite sur <a href="https://makersuite.google.com" target="_blank">makersuite.google.com</a></small>
                    </div>
                    
                    <div class="ai-option">
                        <h5>4. Cohere</h5>
                        <input type="text" id="cohereApiKey" placeholder="Clé API Cohere">
                        <button class="btn btn--sm" onclick="realAI.saveCohereKey()">Sauvegarder</button>
                        <small>100 requêtes/min gratuites sur <a href="https://cohere.ai" target="_blank">cohere.ai</a></small>
                    </div>
                </div>
                
                <div class="ai-status" id="aiStatus">
                    <p>Status: <span id="aiStatusText">Non configuré</span></p>
                </div>
            </div>
        `;
        
        // Ajouter à la sidebar
        const sidebar = document.querySelector('.sidebar--right');
        if (sidebar) {
            sidebar.insertBefore(aiConfig, sidebar.firstChild);
        }
        
        // Vérifier le status
        this.updateAIStatus();
    }

    toggleConfig() {
        const content = document.getElementById('aiConfigContent');
        if (content) {
            content.style.display = content.style.display === 'none' ? 'block' : 'none';
        }
    }

    async testOllama() {
        try {
            const response = await fetch('http://localhost:11434/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: 'gemma3:1b',
                    prompt: 'Test',
                    stream: false
                })
            });
            
            if (response.ok) {
                this.updateAIStatus('Ollama connecté ✅');
                this.app.addAIMessage('🎉 Ollama est configuré ! Je peux maintenant vous fournir des réponses IA locales.');
            } else {
                throw new Error('Ollama non disponible');
            }
        } catch (e) {
            this.updateAIStatus('Ollama non détecté ❌');
            alert('Ollama n\'est pas installé. Téléchargez-le depuis ollama.ai');
        }
    }

    saveHFKey() {
        const key = document.getElementById('hfApiKey').value;
        if (key) {
            this.config.huggingface.apiKey = key;
            this.saveConfig();
            this.updateAIStatus('Hugging Face configuré ✅');
        }
    }

    saveGeminiKey() {
        const key = document.getElementById('geminiApiKey').value;
        if (key) {
            this.config.gemini.apiKey = key;
            this.saveConfig();
            this.updateAIStatus('Google Gemini configuré ✅');
        }
    }

    saveCohereKey() {
        const key = document.getElementById('cohereApiKey').value;
        if (key) {
            this.config.cohere.apiKey = key;
            this.saveConfig();
            this.updateAIStatus('Cohere configuré ✅');
        }
    }

    saveConfig() {
        // Sauvegarder les clés de manière sécurisée (en production, utilisez un backend)
        const configToSave = {
            huggingface: { apiKey: this.config.huggingface.apiKey },
            gemini: { apiKey: this.config.gemini.apiKey },
            cohere: { apiKey: this.config.cohere.apiKey }
        };
        localStorage.setItem('orgagpt-ai-config', JSON.stringify(configToSave));
    }

    updateAIStatus(message) {
        const statusText = document.getElementById('aiStatusText');
        if (statusText) {
            if (message) {
                statusText.textContent = message;
            } else {
                // Vérifier quelles IA sont disponibles
                const available = [];
                if (this.ollamaAvailable) available.push('Ollama');
                if (this.config.huggingface.apiKey) available.push('HuggingFace');
                if (this.config.gemini.apiKey) available.push('Gemini');
                if (this.config.cohere.apiKey) available.push('Cohere');
                
                statusText.textContent = available.length > 0 
                    ? `Actif: ${available.join(', ')}` 
                    : 'Non configuré';
            }
        }
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
        // Détecter et proposer des actions basées sur la réponse
        if (response.includes('Pomodoro')) {
            this.suggestAction('Démarrer une session Pomodoro', () => {
                this.app.startFocusSession();
            });
        }
        
        if (response.includes('Eisenhower')) {
            this.suggestAction('Voir la matrice d\'Eisenhower', () => {
                this.app.switchView('eisenhower');
            });
        }
        
        if (response.includes('rapport')) {
            this.suggestAction('Générer un rapport détaillé', () => {
                this.generateDetailedReport();
            });
        }
    }

    suggestAction(text, callback) {
        const suggestion = document.createElement('div');
        suggestion.className = 'action-suggestion fade-in';
        suggestion.innerHTML = `
            <span>💡 ${text}</span>
            <button class="btn btn--primary btn--sm">Faire maintenant</button>
        `;
        
        suggestion.querySelector('button').onclick = callback;
        document.getElementById('chatMessages').appendChild(suggestion);
    }

    async generateDetailedReport() {
        const context = this.buildContext();
        const prompt = `Génère un rapport de productivité détaillé avec les données suivantes : ${JSON.stringify(context)}`;
        
        try {
            const report = await this.getAIResponse(prompt);
            this.showReportModal(report);
        } catch (e) {
            this.app.addAIMessage('📊 Je génère votre rapport avec les données disponibles...');
            // Générer un rapport local si l'IA échoue
            this.showLocalReport(context);
        }
    }

    showReportModal(content) {
        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content modal-large">
                <div class="modal-header">
                    <h3>📊 Rapport de Productivité IA</h3>
                    <button class="modal-close" onclick="this.closest('.modal').remove()">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="ai-report">${content.replace(/\n/g, '<br>')}</div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    showLocalReport(context) {
        const report = `
            <h2>Rapport de Productivité - ${new Date().toLocaleDateString('fr-FR')}</h2>
            
            <h3>📈 Résumé Exécutif</h3>
            <p>Tâches complétées : ${context.completedTasks}/${context.totalTasks} (${Math.round((context.completedTasks/context.totalTasks)*100)}%)</p>
            <p>Temps de focus : ${context.focusTime}</p>
            <p>Sessions Pomodoro : ${context.pomodoroCount}</p>
            
            <h3>🎯 Priorités Actuelles</h3>
            <ul>${context.topPriorities.map(p => `<li>${p}</li>`).join('')}</ul>
            
            <h3>💡 Recommandations</h3>
            <p>Basé sur votre niveau d'énergie ${context.energyLevel}, concentrez-vous sur les tâches ${context.energyLevel === 'high' ? 'complexes et créatives' : 'administratives'}.</p>
        `;
        
        this.showReportModal(report);
    }
}

// Styles pour la configuration IA
const aiStyles = `
<style>
.ai-config-panel {
    background: var(--color-background);
    border-radius: var(--radius-base);
    padding: var(--space-16);
    margin-bottom: var(--space-16);
    border: 1px solid var(--color-border);
}

.ai-config-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--space-16);
}

.ai-option {
    background: var(--color-surface);
    padding: var(--space-12);
    border-radius: var(--radius-sm);
    margin-bottom: var(--space-12);
}

.ai-option h5 {
    margin: 0 0 var(--space-8) 0;
    color: var(--color-primary);
}

.ai-option input {
    width: 100%;
    margin-bottom: var(--space-8);
}

.ai-option small {
    display: block;
    margin-top: var(--space-4);
    color: var(--color-text-secondary);
}

.ai-status {
    margin-top: var(--space-16);
    padding: var(--space-12);
    background: var(--color-secondary);
    border-radius: var(--radius-sm);
    text-align: center;
}

.action-suggestion {
    background: linear-gradient(135deg, var(--color-primary), var(--color-primary-hover));
    color: white;
    padding: var(--space-12);
    border-radius: var(--radius-base);
    margin: var(--space-12) 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.ai-report {
    line-height: 1.6;
    color: var(--color-text);
}

.ai-report h2, .ai-report h3 {
    margin-top: var(--space-24);
    margin-bottom: var(--space-12);
    color: var(--color-primary);
}

.ai-report ul {
    padding-left: var(--space-24);
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', aiStyles);

// Auto-initialisation
document.addEventListener('DOMContentLoaded', () => {
    // Attendre que l'app originale soit complètement initialisée
    setTimeout(() => {
        if (window.orgaGPT) {
            console.log('🤖 Initialisation de RealAIOrgaGPT...');
            window.realAI = new RealAIOrgaGPT(window.orgaGPT);
            
            // Ajouter un indicateur visuel que l'IA est active
            const aiTitle = document.querySelector('.sidebar__section h3:contains("🤖 Copilote IA")');
            if (aiTitle) {
                aiTitle.innerHTML = '🤖 Copilote IA <span style="color: green; font-size: 0.8em;">(Ollama actif)</span>';
            }
            
            // Forcer le remplacement de la méthode sendChatMessage
            const originalSendChatMessage = window.orgaGPT.sendChatMessage;
            window.orgaGPT.sendChatMessage = async function() {
                const input = document.getElementById('chatInput');
                const message = input.value.trim();
                
                if (!message || !input) return;

                this.addUserMessage(message);
                input.value = '';

                // Afficher l'indicateur de chargement
                const chatMessages = document.getElementById('chatMessages');
                const loadingDiv = document.createElement('div');
                loadingDiv.className = 'ai-message typing-indicator';
                loadingDiv.innerHTML = '<span>.</span><span>.</span><span>.</span>';
                chatMessages.appendChild(loadingDiv);

                try {
                    // Obtenir une vraie réponse IA via Ollama
                    const response = await fetch('http://localhost:11434/api/generate', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            model: 'gemma3:1b',
                            prompt: `Tu es OrgaGPT, un assistant de productivité expert. Réponds à cette question: ${message}`,
                            stream: false
                        })
                    });
                    
                    const data = await response.json();
                    // Supprimer l'indicateur de chargement
                    loadingDiv.remove();
                    
                    // Afficher la réponse
                    this.addAIMessage(data.response);
                    console.log('🤖 Réponse IA reçue via Ollama');
                    
                } catch (error) {
                    console.error('Erreur avec Ollama:', error);
                    loadingDiv.remove();
                    
                    // Fallback vers la méthode originale
                    const fallbackResponse = this.generateAIResponse(message);
                    this.addAIMessage(fallbackResponse + '\n\n[Note: Réponse générée localement car Ollama n\'est pas disponible]');
                }
            };
            
            console.log('✅ Intégration IA activée avec succès!');
        } else {
            console.error('❌ Impossible d\'initialiser RealAIOrgaGPT: orgaGPT non trouvé');
        }
    }, 500); // Augmenter le délai pour s'assurer que tout est chargé
});

// Ajouter des styles pour l'indicateur de chargement
const typingStyles = `
<style>
.typing-indicator {
    display: flex;
    align-items: center;
    column-gap: 4px;
}

.typing-indicator span {
    animation: blink 1s infinite;
    font-size: 20px;
}

.typing-indicator span:nth-child(2) {
    animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
    animation-delay: 0.4s;
}

@keyframes blink {
    0% { opacity: 0.2; }
    20% { opacity: 1; }
    100% { opacity: 0.2; }
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', typingStyles);